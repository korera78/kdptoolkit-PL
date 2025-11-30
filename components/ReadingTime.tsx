/**
 * ReadingTime Component
 * Displays estimated reading time
 */

'use client';

interface ReadingTimeProps {
  minutes: number;
  className?: string;
}

export default function ReadingTime({ minutes, className = '' }: ReadingTimeProps) {
  return (
    <span className={`inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 ${className}`}>
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{minutes} min read</span>
    </span>
  );
}
