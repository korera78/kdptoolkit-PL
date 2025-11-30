/**
 * Caching Utilities
 * In-memory cache for blog posts and other data
 */

import { BlogPost, getAllPosts as fetchAllPosts } from './mdx';

let postCache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (postCache) {
    return postCache;
  }

  postCache = fetchAllPosts();
  return postCache;
}

export function invalidatePostCache() {
  postCache = null;
}
