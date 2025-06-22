// Quick test to verify data loading
import { getAllPoints } from "./src/utils/dataLoader.js";

console.log("Testing data loading...");

try {
  const allPoints = getAllPoints();
  console.log("Total points loaded:", allPoints.length);

  // Find LU7 specifically
  const lu7 = allPoints.find(
    (p) => p.point_number === "LU7" || p.number === "LU7",
  );
  console.log("LU7 found in main data:", lu7 ? "YES" : "NO");
  if (lu7) {
    console.log("LU7 details:", {
      point_number: lu7.point_number,
      hangul: lu7.hangul,
      romanized: lu7.romanized,
      english: lu7.english,
      meridian: lu7.meridian,
    });
  }

  // Check for some other Maek Chi Ki points
  const somePoints = ["LI20", "ST6", "SP6"];
  somePoints.forEach((pointNum) => {
    const point = allPoints.find(
      (p) => p.point_number === pointNum || p.number === pointNum,
    );
    console.log(`${pointNum} found:`, point ? "YES" : "NO");
  });
} catch (error) {
  console.error("Error:", error);
}
