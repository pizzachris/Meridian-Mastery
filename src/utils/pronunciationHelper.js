/**
 * Korean Pronunciation Helper for English Speakers
 * Breaks down romanized Korean into syllables with pronunciation guides
 */

class PronunciationHelper {
  constructor() {
    // Common Korean syllable patterns and their English pronunciation guides
    this.pronunciationMap = {
      // Consonants
      ㄱ: { sound: "g/k", guide: 'like "g" in "go" (softer between vowels)' },
      ㄴ: { sound: "n", guide: 'like "n" in "no"' },
      ㄷ: { sound: "d/t", guide: 'like "d" in "do" (softer between vowels)' },
      ㄹ: { sound: "r/l", guide: 'between "r" and "l", like Spanish "r"' },
      ㅁ: { sound: "m", guide: 'like "m" in "mom"' },
      ㅂ: { sound: "b/p", guide: 'like "b" in "boy" (softer between vowels)' },
      ㅅ: { sound: "s", guide: 'like "s" in "say"' },
      ㅇ: { sound: "ng/silent", guide: 'silent at start, "ng" at end' },
      ㅈ: { sound: "j", guide: 'like "j" in "jump"' },
      ㅊ: { sound: "ch", guide: 'like "ch" in "church"' },
      ㅋ: { sound: "k", guide: 'like "k" in "key" (aspirated)' },
      ㅌ: { sound: "t", guide: 'like "t" in "top" (aspirated)' },
      ㅍ: { sound: "p", guide: 'like "p" in "pop" (aspirated)' },
      ㅎ: { sound: "h", guide: 'like "h" in "hat"' },

      // Vowels
      ㅏ: { sound: "a", guide: 'like "a" in "father"' },
      ㅑ: { sound: "ya", guide: 'like "ya" in "yacht"' },
      ㅓ: { sound: "eo", guide: 'like "u" in "hut"' },
      ㅕ: { sound: "yeo", guide: 'like "yu" in "yuck"' },
      ㅗ: { sound: "o", guide: 'like "o" in "pork"' },
      ㅛ: { sound: "yo", guide: 'like "yo" in "yoga"' },
      ㅜ: { sound: "u", guide: 'like "oo" in "moon"' },
      ㅠ: { sound: "yu", guide: 'like "you"' },
      ㅡ: { sound: "eu", guide: 'like "u" in "put" (no English equivalent)' },
      ㅣ: { sound: "i", guide: 'like "ee" in "see"' },
      ㅐ: { sound: "ae", guide: 'like "a" in "cat"' },
      ㅔ: { sound: "e", guide: 'like "e" in "bet"' },
      ㅢ: { sound: "ui", guide: 'like "we" but shorter' },
    }; // Common romanization patterns with enhanced guides for English speakers
    this.romanizationPatterns = {
      // Vowel patterns
      oo: {
        syllable: "oo",
        guide: 'like "oo" in "moon" (long sound)',
        stress: "long",
      },
      eo: {
        syllable: "uh",
        guide: 'like "u" in "hut" (Korean ㅓ)',
        stress: "short",
      },
      ae: {
        syllable: "eh",
        guide: 'like "a" in "cat" (Korean ㅐ)',
        stress: "short",
      },
      eu: {
        syllable: "eu",
        guide: 'like "u" in "put" but tighter (no English equivalent)',
        stress: "short",
      },
      ui: {
        syllable: "wi",
        guide: 'like "we" but shorter (Korean ㅢ)',
        stress: "short",
      },
      ye: { syllable: "yeh", guide: 'like "ye" in "yes"', stress: "short" },
      yo: { syllable: "yo", guide: 'like "yo" in "yoga"', stress: "short" },
      yu: { syllable: "yu", guide: 'like "you"', stress: "short" },
      wa: { syllable: "wa", guide: 'like "wa" in "watch"', stress: "short" },
      wo: { syllable: "wo", guide: 'like "wo" in "won"', stress: "short" },
      we: { syllable: "weh", guide: 'like "we" but shorter', stress: "short" },
      wi: { syllable: "wi", guide: 'like "we" in "week"', stress: "short" },

      // Consonant patterns
      ng: {
        syllable: "ng",
        guide: 'like "ng" in "sing" (nasal sound)',
        stress: "nasal",
      },
      ch: {
        syllable: "ch",
        guide: 'like "ch" in "church" (Korean ㅊ)',
        stress: "aspirated",
      },
      th: {
        syllable: "th",
        guide: 'like "t" in "top" with air puff (Korean ㅌ)',
        stress: "aspirated",
      },
      kh: {
        syllable: "kh",
        guide: 'like "k" in "key" with air puff (Korean ㅋ)',
        stress: "aspirated",
      },
      ph: {
        syllable: "ph",
        guide: 'like "p" in "pop" with air puff (Korean ㅍ)',
        stress: "aspirated",
      },
      sh: { syllable: "sh", guide: 'like "sh" in "ship"', stress: "normal" },

      // Special combinations
      rr: {
        syllable: "r",
        guide: 'rolled "r" sound (Korean ㄹㄹ)',
        stress: "normal",
      },
      ss: {
        syllable: "s",
        guide: 'strong "s" sound (Korean ㅆ)',
        stress: "tense",
      },
      tt: {
        syllable: "t",
        guide: 'strong "t" sound (Korean ㄸ)',
        stress: "tense",
      },
      pp: {
        syllable: "p",
        guide: 'strong "p" sound (Korean ㅃ)',
        stress: "tense",
      },
      kk: {
        syllable: "k",
        guide: 'strong "k" sound (Korean ㄲ)',
        stress: "tense",
      },
      jj: {
        syllable: "j",
        guide: 'strong "j" sound (Korean ㅉ)',
        stress: "tense",
      },
    };
  }

  /**
   * Break down romanized Korean into syllables with pronunciation guides
   */
  breakDownPronunciation(romanized) {
    if (!romanized) return null;

    // Clean and normalize the input
    const cleaned = romanized.toLowerCase().trim();

    // Split by spaces first to handle multi-word names
    const words = cleaned.split(" ");

    return words.map((word) => this.processSingleWord(word));
  }

  /**
   * Process a single Korean word
   */
  processSingleWord(word) {
    const syllables = [];
    let currentPos = 0;

    while (currentPos < word.length) {
      const syllable = this.extractNextSyllable(word, currentPos);
      if (syllable) {
        syllables.push({
          original: syllable.text,
          phonetic: this.getPhoneticGuide(syllable.text),
          guide: this.getPronunciationGuide(syllable.text),
          stress: this.getStressPattern(syllable.text),
        });
        currentPos += syllable.length;
      } else {
        currentPos++;
      }
    }

    return {
      word,
      syllables,
      phoneticSpelling: syllables.map((s) => s.phonetic).join("-"),
      fullGuide: this.generateFullGuide(syllables),
    };
  }
  /**
   * Extract the next syllable from the word using improved Korean syllable rules
   */
  extractNextSyllable(word, startPos) {
    if (startPos >= word.length) return null;

    // Korean syllables in romanization typically follow patterns:
    // CV, CVC, V, VC where C=consonant, V=vowel
    let currentPos = startPos;
    let syllable = "";

    // Step 1: Handle initial consonant(s)
    if (currentPos < word.length && this.isConsonant(word[currentPos])) {
      // Check for consonant clusters like 'ch', 'ng', 'kh', etc.
      const twoChar = word.substring(currentPos, currentPos + 2);
      if (this.isConsonantCluster(twoChar)) {
        syllable += twoChar;
        currentPos += 2;
      } else {
        syllable += word[currentPos];
        currentPos += 1;
      }
    }

    // Step 2: Must have vowel (or vowel combination)
    if (currentPos < word.length) {
      const twoChar = word.substring(currentPos, currentPos + 2);
      const threeChar = word.substring(currentPos, currentPos + 3);

      // Check for triple vowel combinations first (like 'eui')
      if (this.isTripleVowelCombination(threeChar)) {
        syllable += threeChar;
        currentPos += 3;
      }
      // Check for double vowel combinations
      else if (this.isVowelCombination(twoChar)) {
        syllable += twoChar;
        currentPos += 2;
      }
      // Single vowel
      else if (this.isVowel(word[currentPos])) {
        syllable += word[currentPos];
        currentPos += 1;
      }
    }

    // If we don't have a vowel yet, this isn't a valid syllable
    if (!this.hasVowel(syllable)) {
      return { text: word[startPos], length: 1 };
    }

    // Step 3: Handle final consonant(s)
    while (currentPos < word.length) {
      const remainingWord = word.substring(currentPos);
      const nextChar = word[currentPos];

      // Check if this consonant should end the syllable
      if (this.isConsonant(nextChar)) {
        // Don't take the consonant if it would leave the next syllable without initial consonant
        // unless it's clearly a final consonant
        if (
          this.isTypicalFinalConsonant(nextChar) &&
          (currentPos === word.length - 1 ||
            this.wouldCreateValidNextSyllable(word, currentPos + 1))
        ) {
          syllable += nextChar;
          currentPos += 1;
          break;
        } else {
          // This consonant likely starts the next syllable
          break;
        }
      } else {
        // Not a consonant, so we've reached the end of this syllable
        break;
      }
    }

    return syllable.length > 0
      ? { text: syllable, length: syllable.length }
      : null;
  }
  /**
   * Check if a character is a consonant
   */
  isConsonant(char) {
    const consonants = "bcdfghjklmnpqrstvwxyz";
    return consonants.includes(char.toLowerCase());
  }

  /**
   * Check if a character is a vowel
   */
  isVowel(char) {
    const vowels = "aeiou";
    return vowels.includes(char.toLowerCase());
  }

  /**
   * Check if a three-character combination is a triple vowel combination
   */
  isTripleVowelCombination(chars) {
    const tripleVowelCombos = ["eui", "oeu"];
    return tripleVowelCombos.includes(chars);
  }

  /**
   * Check if a two-character combination is a vowel combination
   */
  isVowelCombination(chars) {
    const vowelCombos = [
      "oo",
      "eo",
      "ae",
      "eu",
      "ui",
      "ye",
      "yo",
      "yu",
      "wa",
      "wo",
      "we",
      "wi",
      "oe",
      "ie",
    ];
    return vowelCombos.includes(chars);
  }

  /**
   * Check if a character is typically a final consonant in Korean
   */
  isTypicalFinalConsonant(char) {
    const finalConsonants = ["n", "m", "k", "t", "p", "l", "r"];
    return finalConsonants.includes(char);
  }
  /**
   * Check if breaking at this position would create a valid next syllable
   */
  wouldCreateValidNextSyllable(word, startPos) {
    if (startPos >= word.length) return true;

    // Look ahead to see if there's a vowel coming up
    for (let i = startPos; i < Math.min(startPos + 3, word.length); i++) {
      if (this.isVowel(word[i])) return true;
    }
    return false;
  }

  /**
   * Check if a character can be a final consonant
   */
  isFinalConsonant(char, currentSyllable) {
    const finalConsonants = ["n", "ng", "m", "k", "t", "p", "l", "r"];
    return finalConsonants.includes(char) && this.hasVowel(currentSyllable);
  }

  /**
   * Check if syllable has a vowel
   */
  hasVowel(syllable) {
    const vowels = ["a", "e", "i", "o", "u", "y"];
    return vowels.some((v) => syllable.includes(v));
  }
  /**
   * Check if characters form a consonant cluster
   */
  isConsonantCluster(chars) {
    const clusters = [
      // Basic clusters
      "ng",
      "ch",
      "th",
      "kh",
      "ph",
      "sh",
      // Double consonants (tense sounds)
      "ss",
      "tt",
      "pp",
      "kk",
      "jj",
      "dd",
      "bb",
      "gg",
      // Other Korean combinations
      "ngh",
      "ngk",
      "ght",
      "nk",
      "nt",
      "mp",
      "ng",
    ];
    return clusters.includes(chars);
  }
  /**
   * Get phonetic guide for a syllable with enhanced Korean sound mapping
   */
  getPhoneticGuide(syllable) {
    let phonetic = syllable;

    // Handle special patterns first (order matters for longer patterns)
    for (const [pattern, guide] of Object.entries(this.romanizationPatterns)) {
      if (syllable.includes(pattern)) {
        phonetic = phonetic.replace(pattern, guide.syllable);
      }
    }

    // Apply additional Korean-specific transformations
    phonetic = phonetic
      .replace(/eo/g, "uh") // ㅓ sound
      .replace(/eu/g, "eu") // ㅡ sound (keep as is, no English equivalent)
      .replace(/ae/g, "eh") // ㅐ sound
      .replace(/ng/g, "ng") // ㅇ final sound
      .replace(/ch/g, "ch") // ㅊ sound
      .replace(/th/g, "th") // ㅌ sound
      .replace(/kh/g, "kh") // ㅋ sound
      .replace(/ph/g, "ph") // ㅍ sound
      .replace(/oo/g, "oo") // ㅜ sound
      .replace(/ui/g, "wi") // ㅢ sound
      .replace(/r([aeiou])/g, "r$1") // ㄹ before vowels (more like 'r')
      .replace(/r$/g, "l") // ㄹ at end (more like 'l')
      .replace(/([aeiou])r/g, "$1l"); // ㄹ after vowels (more like 'l')

    return phonetic;
  }
  /**
   * Get detailed pronunciation guide for a syllable
   */
  getPronunciationGuide(syllable) {
    const guides = [];

    // Check for special patterns first
    for (const [pattern, guide] of Object.entries(this.romanizationPatterns)) {
      if (syllable.includes(pattern)) {
        guides.push(guide.guide);
        break;
      }
    }

    // If no special pattern found, generate detailed guide based on sounds
    if (guides.length === 0) {
      const soundGuides = [];

      // Analyze consonants
      if (syllable.includes("j")) soundGuides.push('soft "j" like "jump"');
      if (syllable.includes("r") && !syllable.includes("rr")) {
        soundGuides.push('soft "r/l" (tap tongue lightly)');
      }
      if (syllable.includes("g") && !syllable.match(/ng/)) {
        soundGuides.push('"g" sound (softer than English)');
      }
      if (syllable.includes("d"))
        soundGuides.push('"d" sound (softer than English)');
      if (syllable.includes("b"))
        soundGuides.push('"b" sound (softer than English)');

      // Analyze vowels
      if (
        syllable.includes("u") &&
        !syllable.includes("oo") &&
        !syllable.includes("eu")
      ) {
        soundGuides.push('short "u" like "book"');
      }
      if (syllable.includes("i") && !syllable.includes("ui")) {
        soundGuides.push('"i" like "see"');
      }
      if (syllable.includes("a") && !syllable.includes("ae")) {
        soundGuides.push('"a" like "father"');
      }
      if (syllable.includes("o") && !syllable.includes("oo")) {
        soundGuides.push('"o" like "pork"');
      }
      if (
        syllable.includes("e") &&
        !syllable.includes("eo") &&
        !syllable.includes("ae")
      ) {
        soundGuides.push('"e" like "bet"');
      }

      if (soundGuides.length > 0) {
        guides.push(soundGuides.join(", "));
      }
    }

    return guides.length > 0 ? guides[0] : "pronounce each sound clearly";
  }
  /**
   * Get stress pattern with enhanced Korean sound categorization
   */
  getStressPattern(syllable) {
    // Check for tense consonants (doubled letters)
    if (syllable.match(/ss|tt|pp|kk|jj/)) return "tense";

    // Check for aspirated consonants
    if (
      syllable.includes("ch") ||
      syllable.includes("th") ||
      syllable.includes("kh") ||
      syllable.includes("ph")
    ) {
      return "aspirated";
    }

    // Check for long vowels
    if (
      syllable.includes("oo") ||
      syllable.includes("aa") ||
      syllable.includes("ee")
    )
      return "long";

    // Check for nasal sounds
    if (
      syllable.includes("ng") ||
      syllable.includes("m") ||
      syllable.includes("n")
    )
      return "nasal";

    // Check for liquid sounds
    if (syllable.includes("r") || syllable.includes("l")) return "liquid";

    return "normal";
  }

  /**
   * Generate comprehensive pronunciation guide
   */
  generateFullGuide(syllables) {
    const tips = [];
    const stressTypes = syllables.map((s) => s.stress);

    // Add tips based on stress patterns found
    if (stressTypes.includes("nasal")) {
      tips.push("🎵 Hold nasal sounds (ng, m, n) slightly longer");
    }

    if (stressTypes.includes("aspirated")) {
      tips.push("💨 Aspirated sounds need a puff of air (ch, th, kh, ph)");
    }

    if (stressTypes.includes("tense")) {
      tips.push(
        "💪 Tense sounds are stronger and sharper (ss, tt, pp, kk, jj)",
      );
    }

    if (stressTypes.includes("liquid")) {
      tips.push('🌊 Korean "r/l" is softer - tap tongue lightly');
    }

    if (stressTypes.includes("long")) {
      tips.push("⏱️ Hold long vowel sounds slightly longer");
    }

    // Add general Korean pronunciation tips
    if (syllables.some((s) => s.original.includes("eo"))) {
      tips.push('🔤 "eo" sounds like "uh" in "hut"');
    }

    if (syllables.some((s) => s.original.includes("eu"))) {
      tips.push(
        '🔤 "eu" has no English equivalent - like "u" in "put" but tighter',
      );
    }

    // Default tip if no specific patterns
    if (tips.length === 0) {
      tips.push("🗣️ Pronounce each syllable clearly and evenly");
    }

    return tips.slice(0, 3).join(" • "); // Limit to 3 tips for mobile readability
  }
  /**
   * Get a simple syllable breakdown for display
   */
  getSimpleBreakdown(romanized) {
    const breakdown = this.breakDownPronunciation(romanized);
    if (!breakdown || breakdown.length === 0) return null;

    return breakdown.map((wordData) => ({
      word: wordData.word,
      syllables: wordData.syllables.map((s) => s.original),
      phonetic: wordData.syllables.map((s) => s.phonetic),
      guide: wordData.fullGuide,
    }));
  }

  /**
   * Get contextual pronunciation tips for common acupuncture terms
   */
  getAcupunctureTermTips(romanized) {
    const commonTerms = {
      joong: 'Central/Middle - pronounced "JUNG" with short "u"',
      boo: 'Treasury/Storehouse - pronounced "BOO" like "book"',
      tae: 'Great/Big - pronounced "TAE" like "tie"',
      chang: 'Granary/Store - pronounced "CHANG" like "change"',
      baek: 'White/Hundred - pronounced "BAEK" like "back"',
      hoe: 'Meeting/Gathering - pronounced "HOE" like "way"',
      cheon: 'Heaven/Sky - pronounced "CHUH-un"',
      joo: 'Master/Lord - pronounced "JOO" like "zoo"',
      gong: 'Merit/Work - pronounced "GONG" like "gone"',
      sun: 'Grandson - pronounced "SOON"',
      sam: 'Three - pronounced "SAHM"',
      eum: 'Yin/Sound - pronounced "UHM"',
      gyo: 'Intersection - pronounced "GYO" like "go"',
      seung: 'Supporting - pronounced "SUHNG"',
      reu: 'Bowl - pronounced "RUH"',
    };

    const lowerRomanized = romanized.toLowerCase();
    const tips = [];

    for (const [term, tip] of Object.entries(commonTerms)) {
      if (lowerRomanized.includes(term)) {
        tips.push(tip);
      }
    }

    return tips.length > 0 ? tips : null;
  }
}

// Create singleton instance
const pronunciationHelper = new PronunciationHelper();

export default pronunciationHelper;
