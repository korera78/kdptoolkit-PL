/**
 * Tag Page
 * Shows all posts with a specific tag
 */

import { getPostsByTag } from '@/lib/posts';
import { getAllTags } from '@/lib/mdx';
import BlogPostCard from '@/components/BlogPostCard';
import type { Metadata } from 'next';

interface TagPageProps {
  params: {
    tag: string;
  };
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: tag.tag,
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);

  return {
    title: `${tag} Posts`,
    description: `All blog posts tagged with ${tag}. Expert insights on KDP tools and software.`,
  };
}

export default function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.tag);
  const { posts } = getPostsByTag(tag);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <section className="mb-12">
        <div className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
          Tag
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {tag}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged with &quot;{tag}&quot;
        </p>
      </section>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            No posts found with this tag.
          </p>
        </div>
      )}
    </div>
  );
}

export const revalidate = 60;
