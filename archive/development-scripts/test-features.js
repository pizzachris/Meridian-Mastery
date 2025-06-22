// Comprehensive Feature Test Script
// Run this in browser console to test all pronunciation features

console.log("🧪 TESTING ENHANCED KOREAN PRONUNCIATION FEATURES 🧪\n");

// Test pronunciation helper import (simulated)
const testPronunciationBreakdown = (word) => {
  console.log(`\n📝 Testing: "${word}"`);

  // Simulate the breakdown logic
  const syllables = word
    .toLowerCase()
    .split(" ")
    .map((w) => {
      // Basic syllable splitting for test
      const parts = [];
      let i = 0;
      while (i < w.length) {
        let syllable = "";

        // Get consonant(s)
        while (i < w.length && !"aeiou".includes(w[i])) {
          syllable += w[i];
          i++;
        }

        // Get vowel(s)
        while (i < w.length && "aeiou".includes(w[i])) {
          syllable += w[i];
          i++;
        }

        // Get final consonant if exists
        if (
          i < w.length &&
          !"aeiou".includes(w[i]) &&
          (i === w.length - 1 || "aeiou".includes(w[i + 1]))
        ) {
          syllable += w[i];
          i++;
        }

        if (syllable) parts.push(syllable);
      }
      return parts;
    });

  console.log(`  Syllables: ${syllables.flat().join(" • ")}`);

  // Test phonetic conversion
  const phonetic = syllables
    .flat()
    .map((s) =>
      s
        .replace("eo", "uh")
        .replace("oo", "oo")
        .replace("ae", "eh")
        .replace("ng", "ng"),
    );

  console.log(`  Phonetic: ${phonetic.join("-")}`);

  // Test tips generation
  const tips = [];
  if (word.includes("ng")) tips.push('🎵 Hold nasal "ng" sound');
  if (word.includes("ch")) tips.push('💨 "ch" with air puff');
  if (word.includes("eo")) tips.push('🔤 "eo" sounds like "uh"');

  if (tips.length > 0) {
    console.log(`  Tips: ${tips.join(" • ")}`);
  }

  return { syllables: syllables.flat(), phonetic, tips };
};

// Test cases from actual flashcard data
const testWords = [
  "Joong Boo", // 중부 - Central Treasury
  "Tae Chang", // 태창 - Great Granary
  "Eum Baek", // 음백 - Yin White
  "Cheon Joo", // 천주 - Celestial Gathering
  "Gong Sun", // 공손 - Grandfather Grandson
  "Sam Eum Gyo", // 삼음교 - Three Yin Intersection
  "Baek Hoe", // 백회 - Hundred Meetings
  "Seung Reu", // 승료 - Supporting Bowl
  "Hap Gok", // 합곡 - Joining Valley
  "Tae Baek", // 태백 - Supreme White
];

// Run tests
testWords.forEach((word) => testPronunciationBreakdown(word));

// Test voice synthesis availability
console.log("\n🔊 TESTING VOICE SYNTHESIS");
if ("speechSynthesis" in window) {
  const voices = speechSynthesis.getVoices();
  console.log(`Total voices available: ${voices.length}`);

  const koreanVoices = voices.filter(
    (voice) =>
      voice.lang.includes("ko") || voice.name.toLowerCase().includes("korean"),
  );
  console.log(`Korean voices: ${koreanVoices.length}`);

  if (koreanVoices.length > 0) {
    console.log("✅ Korean voice available:", koreanVoices[0].name);
  } else {
    console.log("⚠️ No Korean voices found, will use fallback");
  }

  // Test pronunciation
  const testUtterance = new SpeechSynthesisUtterance("중부");
  if (koreanVoices.length > 0) {
    testUtterance.voice = koreanVoices[0];
  }
  testUtterance.rate = 0.8;
  testUtterance.volume = 0.5;

  console.log("🎵 Testing Korean pronunciation...");
  speechSynthesis.speak(testUtterance);
} else {
  console.log("❌ Speech synthesis not supported");
}

// Test UI elements (if in browser)
console.log("\n🎨 TESTING UI ELEMENTS");
setTimeout(() => {
  const pronGuideBtn =
    document.querySelector('[title*="pronunciation guide"]') ||
    document.querySelector('button[title*="How to Say"]');
  if (pronGuideBtn) {
    console.log("✅ Pronunciation guide button found");
  } else {
    console.log("⚠️ Pronunciation guide button not found");
  }

  const pronButtons = document.querySelectorAll('button[title*="Pronounce"]');
  console.log(`🔊 Found ${pronButtons.length} pronunciation buttons`);

  const flashcard =
    document.querySelector('[data-testid="flashcard"]') ||
    document.querySelector(".flashcard") ||
    document.querySelector('[class*="flashcard"]');
  if (flashcard) {
    console.log("✅ Flashcard component found");
  } else {
    console.log("⚠️ Flashcard component not found");
  }
}, 2000);

console.log("\n✨ FEATURE TEST COMPLETE ✨");
console.log(
  'Navigate to flashcards and click "How to Say" to test the enhanced pronunciation guide!',
);
