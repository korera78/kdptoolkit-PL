/**
 * Guides Page
 * Learning path and educational content for KDP publishers
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guides',
  description: 'Structured learning path with guides covering everything from beginner to advanced KDP publishing.',
};

export default function GuidesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          KDP Publishing Guides
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Structured learning path with guides covering everything from beginner to advanced KDP publishing.
        </p>
      </div>

      {/* Coming Soon Message */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-md">
          <div className="mb-4 text-6xl">📚</div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We're creating a structured learning path with 40+ guides covering everything from beginner to advanced KDP publishing.
          </p>
        </div>
      </div>

      {/* Preview of Learning Stages */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Learning Path (Preview)
        </h2>
        <div className="space-y-6">
          {[
            {
              stage: 'Stage 1: Getting Started',
              description: 'Essential tools and first steps',
              guides: '10 guides',
            },
            {
              stage: 'Stage 2: Professional Workflow',
              description: 'Advanced tools and automation',
              guides: '12 guides',
            },
            {
              stage: 'Stage 3: Scaling Up',
              description: 'Multi-book strategies and outsourcing',
              guides: '10 guides',
            },
            {
              stage: 'Stage 4: Advanced Topics',
              description: 'Data analysis and optimization',
              guides: '8 guides',
            },
          ].map((stage, index) => (
            <div
              key={stage.stage}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {stage.stage}
                  </h3>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    {stage.description}
                  </p>
                  <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {stage.guides}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
