const fs = require("fs");

console.log("🚀 Starting complete transform...");

try {
  // Read the workbook file
  const workbookPath =
    "c:/Users/pizza/Downloads/Meridian_Mastery_FULL_WORKBOOK_FINAL_REVIEW.json";
  const outputPath = "./src/data/flashcards.json";

  console.log("📖 Reading workbook data from:", workbookPath);

  if (!fs.existsSync(workbookPath)) {
    throw new Error(`Workbook file not found at: ${workbookPath}`);
  }

  const workbookContent = fs.readFileSync(workbookPath, "utf8");
  const workbookData = JSON.parse(workbookContent);

  console.log("🔍 Workbook keys found:", Object.keys(workbookData));

  const allPoints = workbookData["All Points (Master)"];

  if (!allPoints) {
    throw new Error('Could not find "All Points (Master)" in workbook data');
  }

  console.log(`📊 Found ${allPoints.length} points to transform`);

  // Transform all points
  const transformedFlashcards = [];

  for (let i = 0; i < allPoints.length; i++) {
    const point = allPoints[i];

    if (i % 50 === 0) {
      console.log(`⚡ Processing point ${i + 1}/${allPoints.length}...`);
    }

    const meridianName = point["Meridian Name"] || "";
    let meridian = "";
    let element = "";

    // Map meridians to elements based on TCM theory
    if (meridianName.includes("Lung")) {
      meridian = "Lung";
      element = "metal";
    } else if (meridianName.includes("Large Intestine")) {
      meridian = "Large Intestine";
      element = "metal";
    } else if (meridianName.includes("Stomach")) {
      meridian = "Stomach";
      element = "earth";
    } else if (meridianName.includes("Spleen")) {
      meridian = "Spleen";
      element = "earth";
    } else if (
      meridianName.includes("Heart") &&
      !meridianName.includes("Small")
    ) {
      meridian = "Heart";
      element = "fire";
    } else if (meridianName.includes("Small Intestine")) {
      meridian = "Small Intestine";
      element = "fire";
    } else if (meridianName.includes("Bladder")) {
      meridian = "Bladder";
      element = "water";
    } else if (meridianName.includes("Kidney")) {
      meridian = "Kidney";
      element = "water";
    } else if (meridianName.includes("Pericardium")) {
      meridian = "Pericardium";
      element = "fire";
    } else if (meridianName.includes("Triple")) {
      meridian = "Triple Heater";
      element = "fire";
    } else if (meridianName.includes("Gallbladder")) {
      meridian = "Gallbladder";
      element = "wood";
    } else if (meridianName.includes("Liver")) {
      meridian = "Liver";
      element = "wood";
    } else if (meridianName.includes("Governing")) {
      meridian = "Governing Vessel";
      element = "extraordinary";
    } else if (meridianName.includes("Conception")) {
      meridian = "Conception Vessel";
      element = "extraordinary";
    } else {
      meridian = meridianName;
      element = "other";
    }

    const healingFunction =
      point["Healing Function"] || "Unknown healing function";
    const tcmAction =
      healingFunction.split(",")[0]?.trim() || "General healing";

    const transformedPoint = {
      id: i + 1,
      number: point["Point Number"] || `Unknown-${i + 1}`,
      nameHangul: point["Korean Name (Hangul)"] || "",
      nameRomanized: point["Romanized Korean"] || "",
      nameEnglish: point["English Translation (Verified)"] || "Unknown Point",
      meridian: meridian,
      element: element,
      location: point["Anatomical Location"] || "Location not specified",
      healingFunction: healingFunction,
      martialApplication:
        point["Martial Application"] || "Pressure point application",
      insight: `Traditional pressure point from ${meridian} meridian with both healing and martial applications`,
      tcmActions: [tcmAction],
      indications: [],
    };

    transformedFlashcards.push(transformedPoint);
  }

  console.log(
    `✅ Transformed ${transformedFlashcards.length} points successfully`,
  );

  // Create the final flashcards object
  const flashcardsData = {
    flashcards: transformedFlashcards,
  };

  // Write to the app's data file
  console.log(`💾 Writing to ${outputPath}...`);
  fs.writeFileSync(outputPath, JSON.stringify(flashcardsData, null, 2));

  console.log(
    `🎉 Successfully created flashcards.json with ${transformedFlashcards.length} points!`,
  );
  console.log(`📁 Saved to: ${outputPath}`);
  console.log("🔄 Ready to rebuild and deploy!");
} catch (error) {
  console.error("❌ Error transforming data:", error.message);
  console.error("📍 Stack trace:", error.stack);
  process.exit(1);
}
