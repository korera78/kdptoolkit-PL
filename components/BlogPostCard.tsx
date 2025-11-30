/**
 * BlogPostCard Component
 * Card display for blog post listings with image fallback and error handling
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { BlogPost } from '@/lib/mdx';
import ReadingTime from './ReadingTime';

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  const { slug, frontmatter, readingTime } = post;
  const [imageError, setImageError] = useState(false);

  // Fallback placeholder component
  const ImagePlaceholder = ({ featured }: { featured: boolean }) => (
    <div
      className={`w-full ${
        featured ? 'h-80' : 'h-48'
      } bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-lg flex items-center justify-center`}
    >
      <span className={featured ? 'text-6xl' : 'text-4xl'}>📚</span>
    </div>
  );

  if (featured) {
    return (
      <article className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
          <Link href={`/blog/${slug}`}>
            {!imageError && frontmatter.image ? (
              <Image
                src={frontmatter.image}
                alt={frontmatter.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
                priority
              />
            ) : (
              <ImagePlaceholder featured={true} />
            )}
          </Link>
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {frontmatter.tags.slice(0, 2).map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag.toLowerCase()}`}
              className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800"
            >
              {tag}
            </Link>
          ))}
        </div>

        <Link href={`/blog/${slug}`}>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
            {frontmatter.title}
          </h2>
        </Link>

        <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-3">
          {frontmatter.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <time dateTime={frontmatter.date}>
            {format(new Date(frontmatter.date), 'MMMM d, yyyy')}
          </time>
          <span>•</span>
          <ReadingTime minutes={readingTime} />
        </div>
      </article>
    );
  }

  return (
    <article className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
        <Link href={`/blog/${slug}`}>
          {!imageError && frontmatter.image ? (
            <Image
              src={frontmatter.image}
              alt={frontmatter.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <ImagePlaceholder featured={false} />
          )}
        </Link>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {frontmatter.tags.slice(0, 2).map((tag) => (
          <Link
            key={tag}
            href={`/tags/${tag.toLowerCase()}`}
            className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800"
          >
            {tag}
          </Link>
        ))}
      </div>

      <Link href={`/blog/${slug}`}>
        <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400 line-clamp-2">
          {frontmatter.title}
        </h3>
      </Link>

      <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
        {frontmatter.description}
      </p>

      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
        <time dateTime={frontmatter.date}>
          {format(new Date(frontmatter.date), 'MMM d, yyyy')}
        </time>
        <span>•</span>
        <ReadingTime minutes={readingTime} />
      </div>
    </article>
  );
}
