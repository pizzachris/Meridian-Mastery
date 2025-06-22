# Homescreen Icon Setup for Meridian Mastery

## What's Done
1. ✅ Created the SVG triskelion logo in `/public/icons/triskelion.svg`
2. ✅ Created `/public/icons/apple-touch-icon.svg` for iOS devices
3. ✅ Updated `manifest.json` with proper icon references
4. ✅ Added necessary meta tags to `index.html` for PWA support
5. ✅ Enhanced service worker to cache icon assets
6. ✅ Added service worker registration to `main.jsx`

## What You Need to Do
1. Generate the PNG versions of the icons using one of these methods:

### Method A: Using the Generate Icons Tool
1. Open `/public/icons/generate-icons.html` in your browser
2. Right-click on each generated icon and save it with the appropriate name:
   - 192x192 icon → save as `triskelion-192.png`
   - 512x512 icon → save as `triskelion-512.png`
   - 180x180 icon → save as `apple-touch-icon.png`
   - 32x32 icon → save as `favicon-32x32.png`
   - 16x16 icon → save as `favicon-16x16.png`
3. Save all files in the `/public/icons/` directory

### Method B: Using an Online Converter
1. Use a service like [SVG to PNG converter](https://svgtopng.com/)
2. Upload the SVG file and download it in various sizes:
   - 192x192 pixels
   - 512x512 pixels
   - 180x180 pixels
   - 32x32 pixels
   - 16x16 pixels

### Method C: Using Design Software
1. Open the SVG in Photoshop, GIMP, Illustrator, or other design software
2. Export in the sizes listed above

## Final Steps
1. After generating the PNG files, open `index.html` and uncomment these lines:
```html
<!-- 
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">
-->
```

2. Open `service-worker.js` and uncomment these lines:
```javascript
// The PNG files will need to be added after they're created
// '/icons/triskelion-192.png',
// '/icons/triskelion-512.png',
```

## Testing Your Homescreen Icon
1. Deploy your app to a web server or use a local development server
2. On iOS:
   - Open Safari and navigate to your app
   - Tap the Share button
   - Select "Add to Home Screen"
   - You should see your triskelion icon

3. On Android:
   - Open Chrome and navigate to your app
   - Tap the menu (three dots)
   - Select "Add to Home Screen" or "Install App"
   - You should see your triskelion icon

## Adding the Icon to Your App Store Listings
If you plan to wrap this as a native app using Capacitor, Cordova, or another tool:
1. Use the same triskelion SVG as the basis for your app store icons
2. Follow the specific size requirements for each store:
   - Apple App Store: 1024x1024 pixels
   - Google Play Store: 512x512 pixels

## Troubleshooting
- If the icon doesn't appear on the homescreen, clear the browser cache and try again
- Ensure your app is served over HTTPS (required for service workers)
- Verify that all paths in the manifest.json and HTML files are correct
