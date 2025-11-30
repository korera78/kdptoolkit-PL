/**
 * Homepage
 * Shows latest 10 blog posts with featured post
 */

import { getLatestPosts } from '@/lib/posts';
import BlogPostCard from '@/components/BlogPostCard';
import Newsletter from '@/components/Newsletter';

export default function HomePage() {
  const latestPosts = getLatestPosts(10);
  const featuredPost = latestPosts[0];
  const remainingPosts = latestPosts.slice(1);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Professional KDP Tools & Software
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
          In-depth reviews, guides, and insights on Publisher Rocket, Helium 10, Canva,
          and automation tools for serious KDP publishers.
        </p>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Latest Post
          </h2>
          <BlogPostCard post={featuredPost} featured />
        </section>
      )}

      {/* Recent Posts Grid */}
      {remainingPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Recent Posts
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {remainingPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="mx-auto max-w-2xl">
        <Newsletter variant="fullwidth" language="en" />
      </section>
    </div>
  );
}
