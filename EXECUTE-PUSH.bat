@echo off
setlocal enabledelayedexpansion

echo 🚀 MERIDIAN MASTERY COACH - GITHUB FORCE PUSH
echo ==============================================
echo Repository: https://github.com/pizzachris/Meridian_Mastery_Netifly.git
echo Date: June 15, 2025
echo.

REM Check if git is installed
echo 🔍 Checking git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)
echo ✅ Git is installed

REM Clean existing git repository
echo.
echo 🧹 Cleaning existing git repository...
if exist ".git" (
    rmdir /s /q .git
    echo ✅ Removed existing .git directory
)

REM Initialize git repository
echo.
echo 🔧 Initializing git repository...
git init
if errorlevel 1 (
    echo ❌ Failed to initialize git repository
    pause
    exit /b 1
)

REM Configure git user
echo.
echo 👤 Configuring git user...
git config user.name "pizzachris"
git config user.email "pizzachris@users.noreply.github.com"

REM Add all files
echo.
echo 📦 Adding all files...
git add .
if errorlevel 1 (
    echo ❌ Failed to add files
    pause
    exit /b 1
)

REM Show status
echo.
echo 📋 Git status:
git status --short

REM Create commit
echo.
echo 💾 Creating commit...
git commit -m "PRODUCTION READY: Meridian Mastery Coach - June 15 2025 - Complete debugging and modernization - All TypeScript errors fixed - React state management resolved - ES6 modules implemented - Mobile optimized - PWA ready"
if errorlevel 1 (
    echo ❌ Failed to create commit
    pause
    exit /b 1
)

REM Set main branch
echo.
echo 🌿 Setting main branch...
git branch -M main

REM Add remote
echo.
echo 🔗 Adding GitHub remote...
git remote add origin https://github.com/pizzachris/Meridian_Mastery_Netifly.git
if errorlevel 1 (
    echo ⚠️ Remote might already exist, continuing...
)

REM Show remote
echo.
echo 📡 Remote configuration:
git remote -v

REM Force push
echo.
echo 🚀 FORCE PUSHING TO GITHUB...
echo This will overwrite the remote repository!
git push -f origin main
if errorlevel 1 (
    echo ❌ Failed to push to GitHub
    echo This might be due to authentication issues
    echo Please check your GitHub credentials
    pause
    exit /b 1
)

REM Success
echo.
echo ✅ FORCE PUSH SUCCESSFUL!
echo 🌐 Check your repository: https://github.com/pizzachris/Meridian_Mastery_Netifly
echo 🚀 Netlify should automatically redeploy with latest changes!
echo.
echo Press any key to exit...
pause >nul
