/**
 * MDX Processing Utilities
 * Handles parsing and processing of MDX blog posts with gray-matter frontmatter
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPostFrontmatter {
  title: string;
  date: string;
  description: string;
  coverImage?: string;
  image: string;
  tags: string[];
  author: string;
  published?: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  content: string;
  excerpt?: string;
  readingTime: number;
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

/**
 * Get all blog post slugs from the posts directory
 * @returns Array of post slugs (without .md extension)
 */
export function getPostSlugs(): string[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      console.warn('Posts directory does not exist:', postsDirectory);
      return [];
    }

    const files = fs.readdirSync(postsDirectory);
    return files
      .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx?$/, ''));
  } catch (error) {
    console.error('Error reading post slugs:', error);
    return [];
  }
}

/**
 * Calculate reading time in minutes based on word count
 * Assumes average reading speed of 250 words per minute
 * @param content - The blog post content
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 250;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

/**
 * Extract excerpt from content (first paragraph or first 200 characters)
 * @param content - The blog post content
 * @returns Excerpt text
 */
export function extractExcerpt(content: string): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/^#+\s+.+$/gm, '') // Remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .trim();

  // Get first paragraph or first 200 characters
  const firstParagraph = plainText.split('\n\n')[0];
  if (firstParagraph.length <= 200) {
    return firstParagraph;
  }

  return firstParagraph.substring(0, 197) + '...';
}

/**
 * Get a single blog post by slug
 * @param slug - The post slug (without .md extension)
 * @returns Blog post object with frontmatter and content
 */
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const realSlug = slug.replace(/\.mdx?$/, '');
    let fullPath = path.join(postsDirectory, `${realSlug}.md`);

    // Try .mdx if .md doesn't exist
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
    }

    if (!fs.existsSync(fullPath)) {
      console.warn('Post not found:', slug);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Validate required frontmatter fields
    if (!data.title || !data.date || !data.description || !data.tags || !data.image) {
      console.error('Missing required frontmatter fields in:', slug);
      return null;
    }

    const frontmatter: BlogPostFrontmatter = {
      title: data.title,
      date: data.date,
      description: data.description,
      coverImage: data.coverImage,
      image: data.image,
      tags: Array.isArray(data.tags) ? data.tags : [data.tags],
      author: data.author || 'KDP Toolkit',
      published: data.published !== false, // Default to true
    };

    const readingTime = calculateReadingTime(content);
    const excerpt = data.excerpt || extractExcerpt(content);

    return {
      slug: realSlug,
      frontmatter,
      content,
      excerpt,
      readingTime,
    };
  } catch (error) {
    console.error('Error reading post:', slug, error);
    return null;
  }
}

/**
 * Get all blog posts, sorted by date (newest first)
 * @param includeUnpublished - Whether to include unpublished posts
 * @returns Array of blog posts
 */
export function getAllPosts(includeUnpublished = false): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .filter((post) => includeUnpublished || post.frontmatter.published !== false)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date);
      const dateB = new Date(b.frontmatter.date);
      return dateB.getTime() - dateA.getTime();
    });

  return posts;
}

/**
 * Get posts by tag
 * @param tag - The tag to filter by
 * @returns Array of blog posts with the specified tag
 */
export function getPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) =>
    post.frontmatter.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get all unique tags from all posts
 * @returns Array of unique tags with post counts
 */
export function getAllTags(): Array<{ tag: string; count: number }> {
  const allPosts = getAllPosts();
  const tagMap = new Map<string, number>();

  allPosts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => {
      const lowerTag = tag.toLowerCase();
      tagMap.set(lowerTag, (tagMap.get(lowerTag) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get related posts based on shared tags
 * @param currentSlug - The slug of the current post
 * @param limit - Maximum number of related posts to return
 * @returns Array of related blog posts
 */
export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = getAllPosts();
  const currentTags = currentPost.frontmatter.tags.map((t) => t.toLowerCase());

  // Calculate relevance score for each post
  const scoredPosts = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const sharedTags = post.frontmatter.tags.filter((tag) =>
        currentTags.includes(tag.toLowerCase())
      );
      return {
        post,
        score: sharedTags.length,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scoredPosts.slice(0, limit).map((item) => item.post);
}
