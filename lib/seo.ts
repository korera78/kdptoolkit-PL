/**
 * SEO Utilities
 * Helper functions for generating SEO metadata
 */

import { BlogPost } from './mdx';

export interface SEOMetadata {
  title: string;
  description: string;
  url: string;
  image?: string;
  type: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'KDP Toolkit';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kdptoolkit.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-default.jpg`;

/**
 * Generate SEO metadata for a blog post
 * @param post - Blog post object
 * @returns SEO metadata object
 */
export function generatePostSEO(post: BlogPost): SEOMetadata {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.frontmatter.coverImage
    ? `${SITE_URL}${post.frontmatter.coverImage}`
    : DEFAULT_IMAGE;

  return {
    title: `${post.frontmatter.title} | ${SITE_NAME}`,
    description: post.frontmatter.description,
    url,
    image,
    type: 'article',
    publishedTime: post.frontmatter.date,
    author: post.frontmatter.author,
    tags: post.frontmatter.tags,
  };
}

/**
 * Generate SEO metadata for a page
 * @param title - Page title
 * @param description - Page description
 * @param path - Page path (e.g., '/about')
 * @param image - Optional custom image
 * @returns SEO metadata object
 */
export function generatePageSEO(
  title: string,
  description: string,
  path: string,
  image?: string
): SEOMetadata {
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}${path}`,
    image: image || DEFAULT_IMAGE,
    type: 'website',
  };
}

/**
 * Generate Schema.org Article JSON-LD
 * @param post - Blog post object
 * @returns JSON-LD string
 */
export function generateArticleSchema(post: BlogPost): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    image: post.frontmatter.coverImage
      ? `${SITE_URL}${post.frontmatter.coverImage}`
      : DEFAULT_IMAGE,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date,
    author: {
      '@type': 'Person',
      name: post.frontmatter.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.frontmatter.tags.join(', '),
  };

  return JSON.stringify(schema);
}

/**
 * Generate Schema.org WebSite JSON-LD
 * @returns JSON-LD string
 */
export function generateWebsiteSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Professional insights on KDP tools and software for publishers',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return JSON.stringify(schema);
}

/**
 * Generate Schema.org BreadcrumbList JSON-LD
 * @param items - Array of breadcrumb items
 * @returns JSON-LD string
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return JSON.stringify(schema);
}

/**
 * Truncate description to fit meta description length
 * @param description - Original description
 * @param maxLength - Maximum length (default: 155)
 * @returns Truncated description
 */
export function truncateDescription(description: string, maxLength = 155): string {
  if (description.length <= maxLength) {
    return description;
  }

  return description.substring(0, maxLength - 3) + '...';
}

/**
 * Generate canonical URL
 * @param path - Page path
 * @returns Canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
