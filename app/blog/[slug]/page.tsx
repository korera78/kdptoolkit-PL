/**
 * Individual Blog Post Page
 * With TOC, comments, RAG research, and related posts
 */

import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { getPostBySlug, getRelatedPosts, getPostSlugs } from '@/lib/mdx';
import { generatePostSEO, generateArticleSchema } from '@/lib/seo';
import TableOfContents from '@/components/TableOfContents';
import Comments from '@/components/Comments';
import RelatedPosts from '@/components/RelatedPosts';
import ReadingTime from '@/components/ReadingTime';
import Newsletter from '@/components/Newsletter';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const seo = generatePostSEO(post);

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: {
      canonical: seo.url,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.url,
      type: 'article',
      publishedTime: post.frontmatter.date,
      authors: [post.frontmatter.author],
      images: seo.image ? [seo.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: seo.image ? [seo.image] : [],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(params.slug, 3);
  const schema = generateArticleSchema(post);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schema }}
      />

      <article className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <header className="mb-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {post.frontmatter.tags.map((tag) => (
                  <a
                    key={tag}
                    href={`/tags/${tag.toLowerCase()}`}
                    className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800"
                  >
                    {tag}
                  </a>
                ))}
              </div>

              <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl">
                {post.frontmatter.title}
              </h1>

              <p className="mb-6 text-xl text-gray-600 dark:text-gray-400">
                {post.frontmatter.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <time dateTime={post.frontmatter.date}>
                  {format(new Date(post.frontmatter.date), 'MMMM d, yyyy')}
                </time>
                <span>·</span>
                <ReadingTime minutes={post.readingTime} />
                <span>·</span>
                <span>{post.frontmatter.author}</span>
              </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary-600 hover:prose-a:text-primary-700 dark:prose-a:text-primary-400 dark:hover:prose-a:text-primary-300 prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm dark:prose-code:bg-gray-800 dark:prose-p:text-gray-100 dark:prose-headings:text-gray-50 dark:prose-strong:text-gray-50 dark:prose-li:text-gray-100">
              {post.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return (
                    <h1 key={index} id={`heading-${index}`}>
                      {paragraph.replace('# ', '')}
                    </h1>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  const id = paragraph
                    .replace('## ', '')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-');
                  return (
                    <h2 key={index} id={id}>
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  const id = paragraph
                    .replace('### ', '')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-');
                  return (
                    <h3 key={index} id={id}>
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.trim()) {
                  return <p key={index}>{paragraph}</p>;
                }
                return null;
              })}
            </div>

            {/* Newsletter CTA */}
            <div className="mt-16">
              <Newsletter variant="fullwidth" language="en" />
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <RelatedPosts posts={relatedPosts} />
              </div>
            )}

            {/* Comments */}
            <div className="mt-16">
              <Comments />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

export const revalidate = 60;
