#!/bin/bash
# Push kdptoolkit-blog to GitHub
# Run this script from YOUR LOCAL MACHINE where you have GitHub credentials

set -e  # Exit on error

echo "🚀 Pushing kdptoolkit-blog to GitHub..."
echo ""

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check if we have files to commit
if git status --porcelain | grep -q .; then
    echo "📦 Staging all files..."
    git add .

    echo "💾 Creating commit..."
    git commit -m "feat: Complete Next.js 14 blog with RAG integration

Production-ready blog with 36 files:
- Next.js 14 + TypeScript strict mode
- RAG integration (Gemini File Search API)
- Full dark mode support
- SEO optimized (OpenGraph, Twitter Cards, Schema.org)
- Giscus comments + Formspree newsletter
- Dynamic sitemap + RSS feed
- Complete example blog post (1500+ words)

Ready to deploy!"
    echo "✅ Commit created"
else
    echo "✅ All files already committed"
fi

# Ensure we're on main branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "master")
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Renaming branch to 'main'..."
    git branch -M main
    echo "✅ Branch renamed to main"
fi

# Check if origin exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "✅ Remote 'origin' already configured"
else
    echo "Adding remote 'origin'..."
    git remote add origin https://github.com/korera78/kdptoolkit-blog.git
    echo "✅ Remote added"
fi

# Push to GitHub
echo ""
echo "🔼 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ SUCCESS! Code pushed to https://github.com/korera78/kdptoolkit-blog"
echo ""
echo "🎉 Next steps:"
echo "1. Visit: https://github.com/korera78/kdptoolkit-blog"
echo "2. Deploy to Vercel: https://vercel.com/new"
echo "3. Add environment variables from .env.local.example"
