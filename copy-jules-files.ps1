# PowerShell Script: Copy Jules Review Files to Standalone kdptoolkit-blog Repo
# Purpose: Transfer JULES-REVIEW-INSTRUCTIONS.md and JULES-REVIEW-PROMPT.txt

Write-Host "🔄 Copying Jules Review Files to kdptoolkit-blog Repository..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Navigate to Desktop (where we expect the repos)
Write-Host "📁 Step 1: Navigating to Desktop..." -ForegroundColor Yellow
cd $HOME\Desktop

# Step 2: Check if autoblog-workflows exists
Write-Host "🔍 Step 2: Checking for autoblog-workflows..." -ForegroundColor Yellow
if (!(Test-Path "autoblog-workflows")) {
    Write-Host "❌ Error: autoblog-workflows not found on Desktop" -ForegroundColor Red
    Write-Host "Cloning autoblog-workflows from GitHub..." -ForegroundColor Yellow
    git clone https://github.com/korera78/autoblog-workflows.git
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to clone autoblog-workflows" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ autoblog-workflows found" -ForegroundColor Green

# Step 3: Check if kdptoolkit-blog-transfer exists (from previous transfer)
Write-Host "🔍 Step 3: Checking for kdptoolkit-blog-transfer..." -ForegroundColor Yellow
if (!(Test-Path "kdptoolkit-blog-transfer")) {
    Write-Host "❌ Error: kdptoolkit-blog-transfer not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run the main transfer script first (from previous chat)" -ForegroundColor Yellow
    Write-Host "Or clone the kdptoolkit-blog repo manually:" -ForegroundColor Yellow
    Write-Host "  git clone https://github.com/korera78/kdptoolkit-blog.git kdptoolkit-blog-transfer" -ForegroundColor Cyan
    exit 1
}
Write-Host "✅ kdptoolkit-blog-transfer found" -ForegroundColor Green

# Step 4: Copy Jules review files
Write-Host "📋 Step 4: Copying Jules review files..." -ForegroundColor Yellow

$sourceDir = "autoblog-workflows\kdptoolkit-blog"
$targetDir = "kdptoolkit-blog-transfer"

# Check if source files exist
if (!(Test-Path "$sourceDir\JULES-REVIEW-INSTRUCTIONS.md")) {
    Write-Host "❌ Error: JULES-REVIEW-INSTRUCTIONS.md not found in source" -ForegroundColor Red
    Write-Host "Source path: $sourceDir" -ForegroundColor Red
    exit 1
}

if (!(Test-Path "$sourceDir\JULES-REVIEW-PROMPT.txt")) {
    Write-Host "❌ Error: JULES-REVIEW-PROMPT.txt not found in source" -ForegroundColor Red
    Write-Host "Source path: $sourceDir" -ForegroundColor Red
    exit 1
}

# Copy files
Copy-Item -Path "$sourceDir\JULES-REVIEW-INSTRUCTIONS.md" -Destination "$targetDir\" -Force
Copy-Item -Path "$sourceDir\JULES-REVIEW-PROMPT.txt" -Destination "$targetDir\" -Force

Write-Host "✅ Files copied successfully" -ForegroundColor Green

# Step 5: Navigate to kdptoolkit-blog-transfer
Write-Host "📂 Step 5: Entering kdptoolkit-blog-transfer directory..." -ForegroundColor Yellow
cd kdptoolkit-blog-transfer

# Step 6: Check git status
Write-Host "🔍 Step 6: Checking git status..." -ForegroundColor Yellow
git status

# Step 7: Add files to git
Write-Host "➕ Step 7: Adding files to git..." -ForegroundColor Yellow
git add JULES-REVIEW-INSTRUCTIONS.md JULES-REVIEW-PROMPT.txt

# Step 8: Commit
Write-Host "💾 Step 8: Creating commit..." -ForegroundColor Yellow
git commit -m "docs: Add comprehensive Jules review instructions for code quality and i18n readiness

- Added JULES-REVIEW-INSTRUCTIONS.md with detailed 13-point review checklist
- Added JULES-REVIEW-PROMPT.txt for quick copy-paste
- Focused on i18n readiness for multilingual template (25 blogs planned)
- Includes SEO, accessibility, performance, and security review criteria"

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Warning: Commit may have failed or files already committed" -ForegroundColor Yellow
    Write-Host "Continuing with push..." -ForegroundColor Yellow
}

# Step 9: Push to GitHub
Write-Host "🚀 Step 9: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ SUCCESS! Jules review files pushed to kdptoolkit-blog" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Files now available at:" -ForegroundColor Cyan
    Write-Host "   https://github.com/korera78/kdptoolkit-blog" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Files copied:" -ForegroundColor Cyan
    Write-Host "   ✅ JULES-REVIEW-INSTRUCTIONS.md" -ForegroundColor Green
    Write-Host "   ✅ JULES-REVIEW-PROMPT.txt" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Start new Claude Code session with github.com/korera78/kdptoolkit-blog" -ForegroundColor White
    Write-Host "   2. Paste the prompt from JULES-REVIEW-PROMPT.txt" -ForegroundColor White
    Write-Host "   3. Let Jules complete the comprehensive review" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Push failed" -ForegroundColor Red
    Write-Host "Please check the error message above" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "   - Need to authenticate with GitHub" -ForegroundColor White
    Write-Host "   - Files already exist (not an error, just push again)" -ForegroundColor White
    Write-Host ""
    exit 1
}
