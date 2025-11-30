/**
 * Root Layout
 * Main application layout with dark mode, analytics, and global styles
 */

import { ThemeProvider } from 'next-themes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/globals.css';
import './blog-dark-mode.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kdptoolkit.com'),
  title: {
    default: 'KDP Toolkit - Professional KDP Tools & Software Insights',
    template: '%s | KDP Toolkit',
  },
  description: 'Expert reviews, guides, and insights on the best KDP tools and software for publishers. In-depth coverage of Publisher Rocket, Helium 10, Canva, and automation tools.',
  keywords: ['KDP tools', 'Publisher Rocket', 'Helium 10', 'KDP software', 'Amazon KDP', 'self-publishing', 'book publishing tools', 'KDP automation'],
  authors: [{ name: 'KDP Toolkit' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'KDP Toolkit',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'KDP Toolkit banner image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KDP Toolkit - Professional KDP Tools & Software Insights',
    description: 'Expert reviews, guides, and insights on the best KDP tools and software for publishers. In-depth coverage of Publisher Rocket, Helium 10, Canva, and automation tools.',
    images: ['/images/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Umami Analytics */}
        {process.env.NEXT_PUBLIC_UMAMI_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <script
            async
            src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}

        {/* Ezoic Ads (Optional - adds ~200-500ms load time, impacts Core Web Vitals)
            To enable: Set NEXT_PUBLIC_EZOIC_SITE_ID in .env.local
            To disable: Remove or comment out NEXT_PUBLIC_EZOIC_SITE_ID
            Clone-friendly: Each language blog gets unique EZOIC_SITE_ID */}
        {process.env.NEXT_PUBLIC_EZOIC_SITE_ID && (
          <script
            async
            defer
            src="//www.ezojs.com/ezoic/sa.min.js"
            data-ezoic-id={process.env.NEXT_PUBLIC_EZOIC_SITE_ID}
          />
        )}
      </head>
      <body className="font-sans bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
