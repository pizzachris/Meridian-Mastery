@echo off
echo ================================================
echo  DEPLOYING TO NEW REPOSITORY: Meridian-Mastery
echo ================================================

cd /d "c:\Users\pizza\Desktop\meridian master GPT 2nd attempt"
echo Current directory: %CD%

echo.
echo Initializing git repository...
git init

echo.
echo Adding remote repository...
git remote add origin https://github.com/pizzachris/Meridian-Mastery.git

echo.
echo Adding all files...
git add -A

echo.
echo Creating production commit...
git commit -m "PRODUCTION READY: Complete Meridian Mastery Coach - All fixes and modern React implementation"

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ✅ DEPLOYMENT COMPLETE!
echo Check: https://github.com/pizzachris/Meridian-Mastery
echo.
echo Next step: Update Netlify to use this new repository
echo.
pause
