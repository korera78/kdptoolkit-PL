@echo off
REM Push kdptoolkit-blog to GitHub (Windows)
REM Run this from YOUR LOCAL MACHINE where you have GitHub credentials

echo 🚀 Pushing kdptoolkit-blog to GitHub...
echo.

REM Initialize git if needed
if not exist .git (
    echo Initializing git repository...
    git init
    echo ✅ Git initialized
) else (
    echo ✅ Git already initialized
)

REM Stage and commit files
echo 📦 Staging all files...
git add .

echo 💾 Creating commit...
git commit -m "feat: Complete Next.js 14 blog with RAG integration"

REM Switch to main branch
echo Ensuring we're on main branch...
git branch -M main

REM Add remote
echo Adding remote...
git remote remove origin 2>nul
git remote add origin https://github.com/korera78/kdptoolkit-blog.git

REM Push to GitHub
echo.
echo 🔼 Pushing to GitHub...
git push -u origin main

echo.
echo ✅ SUCCESS! Code pushed to https://github.com/korera78/kdptoolkit-blog
echo.
echo 🎉 Next steps:
echo 1. Visit: https://github.com/korera78/kdptoolkit-blog
echo 2. Deploy to Vercel: https://vercel.com/new
echo 3. Add environment variables from .env.local.example
echo.
pause
