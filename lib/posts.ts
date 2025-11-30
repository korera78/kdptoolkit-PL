/**
 * Blog Post Utilities
 * Helper functions for working with blog posts
 */

import { BlogPost } from './mdx';
import { getAllPosts as getCachedPosts } from './cache';

/**
 * Paginate an array of blog posts
 * @param posts - Array of blog posts
 * @param page - Current page number (1-indexed)
 * @param postsPerPage - Number of posts per page
 * @returns Paginated posts and pagination metadata
 */
export function paginatePosts(
  posts: BlogPost[],
  page: number,
  postsPerPage: number
): {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} {
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;

  return {
    posts: posts.slice(startIndex, endIndex),
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

/**
 * Get all blog posts with optional pagination
 * @param page - Page number (optional)
 * @param postsPerPage - Posts per page (default: 10)
 * @returns Blog posts and pagination info
 */
export function getAllPosts(page?: number, postsPerPage = 10) {
  const allPosts = getCachedPosts();

  if (page) {
    return paginatePosts(allPosts, page, postsPerPage);
  }

  return {
    posts: allPosts,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };
}

/**
 * Get posts by tag with optional pagination
 * @param tag - Tag to filter by
 * @param page - Page number (optional)
 * @param postsPerPage - Posts per page (default: 10)
 * @returns Filtered blog posts and pagination info
 */
export function getPostsByTag(tag: string, page?: number, postsPerPage = 10) {
  // Note: We don't cache by tag, as the number of tags can be large.
  // Instead, we get all posts from the cache and then filter.
  const allPosts = getCachedPosts();
  const tagPosts = allPosts.filter((post) =>
    post.frontmatter.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );


  if (page) {
    return paginatePosts(tagPosts, page, postsPerPage);
  }

  return {
    posts: tagPosts,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };
}

/**
 * Search posts by title or content
 * @param query - Search query
 * @returns Array of matching blog posts
 */
export function searchPosts(query: string): BlogPost[] {
  const allPosts = getCachedPosts();
  const lowerQuery = query.toLowerCase();

  return allPosts.filter((post) => {
    const titleMatch = post.frontmatter.title.toLowerCase().includes(lowerQuery);
    const descriptionMatch = post.frontmatter.description.toLowerCase().includes(lowerQuery);
    const contentMatch = post.content.toLowerCase().includes(lowerQuery);
    const tagMatch = post.frontmatter.tags.some((tag) =>
      tag.toLowerCase().includes(lowerQuery)
    );

    return titleMatch || descriptionMatch || contentMatch || tagMatch;
  });
}

/**
 * Get the latest posts
 * @param limit - Number of posts to return
 * @returns Array of latest blog posts
 */
export function getLatestPosts(limit: number): BlogPost[] {
  const allPosts = getCachedPosts();
  return allPosts.slice(0, limit);
}

/**
 * Group posts by year
 * @returns Object with years as keys and arrays of posts as values
 */
export function groupPostsByYear(): Record<string, BlogPost[]> {
  const allPosts = getCachedPosts();
  const grouped: Record<string, BlogPost[]> = {};

  allPosts.forEach((post) => {
    const year = new Date(post.frontmatter.date).getFullYear().toString();
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(post);
  });

  return grouped;
}

/**
 * Get post count statistics
 * @returns Statistics about the blog
 */
export function getPostStats(): {
  totalPosts: number;
  totalTags: number;
  averageReadingTime: number;
  latestPostDate: string | null;
} {
  const allPosts = getCachedPosts();

  if (allPosts.length === 0) {
    return {
      totalPosts: 0,
      totalTags: 0,
      averageReadingTime: 0,
      latestPostDate: null,
    };
  }

  const uniqueTags = new Set<string>();
  let totalReadingTime = 0;

  allPosts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => uniqueTags.add(tag.toLowerCase()));
    totalReadingTime += post.readingTime;
  });

  return {
    totalPosts: allPosts.length,
    totalTags: uniqueTags.size,
    averageReadingTime: Math.round(totalReadingTime / allPosts.length),
    latestPostDate: allPosts[0]?.frontmatter.date || null,
  };
}
