// Kuk Sool Won Data Validation Script
// Compares current flashcards.json against approved source
console.log("🥋 KUK SOOL WON DATA VALIDATION 🥋\n");

const fs = require("fs");
const path = require("path");

try {
  // Load current flashcards
  const currentData = JSON.parse(
    fs.readFileSync("src/data/flashcards.json", "utf8"),
  );

  // Load approved Kuk Sool Won source
  const approvedPath =
    "c:\\Users\\pizza\\Downloads\\Meridian_Mastery_FULL_WORKBOOK_FINAL_REVIEW.json";

  if (!fs.existsSync(approvedPath)) {
    console.log("❌ Cannot find approved source file at:", approvedPath);
    console.log(
      "Please ensure the approved Kuk Sool Won data file is available.",
    );
    process.exit(1);
  }

  const approvedData = JSON.parse(fs.readFileSync(approvedPath, "utf8"));

  console.log("📊 DATA COMPARISON RESULTS:\n");
  console.log(`Current flashcards: ${currentData.flashcards.length} entries`);
  console.log(
    `Approved source: ${approvedData["All Points (Master)"].length} entries\n`,
  );

  let discrepancies = [];
  let matches = 0;

  // Check each current flashcard against approved source
  currentData.flashcards.forEach((current, index) => {
    const approved = approvedData["All Points (Master)"].find(
      (item) => item["Point Number"] === current.number,
    );

    if (!approved) {
      discrepancies.push({
        point: current.number,
        issue: "NOT FOUND in approved source",
        current: current.nameEnglish,
      });
      return;
    }

    // Check for discrepancies
    const issues = [];

    // Korean Name
    if (current.nameHangul !== approved["Korean Name (Hangul)"]) {
      issues.push(
        `Korean: "${current.nameHangul}" vs "${approved["Korean Name (Hangul)"]}"`,
      );
    }

    // Romanized Korean
    if (current.nameRomanized !== approved["Romanized Korean"]) {
      issues.push(
        `Romanized: "${current.nameRomanized}" vs "${approved["Romanized Korean"]}"`,
      );
    }

    // English Translation (allowing for our enhanced versions)
    const approvedEnglish = approved["English Translation (Verified)"];
    if (!current.nameEnglish.includes(approvedEnglish)) {
      issues.push(`English: "${current.nameEnglish}" vs "${approvedEnglish}"`);
    }

    // Location
    if (current.location !== approved["Anatomical Location"]) {
      issues.push(`Location differs`);
    }

    // Healing Function
    if (current.healingFunction !== approved["Healing Function"]) {
      issues.push(`Healing function differs`);
    }

    // Martial Application
    if (current.martialApplication !== approved["Martial Application"]) {
      issues.push(`Martial application differs`);
    }

    if (issues.length > 0) {
      discrepancies.push({
        point: current.number,
        issue: issues.join("; "),
        current: current.nameEnglish,
        approved: approvedEnglish,
      });
    } else {
      matches++;
    }
  });

  console.log(`✅ Perfect matches: ${matches}`);
  console.log(`⚠️  Discrepancies found: ${discrepancies.length}\n`);

  if (discrepancies.length > 0) {
    console.log("🔍 DETAILED DISCREPANCIES:\n");
    discrepancies.forEach((disc, i) => {
      console.log(`${i + 1}. ${disc.point}:`);
      console.log(`   Issue: ${disc.issue}`);
      if (disc.approved) {
        console.log(`   Current: ${disc.current}`);
        console.log(`   Approved: ${disc.approved}`);
      }
      console.log("");
    });

    console.log("🛠️  RECOMMENDED ACTIONS:");
    console.log(
      "1. Update all discrepancies to match approved Kuk Sool Won source",
    );
    console.log("2. Remove any entries not found in approved source");
    console.log("3. Add any missing entries from approved source");
    console.log("4. Ensure NO TCM information is added beyond approved data");
  } else {
    console.log("🎉 All data matches approved Kuk Sool Won source!");
  }

  // Generate correction script if needed
  if (discrepancies.length > 0) {
    console.log("\n📝 Generating data correction file...");

    const corrections = discrepancies
      .map((disc) => {
        const approved = approvedData["All Points (Master)"].find(
          (item) => item["Point Number"] === disc.point,
        );

        if (approved) {
          return {
            pointNumber: disc.point,
            corrections: {
              nameHangul: approved["Korean Name (Hangul)"],
              nameRomanized: approved["Romanized Korean"],
              nameEnglish: approved["English Translation (Verified)"],
              location: approved["Anatomical Location"],
              healingFunction: approved["Healing Function"],
              martialApplication: approved["Martial Application"],
            },
          };
        }
        return null;
      })
      .filter((c) => c !== null);

    fs.writeFileSync(
      "kuk-sool-corrections.json",
      JSON.stringify(corrections, null, 2),
    );

    console.log("✅ Corrections saved to: kuk-sool-corrections.json");
  }
} catch (error) {
  console.error("❌ Validation Error:", error.message);
}

console.log("\n🥋 Kuk Sool Won data integrity check complete!");
