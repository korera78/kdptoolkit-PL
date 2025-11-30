'use client';

import { useState, useEffect } from 'react';

interface RoyaltyResult {
  royalty35: number;
  royalty70: number;
  deliveryCost: number;
  printCost: number;
  netProfit35: number;
  netProfit70: number;
  is70Eligible: boolean;
  currency: string;
  currencySymbol: string;
}

interface Marketplace {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  minPrice: number;
  maxPrice: number;
}

const marketplaces: Marketplace[] = [
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', minPrice: 0.99, maxPrice: 200 },
  { code: 'UK', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', minPrice: 0.77, maxPrice: 200 },
  { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', minPrice: 0.99, maxPrice: 200 },
  { code: 'FR', name: 'France', currency: 'EUR', currencySymbol: '€', minPrice: 0.99, maxPrice: 200 },
  { code: 'ES', name: 'Spain', currency: 'EUR', currencySymbol: '€', minPrice: 0.99, maxPrice: 200 },
  { code: 'IT', name: 'Italy', currency: 'EUR', currencySymbol: '€', minPrice: 0.99, maxPrice: 200 },
  { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: 'C$', minPrice: 0.99, maxPrice: 200 },
  { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: 'A$', minPrice: 0.99, maxPrice: 200 },
  { code: 'JP', name: 'Japan', currency: 'JPY', currencySymbol: '¥', minPrice: 99, maxPrice: 20000 },
];

export default function KDPRoyaltyCalculator() {
  const [bookType, setBookType] = useState<'ebook' | 'paperback' | 'hardcover'>('ebook');
  const [price, setPrice] = useState<number>(2.99);
  const [pageCount, setPageCount] = useState<number>(200);
  const [marketplace, setMarketplace] = useState<string>('US');
  const [colorInterior, setColorInterior] = useState<boolean>(false);
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [comparisonPrices, setComparisonPrices] = useState<number[]>([2.99, 4.99, 9.99]);
  const [monthlySalesEstimate, setMonthlySalesEstimate] = useState<number>(100);

  const currentMarketplace = marketplaces.find(m => m.code === marketplace) || marketplaces[0];

  const calculateDeliveryCost = (fileSize: number): number => {
    // Amazon charges $0.15 per MB for delivery (70% royalty)
    // Average ebook is ~1MB per 100 pages
    const estimatedMB = pageCount / 100;
    return estimatedMB * 0.15;
  };

  const calculatePrintCost = (pages: number, color: boolean, type: 'paperback' | 'hardcover'): number => {
    // Amazon KDP print costs (approximate for US, 6x9 trim)
    const fixedCost = type === 'paperback' ? 0.85 : 3.50;
    const perPageCost = color
      ? (type === 'paperback' ? 0.06 : 0.08)
      : (type === 'paperback' ? 0.012 : 0.015);
    return fixedCost + (pages * perPageCost);
  };

  const calculateBreakEvenPrice = (): number | null => {
    if (bookType === 'ebook') return null;

    // For print books: find minimum price where royalty > 0
    // Formula: (price * 0.6) - printCost = 0
    // price = printCost / 0.6
    const printCost = calculatePrintCost(pageCount, colorInterior, bookType);
    const breakEvenPrice = printCost / 0.6;
    return breakEvenPrice;
  };

  const calculateRoyalty = (bookPrice: number): RoyaltyResult => {
    // 70% royalty eligibility: price between $2.99-$9.99 for ebook
    const is70Eligible = bookType === 'ebook' && bookPrice >= 2.99 && bookPrice <= 9.99;

    let deliveryCost = 0;
    let printCost = 0;
    let royalty35 = 0;
    let royalty70 = 0;
    let netProfit35 = 0;
    let netProfit70 = 0;

    if (bookType === 'ebook') {
      deliveryCost = calculateDeliveryCost(pageCount / 100);

      // 35% royalty
      royalty35 = bookPrice * 0.35;
      netProfit35 = royalty35;

      // 70% royalty (minus delivery cost)
      if (is70Eligible) {
        royalty70 = bookPrice * 0.70;
        netProfit70 = royalty70 - deliveryCost;
      }
    } else {
      // Print books
      printCost = calculatePrintCost(pageCount, colorInterior, bookType);

      // Print royalty = 60% of list price minus printing costs
      const royaltyBase = bookPrice * 0.60;
      netProfit35 = royaltyBase - printCost;
      royalty35 = netProfit35;

      // For print, there's no 70% option, so we set it to 0
      netProfit70 = 0;
    }

    return {
      royalty35: Math.max(0, royalty35),
      royalty70: Math.max(0, royalty70),
      deliveryCost,
      printCost,
      netProfit35: Math.max(0, netProfit35),
      netProfit70: Math.max(0, netProfit70),
      is70Eligible,
      currency: currentMarketplace.currency,
      currencySymbol: currentMarketplace.currencySymbol,
    };
  };

  const result = calculateRoyalty(price);
  const breakEvenPrice = calculateBreakEvenPrice();

  const formatCurrency = (amount: number): string => {
    return `${currentMarketplace.currencySymbol}${amount.toFixed(2)}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return num.toFixed(1);
  };

  // Calculate best royalty per book
  const bestRoyaltyPerBook = bookType === 'ebook' && result.is70Eligible
    ? result.netProfit70
    : result.netProfit35;

  // Calculate profit per 1000 sales
  const profitPer1000 = bestRoyaltyPerBook * 1000;

  // Calculate annual revenue projection
  const annualRevenue = bestRoyaltyPerBook * monthlySalesEstimate * 12;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            💰 KDP Royalty Calculator
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Calculate your exact Amazon KDP royalties for different price points and formats
          </p>
        </div>

        {/* Book Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Book Type
          </label>
          <div className="flex gap-2 flex-wrap">
            {(['ebook', 'paperback', 'hardcover'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setBookType(type)}
                className={`px-4 py-3 sm:py-2 rounded-lg font-medium transition-colors min-h-[44px] sm:min-h-0 ${
                  bookType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: Inputs */}
          <div className="space-y-4">
            {/* Price Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Book Price: {formatCurrency(price)}
              </label>
              <input
                type="range"
                min={currentMarketplace.minPrice}
                max={currentMarketplace.maxPrice}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{formatCurrency(currentMarketplace.minPrice)}</span>
                <span>{formatCurrency(currentMarketplace.maxPrice)}</span>
              </div>

              {/* Manual Price Input */}
              <input
                type="number"
                min={currentMarketplace.minPrice}
                max={currentMarketplace.maxPrice}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Math.max(currentMarketplace.minPrice, Math.min(currentMarketplace.maxPrice, parseFloat(e.target.value) || currentMarketplace.minPrice)))}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 min-h-[44px]"
                placeholder="Enter exact price"
              />
            </div>

            {/* Page Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page Count: {pageCount}
              </label>
              <input
                type="range"
                min={bookType === 'ebook' ? 1 : 24}
                max={bookType === 'ebook' ? 1000 : 828}
                step="1"
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{bookType === 'ebook' ? 1 : 24}</span>
                <span>{bookType === 'ebook' ? 1000 : 828}</span>
              </div>

              {/* Manual Page Count Input */}
              <input
                type="number"
                min={bookType === 'ebook' ? 1 : 24}
                max={bookType === 'ebook' ? 1000 : 828}
                step="1"
                value={pageCount}
                onChange={(e) => setPageCount(Math.max(bookType === 'ebook' ? 1 : 24, Math.min(bookType === 'ebook' ? 1000 : 828, parseInt(e.target.value) || (bookType === 'ebook' ? 1 : 24))))}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 min-h-[44px]"
                placeholder="Enter exact page count"
              />
            </div>

            {/* Marketplace Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Marketplace
              </label>
              <select
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 min-h-[44px]"
              >
                {marketplaces.map((m) => (
                  <option key={m.code} value={m.code}>
                    {m.name} ({m.currencySymbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Color Interior (Print only) */}
            {bookType !== 'ebook' && (
              <div className="flex items-center min-h-[44px]">
                <input
                  type="checkbox"
                  id="colorInterior"
                  checked={colorInterior}
                  onChange={(e) => setColorInterior(e.target.checked)}
                  className="w-5 h-5 sm:w-4 sm:h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="colorInterior" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Color Interior (higher print cost)
                </label>
              </div>
            )}

            {/* Monthly Sales Estimate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monthly Sales Estimate: {monthlySalesEstimate} books
              </label>
              <input
                type="range"
                min={10}
                max={1000}
                step="10"
                value={monthlySalesEstimate}
                onChange={(e) => setMonthlySalesEstimate(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>10</span>
                <span>1,000</span>
              </div>

              {/* Manual Sales Estimate Input */}
              <input
                type="number"
                min={10}
                max={10000}
                step="10"
                value={monthlySalesEstimate}
                onChange={(e) => setMonthlySalesEstimate(Math.max(10, Math.min(10000, parseInt(e.target.value) || 10)))}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 min-h-[44px]"
                placeholder="Enter monthly sales estimate"
              />
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Royalty Breakdown
              </h3>

              {bookType === 'ebook' ? (
                <>
                  {/* 70% Royalty */}
                  {result.is70Eligible ? (
                    <div className="mb-4 pb-4 border-b border-blue-200 dark:border-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          70% Royalty (Recommended)
                        </span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(result.netProfit70)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Base royalty (70%):</span>
                          <span>{formatCurrency(result.royalty70)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery cost:</span>
                          <span>-{formatCurrency(result.deliveryCost)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 pb-4 border-b border-blue-200 dark:border-gray-600">
                      <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                        ⚠️ 70% royalty requires price between {formatCurrency(2.99)} - {formatCurrency(9.99)}
                      </div>
                    </div>
                  )}

                  {/* 35% Royalty */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        35% Royalty
                      </span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(result.netProfit35)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Base royalty (35%):</span>
                        <span>{formatCurrency(result.royalty35)}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Print Book Royalty */
                <>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Print Royalty (60% - Print Cost)
                      </span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(result.netProfit35)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span>List price:</span>
                        <span>{formatCurrency(price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>60% royalty base:</span>
                        <span>{formatCurrency(price * 0.6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Print cost ({pageCount} pages{colorInterior ? ', color' : ''}):</span>
                        <span>-{formatCurrency(result.printCost)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Break-Even Price for Print Books */}
                  {breakEvenPrice !== null && (
                    <div className="bg-blue-50 dark:bg-gray-900/50 rounded p-3 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400">ℹ️</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            Minimum profitable price: {formatCurrency(breakEvenPrice)}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Price your book at or above this to earn positive royalties
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Profit Per 1000 Sales */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profit Per 1,000 Sales
              </h3>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(profitPer1000)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                If you sell 1,000 copies at {formatCurrency(price)}
              </div>
            </div>

            {/* Annual Revenue Projection */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Annual Revenue Projection
              </h3>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(annualRevenue)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                <div>Based on {monthlySalesEstimate} sales/month</div>
                <div className="flex justify-between pt-2 border-t border-purple-200 dark:border-gray-600">
                  <span>Per book:</span>
                  <span className="font-medium">{formatCurrency(bestRoyaltyPerBook)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual sales:</span>
                  <span className="font-medium">{formatNumber(monthlySalesEstimate * 12)} books</span>
                </div>
              </div>
            </div>

            {/* Key Insight */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>💡 Tip:</strong>{' '}
                {bookType === 'ebook' && result.is70Eligible
                  ? `At ${formatCurrency(price)}, the 70% royalty earns you ${formatCurrency(result.netProfit70 - result.netProfit35)} more per sale.`
                  : bookType === 'ebook'
                  ? `Price your ebook between ${formatCurrency(2.99)}-${formatCurrency(9.99)} to unlock 70% royalty.`
                  : result.netProfit35 > 0
                  ? `Your print book earns ${formatCurrency(result.netProfit35)} per sale after printing costs.`
                  : 'Your print cost is higher than royalty. Consider increasing price or reducing pages.'}
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Mode Toggle */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 min-h-[44px] px-2"
          >
            {comparisonMode ? '− Hide' : '+ Show'} Price Comparison
          </button>
        </div>

        {/* Comparison Table */}
        {comparisonMode && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Price</th>
                  {bookType === 'ebook' && (
                    <th className="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">70% Royalty</th>
                  )}
                  <th className="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                    {bookType === 'ebook' ? '35% Royalty' : 'Print Royalty'}
                  </th>
                  <th className="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Best Option</th>
                </tr>
              </thead>
              <tbody>
                {[0.99, 1.99, 2.99, 3.99, 4.99, 6.99, 9.99, 12.99].map((testPrice) => {
                  const testResult = calculateRoyalty(testPrice);
                  const bestProfit = testResult.is70Eligible
                    ? testResult.netProfit70
                    : testResult.netProfit35;

                  return (
                    <tr key={testPrice} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-3 text-gray-900 dark:text-gray-100">
                        {formatCurrency(testPrice)}
                      </td>
                      {bookType === 'ebook' && (
                        <td className="text-right py-2 px-3 text-gray-700 dark:text-gray-300">
                          {testResult.is70Eligible
                            ? formatCurrency(testResult.netProfit70)
                            : '-'}
                        </td>
                      )}
                      <td className="text-right py-2 px-3 text-gray-700 dark:text-gray-300">
                        {formatCurrency(testResult.netProfit35)}
                      </td>
                      <td className="text-right py-2 px-3 font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(bestProfit)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Educational Content */}
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">How Amazon KDP Royalties Work</h4>
        <ul className="space-y-2 list-disc list-inside">
          <li><strong>70% Royalty (eBooks):</strong> Available for eBooks priced $2.99-$9.99. Amazon deducts delivery costs (~$0.15/MB).</li>
          <li><strong>35% Royalty (eBooks):</strong> Available for all price points. No delivery cost deduction.</li>
          <li><strong>Print Royalties:</strong> Based on 60% of list price minus printing costs (fixed cost + per-page cost).</li>
          <li><strong>Tip:</strong> For eBooks, pricing between $2.99-$4.99 typically maximizes both profit and sales volume.</li>
        </ul>
      </div>
    </div>
  );
}
