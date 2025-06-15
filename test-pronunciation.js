// Test the enhanced pronunciation helper
import pronunciationHelper from "./src/utils/pronunciationHelper.js";

// Test various Korean romanizations
const testWords = [
  "Joong Boo", // 중부 - Central Treasury
  "Tae Chang", // 태창 - Great Granary
  "Eum Baek", // 음백 - Yin White
  "Cheon Joo", // 천주 - Celestial Gathering
  "Gong Sun", // 공손 - Grandfather Grandson
  "Sam Eum Gyo", // 삼음교 - Three Yin Intersection
  "Baek Hoe", // 백회 - Hundred Meetings
  "Seung Reu", // 승료 - Supporting Bowl
];

console.log("=== Enhanced Korean Pronunciation Guide Test ===\n");

testWords.forEach((word) => {
  console.log(`Testing: "${word}"`);
  const breakdown = pronunciationHelper.getSimpleBreakdown(word);

  if (breakdown && breakdown.length > 0) {
    breakdown.forEach((wordData, index) => {
      console.log(`  Word ${index + 1}: ${wordData.word}`);
      console.log(`  Syllables: ${wordData.syllables.join(" • ")}`);
      console.log(`  Phonetic: ${wordData.phonetic.join("-")}`);
      console.log(`  Guide: ${wordData.guide}`);
    });
  }
  console.log("---");
});

console.log("Test completed!");
