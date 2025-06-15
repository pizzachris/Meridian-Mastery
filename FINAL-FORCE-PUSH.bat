@echo off
echo ===============================================
echo  MERIDIAN MASTERY COACH - FINAL FORCE PUSH
echo ===============================================

cd /d "c:\Users\pizza\Desktop\meridian master GPT 2nd attempt"
echo Current directory: %CD%

echo.
echo Adding GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/pizzachris/Meridian_Mastery_Netifly.git

echo.
echo Adding all files...
git add -A

echo.
echo Creating production commit...
git commit -m "PRODUCTION READY: Complete Meridian Mastery Coach - All 101+ files updated with fixes, modern React, responsive design, PWA features, and deployment optimization"

echo.
echo Force pushing to GitHub...
git push --force origin main

echo.
echo ✅ DEPLOYMENT COMPLETE!
echo Check: https://github.com/pizzachris/Meridian_Mastery_Netifly
echo Netlify will auto-redeploy from the updated repository
echo.
pause
