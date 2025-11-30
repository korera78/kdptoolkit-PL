'use client';

/**
 * Affiliate Dashboard
 * Admin page for managing affiliate links and viewing performance metrics
 */

import { useState, useEffect } from 'react';
import {
  AFFILIATE_PROGRAMS,
  AFFILIATE_CATEGORIES,
  formatCommission,
  calculateCommission,
  type AffiliateProgram,
  type AffiliateCategory,
} from '@/lib/affiliate';

// Mock data for demonstration (replace with API calls in production)
interface AffiliateStats {
  programId: string;
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
}

interface LinkPerformance {
  id: string;
  programId: string;
  productName: string;
  category: AffiliateCategory;
  clicks: number;
  conversions: number;
  revenue: number;
  lastClicked: string;
}

const mockStats: AffiliateStats[] = [
  { programId: 'amazon', clicks: 1250, conversions: 45, revenue: 892.50, conversionRate: 3.6 },
  { programId: 'publisher-rocket', clicks: 450, conversions: 28, revenue: 2520.00, conversionRate: 6.2 },
  { programId: 'helium10', clicks: 320, conversions: 15, revenue: 1875.00, conversionRate: 4.7 },
  { programId: 'canva', clicks: 680, conversions: 32, revenue: 1152.00, conversionRate: 4.7 },
  { programId: 'bookbolt', clicks: 280, conversions: 18, revenue: 1080.00, conversionRate: 6.4 },
];

const mockLinks: LinkPerformance[] = [
  { id: '1', programId: 'publisher-rocket', productName: 'Publisher Rocket Software', category: 'keyword-research', clicks: 245, conversions: 15, revenue: 1350.00, lastClicked: '2024-01-15' },
  { id: '2', programId: 'amazon', productName: 'Kindle Paperwhite', category: 'books', clicks: 520, conversions: 22, revenue: 264.00, lastClicked: '2024-01-15' },
  { id: '3', programId: 'canva', productName: 'Canva Pro Subscription', category: 'book-design', clicks: 380, conversions: 18, revenue: 648.00, lastClicked: '2024-01-14' },
  { id: '4', programId: 'helium10', productName: 'Helium 10 Platinum', category: 'analytics', clicks: 198, conversions: 8, revenue: 1000.00, lastClicked: '2024-01-14' },
  { id: '5', programId: 'bookbolt', productName: 'BookBolt Annual', category: 'book-design', clicks: 165, conversions: 12, revenue: 720.00, lastClicked: '2024-01-13' },
];

export default function AffiliateDashboard() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [stats, setStats] = useState<AffiliateStats[]>(mockStats);
  const [links, setLinks] = useState<LinkPerformance[]>(mockLinks);
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);

  // Calculate totals
  const totals = stats.reduce(
    (acc, stat) => ({
      clicks: acc.clicks + stat.clicks,
      conversions: acc.conversions + stat.conversions,
      revenue: acc.revenue + stat.revenue,
    }),
    { clicks: 0, conversions: 0, revenue: 0 }
  );

  const overallConversionRate = totals.clicks > 0
    ? ((totals.conversions / totals.clicks) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Affiliate Dashboard
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Monitor performance and manage affiliate links
            </p>
          </div>

          <div className="flex gap-3">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>

            <button
              onClick={() => setShowAddLinkModal(true)}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              + Add Link
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Clicks"
            value={totals.clicks.toLocaleString()}
            change="+12.5%"
            positive
          />
          <SummaryCard
            title="Conversions"
            value={totals.conversions.toLocaleString()}
            change="+8.2%"
            positive
          />
          <SummaryCard
            title="Revenue"
            value={formatCommission(totals.revenue)}
            change="+15.3%"
            positive
          />
          <SummaryCard
            title="Conversion Rate"
            value={`${overallConversionRate}%`}
            change="-0.5%"
            positive={false}
          />
        </div>

        {/* Program Performance */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Performance by Program
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                    Program
                  </th>
                  <th className="py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    Clicks
                  </th>
                  <th className="py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    Conversions
                  </th>
                  <th className="py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    Rate
                  </th>
                  <th className="py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    Revenue
                  </th>
                  <th className="py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => {
                  const program = AFFILIATE_PROGRAMS[stat.programId as keyof typeof AFFILIATE_PROGRAMS];
                  return (
                    <tr
                      key={stat.programId}
                      className="border-b border-gray-100 dark:border-gray-700"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                              {(program?.name || stat.programId).charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {program?.name || stat.programId}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                        {stat.clicks.toLocaleString()}
                      </td>
                      <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                        {stat.conversions}
                      </td>
                      <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                        {stat.conversionRate.toFixed(1)}%
                      </td>
                      <td className="py-3 text-right font-medium text-green-600 dark:text-green-400">
                        {formatCommission(stat.revenue)}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            program?.enabled
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {program?.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Links */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Top Performing Links
            </h2>

            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="all">All Programs</option>
              {Object.entries(AFFILIATE_PROGRAMS).map(([id, program]) => (
                <option key={id} value={id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                    Product
                  </th>
                  <th className="py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </th>
                  <th className="py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    Clicks
                  </th>
                  <th className="py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    Conv.
                  </th>
                  <th className="py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    Revenue
                  </th>
                  <th className="py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    Last Click
                  </th>
                </tr>
              </thead>
              <tbody>
                {links
                  .filter(
                    (link) =>
                      selectedProgram === 'all' || link.programId === selectedProgram
                  )
                  .map((link) => (
                    <tr
                      key={link.id}
                      className="border-b border-gray-100 dark:border-gray-700"
                    >
                      <td className="py-3">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {link.productName}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700 dark:text-gray-300">
                          {link.category}
                        </span>
                      </td>
                      <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                        {link.clicks.toLocaleString()}
                      </td>
                      <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                        {link.conversions}
                      </td>
                      <td className="py-3 text-right font-medium text-green-600 dark:text-green-400">
                        {formatCommission(link.revenue)}
                      </td>
                      <td className="py-3 text-right text-gray-500 dark:text-gray-400">
                        {link.lastClicked}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Export Report"
            description="Download CSV of all affiliate data"
            icon="📊"
            onClick={() => alert('Export functionality - implement with backend')}
          />
          <ActionCard
            title="Program Settings"
            description="Configure affiliate program credentials"
            icon="⚙️"
            onClick={() => alert('Settings - implement with backend')}
          />
          <ActionCard
            title="View All Links"
            description="Manage all affiliate links"
            icon="🔗"
            onClick={() => alert('Link management - implement with backend')}
          />
        </div>
      </div>

      {/* Add Link Modal (placeholder) */}
      {showAddLinkModal && (
        <AddLinkModal onClose={() => setShowAddLinkModal(false)} />
      )}
    </div>
  );
}

// Summary Card Component
function SummaryCard({
  title,
  value,
  change,
  positive,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </p>
      <p
        className={`mt-1 text-sm ${
          positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}
      >
        {change} vs last period
      </p>
    </div>
  );
}

// Action Card Component
function ActionCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <span className="text-2xl">{icon}</span>
      <h3 className="mt-2 font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </button>
  );
}

// Add Link Modal Component
function AddLinkModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    programId: 'amazon',
    productName: '',
    url: '',
    category: 'software' as AffiliateCategory,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement link creation with backend
    console.log('Creating link:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Add Affiliate Link
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Program
            </label>
            <select
              value={formData.programId}
              onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              {Object.entries(AFFILIATE_PROGRAMS).map(([id, program]) => (
                <option key={id} value={id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Name
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              placeholder="e.g., Publisher Rocket"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              placeholder="https://..."
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as AffiliateCategory })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              {AFFILIATE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Add Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
