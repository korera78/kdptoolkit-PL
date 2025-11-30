/**
 * Privacy Policy Page
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for KDP Toolkit',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Privacy Policy
      </h1>

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, such as when you subscribe to our newsletter or contact us through our website.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Send you newsletters and updates (if you've subscribed)</li>
          <li>Respond to your inquiries and requests</li>
          <li>Improve our website and content</li>
          <li>Analyze website usage and trends</li>
        </ul>

        <h2>3. Analytics</h2>
        <p>
          We use privacy-friendly analytics (Umami) to understand how visitors use our website. This analytics solution is GDPR-compliant and does not use cookies or collect personal data.
        </p>

        <h2>4. Cookies</h2>
        <p>
          We use minimal cookies to remember your dark mode preference and other site settings. These cookies do not track you across other websites.
        </p>

        <h2>5. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.
        </p>

        <h2>6. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2>7. Your Rights</h2>
        <p>
          You have the right to:
        </p>
        <ul>
          <li>Access your personal data</li>
          <li>Request correction of your personal data</li>
          <li>Request deletion of your personal data</li>
          <li>Unsubscribe from our newsletter at any time</li>
        </ul>

        <h2>8. Children's Privacy</h2>
        <p>
          Our website is not directed to children under 13. We do not knowingly collect personal information from children under 13.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy, please contact us through our contact page.
        </p>
      </div>
    </div>
  );
}
