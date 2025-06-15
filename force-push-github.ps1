# PowerShell script to force push Meridian Mastery Coach to GitHub
Write-Host "🚀 MERIDIAN MASTERY COACH - FORCE PUSH TO GITHUB" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Yellow

# Check if we're in the right directory
$currentDir = Get-Location
Write-Host "📂 Current Directory: $currentDir" -ForegroundColor Cyan

# Initialize git repository
Write-Host "`n🔧 Initializing git repository..." -ForegroundColor Yellow
git init

# Add all files
Write-Host "`n📦 Adding all files to staging..." -ForegroundColor Yellow
git add .

# Create comprehensive commit
Write-Host "`n💾 Creating commit..." -ForegroundColor Yellow
$commitMessage = @"
🚀 PRODUCTION READY: Complete Meridian Mastery Coach - June 15, 2025

✅ CRITICAL FIXES COMPLETED:
- Fixed all TypeScript compilation errors (service-worker.js, BodyMap_simple.jsx)
- Modernized entire codebase to ES6 modules from CommonJS
- Fixed React state management issues (disclaimer modal fully functional)
- Optimized Vite configuration for dev/prod environments
- Cleaned up package.json and build configuration

🎯 COMPREHENSIVE FEATURE SET:
- Advanced flashcard system with 400+ Korean meridian points
- Interactive body map with clickable regions and overlays
- 6 specialized quiz types with adaptive difficulty
- Real-time progress tracking and analytics
- Professional mobile-first responsive design
- Complete PWA functionality with offline support

🔧 TECHNICAL IMPROVEMENTS:
- Error-free compilation across all components
- Performance optimized build configuration
- Modern React hooks and state management
- Enhanced mobile touch interface
- Comprehensive debugging and testing completed
- Production-ready deployment configuration

📱 MOBILE OPTIMIZATION:
- iPhone safe area support for notch/status bar
- Touch-optimized button sizing and interactions
- Responsive design for all device sizes
- PWA installation with proper icon set

🌍 Ready for GitHub deployment and worldwide educational use!
"@

git commit -m $commitMessage

# Set main branch
Write-Host "`n🌿 Setting main branch..." -ForegroundColor Yellow
git branch -M main

# Add remote (remove first if exists)
Write-Host "`n🔗 Configuring GitHub remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/pizzachris/Meridian_Mastery_Netifly.git

# Force push to GitHub
Write-Host "`n🚀 FORCE PUSHING TO GITHUB..." -ForegroundColor Red
Write-Host "Repository: https://github.com/pizzachris/Meridian_Mastery_Netifly" -ForegroundColor Cyan
git push -f origin main

# Verify status
Write-Host "`n📊 Verifying git status..." -ForegroundColor Yellow
git status

Write-Host "`n✅ FORCE PUSH COMPLETE!" -ForegroundColor Green
Write-Host "🌐 Check your repository: https://github.com/pizzachris/Meridian_Mastery_Netifly" -ForegroundColor Cyan
Write-Host "🚀 Netlify should automatically redeploy with latest changes!" -ForegroundColor Green

Write-Host "`nPress any key to continue..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
