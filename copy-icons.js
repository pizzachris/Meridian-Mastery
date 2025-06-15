// Script to copy icons to the dist folder during build
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the icons directory exists in the dist folder
const iconDir = path.join(__dirname, "dist", "icons");
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Copy SVG icons
const svgFiles = ["triskelion.svg", "apple-touch-icon.svg"];
svgFiles.forEach((file) => {
  const sourcePath = path.join(__dirname, "public", "icons", file);
  const destPath = path.join(iconDir, file);

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to dist/icons/`);
  } else {
    console.warn(`Warning: ${file} not found in public/icons/`);
  }
});

// Copy PNG icons if they exist
const pngFiles = [
  "triskelion-192.png",
  "triskelion-512.png",
  "apple-touch-icon.png",
  "favicon-32x32.png",
  "favicon-16x16.png",
];

pngFiles.forEach((file) => {
  const sourcePath = path.join(__dirname, "public", "icons", file);
  const destPath = path.join(iconDir, file);

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to dist/icons/`);
  } else {
    console.warn(
      `Warning: ${file} not found in public/icons/ - you may need to generate it`,
    );
  }
});

console.log("Icon copying complete!");
