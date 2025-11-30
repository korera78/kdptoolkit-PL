/**
 * Tools Page
 * Directory of KDP tools organized by category
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Comprehensive directory of KDP tools organized by category, budget, and skill level.',
};

export default function ToolsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          KDP Tools Directory
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Comprehensive directory of KDP tools organized by category, budget, and skill level.
        </p>
      </div>

      {/* Coming Soon Message */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-md">
          <div className="mb-4 text-6xl">🚀</div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We're building a comprehensive directory of 40+ KDP tools organized by category, budget, and skill level.
            Subscribe to our newsletter to be notified when it launches!
          </p>
        </div>
      </div>

      {/* Preview of Categories */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Tool Categories (Preview)
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Keyword Research', icon: '🔍', count: '9 tools' },
            { name: 'Writing & Editing', icon: '✍️', count: '10 tools' },
            { name: 'Cover Design', icon: '🎨', count: '7 tools' },
            { name: 'Formatting', icon: '📄', count: '6 tools' },
            { name: 'Marketing', icon: '📢', count: '5 tools' },
            { name: 'Analytics', icon: '📊', count: '5 tools' },
          ].map((category) => (
            <div
              key={category.name}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-2 text-4xl">{category.icon}</div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{category.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
