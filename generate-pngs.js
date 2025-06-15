import fs from "fs";
import path from "path";
import { createCanvas, loadImage } from "canvas";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICON_SIZES = [
  { name: "triskelion-192.png", size: 192 },
  { name: "triskelion-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-16x16.png", size: 16 },
];

async function generateIcons() {
  console.log("Generating PNG icons from triskelion.svg...");

  try {
    // Create icons directory if it doesn't exist
    const iconsDir = path.join(__dirname, "public", "icons");
    if (!fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDir, { recursive: true });
    }

    for (const icon of ICON_SIZES) {
      const canvas = createCanvas(icon.size, icon.size);
      const ctx = canvas.getContext("2d");

      // Fill background
      ctx.fillStyle = "#7B2D26";
      ctx.fillRect(0, 0, icon.size, icon.size);

      // Draw circle
      ctx.beginPath();
      ctx.arc(
        icon.size / 2,
        icon.size / 2,
        icon.size / 2 - icon.size / 25,
        0,
        Math.PI * 2,
      );
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = icon.size / 25;
      ctx.stroke();

      // Calculate scale factor
      const scaleFactor = icon.size / 100;

      // Draw the three spiral arms
      drawSpiralArm(ctx, icon.size / 2, icon.size / 2, scaleFactor);
      drawSpiralArm(ctx, icon.size / 2, icon.size / 2, scaleFactor, 120);
      drawSpiralArm(ctx, icon.size / 2, icon.size / 2, scaleFactor, 240);

      // Save as PNG
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(path.join(iconsDir, icon.name), buffer);
      console.log(`Generated ${icon.name} (${icon.size}x${icon.size})`);
    }

    console.log("All icons generated successfully!");
  } catch (error) {
    console.error("Error generating icons:", error);
  }
}

function drawSpiralArm(ctx, centerX, centerY, scale, rotation = 0) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((rotation * Math.PI) / 180);

  ctx.beginPath();
  ctx.moveTo(0, -30 * scale);
  ctx.quadraticCurveTo(10 * scale, -15 * scale, 0, 0);
  ctx.quadraticCurveTo(-10 * scale, 15 * scale, 0, 30 * scale);

  ctx.strokeStyle = "#FFD700";
  ctx.lineWidth = 5 * scale;
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.restore();
}

// Install the required packages and run the generator
console.log("Installing required packages...");
execSync("npm install canvas --save-dev", { stdio: "inherit" });
generateIcons();
