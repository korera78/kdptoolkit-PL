/**
 * SEO Component
 * Comprehensive SEO metadata including OpenGraph, Twitter Cards, and Schema.org
 */

'use client';

import Head from 'next/head';
import { SEOMetadata } from '@/lib/seo';

interface SEOProps {
  metadata: SEOMetadata;
  schema?: string;
}

export default function SEO({ metadata, schema }: SEOProps) {
  const {
    title,
    description,
    url,
    image,
    type,
    publishedTime,
    modifiedTime,
    author,
    tags,
  } = metadata;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* OpenGraph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:alt" content={title} />}
      <meta property="og:site_name" content="KDP Toolkit" />

      {/* Article-specific OpenGraph Tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && <meta property="article:author" content={author} />}
      {type === 'article' &&
        tags &&
        tags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Schema.org JSON-LD */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      )}
    </Head>
  );
}
