@echo off
echo Starting git push process...

REM Remove any existing git repository
rmdir /s /q .git 2>nul

REM Initialize fresh git repository
git init

REM Configure git user
git config user.email "pizzachris@github.com"
git config user.name "pizzachris"

REM Add all files
git add .

REM Create commit
git commit -m "PRODUCTION READY: Meridian Mastery Coach - June 15 2025 - Complete debugging and modernization"

REM Set main branch
git branch -M main

REM Add remote
git remote add origin https://github.com/pizzachris/Meridian_Mastery_Netifly.git

REM Force push
git push -f origin main

echo.
echo PUSH COMPLETE! Check GitHub and Netlify for deployment.
echo Repository: https://github.com/pizzachris/Meridian_Mastery_Netifly
pause
