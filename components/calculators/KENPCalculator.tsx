'use client';

import { useState } from 'react';

interface HistoricalRate {
  month: string;
  rate: number;
  fund: number;
}

// Historical KENP rates (estimated/sample data - actual rates vary by month)
const historicalRates: HistoricalRate[] = [
  { month: 'Dec 2023', rate: 0.00458, fund: 42000000 },
  { month: 'Jan 2024', rate: 0.00452, fund: 41200000 },
  { month: 'Feb 2024', rate: 0.00449, fund: 40500000 },
  { month: 'Mar 2024', rate: 0.00454, fund: 41800000 },
  { month: 'Apr 2024', rate: 0.00451, fund: 40900000 },
  { month: 'May 2024', rate: 0.00457, fund: 42200000 },
  { month: 'Jun 2024', rate: 0.00453, fund: 41500000 },
  { month: 'Jul 2024', rate: 0.00456, fund: 42000000 },
  { month: 'Aug 2024', rate: 0.00450, fund: 40800000 },
  { month: 'Sep 2024', rate: 0.00455, fund: 41900000 },
  { month: 'Oct 2024', rate: 0.00459, fund: 42500000 },
  { month: 'Nov 2024', rate: 0.00461, fund: 43000000 },
];

export default function KENPCalculator() {
  const [pagesRead, setPagesRead] = useState<number>(10000);
  const [kenpRate, setKenpRate] = useState<number>(0.00450); // Current average rate
  const [globalFund, setGlobalFund] = useState<number>(40000000);
  const [bookPages, setBookPages] = useState<number>(300);
  const [completionRate, setCompletionRate] = useState<number>(60);
  const [monthlyReaders, setMonthlyReaders] = useState<number>(100);

  // Series calculator states
  const [seriesBooks, setSeriesBooks] = useState<number>(3);
  const [readThroughRate, setReadThroughRate] = useState<number>(50);

  // Goal calculator states
  const [targetIncome, setTargetIncome] = useState<number>(1000);

  const calculateEarnings = () => {
    const totalEarnings = pagesRead * kenpRate;
    const perPageEarning = kenpRate;
    const fullReadEarnings = bookPages * kenpRate;
    const avgReadPages = bookPages * (completionRate / 100);
    const earningsPerReader = avgReadPages * kenpRate;
    const projectedMonthlyEarnings = monthlyReaders * earningsPerReader;

    return {
      totalEarnings,
      perPageEarning,
      fullReadEarnings,
      avgReadPages,
      earningsPerReader,
      projectedMonthlyEarnings,
    };
  };

  const calculate70Royalty = () => {
    // Calculate equivalent book price for 70% royalty
    const earnings = calculateEarnings();
    const equivalentPrice = earnings.fullReadEarnings / 0.7;
    return equivalentPrice;
  };

  const calculateSeriesEarnings = () => {
    const fullReadEarnings = bookPages * kenpRate;

    // Calculate earnings with read-through rate
    let totalSeriesEarnings = fullReadEarnings; // First book
    for (let i = 1; i < seriesBooks; i++) {
      totalSeriesEarnings += fullReadEarnings * Math.pow(readThroughRate / 100, i);
    }

    return {
      totalSeriesEarnings,
      perReaderValue: totalSeriesEarnings,
      monthlyFromSeries: totalSeriesEarnings * monthlyReaders,
    };
  };

  const calculateGoalRequirements = () => {
    const avgReadPages = bookPages * (completionRate / 100);
    const earningsPerReader = avgReadPages * kenpRate;

    // Calculate required readers
    const requiredReaders = targetIncome / earningsPerReader;

    // Calculate required page reads
    const requiredPageReads = targetIncome / kenpRate;

    return {
      requiredReaders: Math.ceil(requiredReaders),
      requiredPageReads: Math.ceil(requiredPageReads),
      earningsPerReader,
    };
  };

  const calculateDirectSalesComparison = () => {
    const fullReadEarnings = bookPages * kenpRate;
    const prices = [2.99, 4.99, 9.99];

    return prices.map(price => {
      const royalty70 = price * 0.7;
      const royalty35 = price * 0.35;
      const profitableAt70 = fullReadEarnings >= royalty70;
      const profitableAt35 = fullReadEarnings >= royalty35;

      return {
        price,
        royalty70,
        royalty35,
        kuEarnings: fullReadEarnings,
        profitableAt70,
        profitableAt35,
      };
    });
  };

  const result = calculateEarnings();
  const equivalent70Price = calculate70Royalty();
  const seriesResult = calculateSeriesEarnings();
  const goalRequirements = calculateGoalRequirements();
  const directSalesComparison = calculateDirectSalesComparison();

  // Calculate average rate from historical data
  const avgHistoricalRate = historicalRates.reduce((sum, r) => sum + r.rate, 0) / historicalRates.length;
  const rateVariance = ((kenpRate - avgHistoricalRate) / avgHistoricalRate) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            KENP Calculator (Kindle Unlimited)
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Calculate your Kindle Unlimited earnings based on pages read
          </p>
        </div>

        {/* Current Rate Info */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current KENP Rate (Estimated)</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${kenpRate.toFixed(5)} per page
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {rateVariance > 0 ? '↑' : '↓'} {Math.abs(rateVariance).toFixed(1)}% vs 12-month average
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">KDP Select Global Fund</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                ${(globalFund / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Updated monthly by Amazon
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: Basic Calculator */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Basic Earnings Calculator
            </h3>

            {/* Pages Read Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pages Read This Month: {pagesRead.toLocaleString()}
              </label>
              <input
                type="range"
                min={0}
                max={1000000}
                step={1000}
                value={pagesRead}
                onChange={(e) => setPagesRead(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0</span>
                <span>1,000,000</span>
              </div>

              <input
                type="number"
                min={0}
                value={pagesRead}
                onChange={(e) => setPagesRead(Math.max(0, parseInt(e.target.value) || 0))}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="Enter exact pages read"
              />
            </div>

            {/* KENP Rate Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                KENP Rate: ${kenpRate.toFixed(5)}
              </label>
              <input
                type="range"
                min={0.00300}
                max={0.00600}
                step={0.00001}
                value={kenpRate}
                onChange={(e) => setKenpRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>$0.00300</span>
                <span>$0.00600</span>
              </div>

              <input
                type="number"
                min={0.00300}
                max={0.00600}
                step={0.00001}
                value={kenpRate}
                onChange={(e) => setKenpRate(Math.min(0.00600, Math.max(0.00300, parseFloat(e.target.value) || 0.00450)))}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="Enter exact KENP rate"
              />

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Adjust if you know the exact rate from KDP reports
              </p>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Your Earnings
              </h4>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total Earnings</div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ${result.totalEarnings.toFixed(2)}
                  </div>
                </div>

                <div className="pt-3 border-t border-green-200 dark:border-gray-600 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Pages read:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {pagesRead.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Rate per page:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ${result.perPageEarning.toFixed(5)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Earnings:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      ${result.totalEarnings.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Advanced Projections */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Full Read Projection
            </h3>

            {/* Book Pages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Book Length: {bookPages} pages
              </label>
              <input
                type="range"
                min={50}
                max={1000}
                step={10}
                value={bookPages}
                onChange={(e) => setBookPages(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>50</span>
                <span>1,000</span>
              </div>

              <input
                type="number"
                min={50}
                max={1000}
                value={bookPages}
                onChange={(e) => setBookPages(Math.min(1000, Math.max(50, parseInt(e.target.value) || 300)))}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="Enter book page count"
              />
            </div>

            {/* Completion Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Average Completion Rate: {completionRate}%
              </label>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={completionRate}
                onChange={(e) => setCompletionRate(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>10%</span>
                <span>100%</span>
              </div>

              <input
                type="number"
                min={10}
                max={100}
                value={completionRate}
                onChange={(e) => setCompletionRate(Math.min(100, Math.max(10, parseInt(e.target.value) || 60)))}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="Enter completion rate %"
              />

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Industry average: 40-60% for most books
              </p>
            </div>

            {/* Monthly Readers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monthly KU Readers: {monthlyReaders}
              </label>
              <input
                type="range"
                min={10}
                max={1000}
                step={10}
                value={monthlyReaders}
                onChange={(e) => setMonthlyReaders(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>10</span>
                <span>1,000</span>
              </div>

              <input
                type="number"
                min={10}
                max={10000}
                value={monthlyReaders}
                onChange={(e) => setMonthlyReaders(Math.max(10, parseInt(e.target.value) || 100))}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="Enter monthly readers"
              />
            </div>

            {/* Projections */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Projected Earnings
              </h4>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Full read value:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ${result.fullReadEarnings.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg pages read:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {result.avgReadPages.toFixed(0)} pages ({completionRate}%)
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Per reader earnings:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ${result.earningsPerReader.toFixed(2)}
                  </span>
                </div>

                <div className="pt-3 border-t border-blue-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Monthly projection:</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${result.projectedMonthlyEarnings.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {monthlyReaders} readers × ${result.earningsPerReader.toFixed(2)} avg
                  </div>
                </div>
              </div>
            </div>

            {/* 70% Royalty Comparison */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
              <div className="text-sm">
                <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  70% Royalty Comparison
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  A full read-through equals a book priced at{' '}
                  <strong className="text-amber-700 dark:text-amber-400">
                    ${equivalent70Price.toFixed(2)}
                  </strong>{' '}
                  with 70% royalty.
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {equivalent70Price < 2.99
                    ? 'KU pays better than 35% royalty at this book length.'
                    : equivalent70Price > 9.99
                    ? 'For long books, KU can be very profitable.'
                    : 'KU is roughly equivalent to 70% royalty.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KU vs Direct Sales Comparison */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            KU vs Direct Sales Comparison
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-gray-100">Book Price</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-900 dark:text-gray-100">70% Royalty</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-900 dark:text-gray-100">35% Royalty</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-900 dark:text-gray-100">KU Full Read</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-gray-100">Winner</th>
                </tr>
              </thead>
              <tbody>
                {directSalesComparison.map((comparison, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-3 text-gray-900 dark:text-gray-100">
                      ${comparison.price.toFixed(2)}
                    </td>
                    <td className="text-right py-2 px-3 text-gray-900 dark:text-gray-100">
                      ${comparison.royalty70.toFixed(2)}
                    </td>
                    <td className="text-right py-2 px-3 text-gray-900 dark:text-gray-100">
                      ${comparison.royalty35.toFixed(2)}
                    </td>
                    <td className="text-right py-2 px-3 font-medium text-blue-600 dark:text-blue-400">
                      ${comparison.kuEarnings.toFixed(2)}
                    </td>
                    <td className="py-2 px-3">
                      {comparison.profitableAt70 ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">KU wins</span>
                      ) : comparison.profitableAt35 ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">Direct (70%)</span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">Direct (35%)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            <strong>Note:</strong> This comparison assumes 100% completion rate for KU. Actual earnings vary based on reader completion.
            KU readers may not finish the book, while direct sales give you the full royalty upfront.
          </p>
        </div>

        {/* Series Calculator */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Series Earnings Calculator
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Books in Series: {seriesBooks}
              </label>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={seriesBooks}
                onChange={(e) => setSeriesBooks(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>1</span>
                <span>10</span>
              </div>

              <input
                type="number"
                min={1}
                max={20}
                value={seriesBooks}
                onChange={(e) => setSeriesBooks(Math.max(1, parseInt(e.target.value) || 3))}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="Enter number of books"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Read-Through Rate: {readThroughRate}%
              </label>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={readThroughRate}
                onChange={(e) => setReadThroughRate(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>10%</span>
                <span>100%</span>
              </div>

              <input
                type="number"
                min={10}
                max={100}
                value={readThroughRate}
                onChange={(e) => setReadThroughRate(Math.min(100, Math.max(10, parseInt(e.target.value) || 50)))}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="Enter read-through rate %"
              />

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                % of readers who continue to next book (typical: 40-70%)
              </p>
            </div>
          </div>

          <div className="mt-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Series Earnings Projection
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Per reader value (full series):</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ${seriesResult.perReaderValue.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total series earnings/reader:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ${seriesResult.totalSeriesEarnings.toFixed(2)}
                </span>
              </div>

              <div className="pt-3 border-t border-purple-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Monthly series earnings:</span>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    ${seriesResult.monthlyFromSeries.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {monthlyReaders} readers × ${seriesResult.perReaderValue.toFixed(2)} series value
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
              <strong>Breakdown by book:</strong>
              <ul className="mt-1 space-y-1">
                {Array.from({ length: seriesBooks }, (_, i) => {
                  const bookEarnings = result.fullReadEarnings * Math.pow(readThroughRate / 100, i);
                  const readersReachingBook = monthlyReaders * Math.pow(readThroughRate / 100, i);
                  return (
                    <li key={i}>
                      Book {i + 1}: ${bookEarnings.toFixed(2)} × {readersReachingBook.toFixed(0)} readers = ${(bookEarnings * readersReachingBook).toFixed(2)}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Goal Calculator */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Income Goal Calculator
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Monthly Income: ${targetIncome.toLocaleString()}
            </label>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={targetIncome}
              onChange={(e) => setTargetIncome(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>$100</span>
              <span>$10,000</span>
            </div>

            <input
              type="number"
              min={100}
              value={targetIncome}
              onChange={(e) => setTargetIncome(Math.max(100, parseInt(e.target.value) || 1000))}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              placeholder="Enter target income"
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Required Monthly Readers
              </h4>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {goalRequirements.requiredReaders.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                At {completionRate}% avg completion ({result.avgReadPages.toFixed(0)} pages)
                <br />
                Earning ${goalRequirements.earningsPerReader.toFixed(2)} per reader
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Required Total Page Reads
              </h4>
              <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                {goalRequirements.requiredPageReads.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Total KENP pages that need to be read
                <br />
                At ${kenpRate.toFixed(5)} per page
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <strong>Tips to reach your goal:</strong>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Increase book length to earn more per reader</li>
              <li>Improve book quality to increase completion rates</li>
              <li>Write a series to multiply earnings per reader</li>
              <li>Market to attract more KU subscribers</li>
              <li>Publish more books to increase total page reads</li>
            </ul>
          </div>
        </div>

        {/* Historical Rate Chart */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Historical KENP Rates (Last 12 Months - Estimated)
          </h4>

          <div className="overflow-x-auto">
            <div className="inline-flex gap-2 min-w-full">
              {historicalRates.map((rate, idx) => {
                const maxRate = Math.max(...historicalRates.map(r => r.rate));
                const heightPercent = (rate.rate / maxRate) * 100;

                return (
                  <div key={idx} className="flex flex-col items-center flex-1 min-w-[60px] group">
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
                      ${rate.rate.toFixed(5)}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t h-32 flex items-end relative">
                      <div
                        className="w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-all cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                      {/* Hover tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded py-1 px-2 whitespace-nowrap">
                          <div className="font-semibold">{rate.month}</div>
                          <div>Rate: ${rate.rate.toFixed(5)}</div>
                          <div>Fund: ${(rate.fund / 1000000).toFixed(1)}M</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 -rotate-45 origin-top-left">
                      {rate.month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <p>
              <strong>Note:</strong> These rates are approximate/estimated values for demonstration purposes.
              Actual KENP rates fluctuate monthly based on the KDP Select Global Fund size and total pages read across all KU books.
              Rates typically range from $0.0040 to $0.0050 per page. Check your KDP dashboard for exact historical rates.
            </p>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Understanding KENP (Kindle Edition Normalized Pages)
        </h4>
        <ul className="space-y-2 list-disc list-inside">
          <li><strong>KENP is NOT your book's page count:</strong> Amazon calculates KENP based on file size, formatting, and content density.</li>
          <li><strong>KU earnings = Pages Read × Rate:</strong> You earn every time a KU subscriber reads your book's pages.</li>
          <li><strong>Rates change monthly:</strong> Amazon announces the rate after each month closes (usually around the 15th).</li>
          <li><strong>70% threshold doesn't apply:</strong> Unlike 70% royalty, there's no $2.99-$9.99 price restriction for KU.</li>
          <li><strong>Longer books earn more:</strong> A 500-page book earns ~2-3× more per full read than a 200-page book.</li>
          <li><strong>Completion matters:</strong> Most readers don't finish books. Average completion is 40-60%.</li>
        </ul>
      </div>
    </div>
  );
}
