const fs = require("fs");

console.log("🔄 Starting debug transform...");

try {
  // Read the workbook file
  const workbookPath =
    "c:/Users/pizza/Downloads/Meridian_Mastery_FULL_WORKBOOK_FINAL_REVIEW.json";
  console.log("📖 Reading workbook from:", workbookPath);

  const workbookContent = fs.readFileSync(workbookPath, "utf8");
  console.log("📄 File size:", workbookContent.length, "characters");

  const workbookData = JSON.parse(workbookContent);
  console.log("🔑 Workbook keys:", Object.keys(workbookData));

  const allPoints = workbookData["All Points (Master)"];
  console.log(
    "📊 Total points found:",
    allPoints ? allPoints.length : "undefined",
  );

  if (allPoints && allPoints.length > 0) {
    console.log("✅ Sample point structure:", Object.keys(allPoints[0]));
    console.log(
      "🎯 First point:",
      allPoints[0]["Point Number"],
      allPoints[0]["English Translation (Verified)"],
    );
    console.log(
      "🎯 Last point:",
      allPoints[allPoints.length - 1]["Point Number"],
      allPoints[allPoints.length - 1]["English Translation (Verified)"],
    );
  }
} catch (error) {
  console.error("❌ Error:", error.message);
}
