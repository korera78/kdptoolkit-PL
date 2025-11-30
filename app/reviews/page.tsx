/**
 * Reviews Page
 * In-depth tool reviews and comparisons
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Reviews',
  description: 'In-depth, hands-on reviews of KDP tools and software for serious publishers.',
};

export default function ReviewsPage() {
  // Featured reviews (will be dynamic later)
  const featuredReviews = [
    {
      slug: '2025-11-19-publisher-rocket-review',
      title: 'Publisher Rocket Review',
      excerpt: 'Complete analysis of the industry-standard keyword research tool',
      category: 'Keyword Research',
      rating: 4.5,
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          KDP Tool Reviews
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          In-depth, hands-on reviews of KDP tools and software for serious publishers.
        </p>
      </div>

      {/* Featured Reviews */}
      {featuredReviews.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Featured Reviews
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredReviews.map((review) => (
              <Link
                key={review.slug}
                href={`/blog/${review.slug}`}
                className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-700"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                    {review.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm font-medium text-yellow-500">
                    <span>★</span>
                    <span>{review.rating}</span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
                  {review.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {review.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          More Reviews Coming Soon
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          We're working on comprehensive reviews for the top KDP tools. Subscribe to be notified when new reviews are published.
        </p>

        {/* Preview of Upcoming Reviews */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            'Helium 10 Review',
            'Canva for Authors Review',
            'Atticus Writing Software Review',
            'BookBeam Analytics Review',
            'KDP Spy Chrome Extension Review',
            'Vellum Formatting Review',
          ].map((title) => (
            <div
              key={title}
              className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 text-2xl">📝</div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
