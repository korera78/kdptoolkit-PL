/**
 * Comments Component
 * Giscus-powered comments section
 */

'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

export default function Comments() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mt-8">
      <Giscus
        repo="user/repo"
        repoId="repoId"
        category="Announcements"
        categoryId="categoryId"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
