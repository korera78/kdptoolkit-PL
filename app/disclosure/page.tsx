/**
 * Affiliate Disclosure Page
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'Affiliate Disclosure for KDP Toolkit',
};

export default function DisclosurePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Affiliate Disclosure
      </h1>

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2>Transparency is Important to Us</h2>
        <p>
          KDP Toolkit contains affiliate links, which means we may earn a commission if you click through and make a purchase at no additional cost to you.
        </p>

        <h2>What Are Affiliate Links?</h2>
        <p>
          An affiliate link is a special tracking link provided by companies that allows them to know when someone makes a purchase after clicking from our website. If you purchase through our affiliate links, we earn a small commission that helps support our work.
        </p>

        <h2>Our Commitment</h2>
        <p>
          We only recommend tools and software that we:
        </p>
        <ul>
          <li>Have personally tested and used</li>
          <li>Believe provide genuine value to KDP publishers</li>
          <li>Would recommend regardless of affiliate compensation</li>
        </ul>

        <h2>No Extra Cost to You</h2>
        <p>
          Using our affiliate links does not cost you anything extra. The price you pay is exactly the same whether you use our link or go directly to the seller's website.
        </p>

        <h2>Honest Reviews</h2>
        <p>
          Our reviews and recommendations are based on hands-on experience and thorough testing. We highlight both strengths and weaknesses of every tool we review, regardless of affiliate relationships.
        </p>

        <h2>Which Tools Have Affiliate Programs?</h2>
        <p>
          We participate in affiliate programs for various KDP tools and software, including but not limited to:
        </p>
        <ul>
          <li>Publisher Rocket</li>
          <li>Helium 10</li>
          <li>Various design and formatting tools</li>
          <li>Amazon Associates Program</li>
        </ul>

        <h2>Supporting Our Work</h2>
        <p>
          The commissions we earn from affiliate links help us:
        </p>
        <ul>
          <li>Purchase and test new tools</li>
          <li>Create in-depth reviews and guides</li>
          <li>Maintain and improve our website</li>
          <li>Provide free resources and calculators</li>
        </ul>

        <h2>Your Trust Matters</h2>
        <p>
          We take your trust seriously. If you ever feel that an affiliate relationship has influenced our content in a way that doesn't serve your interests, please let us know through our contact page.
        </p>

        <h2>FTC Compliance</h2>
        <p>
          This disclosure complies with the Federal Trade Commission's requirements for affiliate disclosures. We are committed to being transparent about our affiliate relationships and how we earn revenue.
        </p>

        <h2>Questions?</h2>
        <p>
          If you have any questions about our affiliate disclosure or partnerships, please don't hesitate to contact us.
        </p>
      </div>
    </div>
  );
}
