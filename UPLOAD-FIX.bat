@echo off
echo ================================================
echo  UPLOADING FIXED index.html TO FIX NETLIFY BUILD
echo ================================================

cd /d "c:\Users\pizza\Desktop\meridian master GPT 2nd attempt"
echo Current directory: %CD%

echo.
echo Adding and committing fixed index.html...
git add index.html
git commit -m "FIX: Update index.html script path for Netlify build - change /src/main.jsx to ./src/main.jsx"

echo.
echo Pushing fix to GitHub...
git push origin main

echo.
echo ✅ FIXED index.html UPLOADED!
echo Now retry Netlify deployment
echo.
pause
