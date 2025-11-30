/**
 * RelatedPosts Component
 * Shows related posts based on shared tags
 */

'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { BlogPost } from '@/lib/mdx';

interface RelatedPostsProps {
  posts: BlogPost[];
  className?: string;
}

export default function RelatedPosts({ posts, className = '' }: RelatedPostsProps) {

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className={`${className}`}>
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Related Posts
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <Link href={`/blog/${post.slug}`}>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
                {post.frontmatter.title}
              </h3>
            </Link>
            <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {post.frontmatter.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
              <time dateTime={post.frontmatter.date}>
                {format(new Date(post.frontmatter.date), 'MMM d, yyyy')}
              </time>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
