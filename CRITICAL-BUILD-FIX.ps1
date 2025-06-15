# CRITICAL NETLIFY BUILD FIXES
Write-Host "PUSHING CRITICAL NETLIFY BUILD FIXES..." -ForegroundColor Green

Set-Location "c:\Users\pizza\Desktop\meridian master GPT 2nd attempt"

Write-Host "Adding fixed netlify.toml and package.json..." -ForegroundColor Yellow
git add netlify.toml package.json

Write-Host "Committing build fixes..." -ForegroundColor Yellow
git commit -m "FIX: Simplify Netlify build process - remove aggressive cache clearing and problematic copy-icons step"

Write-Host "Pushing critical fixes to GitHub..." -ForegroundColor Yellow  
git push origin main

Write-Host "CRITICAL BUILD FIXES PUSHED!" -ForegroundColor Green
Write-Host "Now retry your Netlify deployment - should work!" -ForegroundColor Cyan
