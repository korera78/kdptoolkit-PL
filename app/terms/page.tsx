/**
 * Terms of Service Page
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for KDP Toolkit',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Terms of Service
      </h1>

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using KDP Toolkit, you accept and agree to be bound by the terms and provisions of this agreement.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily access the materials (information or software) on KDP Toolkit for personal, non-commercial transitory viewing only.
        </p>

        <h2>3. Disclaimer</h2>
        <p>
          The materials on KDP Toolkit are provided on an 'as is' basis. KDP Toolkit makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h2>4. Limitations</h2>
        <p>
          In no event shall KDP Toolkit or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on KDP Toolkit.
        </p>

        <h2>5. Accuracy of Materials</h2>
        <p>
          The materials appearing on KDP Toolkit could include technical, typographical, or photographic errors. KDP Toolkit does not warrant that any of the materials on its website are accurate, complete or current.
        </p>

        <h2>6. Links</h2>
        <p>
          KDP Toolkit has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site.
        </p>

        <h2>7. Modifications</h2>
        <p>
          KDP Toolkit may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
        </p>

        <h2>8. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with applicable laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
        </p>
      </div>
    </div>
  );
}
