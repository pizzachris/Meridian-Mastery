import fs from "fs";
import path from "path";

// Read the source workbook data
const sourceFile =
  "c:/Users/pizza/Downloads/Meridian_Mastery_FULL_WORKBOOK_FINAL_REVIEW.json";
const outputFile = "./src/data/flashcards.json";

console.log("🔄 Reading approved Kuk Sool Won workbook data...");

// Read and parse the source data
let sourceData;
try {
  const rawData = fs.readFileSync(sourceFile, "utf8");
  sourceData = JSON.parse(rawData);
} catch (error) {
  console.error("❌ Error reading source file:", error.message);
  process.exit(1);
}

// Extract all points from the master list
const allPoints = sourceData["All Points (Master)"];

if (!allPoints || !Array.isArray(allPoints)) {
  console.error('❌ Could not find "All Points (Master)" in source data');
  process.exit(1);
}

console.log(`📊 Found ${allPoints.length} total points in source data`);

// Function to determine element based on meridian
function getElement(meridianName) {
  const elementMap = {
    "Lung (LU)": "metal",
    "Large Intestine (LI)": "metal",
    "Stomach (ST)": "earth",
    "Spleen (SP)": "earth",
    "Heart (HT)": "fire",
    "Small Intestine (SI)": "fire",
    "Urinary Bladder (UB)": "water",
    "Kidney (KI)": "water",
    "Pericardium (PC)": "fire",
    "Triple Burner (TB)": "fire",
    "Gallbladder (GB)": "wood",
    "Liver (LV)": "wood",
    "Conception Vessel (CV)": "special",
    "Governing Vessel (GV)": "special",
  };
  return elementMap[meridianName] || "unknown";
}

// Function to extract meridian from point number
function getMeridian(pointNumber) {
  if (!pointNumber) return "Unknown";
  const prefix = pointNumber.split(/\d/)[0];
  const meridianMap = {
    LU: "Lung",
    LI: "Large Intestine",
    ST: "Stomach",
    SP: "Spleen",
    HT: "Heart",
    SI: "Small Intestine",
    UB: "Bladder",
    KI: "Kidney",
    PC: "Pericardium",
    TB: "Triple Burner",
    GB: "Gallbladder",
    LV: "Liver",
    CV: "Conception Vessel",
    GV: "Governing Vessel",
  };
  return meridianMap[prefix] || "Unknown";
}

// Transform the data
const flashcards = [];
let id = 1;

for (const point of allPoints) {
  // Skip empty or invalid points
  if (!point["Point Number"] || !point["Korean Name (Hangul)"]) {
    continue;
  }

  const pointNumber = point["Point Number"];
  let romanizedName = point["Romanized Korean"];
  let englishName = point["English Translation (Verified)"];

  // Apply specific corrections as requested
  if (pointNumber === "LU2") {
    romanizedName = "Oon Moon"; // Correction from "Woon Moon"
    console.log(`✅ Applied LU2 correction: ${romanizedName}`);
  }

  if (pointNumber === "LU3") {
    englishName = "Heavenly Palace (Celestial Storehouse)"; // Correction from "Palace of Heaven"
    console.log(`✅ Applied LU3 correction: ${englishName}`);
  }

  const flashcard = {
    id: id++,
    number: pointNumber,
    nameHangul: point["Korean Name (Hangul)"],
    nameRomanized: romanizedName,
    nameEnglish: englishName,
    meridian: getMeridian(pointNumber),
    element: getElement(point["Meridian Name"]),
    location: point["Anatomical Location"] || "",
    healingFunction: point["Healing Function"] || "",
    martialApplication: point["Martial Application"] || "",
    insight: "Traditional pressure point with healing and martial applications",
    tcmActions: point["Healing Function"]
      ? [point["Healing Function"].split(",")[0].trim()]
      : [],
    indications: [],
  };

  flashcards.push(flashcard);
}

// Create the final structure
const finalData = {
  flashcards: flashcards,
};

// Write the output file
try {
  fs.writeFileSync(outputFile, JSON.stringify(finalData, null, 2));
  console.log(
    `✅ Successfully created flashcards.json with ${flashcards.length} cards`,
  );
  console.log(`📁 Output file: ${outputFile}`);

  // Show some statistics
  const meridianCounts = {};
  flashcards.forEach((card) => {
    meridianCounts[card.meridian] = (meridianCounts[card.meridian] || 0) + 1;
  });

  console.log("\n📊 Meridian breakdown:");
  Object.entries(meridianCounts).forEach(([meridian, count]) => {
    console.log(`   ${meridian}: ${count} points`);
  });
} catch (error) {
  console.error("❌ Error writing output file:", error.message);
  process.exit(1);
}

console.log(
  "\n🎯 Rebuild complete! Ready for Kuk Sool Won martial arts training.",
);
