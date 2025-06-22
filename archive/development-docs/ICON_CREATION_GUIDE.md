# Icon Creation Guide

To complete the icon setup for your app:

1. Convert the SVG to PNG files with the following sizes:
   - 192x192 (for Android)
   - 512x512 (for Android)
   - 180x180 (for iOS)
   - 32x32 (for browser favicon)
   - 16x16 (for browser favicon)

You can use an online tool like:
- https://svgtopng.com/
- https://www.iloveimg.com/convert-to-png/svg-to-png

Or if you have access to Photoshop, Illustrator, or GIMP, you can create these files locally.

## File Naming
Save these files in the `/public/icons/` directory with the following names:
- triskelion-192.png
- triskelion-512.png
- apple-touch-icon.png
- favicon-32x32.png
- favicon-16x16.png

## Additional Meta Tags
Add these to your index.html after conversion:

```html
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">
```

This will ensure your triskelion icon appears properly on all devices.
