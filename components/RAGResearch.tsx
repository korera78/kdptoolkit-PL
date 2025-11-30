/**
 * RAGResearch Component
 * "Show Related Research" button and display for RAG-enhanced content
 */

'use client';

import { useState } from 'react';
import { queryRAGClient, RAG_STORES } from '@/lib/rag';

interface RAGResearchProps {
  topic: string;
  className?: string;
}

export default function RAGResearch({ topic, className = '' }: RAGResearchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [research, setResearch] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleShowResearch = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    if (research) {
      setIsExpanded(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryRAGClient(
        `Provide detailed information about ${topic} for KDP publishers`,
        RAG_STORES.KDP_MARKETING
      );

      setResearch(result.answer);
      setIsExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('RAG query error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleShowResearch();
  };

  return (
    <div className={`rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      <button
        onClick={handleShowResearch}
        disabled={isLoading}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
        aria-expanded={isExpanded}
        aria-controls="rag-research-content"
      >
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5 text-primary-600 dark:text-primary-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {isLoading ? 'Loading...' : isExpanded ? 'Hide Research' : 'Show Related Research'}
          </span>
        </div>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isLoading && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
          </div>
        </div>
      )}

      {isExpanded && research && !isLoading && (
        <div
          id="rag-research-content"
          className="border-t border-gray-200 p-4 dark:border-gray-700"
        >
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>AI-generated content from knowledge base</span>
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              {research.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-2 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
