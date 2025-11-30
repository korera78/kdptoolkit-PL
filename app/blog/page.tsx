/**
 * Blog Listing Page
 * All blog posts with pagination
 */

import { getAllPosts } from '@/lib/posts';
import { getAllTags } from '@/lib/mdx';
import BlogPostCard from '@/components/BlogPostCard';
import Link from 'next/link';

interface BlogPageProps {
  searchParams: { page?: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kdptoolkit.com';

export const metadata = {
  title: 'Blog',
  description:
    'Expert reviews and guides on KDP tools and software. Learn about Publisher Rocket, Helium 10, Canva, and automation tools.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

const POSTS_PER_PAGE = 12;

export default function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const { posts, totalPages, hasNextPage, hasPrevPage } = getAllPosts(
    currentPage,
    POSTS_PER_PAGE
  );
  const tags = getAllTags();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <section className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Expert insights on KDP tools and software for publishers.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {posts.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  className="mt-12 flex items-center justify-center gap-2"
                  aria-label="Pagination"
                >
                  {hasPrevPage && (
                    <Link
                      href={`/blog?page=${currentPage - 1}`}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Previous
                    </Link>
                  )}

                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>

                  {hasNextPage && (
                    <Link
                      href={`/blog?page=${currentPage + 1}`}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Next
                    </Link>
                  )}
                </nav>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                No blog posts found. Check back soon!
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Popular Tags */}
            {tags.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Popular Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 10).map(({ tag, count }) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800"
                    >
                      {tag} ({count})
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
