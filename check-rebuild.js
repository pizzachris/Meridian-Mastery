const fs = require("fs");

const data = JSON.parse(fs.readFileSync("./src/data/flashcards.json", "utf8"));

console.log("✅ Total flashcards:", data.flashcards.length);

// Check corrections
const lu2 = data.flashcards.find((card) => card.number === "LU2");
const lu3 = data.flashcards.find((card) => card.number === "LU3");

console.log("\n🔍 Verification of corrections:");
console.log(`LU2: ${lu2?.nameRomanized} - ${lu2?.nameEnglish}`);
console.log(`LU3: ${lu3?.nameRomanized} - ${lu3?.nameEnglish}`);

// Show meridian breakdown
const meridianCounts = {};
data.flashcards.forEach((card) => {
  meridianCounts[card.meridian] = (meridianCounts[card.meridian] || 0) + 1;
});

console.log("\n📊 Meridian breakdown:");
Object.entries(meridianCounts).forEach(([meridian, count]) => {
  console.log(`   ${meridian}: ${count} points`);
});

console.log("\n🎯 Sample of last 5 points:");
data.flashcards.slice(-5).forEach((card) => {
  console.log(`   ${card.number}: ${card.nameRomanized} - ${card.nameEnglish}`);
});
