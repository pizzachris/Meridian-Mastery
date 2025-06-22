// Quiz debugging script
import { getAllPoints } from "./src/utils/dataLoader.js";

console.log("Testing quiz data loading...");

try {
  const points = getAllPoints();
  console.log("Total points loaded:", points.length);

  if (points.length > 0) {
    const firstPoint = points[0];
    console.log("First point structure:", firstPoint);
    console.log("Properties:", Object.keys(firstPoint));

    // Check for quiz-required properties
    const requiredProps = [
      "id",
      "nameEnglish",
      "nameHangul",
      "nameRomanized",
      "number",
      "meridian",
      "location",
      "healingFunction",
    ];
    requiredProps.forEach((prop) => {
      console.log(`${prop}:`, firstPoint[prop] || "MISSING");
    });
  }
} catch (error) {
  console.error("Error testing quiz data:", error);
}
