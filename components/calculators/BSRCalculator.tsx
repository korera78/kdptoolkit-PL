'use client';

import { useState } from 'react';

interface SalesEstimate {
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
  annualSales: number;
  estimatedRevenue: number;
  percentile: number;
  category: string;
}

interface BSRData {
  bsr: number;
  dailySales: number;
}

interface CategoryBenchmark {
  range: string;
  dailySales: string;
  description: string;
}

// Based on Kindlepreneur's published BSR-to-sales data (approximate)
const bsrToSalesData: BSRData[] = [
  { bsr: 1, dailySales: 5000 },
  { bsr: 5, dailySales: 3500 },
  { bsr: 10, dailySales: 2500 },
  { bsr: 20, dailySales: 1800 },
  { bsr: 50, dailySales: 1200 },
  { bsr: 100, dailySales: 800 },
  { bsr: 200, dailySales: 500 },
  { bsr: 500, dailySales: 300 },
  { bsr: 1000, dailySales: 175 },
  { bsr: 2000, dailySales: 100 },
  { bsr: 5000, dailySales: 50 },
  { bsr: 10000, dailySales: 25 },
  { bsr: 20000, dailySales: 15 },
  { bsr: 50000, dailySales: 8 },
  { bsr: 100000, dailySales: 4 },
  { bsr: 200000, dailySales: 2 },
  { bsr: 500000, dailySales: 1 },
  { bsr: 1000000, dailySales: 0.5 },
  { bsr: 2000000, dailySales: 0.25 },
  { bsr: 3000000, dailySales: 0.1 },
];

const categories = [
  { id: 'overall', name: 'Overall Kindle Store', multiplier: 1 },
  { id: 'fiction', name: 'Fiction', multiplier: 1.2 },
  { id: 'romance', name: 'Romance', multiplier: 1.5 },
  { id: 'mystery', name: 'Mystery & Thriller', multiplier: 1.3 },
  { id: 'scifi', name: 'Sci-Fi & Fantasy', multiplier: 1.2 },
  { id: 'nonfiction', name: 'Non-Fiction', multiplier: 0.8 },
  { id: 'business', name: 'Business & Money', multiplier: 0.7 },
  { id: 'selfhelp', name: 'Self-Help', multiplier: 0.9 },
  { id: 'biography', name: 'Biography & Memoir', multiplier: 0.8 },
];

// Category-specific BSR benchmarks
const categoryBenchmarks: Record<string, CategoryBenchmark[]> = {
  overall: [
    { range: 'Top 100', dailySales: '800-5,000', description: 'Elite bestseller' },
    { range: 'Top 1,000', dailySales: '175-800', description: 'Strong seller' },
    { range: 'Top 10,000', dailySales: '25-175', description: 'Consistent seller' },
    { range: 'Top 100,000', dailySales: '4-25', description: 'Moderate sales' },
  ],
  romance: [
    { range: 'Top 100', dailySales: '50-200', description: 'Category bestseller' },
    { range: 'Top 1,000', dailySales: '15-50', description: 'Popular in category' },
    { range: 'Top 10,000', dailySales: '2-15', description: 'Steady seller' },
    { range: 'Top 50,000', dailySales: '0.5-2', description: 'Niche appeal' },
  ],
  mystery: [
    { range: 'Top 100', dailySales: '60-220', description: 'Category bestseller' },
    { range: 'Top 1,000', dailySales: '18-60', description: 'Popular in category' },
    { range: 'Top 10,000', dailySales: '2.5-18', description: 'Steady seller' },
    { range: 'Top 50,000', dailySales: '0.6-2.5', description: 'Niche appeal' },
  ],
  fiction: [
    { range: 'Top 100', dailySales: '65-230', description: 'Category bestseller' },
    { range: 'Top 1,000', dailySales: '20-65', description: 'Popular in category' },
    { range: 'Top 10,000', dailySales: '3-20', description: 'Steady seller' },
    { range: 'Top 50,000', dailySales: '0.7-3', description: 'Niche appeal' },
  ],
  scifi: [
    { range: 'Top 100', dailySales: '65-230', description: 'Category bestseller' },
    { range: 'Top 1,000', dailySales: '20-65', description: 'Popular in category' },
    { range: 'Top 10,000', dailySales: '3-20', description: 'Steady seller' },
    { range: 'Top 50,000', dailySales: '0.7-3', description: 'Niche appeal' },
  ],
  nonfiction: [
    { range: 'Top 100', dailySales: '100-300', description: 'Category bestseller' },
    { range: 'Top 1,000', dailySales: '30-100', description: 'Popular in category' },
    { range: 'Top 10,000', dailySales: '4-30', description: 'Steady seller' },
    { range: 'Top 50,000', dailySales: '1-4', description: 'Niche appeal' },
  ],
  business: [
    { range: 'Top 100', dailySales: '115-350', description: 'Category bestseller' },
    { range: 'Top 1,000', dailySales: '35-115', description: 'Popular in category' },
    { range: 'Top 10,000', dailySales: '5-35', description: 'Steady seller' },
    { range: 'Top 50,000', dailySales: '1.2-5', description: 'Niche appeal' },
  ],
  selfhelp: [
    { range: 'Top 100', dailySales: '90-275', description: 'Category bestseller' },
    { range: 'Top 1,000', dailySales: '25-90', description: 'Popular in category' },
    { range: 'Top 10,000', dailySales: '3.5-25', description: 'Steady seller' },
    { range: 'Top 50,000', dailySales: '0.9-3.5', description: 'Niche appeal' },
  ],
  biography: [
    { range: 'Top 100', dailySales: '100-300', description: 'Category bestseller' },
    { range: 'Top 1,000', dailySales: '30-100', description: 'Popular in category' },
    { range: 'Top 10,000', dailySales: '4-30', description: 'Steady seller' },
    { range: 'Top 50,000', dailySales: '1-4', description: 'Niche appeal' },
  ],
};

const marketplaces = [
  { code: 'US', name: 'United States', avgPrice: 4.99 },
  { code: 'UK', name: 'United Kingdom', avgPrice: 3.99 },
  { code: 'DE', name: 'Germany', avgPrice: 3.99 },
  { code: 'FR', name: 'France', avgPrice: 3.99 },
  { code: 'ES', name: 'Spain', avgPrice: 3.99 },
];

export default function BSRCalculator() {
  const [bsr, setBsr] = useState<number>(10000);
  const [category, setCategory] = useState<string>('overall');
  const [marketplace, setMarketplace] = useState<string>('US');
  const [customPrice, setCustomPrice] = useState<number>(4.99);
  const [reverseMode, setReverseMode] = useState<boolean>(false);
  const [targetSales, setTargetSales] = useState<number>(10);
  const [bsr7DaysAgo, setBsr7DaysAgo] = useState<number | null>(null);
  const [royaltyTier, setRoyaltyTier] = useState<number>(70);

  const interpolateSales = (inputBSR: number): number => {
    // Handle edge cases
    if (inputBSR <= 1) return bsrToSalesData[0].dailySales;
    if (inputBSR >= 3000000) return 0.05;

    // Find the two nearest BSR points
    let lower = bsrToSalesData[0];
    let upper = bsrToSalesData[bsrToSalesData.length - 1];

    for (let i = 0; i < bsrToSalesData.length - 1; i++) {
      if (inputBSR >= bsrToSalesData[i].bsr && inputBSR <= bsrToSalesData[i + 1].bsr) {
        lower = bsrToSalesData[i];
        upper = bsrToSalesData[i + 1];
        break;
      }
    }

    // Logarithmic interpolation (BSR scales logarithmically)
    const logBSR = Math.log(inputBSR);
    const logLowerBSR = Math.log(lower.bsr);
    const logUpperBSR = Math.log(upper.bsr);
    const ratio = (logBSR - logLowerBSR) / (logUpperBSR - logLowerBSR);

    const interpolatedSales = lower.dailySales - (lower.dailySales - upper.dailySales) * ratio;
    return interpolatedSales;
  };

  const calculateBSRFromSales = (targetDaily: number): number => {
    // Reverse calculation: find BSR that gives target sales
    for (let i = 0; i < bsrToSalesData.length - 1; i++) {
      if (targetDaily >= bsrToSalesData[i + 1].dailySales && targetDaily <= bsrToSalesData[i].dailySales) {
        const lower = bsrToSalesData[i];
        const upper = bsrToSalesData[i + 1];

        const ratio = (targetDaily - upper.dailySales) / (lower.dailySales - upper.dailySales);
        const logLowerBSR = Math.log(lower.bsr);
        const logUpperBSR = Math.log(upper.bsr);
        const logBSR = logLowerBSR + ratio * (logUpperBSR - logLowerBSR);

        return Math.round(Math.exp(logBSR));
      }
    }

    // Edge cases
    if (targetDaily > bsrToSalesData[0].dailySales) return 1;
    return 3000000;
  };

  const estimateSales = (): SalesEstimate => {
    const selectedCategory = categories.find(c => c.id === category) || categories[0];
    const baseDailySales = interpolateSales(bsr);

    // Adjust for category (category rankings typically have lower volume)
    const adjustedDailySales = category === 'overall'
      ? baseDailySales
      : baseDailySales / selectedCategory.multiplier;

    const weeklySales = adjustedDailySales * 7;
    const monthlySales = adjustedDailySales * 30;
    const annualSales = adjustedDailySales * 365;
    const royaltyRate = royaltyTier / 100;
    const estimatedRevenue = monthlySales * customPrice * royaltyRate;

    // Calculate percentile (1 = top 0.01%, 100 = top 100%)
    const totalBooks = 3000000; // Approximate Kindle Store size
    const percentile = (bsr / totalBooks) * 100;

    return {
      dailySales: Math.max(0.01, adjustedDailySales),
      weeklySales: Math.max(0.07, weeklySales),
      monthlySales: Math.max(0.3, monthlySales),
      annualSales: Math.max(3.65, annualSales),
      estimatedRevenue: Math.max(0, estimatedRevenue),
      percentile,
      category: selectedCategory.name,
    };
  };

  const calculateSalesVelocity = (): { trend: 'improving' | 'declining' | 'stable'; percentage: number } | null => {
    if (bsr7DaysAgo === null || bsr7DaysAgo === bsr) return null;

    // Lower BSR is better, so if current BSR < old BSR, it's improving
    if (bsr < bsr7DaysAgo) {
      const percentage = ((bsr7DaysAgo - bsr) / bsr7DaysAgo) * 100;
      return { trend: 'improving', percentage: Math.abs(percentage) };
    } else if (bsr > bsr7DaysAgo) {
      const percentage = ((bsr - bsr7DaysAgo) / bsr7DaysAgo) * 100;
      return { trend: 'declining', percentage: Math.abs(percentage) };
    }
    return { trend: 'stable', percentage: 0 };
  };

  const calculateAmazonFees = (): { authorEarnings: number; amazonFee: number; deliveryFee: number } => {
    let authorEarnings = 0;
    let amazonFee = 0;
    let deliveryFee = 0;

    if (royaltyTier === 70) {
      // 70% royalty: price must be $2.99-$9.99, delivery fee applies
      deliveryFee = 0.06; // Approximate $0.06 per book
      authorEarnings = customPrice * 0.7 - deliveryFee;
      amazonFee = customPrice - authorEarnings - deliveryFee;
    } else {
      // 35% royalty: no delivery fee
      authorEarnings = customPrice * 0.35;
      amazonFee = customPrice * 0.65;
      deliveryFee = 0;
    }

    return {
      authorEarnings: Math.max(0, authorEarnings),
      amazonFee: Math.max(0, amazonFee),
      deliveryFee,
    };
  };

  const getBSRColorClass = (currentBSR: number): string => {
    if (currentBSR <= 1000) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    } else if (currentBSR <= 10000) {
      return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    } else if (currentBSR <= 100000) {
      return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
    } else {
      return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    }
  };

  const result = estimateSales();
  const targetBSR = reverseMode ? calculateBSRFromSales(targetSales) : 0;
  const velocity = calculateSalesVelocity();
  const fees = calculateAmazonFees();
  const benchmarks = categoryBenchmarks[category] || categoryBenchmarks.overall;

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return num.toFixed(1);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            BSR to Sales Estimator
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Estimate daily and monthly sales based on Amazon Best Sellers Rank
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setReverseMode(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !reverseMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            BSR → Sales
          </button>
          <button
            onClick={() => setReverseMode(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              reverseMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Sales → BSR
          </button>
        </div>

        {!reverseMode ? (
          /* BSR to Sales Mode */
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column: Inputs */}
            <div className="space-y-4">
              {/* BSR Input with Color Coding */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Best Sellers Rank: #{formatNumber(bsr)}
                </label>
                <input
                  type="range"
                  min={1}
                  max={3000000}
                  step={100}
                  value={bsr}
                  onChange={(e) => setBsr(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>#1</span>
                  <span>#3,000,000</span>
                </div>

                {/* Manual BSR Input with Color Coding */}
                <input
                  type="number"
                  min={1}
                  max={3000000}
                  value={bsr}
                  onChange={(e) => setBsr(Math.max(1, Math.min(3000000, parseInt(e.target.value) || 1)))}
                  className={`mt-2 w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-gray-100 ${getBSRColorClass(bsr)}`}
                  placeholder="Enter exact BSR"
                />
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {bsr <= 1000 && '🟢 Bestseller range'}
                  {bsr > 1000 && bsr <= 10000 && '🟡 Good performance'}
                  {bsr > 10000 && bsr <= 100000 && '🟠 Moderate sales'}
                  {bsr > 100000 && '🔴 Low sales volume'}
                </div>
              </div>

              {/* Sales Velocity Indicator */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  BSR 7 Days Ago (Optional)
                </label>
                <input
                  type="number"
                  min={1}
                  max={3000000}
                  value={bsr7DaysAgo || ''}
                  onChange={(e) => setBsr7DaysAgo(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  placeholder="Enter BSR from 7 days ago"
                />
                {velocity && (
                  <div className={`mt-2 p-2 rounded-lg text-sm ${
                    velocity.trend === 'improving'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : velocity.trend === 'declining'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                  }`}>
                    {velocity.trend === 'improving' && '📈 Sales Improving'}
                    {velocity.trend === 'declining' && '📉 Sales Declining'}
                    {velocity.trend === 'stable' && '➡️ Sales Stable'}
                    <span className="ml-2 font-medium">
                      {velocity.percentage > 0 && `${velocity.percentage.toFixed(1)}%`}
                    </span>
                  </div>
                )}
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Type
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Category-specific BSRs typically indicate lower sales volume
                </p>
              </div>

              {/* Royalty Tier Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Royalty Tier
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRoyaltyTier(70)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      royaltyTier === 70
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    70%
                  </button>
                  <button
                    onClick={() => setRoyaltyTier(35)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      royaltyTier === 35
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    35%
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {royaltyTier === 70
                    ? '70% royalty requires $2.99-$9.99 price range'
                    : '35% royalty available for all prices'}
                </p>
              </div>

              {/* Average Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Book Price: ${customPrice.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={0.99}
                  max={19.99}
                  step={0.10}
                  value={customPrice}
                  onChange={(e) => setCustomPrice(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>$0.99</span>
                  <span>$19.99</span>
                </div>

                {/* Manual Price Input */}
                <input
                  type="number"
                  min={0.99}
                  max={19.99}
                  step={0.01}
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Math.max(0.99, Math.min(19.99, parseFloat(e.target.value) || 0.99)))}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  placeholder="Enter exact price"
                />
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Estimated Sales
                </h3>

                {/* Daily Sales */}
                <div className="mb-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Daily Sales</div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatNumber(result.dailySales)} books
                  </div>
                </div>

                {/* Weekly Sales */}
                <div className="mb-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weekly Sales</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatNumber(result.weeklySales)} books
                  </div>
                </div>

                {/* Monthly Sales */}
                <div className="mb-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Sales</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatNumber(result.monthlySales)} books
                  </div>
                </div>

                {/* Annual Sales */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Annual Sales</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatNumber(result.annualSales)} books
                  </div>
                </div>

                {/* Estimated Revenue */}
                <div className="mb-4 pt-4 border-t border-green-200 dark:border-gray-600">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Estimated Monthly Revenue ({royaltyTier}% royalty)
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${formatNumber(result.estimatedRevenue)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Based on ${customPrice.toFixed(2)} price point
                  </div>
                </div>

                {/* Percentile */}
                <div className="bg-white/50 dark:bg-gray-900/50 rounded p-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Position</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Top {result.percentile.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    of all books in {result.category}
                  </div>
                </div>
              </div>

              {/* Amazon Fee Breakdown */}
              <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Amazon Fee Breakdown (per book)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Book Price:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ${customPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Your Earnings:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      ${fees.authorEarnings.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amazon Fee:</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      ${fees.amazonFee.toFixed(2)}
                    </span>
                  </div>
                  {fees.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Delivery Fee:</span>
                      <span className="font-medium text-orange-600 dark:text-orange-400">
                        ${fees.deliveryFee.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-blue-200 dark:border-gray-700">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">You keep:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {((fees.authorEarnings / customPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Context */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Context:</strong>{' '}
                  {bsr < 100
                    ? 'Bestseller territory! This book is generating significant sales.'
                    : bsr < 1000
                    ? 'Excellent performance. This book is selling very well.'
                    : bsr < 10000
                    ? 'Good sales volume. Strong performer in its category.'
                    : bsr < 100000
                    ? 'Moderate sales. Decent visibility on Amazon.'
                    : bsr < 500000
                    ? 'Low but consistent sales. Niche audience.'
                    : 'Minimal sales activity. Needs marketing boost.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Reverse Mode: Sales to BSR */
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column: Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Daily Sales: {formatNumber(targetSales)} books
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={1000}
                  step={0.1}
                  value={targetSales}
                  onChange={(e) => setTargetSales(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0.1</span>
                  <span>1,000</span>
                </div>

                <input
                  type="number"
                  min={0.1}
                  max={10000}
                  step={0.1}
                  value={targetSales}
                  onChange={(e) => setTargetSales(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  placeholder="Enter exact number"
                />
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Required BSR
                </h3>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    To achieve {formatNumber(targetSales)} daily sales, you need:
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    BSR #{formatNumber(targetBSR)}
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-gray-900/50 rounded p-3 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Daily Sales:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatNumber(targetSales)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Weekly Sales:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatNumber(targetSales * 7)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Monthly Sales:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatNumber(targetSales * 30)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Annual Sales:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatNumber(targetSales * 365)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Monthly Revenue:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        ${formatNumber(targetSales * 30 * customPrice * (royaltyTier / 100))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category-Specific BSR Benchmarks */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Category Benchmarks: {categories.find(c => c.id === category)?.name}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {benchmarks.map((benchmark, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3">
                <div className="font-semibold text-purple-900 dark:text-purple-300 text-sm">
                  {benchmark.range}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {benchmark.dailySales}
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  {benchmark.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Reference Table */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Quick Reference: Overall BSR Benchmarks
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {[
              { bsr: '#1-100', sales: '800-5,000/day', label: 'Bestseller' },
              { bsr: '#100-1K', sales: '175-800/day', label: 'Hot Seller' },
              { bsr: '#1K-10K', sales: '25-175/day', label: 'Solid Seller' },
              { bsr: '#10K-100K', sales: '4-25/day', label: 'Moderate' },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                <div className="font-medium text-gray-900 dark:text-gray-100">{item.bsr}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.sales}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">How BSR Works</h4>
        <ul className="space-y-2 list-disc list-inside">
          <li><strong>BSR updates hourly:</strong> Based on recent sales velocity, not total lifetime sales.</li>
          <li><strong>Lower is better:</strong> BSR #1 means you're the #1 bestseller in that category.</li>
          <li><strong>Category vs Overall:</strong> Overall BSR is harder to achieve than category-specific BSR.</li>
          <li><strong>Estimates vary:</strong> These are approximations based on industry data. Actual sales may vary by season, promotions, and category.</li>
        </ul>
      </div>
    </div>
  );
}
