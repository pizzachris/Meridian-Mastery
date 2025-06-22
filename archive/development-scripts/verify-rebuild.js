// Verification script for the rebuilt flashcards
import fs from "fs";

console.log("🔍 Verifying Kuk Sool Won flashcards rebuild...\n");

// Read the flashcards data
const flashcardsData = JSON.parse(
  fs.readFileSync("./src/data/flashcards.json", "utf8"),
);
const flashcards = flashcardsData.flashcards;

console.log(`📊 Total flashcards: ${flashcards.length}`);

// Check specific corrections
const lu2 = flashcards.find((card) => card.number === "LU2");
const lu3 = flashcards.find((card) => card.number === "LU3");

console.log("\n✅ Corrections Applied:");
console.log(
  `   LU2 Romanized: "${lu2?.nameRomanized}" ${lu2?.nameRomanized === "Oon Moon" ? "✓" : "✗"}`,
);
console.log(
  `   LU3 English: "${lu3?.nameEnglish}" ${lu3?.nameEnglish === "Heavenly Palace (Celestial Storehouse)" ? "✓" : "✗"}`,
);

// Check meridian distribution
const meridianCounts = {};
flashcards.forEach((card) => {
  meridianCounts[card.meridian] = (meridianCounts[card.meridian] || 0) + 1;
});

console.log("\n📈 Meridian Distribution:");
Object.entries(meridianCounts)
  .sort(([, a], [, b]) => b - a)
  .forEach(([meridian, count]) => {
    console.log(`   ${meridian}: ${count} points`);
  });

// Check data completeness
const withLocation = flashcards.filter(
  (card) => card.location && card.location.trim(),
).length;
const withHealing = flashcards.filter(
  (card) => card.healingFunction && card.healingFunction.trim(),
).length;
const withMartial = flashcards.filter(
  (card) => card.martialApplication && card.martialApplication.trim(),
).length;

console.log("\n📋 Data Completeness:");
console.log(
  `   Points with locations: ${withLocation}/${flashcards.length} (${Math.round((withLocation / flashcards.length) * 100)}%)`,
);
console.log(
  `   Points with healing functions: ${withHealing}/${flashcards.length} (${Math.round((withHealing / flashcards.length) * 100)}%)`,
);
console.log(
  `   Points with martial applications: ${withMartial}/${flashcards.length} (${Math.round((withMartial / flashcards.length) * 100)}%)`,
);

console.log("\n🎯 Rebuild verification complete!");
