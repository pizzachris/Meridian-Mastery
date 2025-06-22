// Quick test to verify data loading with the new complete meridian file
import {
  getAllPoints,
  getMaekChiKiPoints,
  getMaekChaKiPoints,
} from "./src/utils/dataLoader.js";

async function testDataLoading() {
  console.log("🧪 Testing data loading...");

  try {
    console.log("📋 Loading all points...");
    const allPoints = await getAllPoints();
    console.log(`✅ All points loaded: ${allPoints.length} points`);

    // Test a few points to verify field mapping
    const testPoint = allPoints[0];
    console.log("🔍 Sample point fields:", {
      id: testPoint.id,
      nameEnglish: testPoint.nameEnglish,
      meridian: testPoint.meridian,
      point_number: testPoint.point_number,
      location: testPoint.location,
      bilateral: testPoint.bilateral,
    });

    // Test meridian distribution
    const meridianCounts = {};
    allPoints.forEach((point) => {
      const meridian = point.meridian;
      meridianCounts[meridian] = (meridianCounts[meridian] || 0) + 1;
    });
    console.log("📊 Meridian distribution:", meridianCounts);

    console.log("🤜 Loading Maek Chi Ki points...");
    const maekChiKi = await getMaekChiKiPoints();
    console.log(`✅ Maek Chi Ki loaded: ${maekChiKi.length} points`);

    console.log("🦶 Loading Maek Cha Ki points...");
    const maekChaKi = await getMaekChaKiPoints();
    console.log(`✅ Maek Cha Ki loaded: ${maekChaKi.length} points`);

    // Test for any empty location fields
    const emptyLocations = allPoints.filter((p) => !p.location);
    if (emptyLocations.length > 0) {
      console.warn("⚠️ Points with empty locations:", emptyLocations.length);
      console.log(
        "Sample empty location points:",
        emptyLocations.slice(0, 3).map((p) => ({
          id: p.id,
          meridian: p.meridian,
          point_number: p.point_number,
        })),
      );
    } else {
      console.log("✅ All points have location data");
    }
  } catch (error) {
    console.error("❌ Data loading test failed:", error);
  }
}

testDataLoading();
