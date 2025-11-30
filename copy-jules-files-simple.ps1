# Simple PowerShell Script: Copy Jules Files (Assumes repos already cloned)
# Use this if you already have kdptoolkit-blog-transfer on your Desktop

Write-Host "🔄 Quick Copy: Jules Files to kdptoolkit-blog..." -ForegroundColor Cyan
Write-Host ""

# Navigate to Desktop
cd $HOME\Desktop

# Copy files
Write-Host "📋 Copying files..." -ForegroundColor Yellow
Copy-Item -Path "autoblog-workflows\kdptoolkit-blog\JULES-REVIEW-INSTRUCTIONS.md" `
          -Destination "kdptoolkit-blog-transfer\" -Force
Copy-Item -Path "autoblog-workflows\kdptoolkit-blog\JULES-REVIEW-PROMPT.txt" `
          -Destination "kdptoolkit-blog-transfer\" -Force

# Navigate and push
cd kdptoolkit-blog-transfer

Write-Host "📦 Committing and pushing..." -ForegroundColor Yellow
git add JULES-REVIEW-INSTRUCTIONS.md JULES-REVIEW-PROMPT.txt
git commit -m "docs: Add Jules review instructions for code quality and i18n readiness"
git push origin main

Write-Host ""
Write-Host "✅ DONE!" -ForegroundColor Green
Write-Host "View at: https://github.com/korera78/kdptoolkit-blog" -ForegroundColor Yellow
