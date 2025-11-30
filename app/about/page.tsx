/**
 * About Page
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about KDP Toolkit - Your trusted source for KDP tools, software reviews, and publishing insights.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        About KDP Toolkit
      </h1>

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p className="lead text-xl text-gray-600 dark:text-gray-400">
          KDP Toolkit is your trusted source for in-depth reviews, guides, and insights on the best tools and software for Amazon KDP publishing.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
          What We Cover
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          We focus on providing comprehensive, hands-on reviews and guides for serious self-publishers who want to grow their KDP business.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Publisher Rocket</strong> - Complete keyword research and niche analysis
          </li>
          <li>
            <strong>Helium 10</strong> - Advanced keyword and competitor research tools
          </li>
          <li>
            <strong>Canva</strong> - Professional cover design made easy
          </li>
          <li>
            <strong>Automation Tools</strong> - Software to streamline your publishing workflow
          </li>
          <li>
            <strong>Market Intelligence</strong> - Analytics and tracking tools for data-driven decisions
          </li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Our Approach
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Every review and guide on this site is based on hands-on experience and thorough testing.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Hands-On Testing</strong> - We personally use and test every tool we recommend
          </li>
          <li>
            <strong>Detailed Analysis</strong> - In-depth feature breakdowns with real-world examples
          </li>
          <li>
            <strong>Honest Reviews</strong> - We highlight both strengths and weaknesses
          </li>
          <li>
            <strong>Up-to-Date</strong> - Regular updates as tools evolve and new features are added
          </li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
          AI-Enhanced Research
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          We use advanced AI technology to analyze thousands of sources, ensuring our content is comprehensive, accurate, and up-to-date with the latest KDP strategies and tools.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Stay Updated
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Subscribe to our newsletter to receive the latest tool reviews, KDP insights, and publishing strategies delivered weekly to your inbox.
        </p>
      </div>
    </div>
  );
}
