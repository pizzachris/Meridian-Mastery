// Kuk Sool Won Data Validation Script
console.log("🥋 KUK SOOL WON DATA VALIDATION 🥋\n");

const fs = require("fs");

try {
  // Load current flashcards
  const currentData = JSON.parse(
    fs.readFileSync("src/data/flashcards.json", "utf8"),
  );

  // Load approved Kuk Sool Won source
  const approvedPath =
    "c:\\Users\\pizza\\Downloads\\Meridian_Mastery_FULL_WORKBOOK_FINAL_REVIEW.json";

  if (!fs.existsSync(approvedPath)) {
    console.log("❌ Cannot find approved source file");
    process.exit(1);
  }

  const approvedData = JSON.parse(fs.readFileSync(approvedPath, "utf8"));

  console.log("📊 COMPARISON RESULTS:\n");
  console.log(`Current: ${currentData.flashcards.length} entries`);
  console.log(
    `Approved: ${approvedData["All Points (Master)"].length} entries\n`,
  );

  // Check first 5 entries
  currentData.flashcards.slice(0, 5).forEach((current) => {
    const approved = approvedData["All Points (Master)"].find(
      (item) => item["Point Number"] === current.number,
    );

    if (approved) {
      console.log(`${current.number}:`);
      console.log(
        `  Current: ${current.nameRomanized} → ${current.nameEnglish}`,
      );
      console.log(
        `  Approved: ${approved["Romanized Korean"]} → ${approved["English Translation (Verified)"]}`,
      );

      if (current.nameRomanized !== approved["Romanized Korean"]) {
        console.log(`  ⚠️  ROMANIZATION DIFFERS`);
      }

      console.log("");
    }
  });
} catch (error) {
  console.error("❌ Error:", error.message);
}

console.log("🥋 Validation complete!");
