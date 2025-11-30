/**
 * Newsletter Page
 * Language-specific newsletter signup with GDPR compliance
 */

import Newsletter from '@/components/Newsletter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Subscribe to the KDP Toolkit newsletter for expert KDP insights, tool reviews, and publishing strategies delivered weekly.',
};

export default function NewsletterPage() {
  // For the EN site, use 'en' language
  // When cloning to other language sites, change this value
  const siteLanguage = 'en' as const;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Subscribe to Our Newsletter
        </h1>
        <p className="mb-12 text-xl text-gray-600 dark:text-gray-400">
          Get expert KDP insights, tool reviews, and publishing strategies delivered weekly.
        </p>
      </div>

      <div className="mx-auto max-w-md">
        <Newsletter variant="fullwidth" language={siteLanguage} />
      </div>

      {/* Benefits */}
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
              <svg
                className="h-6 w-6 text-primary-600 dark:text-primary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Expert Tool Reviews
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            In-depth, hands-on reviews of the best KDP tools and software.
          </p>
        </div>

        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
              <svg
                className="h-6 w-6 text-primary-600 dark:text-primary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Actionable Insights
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Practical tips and strategies you can implement immediately.
          </p>
        </div>

        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
              <svg
                className="h-6 w-6 text-primary-600 dark:text-primary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Stay Updated
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Be first to know about new tools, features, and publishing trends.
          </p>
        </div>
      </div>
    </div>
  );
}
