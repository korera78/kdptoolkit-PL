/**
 * Calculators Page
 * Interactive KDP calculators and tools
 */

'use client';

import { useState } from 'react';
import KDPRoyaltyCalculator from '@/components/calculators/KDPRoyaltyCalculator';
import BSRCalculator from '@/components/calculators/BSRCalculator';
import BookDescriptionGenerator from '@/components/calculators/BookDescriptionGenerator';
import KENPCalculator from '@/components/calculators/KENPCalculator';

type CalculatorType = 'royalty' | 'bsr' | 'description' | 'kenp';

interface Calculator {
  id: CalculatorType;
  name: string;
  description: string;
  icon: string;
  seoValue: string;
  component: React.ComponentType;
}

const calculators: Calculator[] = [
  {
    id: 'royalty',
    name: 'KDP Royalty Calculator',
    description: 'Calculate exact royalties for different price points and book formats',
    icon: '💰',
    seoValue: '12,000 searches/month',
    component: KDPRoyaltyCalculator,
  },
  {
    id: 'bsr',
    name: 'BSR to Sales Estimator',
    description: 'Estimate daily and monthly sales based on Best Sellers Rank',
    icon: '📊',
    seoValue: '8,500 searches/month',
    component: BSRCalculator,
  },
  {
    id: 'description',
    name: 'Book Description Generator',
    description: 'Create compelling, Amazon-compliant HTML book descriptions',
    icon: '✍️',
    seoValue: '3,000 searches/month',
    component: BookDescriptionGenerator,
  },
  {
    id: 'kenp',
    name: 'KENP Calculator',
    description: 'Calculate Kindle Unlimited earnings based on pages read',
    icon: '📖',
    seoValue: '2,500 searches/month',
    component: KENPCalculator,
  },
];

export default function CalculatorsPage() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('royalty');

  const ActiveComponent = calculators.find(c => c.id === activeCalculator)?.component || KDPRoyaltyCalculator;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          🧮 Free KDP Calculators
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Interactive tools to help you calculate royalties, estimate sales, and optimize your Amazon KDP business
        </p>
      </div>

      {/* Calculator Navigation */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {calculators.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                activeCalculator === calc.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'
              }`}
            >
              <div className="text-3xl mb-2">{calc.icon}</div>
              <h3 className={`font-semibold mb-1 ${
                activeCalculator === calc.id
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-900 dark:text-gray-100'
              }`}>
                {calc.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {calc.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                {calc.seoValue}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Calculator */}
      <div className="mb-12">
        <ActiveComponent />
      </div>

      {/* SEO & Features Section */}
      <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Why Use Our Calculators */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Use KDP Toolkit Calculators?
            </h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span><strong>100% Free:</strong> No signup required, no credit card needed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span><strong>Accurate Data:</strong> Based on official Amazon KDP rates and industry research</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span><strong>Mobile-Friendly:</strong> Works perfectly on all devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span><strong>Privacy-First:</strong> All calculations happen in your browser</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span><strong>Updated Monthly:</strong> KENP rates and data refreshed regularly</span>
              </li>
            </ul>
          </div>

          {/* Common Questions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Common Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  How accurate are these calculators?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our calculators use official Amazon KDP rates and formulas. The Royalty Calculator is 100% accurate.
                  BSR and KENP calculators use industry-standard estimates based on published data.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Do I need to create an account?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No! All calculators are completely free and require no signup. Your data never leaves your browser.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Which calculator should I use first?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start with the <strong>KDP Royalty Calculator</strong> to understand your earnings potential at
                  different price points. Then use the <strong>BSR Calculator</strong> to estimate realistic sales goals.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Can I use these for books on other platforms?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These calculators are designed specifically for Amazon KDP. Other platforms have different royalty
                  structures and BSR systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Tools CTA */}
      <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-blue-200 dark:border-gray-700">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Need More KDP Tools?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Explore our complete directory of 40+ KDP tools, from keyword research to cover design to marketing automation.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/tools"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse All Tools →
            </a>
            <a
              href="/guides"
              className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Read Step-by-Step Guides
            </a>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-16 prose prose-gray dark:prose-invert max-w-none">
        <h2>About Our KDP Calculators</h2>

        <h3>KDP Royalty Calculator</h3>
        <p>
          Our KDP Royalty Calculator helps you understand exactly how much you'll earn from each book sale on Amazon.
          Whether you're publishing ebooks, paperbacks, or hardcovers, this calculator breaks down the complex royalty
          structure into easy-to-understand numbers. Calculate 35% vs 70% royalty options, factor in delivery costs for
          ebooks, and understand print costs for physical books.
        </p>

        <h3>BSR to Sales Estimator</h3>
        <p>
          The Best Sellers Rank (BSR) to Sales Estimator translates Amazon's ranking system into actual sales numbers.
          Input your book's BSR and get estimated daily and monthly sales, plus projected revenue. This tool uses
          logarithmic interpolation based on industry data from sources like Kindlepreneur to provide accurate estimates.
          Perfect for competitive analysis and setting realistic sales goals.
        </p>

        <h3>Book Description Generator</h3>
        <p>
          Creating compelling book descriptions is an art and a science. Our Book Description Generator provides
          genre-specific templates for Mystery, Romance, Self-Help, How-To Guides, and Sci-Fi/Fantasy. The built-in
          WYSIWYG editor supports Amazon's allowed HTML tags (bold, italic, underline, lists), and you can see a
          real-time preview of how your description will look on Amazon. Export clean HTML code ready to paste directly
          into your KDP dashboard.
        </p>

        <h3>KENP Calculator (Kindle Unlimited)</h3>
        <p>
          The KENP (Kindle Edition Normalized Pages) Calculator helps authors understand their Kindle Unlimited earnings.
          Calculate how much you earn per page read, project monthly earnings based on reader behavior, and compare KU
          earnings to traditional 70% royalty sales. The calculator includes historical KENP rate data for the last 12
          months and adjusts for average completion rates (typically 40-60% for most books).
        </p>

        <h2>How to Use These Calculators for Maximum Benefit</h2>
        <ol>
          <li>
            <strong>Price Testing:</strong> Use the Royalty Calculator to test multiple price points. The built-in
            comparison mode shows you exactly which price maximizes your per-sale profit.
          </li>
          <li>
            <strong>Goal Setting:</strong> Use the BSR Calculator's reverse mode to determine what BSR you need to hit
            your monthly income goals.
          </li>
          <li>
            <strong>Marketing Copy:</strong> Generate compelling book descriptions using proven templates, then A/B test
            them to see which converts better.
          </li>
          <li>
            <strong>KU vs Wide:</strong> Use both the Royalty and KENP calculators to compare earnings potential in
            Kindle Unlimited vs selling on multiple platforms.
          </li>
        </ol>

        <h2>Why Accurate Calculations Matter</h2>
        <p>
          Understanding your numbers is crucial for building a profitable KDP publishing business. These calculators help you:
        </p>
        <ul>
          <li>Set realistic income goals based on actual sales data</li>
          <li>Choose optimal pricing that maximizes profit without hurting sales volume</li>
          <li>Decide between KDP Select (Kindle Unlimited) and wide distribution</li>
          <li>Budget for book production costs (editing, covers, marketing)</li>
          <li>Track your progress toward financial milestones</li>
        </ul>

        <h2>Additional Resources</h2>
        <p>
          Looking for more help with your KDP journey? Check out our comprehensive guides:
        </p>
        <ul>
          <li><a href="/guides/kdp-account-setup">Complete KDP Account Setup Guide</a></li>
          <li><a href="/guides/pricing-strategy">Pricing Your Book for Maximum Profit</a></li>
          <li><a href="/guides/kdp-select-vs-wide">KDP Select vs Wide Distribution</a></li>
          <li><a href="/tools">Browse 40+ KDP Tools and Software</a></li>
        </ul>
      </div>
    </div>
  );
}
