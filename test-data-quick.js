// Quick test to verify data loading
import { getAllPoints } from "./src/utils/dataLoader.js";

async function testData() {
  try {
    console.log("Testing data loading...");
    const points = await getAllPoints();
    console.log("Points loaded:", points.length);
    console.log("First point:", JSON.stringify(points[0], null, 2));
  } catch (error) {
    console.error("Data loading failed:", error);
  }
}

testData();
