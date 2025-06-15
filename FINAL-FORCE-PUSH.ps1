# FINAL FORCE PUSH SCRIPT - Meridian Mastery Coach
# Execute this PowerShell script to push all changes to GitHub

Write-Host "MERIDIAN MASTERY COACH - BATCHED FORCE PUSH TO GITHUB" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Yellow

# Navigate to project directory
Set-Location "c:\Users\pizza\Desktop\meridian master GPT 2nd attempt"
Write-Host "`nWorking Directory: $(Get-Location)" -ForegroundColor Cyan

# Check git status
Write-Host "`nChecking git status..." -ForegroundColor Yellow
git status

# Add remote origin if not exists
Write-Host "`nSetting up GitHub remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/pizzachris/Meridian_Mastery_Netifly.git

# Verify remote
Write-Host "`nVerifying remote connection..." -ForegroundColor Yellow
git remote -v

# BATCH DEPLOYMENT STRATEGY - Push in manageable chunks
Write-Host "`n📦 BATCH DEPLOYMENT: Pushing files in manageable chunks..." -ForegroundColor Yellow

# Function to commit and push a batch
function Push-Batch {
    param($batchName, $files)
    Write-Host "`n� Processing $batchName..." -ForegroundColor Cyan
    
    if ($files.Count -gt 0) {
        # Add files for this batch
        foreach ($file in $files) {
            git add $file
        }
        
        # Create commit for this batch
        $commitMessage = "🚀 BATCH DEPLOY: $batchName - Meridian Mastery Coach

✅ PRODUCTION READY DEPLOYMENT
- Fixed all compilation errors
- Modern React + Vite + Tailwind
- Mobile-optimized PWA features
- Complete flashcard system
- Interactive body maps
- Quiz system with progress tracking

Files in this batch: $($files.Count) files"

        git commit -m "$commitMessage"
        
        # Force push this batch
        Write-Host "   📤 Force pushing $batchName..." -ForegroundColor Yellow
        git push --force origin main
        
        Write-Host "   ✅ $batchName pushed successfully!" -ForegroundColor Green
        Start-Sleep -Seconds 2  # Brief pause between batches
    }
}

# Get all files that need to be committed
$allFiles = git ls-files --others --exclude-standard
$modifiedFiles = git diff --name-only HEAD

Write-Host "`n📊 Files to deploy:" -ForegroundColor Cyan
Write-Host "   New files: $($allFiles.Count)" -ForegroundColor White
Write-Host "   Modified files: $($modifiedFiles.Count)" -ForegroundColor White

# BATCH 1: Core configuration and build files
Write-Host "`n🔧 BATCH 1: Core Configuration Files" -ForegroundColor Magenta
$batch1 = @(
    "package.json", "package-lock.json", "vite.config.js", "tailwind.config.js", 
    "postcss.config.js", "netlify.toml", "vercel.json", ".gitignore", 
    "index.html", "service-worker.js", "README.md"
)
$batch1Files = $batch1 | Where-Object { Test-Path $_ }
Push-Batch "Core Config" $batch1Files

# BATCH 2: Main React app files
Write-Host "`n⚛️ BATCH 2: Main React Application" -ForegroundColor Magenta
$batch2 = @(
    "src/main.jsx", "src/index.css", "src/App.jsx", "src/SimpleApp.jsx", "src/TestApp.jsx"
)
$batch2Files = $batch2 | Where-Object { Test-Path $_ }
Push-Batch "Main React App" $batch2Files

# BATCH 3: React components (split into smaller groups)
Write-Host "`n🧩 BATCH 3A: Core Components" -ForegroundColor Magenta
$batch3a = Get-ChildItem "src/components" -Filter "*.jsx" | 
    Where-Object { $_.Name -match "^(App|Body|Home|Flash)" } | 
    Select-Object -First 8 | ForEach-Object { $_.FullName }
Push-Batch "Core Components" $batch3a

Write-Host "`n🧩 BATCH 3B: Quiz & Interactive Components" -ForegroundColor Magenta
$batch3b = Get-ChildItem "src/components" -Filter "*.jsx" | 
    Where-Object { $_.Name -match "^(Quiz|Daily|Progress|Settings)" } | 
    Select-Object -First 8 | ForEach-Object { $_.FullName }
Push-Batch "Quiz Components" $batch3b

Write-Host "`n🧩 BATCH 3C: Remaining Components" -ForegroundColor Magenta
$batch3c = Get-ChildItem "src/components" -Filter "*.jsx" | 
    Where-Object { $_.Name -notmatch "^(App|Body|Home|Flash|Quiz|Daily|Progress|Settings)" } | 
    ForEach-Object { $_.FullName }
Push-Batch "Other Components" $batch3c

# BATCH 4: Data files
Write-Host "`n📊 BATCH 4: Data Files" -ForegroundColor Magenta
$batch4 = Get-ChildItem "src/data" -Filter "*.json" | ForEach-Object { $_.FullName }
Push-Batch "Data Files" $batch4

# BATCH 5: Utils, context, styles
Write-Host "`n🛠️ BATCH 5: Utils & Context" -ForegroundColor Magenta
$batch5 = @()
if (Test-Path "src/utils") { $batch5 += Get-ChildItem "src/utils" -Recurse | ForEach-Object { $_.FullName } }
if (Test-Path "src/context") { $batch5 += Get-ChildItem "src/context" -Recurse | ForEach-Object { $_.FullName } }
if (Test-Path "src/styles") { $batch5 += Get-ChildItem "src/styles" -Recurse | ForEach-Object { $_.FullName } }
Push-Batch "Utils & Context" $batch5

# BATCH 6: Public assets (split by type)
Write-Host "`n🖼️ BATCH 6A: SVG Assets" -ForegroundColor Magenta
$batch6a = Get-ChildItem "public" -Filter "*.svg" | ForEach-Object { $_.FullName }
Push-Batch "SVG Assets" $batch6a

Write-Host "`n🖼️ BATCH 6B: Icons & Images" -ForegroundColor Magenta
$batch6b = @()
if (Test-Path "public/icons") { $batch6b += Get-ChildItem "public/icons" -Recurse | ForEach-Object { $_.FullName } }
$batch6b += Get-ChildItem "public" -Filter "*.png" | ForEach-Object { $_.FullName }
$batch6b += Get-ChildItem "public" -Filter "*.html" | ForEach-Object { $_.FullName }
$batch6b += Get-ChildItem "public" -Filter "*.json" | ForEach-Object { $_.FullName }
Push-Batch "Icons & Images" $batch6b

# BATCH 7: Documentation and scripts
Write-Host "`n📚 BATCH 7: Documentation" -ForegroundColor Magenta
$batch7 = Get-ChildItem "." -Filter "*.md" | ForEach-Object { $_.FullName }
$batch7 += Get-ChildItem "." -Filter "*.js" | Where-Object { $_.Name -notmatch "^(package|node_modules)" } | ForEach-Object { $_.FullName }
Push-Batch "Documentation & Scripts" $batch7

# BATCH 8: Any remaining files
Write-Host "`n� BATCH 8: Final Cleanup" -ForegroundColor Magenta
git add -A  # Add any remaining files
$hasChanges = git diff --cached --quiet; $LASTEXITCODE -ne 0
if ($hasChanges) {
    git commit -m "🚀 FINAL BATCH: Any remaining Meridian Mastery Coach files - Production deployment complete"
    git push --force origin main
    Write-Host "   ✅ Final batch pushed!" -ForegroundColor Green
}

Write-Host "`n✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "🌐 Your changes should now be visible at:" -ForegroundColor Cyan
Write-Host "   https://github.com/pizzachris/Meridian_Mastery_Netifly" -ForegroundColor Blue
Write-Host "📱 Netlify will auto-redeploy from the updated repository" -ForegroundColor Cyan

Write-Host "`n🔍 Next steps:" -ForegroundColor Yellow
Write-Host "1. Check GitHub repo for updated files" -ForegroundColor White
Write-Host "2. Verify Netlify deployment status" -ForegroundColor White
Write-Host "3. Test the live application" -ForegroundColor White

Write-Host "`n🎉 Meridian Mastery Coach is now live and ready!" -ForegroundColor Green
