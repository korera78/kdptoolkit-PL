# KDP Toolkit Blog

Professional insights on KDP tools and software for publishers. Built with Next.js 14, TypeScript, and Dify RAG integration.

## Features

- ✅ **Next.js 14 App Router** - Latest React patterns with server components
- ✅ **TypeScript Strict Mode** - Full type safety throughout
- ✅ **RAG Integration** - AI-powered research insights via Dify RAG API
- ✅ **MDX Blog Posts** - Write content in Markdown with frontmatter
- ✅ **Dark Mode** - Seamless light/dark theme switching
- ✅ **SEO Optimized** - OpenGraph, Twitter Cards, Schema.org JSON-LD
- ✅ **Comments** - Giscus integration (GitHub Discussions)
- ✅ **Newsletter** - Formspree integration
- ✅ **RSS & Sitemap** - Auto-generated feeds
- ✅ **Analytics** - Plausible Analytics integration
- ✅ **ISR** - Incremental Static Regeneration (60s revalidation)

## Tech Stack

- **Framework**: Next.js 14.2
- **Language**: TypeScript 5.4
- **Styling**: Tailwind CSS 3.4
- **Content**: MDX + gray-matter
- **Theme**: next-themes
- **Comments**: Giscus (@giscus/react)
- **Forms**: react-hook-form + zod
- **RAG**: Gemini File Search API

## Getting Started

### Prerequisites

- Node.js 18.17+
- npm 9+
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/korera78/kdptoolkit-blog.git
cd kdptoolkit-blog
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and configure:

```env
# Dify RAG API
GEMINI_API_KEY=your_gemini_api_key_here
RAG_API_URL=http://localhost:5002

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://kdptoolkit.com
NEXT_PUBLIC_SITE_NAME=KDP Toolkit

# Giscus (GitHub Discussions)
NEXT_PUBLIC_GISCUS_REPO=kdptoolkit/kdptoolkit-blog
NEXT_PUBLIC_GISCUS_REPO_ID=your_repo_id
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your_category_id

# Formspree Newsletter
NEXT_PUBLIC_FORMSPREE_ID=your_form_id

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=kdptoolkit.com
```

4. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
kdptoolkit-blog/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── blog/              # Blog routes
│   ├── tags/              # Tag pages
│   ├── about/             # About page
│   ├── newsletter/        # Newsletter page
│   └── api/               # API routes
│       ├── rag/           # RAG proxy
│       ├── sitemap/       # XML sitemap
│       └── rss/           # RSS feed
├── components/            # React components
│   ├── SEO.tsx
│   ├── Comments.tsx
│   ├── Newsletter.tsx
│   ├── DarkMode.tsx
│   ├── TableOfContents.tsx
│   ├── RelatedPosts.tsx
│   ├── RAGResearch.tsx
│   └── ...
├── lib/                   # Utility libraries
│   ├── mdx.ts            # MDX processing
│   ├── posts.ts          # Post utilities
│   ├── seo.ts            # SEO helpers
│   └── rag.ts            # RAG API client
├── content/              # Blog content
│   └── posts/            # MDX blog posts
├── public/               # Static assets
│   ├── images/
│   └── robots.txt
└── styles/
    └── globals.css       # Global styles
```

## Writing Blog Posts

Create a new `.md` file in `content/posts/`:

```markdown
---
title: "Your Post Title"
date: "2025-11-19"
description: "Brief description for SEO"
coverImage: "/images/your-image.jpg"
tags: ["Tag1", "Tag2", "Tag3"]
author: "KDP Toolkit"
published: true
---

# Your Post Title

Your content here in Markdown...

## Section Heading

More content...
```

### Frontmatter Fields

- `title` (required): Post title
- `date` (required): Publication date (YYYY-MM-DD)
- `description` (required): SEO description (155 chars max)
- `coverImage` (optional): Path to cover image
- `tags` (required): Array of tags
- `author` (optional): Author name (defaults to "KDP Toolkit")
- `published` (optional): Set to `false` to hide post (defaults to `true`)

## RAG Integration

The blog includes AI-powered research insights via Dify RAG API.

### RAG Stores

Three knowledge bases are configured in `lib/rag.ts`:

1. **KDP Marketing Intelligence** - KDP tools and strategies
2. **Autoblog Style Guide** - Brand voice and writing guidelines
3. **Affiliate Products** - Tool documentation and reviews

### Using RAG in Posts

The `RAGResearch` component automatically appears on blog posts, allowing readers to query the knowledge base for related information.

### Server-Side RAG Queries

```typescript
import { queryRAG, RAG_STORES } from '@/lib/rag';

const result = await queryRAG(
  'What are the best KDP keyword tools?',
  RAG_STORES.KDP_MARKETING
);
```

### Client-Side RAG Queries

```typescript
import { queryRAGClient, RAG_STORES } from '@/lib/rag';

const result = await queryRAGClient(
  'Compare Publisher Rocket vs Helium 10',
  RAG_STORES.KDP_MARKETING
);
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy!

```bash
git push origin main
```

Vercel will automatically detect Next.js and configure build settings.

### Environment Variables in Vercel

Add these in Vercel dashboard → Settings → Environment Variables:

- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GISCUS_REPO`
- `NEXT_PUBLIC_GISCUS_REPO_ID`
- `NEXT_PUBLIC_GISCUS_CATEGORY`
- `NEXT_PUBLIC_GISCUS_CATEGORY_ID`
- `NEXT_PUBLIC_FORMSPREE_ID`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

### Custom Domain

1. Go to Vercel → Settings → Domains
2. Add `kdptoolkit.com`
3. Update DNS records as instructed
4. SSL certificate auto-provisions

## Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Comments Setup (Giscus)

1. Enable GitHub Discussions on your repo
2. Install [Giscus app](https://github.com/apps/giscus)
3. Visit [giscus.app](https://giscus.app) to configure
4. Copy the generated IDs to `.env.local`

## Newsletter Setup (Formspree)

1. Create account at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy form ID to `NEXT_PUBLIC_FORMSPREE_ID`

## Analytics Setup (Plausible)

1. Add your site at [plausible.io](https://plausible.io)
2. Add domain to `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
3. Script auto-loads in `app/layout.tsx`

## Performance

- **Lighthouse Score**: 95+ on all metrics
- **ISR**: 60-second revalidation for fresh content
- **Image Optimization**: Automatic via Next.js Image
- **Code Splitting**: Automatic route-based splitting
- **Font Optimization**: Inter font with next/font

## Contributing

This is a personal blog project. Feel free to fork and adapt for your own use.

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- GitHub Issues: [github.com/korera78/kdptoolkit-blog/issues](https://github.com/korera78/kdptoolkit-blog/issues)
- Email: support@kdptoolkit.com

---

Built with ❤️ using Next.js 14 and TypeScript
