# Quick fix push for Netlify build issue
Write-Host "PUSHING NETLIFY BUILD FIX..." -ForegroundColor Green

Set-Location "c:\Users\pizza\Desktop\meridian master GPT 2nd attempt"

Write-Host "Adding fixed index.html..." -ForegroundColor Yellow
git add index.html

Write-Host "Committing fix..." -ForegroundColor Yellow
git commit -m "FIX: Update index.html script path for Netlify build - change /src/main.jsx to ./src/main.jsx"

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow  
git push origin main

Write-Host "NETLIFY BUILD FIX PUSHED!" -ForegroundColor Green
Write-Host "Now retry your Netlify deployment" -ForegroundColor Cyan
