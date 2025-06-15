const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const sharp = require("sharp");

async function convertSvgToPng(svgPath, pngPath, width, height) {
  try {
    await sharp(svgPath).resize(width, height).png().toFile(pngPath);
    console.log(`Created ${pngPath}`);
  } catch (error) {
    console.error("Error converting SVG to PNG:", error);
  }
}

// Install required packages
require("child_process").execSync("npm install sharp canvas", {
  stdio: "inherit",
});

// Convert to different sizes
const svgPath = "./public/icons/triskelion.svg";
convertSvgToPng(svgPath, "./public/icons/triskelion-192.png", 192, 192);
convertSvgToPng(svgPath, "./public/icons/triskelion-512.png", 512, 512);
