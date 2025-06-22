// Rebuild flashcards.json using ONLY approved Kuk Sool Won data
console.log("🥋 REBUILDING FLASHCARDS FROM APPROVED KUK SOOL WON DATA 🥋\n");

import fs from "fs";

try {
  // Load approved Kuk Sool Won source
  const approvedData = JSON.parse(
    fs.readFileSync(
      "c:\\Users\\pizza\\Downloads\\Meridian_Mastery_FULL_WORKBOOK_FINAL_REVIEW.json",
      "utf8",
    ),
  );

  console.log(
    `Found ${approvedData["All Points (Master)"].length} approved pressure points\n`,
  );

  // Create new flashcards structure using ONLY approved data
  const newFlashcards = {
    flashcards: [],
  };

  // Map element names (if needed)
  const getElement = (meridianName) => {
    const elementMap = {
      "Lung (LU)": "metal",
      "Large Intestine (LI)": "metal",
      "Stomach (ST)": "earth",
      "Spleen (SP)": "earth",
      "Heart (HT)": "fire",
      "Small Intestine (SI)": "fire",
      "Bladder (BL)": "water",
      "Kidney (KI)": "water",
      "Pericardium (PC)": "fire",
      "Triple Heater (TH)": "fire",
      "Gallbladder (GB)": "wood",
      "Liver (LV)": "wood",
    };
    return elementMap[meridianName] || "metal";
  };

  // Apply your specific corrections
  const applyInstructorCorrections = (point) => {
    // LU1: Middle Palace (Central Treasury)
    if (point["Point Number"] === "LU1") {
      point["English Translation (Verified)"] =
        "Middle Palace (Central Treasury)";
    }

    // LU2: Oon Moon (per instructor)
    if (point["Point Number"] === "LU2") {
      point["Romanized Korean"] = "Oon Moon";
    }

    // LU3: Heavenly Palace (Celestial Storehouse)
    if (point["Point Number"] === "LU3") {
      point["English Translation (Verified)"] =
        "Heavenly Palace (Celestial Storehouse)";
    }

    return point;
  };

  // Transform each approved point to flashcard format
  approvedData["All Points (Master)"].forEach((approvedPoint, index) => {
    // Apply instructor corrections
    const correctedPoint = applyInstructorCorrections(approvedPoint);

    const flashcard = {
      id: index + 1,
      number: correctedPoint["Point Number"],
      nameHangul: correctedPoint["Korean Name (Hangul)"],
      nameRomanized: correctedPoint["Romanized Korean"],
      nameEnglish: correctedPoint["English Translation (Verified)"],
      meridian: correctedPoint["Meridian Name"].replace(/\s*\([^)]*\)/, ""), // Remove (LU) part
      element: getElement(correctedPoint["Meridian Name"]),
      location: correctedPoint["Anatomical Location"],
      healingFunction: correctedPoint["Healing Function"],
      martialApplication: correctedPoint["Martial Application"],
      insight:
        "Traditional pressure point with healing and martial applications",
    };

    newFlashcards.flashcards.push(flashcard);
  });

  // Create backup of current file
  const currentTime = new Date().toISOString().replace(/[:.]/g, "-");
  fs.copyFileSync(
    "src/data/flashcards.json",
    `src/data/flashcards-backup-${currentTime}.json`,
  );

  // Write new flashcards file
  fs.writeFileSync(
    "src/data/flashcards.json",
    JSON.stringify(newFlashcards, null, 2),
  );

  console.log("✅ REBUILD COMPLETE!");
  console.log(
    `📊 Created ${newFlashcards.flashcards.length} flashcards from approved data`,
  );
  console.log("🔧 Applied instructor corrections:");
  console.log("   • LU1: Middle Palace (Central Treasury)");
  console.log("   • LU2: Oon Moon romanization");
  console.log("   • LU3: Heavenly Palace (Celestial Storehouse)");
  console.log("💾 Backup saved as: flashcards-backup-[timestamp].json");
  console.log("\n🥋 Ready for Kuk Sool Won training!");
} catch (error) {
  console.error("❌ Rebuild Error:", error.message);
  console.log("\nPlease ensure the approved source file is available.");
}
