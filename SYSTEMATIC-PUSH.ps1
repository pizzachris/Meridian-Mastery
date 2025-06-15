# SYSTEMATIC BATCH PUSH TO NEW REPOSITORY
# Run this script to deploy all files in manageable batches

Write-Host "MERIDIAN MASTERY COACH - SYSTEMATIC DEPLOYMENT" -ForegroundColor Green
Write-Host "Target: https://github.com/pizzachris/Meridian-Mastery" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Yellow

# Set location
Set-Location "c:\Users\pizza\Desktop\meridian master GPT 2nd attempt"
Write-Host "Working Directory: $(Get-Location)" -ForegroundColor White

# Initialize repository
Write-Host "`nStep 1: Initializing git repository..." -ForegroundColor Yellow
git init
git remote remove origin 2>$null
git remote add origin https://github.com/pizzachris/Meridian-Mastery.git
git remote -v

# Function to push in batches
function Push-FileBatch {
    param($batchName, $files)
    
    if ($files.Count -gt 0) {
        Write-Host "`nBATCH: $batchName ($($files.Count) files)" -ForegroundColor Cyan
        
        # Add files for this batch
        foreach ($file in $files) {
            if (Test-Path $file) {
                git add $file
                Write-Host "  Added: $file" -ForegroundColor Gray
            }
        }
        
        # Commit this batch
        $commitMsg = "BATCH: $batchName - Meridian Mastery Coach Production Files"
        git commit -m "$commitMsg"
        
        # Force push this batch
        Write-Host "  Pushing $batchName..." -ForegroundColor Yellow
        git push --force origin main
        Write-Host "  SUCCESS: $batchName pushed!" -ForegroundColor Green
        
        # Brief pause
        Start-Sleep -Seconds 1
    }
}

# BATCH 1: Core configuration files
Write-Host "`nStarting systematic deployment..." -ForegroundColor Magenta
$batch1 = @(
    "package.json",
    "package-lock.json", 
    "vite.config.js",
    "tailwind.config.js",
    "postcss.config.js",
    "netlify.toml",
    ".gitignore",
    "README.md"
)
Push-FileBatch "Core Config" $batch1

# BATCH 2: Main app entry points
$batch2 = @(
    "index.html",
    "src/main.jsx",
    "src/index.css",
    "src/App.jsx",
    "src/SimpleApp.jsx"
)
Push-FileBatch "Main App Files" $batch2

# BATCH 3: React components (split into smaller groups)
$componentFiles = Get-ChildItem "src/components" -Filter "*.jsx" -ErrorAction SilentlyContinue
if ($componentFiles) {
    $componentGroups = $componentFiles | Group-Object {[math]::Floor($_.Name[0] / 8)}
    
    $groupIndex = 1
    foreach ($group in $componentGroups) {
        $componentPaths = $group.Group | ForEach-Object { $_.FullName }
        Push-FileBatch "Components Group $groupIndex" $componentPaths
        $groupIndex++
    }
}

# BATCH 4: Data files
$dataFiles = Get-ChildItem "src/data" -Filter "*.json" -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName }
Push-FileBatch "Data Files" $dataFiles

# BATCH 5: Utils and Context
$utilFiles = @()
if (Test-Path "src/utils") { 
    $utilFiles += Get-ChildItem "src/utils" -Recurse | ForEach-Object { $_.FullName }
}
if (Test-Path "src/context") { 
    $utilFiles += Get-ChildItem "src/context" -Recurse | ForEach-Object { $_.FullName }
}
Push-FileBatch "Utils & Context" $utilFiles

# BATCH 6: Public assets
$publicFiles = Get-ChildItem "public" -Recurse | ForEach-Object { $_.FullName }
Push-FileBatch "Public Assets" $publicFiles

# BATCH 7: Documentation and scripts
$docFiles = Get-ChildItem "." -Filter "*.md" | ForEach-Object { $_.FullName }
$scriptFiles = Get-ChildItem "." -Filter "*.js" | Where-Object { $_.Name -notmatch "node_modules" } | ForEach-Object { $_.FullName }
$allDocs = $docFiles + $scriptFiles
Push-FileBatch "Documentation & Scripts" $allDocs

# BATCH 8: Any remaining files
Write-Host "`nFinal cleanup - adding any remaining files..." -ForegroundColor Magenta
git add -A
$hasChanges = git diff --cached --quiet; $LASTEXITCODE -ne 0
if ($hasChanges) {
    git commit -m "FINAL: Any remaining Meridian Mastery Coach files"
    git push --force origin main
    Write-Host "Final batch pushed successfully!" -ForegroundColor Green
}

Write-Host "`n" + "=" * 60 -ForegroundColor Yellow
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "Repository: https://github.com/pizzachris/Meridian-Mastery" -ForegroundColor Cyan
Write-Host "Next: Update Netlify to use this new repository" -ForegroundColor White
Write-Host "=" * 60 -ForegroundColor Yellow
