import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react";
import {
  getAllPoints,
  getPointsByMeridian,
  getPointsByRegion,
  getPointsByTheme,
  getMaekChiKiPoints,
  getMaekChaKiPoints,
} from "../utils/dataLoaderOptimized";
import { ProgressTracker } from "../utils/progressTracker";
import PronunciationManager from "../utils/pronunciation";
import Logo from "./Logo";

// Temporary fallback functions for mobile optimization
const getOptimalTouchTargetSize = () => ({
  minWidth: "44px",
  minHeight: "44px",
  recommendedPadding: "12px",
});

// Dummy setupTouchGestures function (mobile gestures temporarily disabled)
const setupTouchGestures = () => () => {}; // Returns cleanup function that does nothing

// Helper to get meridian abbreviation for badge
const getMeridianAbbreviation = (meridianName, pointNumber) => {
  if (!meridianName) return "UN";

  // If pointNumber already contains the meridian abbreviation (like "LU1"), use it directly
  if (pointNumber && /^[A-Z]{1,2}\d+/.test(pointNumber.toString())) {
    return pointNumber.toString();
  }

  // Otherwise, create abbreviation from meridian name and combine with point number
  const normalizedName = meridianName.replace(/\s*\([^)]*\)/, "").trim();
  const abbrevMap = {
    Lung: "LU",
    "Large Intestine": "LI",
    Stomach: "ST",
    Spleen: "SP",
    Heart: "HT",
    "Small Intestine": "SI",
    Pericardium: "PC",
    "Triple Heater": "TH",
    "Triple Burner": "TH",
    Kidney: "KI",
    Bladder: "BL",
    "Urinary Bladder": "BL",
    Liver: "LV",
    Gallbladder: "GB",
    Governing: "GV",
    Conception: "CV",
    "Governing Vessel": "GV",
    "Conception Vessel": "CV",
  };

  const abbrev = abbrevMap[normalizedName] || "UN";
  return pointNumber ? `${abbrev}${pointNumber}` : abbrev;
};

// Helper to get element from meridian name
const getElementFromMeridian = (meridianName) => {
  if (!meridianName) return "Metal";

  const normalizedName = meridianName.replace(/\s*\([^)]*\)/, "").trim();
  const elementMap = {
    Lung: "Metal",
    "Large Intestine": "Metal",
    Stomach: "Earth",
    Spleen: "Earth",
    Heart: "Fire",
    "Small Intestine": "Fire",
    Pericardium: "Fire",
    "Triple Heater": "Fire",
    "Triple Burner": "Fire",
    Kidney: "Water",
    Bladder: "Water",
    "Urinary Bladder": "Water",
    Liver: "Wood",
    Gallbladder: "Wood",
    Governing: "Extraordinary",
    Conception: "Extraordinary",
    "Governing Vessel": "Extraordinary",
    "Conception Vessel": "Extraordinary",
  };

  return elementMap[normalizedName] || "Metal";
};

// Helper to get element color classes
const getElementColors = (element) => {
  const colorMap = {
    Fire: {
      bg: "bg-red-600",
      border: "border-red-400",
      text: "text-white",
    },
    Earth: {
      bg: "bg-yellow-600",
      border: "border-yellow-400",
      text: "text-black",
    },
    Metal: {
      bg: "bg-gray-100",
      border: "border-gray-300",
      text: "text-black",
    },
    Water: {
      bg: "bg-blue-600",
      border: "border-blue-400",
      text: "text-white",
    },
    Wood: {
      bg: "bg-green-600",
      border: "border-green-400",
      text: "text-white",
    },
    Extraordinary: {
      bg: "bg-purple-600",
      border: "border-purple-400",
      text: "text-white",
    },
  };

  return colorMap[element] || colorMap["Metal"]; // Default to Metal if unknown
};

// Memoized helper components for better performance
const MemoizedPointBadge = memo(({ abbreviation, colors }) => (
  <div
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${colors.bg} ${colors.border} ${colors.text} border-2`}
  >
    {abbreviation}
  </div>
));

const MemoizedProgressBar = memo(({ current, total }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
    <div
      className="bg-yellow-400 h-2.5 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${total > 0 ? ((current + 1) / total) * 100 : 0}%` }}
    ></div>
  </div>
));

const Flashcard = memo(
  ({
    navigateTo,
    selectedPointId,
    sessionMode,
    shuffleMode = false,
    onCardChange,
  }) => {
    // All state hooks must be at the top level - never conditional
    const [currentCard, setCurrentCard] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false); // Always start with front side
    const [userStats, setUserStats] = useState({});
    const [showFlagModal, setShowFlagModal] = useState(false);
    const [flagReason, setFlagReason] = useState("");
    const [flagSubmitted, setFlagSubmitted] = useState(false);
    const [showInsightModal, setShowInsightModal] = useState(false);
    const [showPronunciationModal, setShowPronunciationModal] = useState(false);
    const [pronunciationBreakdown, setPronunciationBreakdown] = useState([]);
    const [pronunciation, setPronunciation] = useState(null);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Refs for touch gesture support
    const cardContainerRef = useRef(null);

    // Memoized navigation functions for better performance - defined early to avoid reference errors
    const nextCard = useCallback(async () => {
      if (flashcards.length === 0) return;

      // Record study event
      if (flashcards.length > 0 && currentCard < flashcards.length) {
        const card = flashcards[currentCard];
        if (card) {
          try {
            await ProgressTracker.studyPoint(card.id, card.meridian);
            // Update progress asynchronously
            const progressData = await ProgressTracker.getProgress();
            setProgress(progressData);
          } catch (error) {
            console.error("Failed to update progress:", error);
          }
        }
      }

      setIsFlipped(false);
      setCurrentCard((prev) => (prev + 1) % flashcards.length);
    }, [flashcards, currentCard]);

    const prevCard = useCallback(() => {
      if (flashcards.length === 0) return;
      setIsFlipped(false);
      setCurrentCard(
        (prev) => (prev - 1 + flashcards.length) % flashcards.length,
      );
    }, [flashcards]);

    const flipCard = useCallback(() => {
      setIsFlipped(!isFlipped);
    }, [isFlipped]);

    // Current card data - derived from state
    const currentCardData = flashcards[currentCard] || null;

    // Memoized computed card properties for performance
    const cardProperties = useMemo(() => {
      if (!currentCardData) return null;

      const pointNumber =
        currentCardData.point_number || currentCardData.number;
      const nameHangul = currentCardData.nameHangul || currentCardData.hangul;
      const nameRomanized =
        currentCardData.nameRomanized || currentCardData.romanized;
      const nameEnglish =
        currentCardData.nameEnglish || currentCardData.english;
      const meridianName = currentCardData.meridian;
      const meridianAbbrev = getMeridianAbbreviation(meridianName, pointNumber);
      const element = getElementFromMeridian(meridianName);
      const location =
        currentCardData.location || currentCardData["Anatomical Location"];
      const healingFunction =
        currentCardData.healingFunction || currentCardData.healing;
      const martialApplication =
        currentCardData.martialApplication || currentCardData.application;
      const insightText = currentCardData.insight;
      const isBilateral =
        currentCardData.bilateral === true ||
        currentCardData.bilateral === "true";

      console.log("✅ Card properties computed:", {
        pointNumber,
        nameHangul,
        nameRomanized,
        nameEnglish,
        meridianName,
        location,
        healingFunction,
        martialApplication,
      });

      return {
        pointNumber,
        nameHangul,
        nameRomanized,
        nameEnglish,
        meridianName,
        meridianAbbrev,
        element,
        location,
        healingFunction,
        martialApplication,
        insightText,
        isBilateral,
      };
    }, [currentCardData, currentCard]);

    // Notify parent of card changes
    useEffect(() => {
      if (onCardChange && currentCardData) {
        onCardChange(currentCardData);
      }
    }, [onCardChange, currentCardData]);

    // Initialize pronunciation manager and load progress
    useEffect(() => {
      const initialize = async () => {
        try {
          const manager = new PronunciationManager();
          await manager.loadVoices();
          setPronunciation(manager);
          const progressData = await ProgressTracker.getProgress();
          setProgress(progressData);
          setError(null);
        } catch (error) {
          console.error("Failed to initialize:", error);
          setError("Initialization failed. Please try refreshing.");
        }
      };
      initialize();
    }, []);
    // Load flashcards based on session mode
    useEffect(() => {
      const loadCards = async () => {
        setIsLoading(true);
        setError(null);
        console.log("🔄 Loading cards for sessionMode:", sessionMode);
        console.log("🔄 Current flashcards state:", flashcards.length);
        try {
          let cards = [];

          // Default behavior: show all pressure points (no Hohn Soo) unless specific session mode
          if (
            !sessionMode ||
            sessionMode === "all" ||
            sessionMode === "flashcards"
          ) {
            cards = await getAllPoints();
            // Filter out Hohn Soo points - they should only appear in Maek sessions
            cards = cards.filter((card) => {
              const pointName = (
                card.nameEnglish ||
                card.english ||
                ""
              ).toLowerCase();
              return (
                !pointName.includes("hohn soo") &&
                !pointName.includes("hoan su")
              );
            });
          } else if (sessionMode.startsWith("meridian-")) {
            const meridian = sessionMode.replace("meridian-", "");
            cards = await getPointsByMeridian(meridian);
            // Filter out Hohn Soo points from meridian sessions too
            cards = cards.filter((card) => {
              const pointName = (
                card.nameEnglish ||
                card.english ||
                ""
              ).toLowerCase();
              return (
                !pointName.includes("hohn soo") &&
                !pointName.includes("hoan su")
              );
            });
          } else if (sessionMode.startsWith("region-")) {
            const region = sessionMode.replace("region-", "");
            cards = await getPointsByRegion(region);
          } else if (sessionMode.startsWith("theme-")) {
            const theme = sessionMode.replace("theme-", "");
            cards = await getPointsByTheme(theme);
          } else if (sessionMode === "maek-chi-ki") {
            cards = await getMaekChiKiPoints();
          } else if (sessionMode === "maek-cha-ki") {
            cards = await getMaekChaKiPoints();
          } else {
            // Fallback: all pressure points without Hohn Soo
            cards = await getAllPoints();
            cards = cards.filter((card) => {
              const pointName = (
                card.nameEnglish ||
                card.english ||
                ""
              ).toLowerCase();
              return (
                !pointName.includes("hohn soo") &&
                !pointName.includes("hoan su")
              );
            });
          }
          if (!cards || cards.length === 0) {
            throw new Error("No cards available for selected mode.");
          }

          console.log("✅ Cards loaded successfully:", cards.length);
          console.log("✅ First card sample:", cards[0]);
          console.log("✅ First card keys:", Object.keys(cards[0] || {}));

          if (!Array.isArray(cards)) {
            console.error("Cards is not an array:", cards);
            throw new Error("Invalid card data format.");
          }

          // Only shuffle if shuffleMode is explicitly enabled
          if (shuffleMode) {
            for (let i = cards.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [cards[i], cards[j]] = [cards[j], cards[i]];
            }
          }
          setFlashcards(cards);
          setCurrentCard(0);
          setIsFlipped(false); // Always start with front side
          setError(null);
          console.log(
            "✅ Flashcards state updated, total cards:",
            cards.length,
          );
        } catch (error) {
          console.error("❌ Failed to load flashcards:", error);
          setError(error.message || "Failed to load flashcards.");
          setFlashcards([]);
        } finally {
          setIsLoading(false);
        }
      };

      loadCards();
    }, [sessionMode, shuffleMode]);

    // Update progress when card changes and load stats for current card
    useEffect(() => {
      if (flashcards.length > 0 && currentCard < flashcards.length) {
        const card = flashcards[currentCard];
        if (card) {
          try {
            const stats = ProgressTracker.getPointStats(card.id);
            setUserStats(stats);
            // Reset flip when card changes
            setIsFlipped(false);
          } catch (error) {
            console.error("Failed to load user stats:", error);
          }
        }
      }
    }, [currentCard, flashcards]);

    // Handle navigation from BodyMap with selectedPointId
    useEffect(() => {
      if (selectedPointId && flashcards.length > 0) {
        const pointIndex = flashcards.findIndex(
          (card) => card.id === selectedPointId,
        );
        if (pointIndex !== -1) {
          setCurrentCard(pointIndex);
          setIsFlipped(false);
        }
      }
    }, [selectedPointId, flashcards]);

    // Setup touch gestures for mobile navigation - TEMPORARILY DISABLED
    /*
  useEffect(() => {
    if (!cardContainerRef.current || !setupTouchGestures) return;
    
    try {
      const cleanup = setupTouchGestures(cardContainerRef.current, {
        onSwipeLeft: nextCard,
        onSwipeRight: prevCard,
        onTap: flipCard,
        threshold: 50 // Adjust sensitivity as needed
      });
      
      return cleanup;
    } catch (error) {
      console.warn('Touch gestures setup failed:', error);
      return () => {};
    }
  }, [nextCard, prevCard, flipCard])
  */

    const handlePronunciation = useCallback(
      async (text, isKorean = false) => {
        if (!pronunciation) return;

        try {
          if (isKorean) {
            await pronunciation.speakKorean(text);
          } else {
            await pronunciation.speakEnglish(text);
          }
        } catch (error) {
          console.error("Pronunciation failed:", error);
        }
      },
      [pronunciation],
    );
    const handlePronunciationBreakdown = useCallback(() => {
      if (
        !pronunciation ||
        !flashcards.length ||
        currentCard >= flashcards.length
      )
        return;

      const currentCardData = flashcards[currentCard];
      if (!currentCardData) return;

      const romanized =
        currentCardData.romanized || currentCardData.nameRomanized;
      if (!romanized) return;

      try {
        const breakdown = pronunciation.breakdownRomanized(romanized);
        setPronunciationBreakdown(breakdown);
        setShowPronunciationModal(true);
      } catch (error) {
        console.error("Failed to create pronunciation breakdown:", error);
      }
    }, [pronunciation, flashcards, currentCard]);

    const handleFlag = useCallback(() => {
      setShowFlagModal(true);
      setFlagSubmitted(false);
      setFlagReason("");
    }, []);
    const submitFlag = useCallback(() => {
      if (!flagReason.trim()) return;

      try {
        const flaggedIssues = JSON.parse(
          localStorage.getItem("flaggedIssues") || "[]",
        );
        const newFlag = {
          id: Date.now(),
          pointId: flashcards[currentCard]?.id,
          pointNumber: flashcards[currentCard]?.point_number,
          reason: flagReason,
          timestamp: new Date().toISOString(),
        };
        flaggedIssues.push(newFlag);
        localStorage.setItem("flaggedIssues", JSON.stringify(flaggedIssues));
        setFlagSubmitted(true);
        setTimeout(() => setShowFlagModal(false), 2000);
      } catch (error) {
        console.error("Failed to save flag:", error);
      }
    }, [flagReason, flashcards, currentCard]);

    const closeFlagModal = useCallback(() => {
      setShowFlagModal(false);
      setFlagReason("");
      setFlagSubmitted(false);
    }, []);

    const startQuiz = useCallback(() => {
      navigateTo("quiz", { sessionMode });
    }, [navigateTo, sessionMode]);

    // Loading state
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-yellow-400">Loading flashcards...</p>
          </div>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => navigateTo("daily-session")}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-2 px-4 rounded-lg"
            >
              Back to Sessions
            </button>
          </div>
        </div>
      );
    }

    // No cards state
    if (flashcards.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-yellow-400 mb-4">
              No flashcards found for this selection.
            </p>
            <button
              onClick={() => navigateTo("daily-session")}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-2 px-4 rounded-lg"
            >
              Choose Another Session
            </button>{" "}
          </div>
        </div>
      );
    }

    if (!currentCardData || !cardProperties) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-red-400 mb-4">
              Error displaying card. Please try again.
            </p>
            <button
              onClick={() => navigateTo("daily-session")}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-2 px-4 rounded-lg"
            >
              Choose Another Session
            </button>{" "}
          </div>
        </div>
      );
    }

    // Extract properties from memoized object
    const {
      pointNumber,
      nameHangul,
      nameRomanized,
      nameEnglish,
      meridianName,
      meridianAbbrev,
      element,
      location,
      healingFunction,
      martialApplication,
      insightText,
      isBilateral,
    } = cardProperties;
    return (
      <div className="min-h-screen bg-black text-white relative mobile-safe">
        {" "}
        {/* Header - Logo left, title center, progress right */}
        <div className="flex items-center justify-between p-3 sm:p-4 mobile-header-safe">
          {/* Logo Home Button - Left side, smaller size */}
          <button
            onClick={() => navigateTo("home")}
            className="text-yellow-400 hover:text-yellow-300 transition-colors"
            aria-label="Go to Home"
          >
            <Logo className="w-8 h-8" />
          </button>

          {/* Centered title */}
          <div className="flex-1 text-center">
            <h1 className="text-base sm:text-lg font-bold text-yellow-400">
              MERIDIAN
            </h1>
            <p className="text-xs sm:text-sm text-yellow-400 opacity-80">
              MASTERY COACH
            </p>
          </div>

          {/* Progress counter - Right side */}
          <div className="text-yellow-400 text-xs sm:text-sm font-medium">
            {currentCard + 1} / {flashcards.length}
          </div>
        </div>{" "}
        {/* Study Session Progress Bar - Clean without borders */}
        <div className="w-full p-3 sm:p-4">
          <div className="w-full max-w-sm sm:max-w-md mx-auto">
            <div className="bg-gray-800 rounded-full h-1.5 sm:h-2">
              <div
                className="bg-yellow-400 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentCard + 1) / flashcards.length) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-center text-gray-400 text-xs sm:text-sm mt-2">
              {sessionMode.includes("meridian")
                ? "Meridian Study"
                : sessionMode.includes("maek")
                  ? sessionMode.replace("-", " ").toUpperCase()
                  : "Study Session"}
            </div>
          </div>
        </div>
        {/* Main Content - moved up closer to study session bar */}
        <div className="flex flex-col items-center justify-start min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-160px)] px-2 sm:px-3 pt-0">
          {" "}
          {/* Flashcard - optimized positioning for mobile */}
          <div className="w-full max-w-sm sm:max-w-md mx-auto mt-1 sm:mt-2">
            <div
              ref={cardContainerRef}
              className={`relative w-full h-[25rem] sm:h-[30rem] md:h-[32rem] transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
              style={{ minHeight: getOptimalTouchTargetSize().minHeight }}
            >
              {/* Front Side - mobile optimized */}
              <div className="absolute inset-0 w-full h-full backface-hidden">
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-xl h-full flex flex-col justify-center items-center p-4 sm:p-6 relative">
                  {/* Meridian badge with element colors at top - mobile responsive */}
                  <div
                    className={`absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 ${getElementColors(element).bg} ${getElementColors(element).text} px-2 sm:px-4 py-1 sm:py-2 rounded-lg border-2 ${getElementColors(element).border}`}
                  >
                    <span className="text-xs sm:text-sm font-bold">
                      {meridianAbbrev} • {element.toUpperCase()}
                      {isBilateral ? " ⇔" : ""}
                    </span>
                  </div>
                  {/* Pronunciation button - mobile optimized */}
                  {pronunciation && (
                    <button
                      onClick={() =>
                        handlePronunciation(nameHangul || nameRomanized, true)
                      }
                      className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-yellow-600 hover:bg-yellow-700 text-black p-1.5 sm:p-2 rounded-full transition-colors"
                      aria-label="Play pronunciation"
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.797L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.797A1 1 0 019.383 3.076zM12 5a1 1 0 011.414 0C14.495 6.081 15 7.448 15 9s-.505 2.919-1.586 4a1 1 0 01-1.414-1.414C12.63 10.927 13 10.017 13 9s-.37-1.927-1-2.586A1 1 0 0112 5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                  {/* Korean characters - responsive sizing */}
                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-yellow-400 mb-3 sm:mb-4 text-center mt-8 sm:mt-12 md:mt-16">
                    {nameHangul}
                  </div>
                  {/* English translation - responsive */}
                  <div className="text-lg sm:text-xl text-white text-center font-medium px-2">
                    {nameEnglish}
                  </div>{" "}
                  {/* Romanized Korean - responsive */}
                  <div className="text-sm sm:text-base text-gray-300 text-center mt-1 sm:mt-2 px-2">
                    {nameRomanized}
                  </div>
                  {/* Pronunciation breakdown button - styled to match approved design */}
                  {pronunciation && nameRomanized && (
                    <div className="mt-3 sm:mt-4 flex justify-center">
                      <button
                        onClick={handlePronunciationBreakdown}
                        className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors"
                        aria-label="Learn pronunciation"
                      >
                        📖 Learn Pronunciation
                      </button>
                    </div>
                  )}
                </div>
              </div>{" "}
              {/* Back Side - full content with proper mobile layout */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400 rounded-xl h-full p-2.5 text-xs flex flex-col overflow-hidden">
                  {/* Header with point info - readable but compact */}
                  <div className="text-center mb-1.5 border-b border-gray-700 pb-1 flex-shrink-0">
                    <h2 className="text-sm font-bold text-yellow-400 mb-0.5 leading-tight">
                      {nameRomanized || nameEnglish}
                    </h2>
                    <p className="text-gray-300 text-xs">{nameHangul}</p>
                    <p className="text-gray-400 text-xs">
                      {pointNumber} {meridianName} Meridian
                    </p>
                  </div>

                  {/* Information sections - full content with scroll if needed */}
                  <div className="flex-1 space-y-1.5 overflow-y-auto min-h-0">
                    {/* Location - Full content */}
                    {location && (
                      <div className="bg-yellow-600 text-black p-2 rounded">
                        <h3 className="font-bold text-xs mb-1">LOCATION:</h3>
                        <p className="text-xs leading-relaxed">{location}</p>
                      </div>
                    )}
                    {/* Striking Effect - Full content */}
                    <div className="bg-yellow-600 text-black p-2 rounded">
                      <h3 className="font-bold text-xs mb-1">
                        STRIKING EFFECT:
                      </h3>
                      <p className="text-xs leading-relaxed">
                        {martialApplication ||
                          "The point is usually struck to an upward direction with a blunt edge."}
                      </p>
                    </div>
                    {/* Observed Effects - Full content */}
                    <div className="bg-yellow-600 text-black p-2 rounded">
                      <h3 className="font-bold text-xs mb-1">
                        OBSERVED EFFECTS:
                      </h3>
                      <p className="text-xs leading-relaxed">
                        {healingFunction ||
                          "Light to moderate knockout. Liver dysfunction in theory. Be responsible."}
                      </p>
                    </div>
                    {/* Insight - with expand option for very long content */}
                    <div className="bg-yellow-600 text-black p-2 rounded">
                      <h3 className="font-bold text-xs mb-1">INSIGHT:</h3>
                      <p className="text-xs leading-relaxed">
                        {insightText && insightText.length > 150
                          ? insightText.substring(0, 150) + "..."
                          : insightText ||
                            "This point has the potential to affect the associated meridian. Be responsible."}
                      </p>
                      {insightText && insightText.length > 150 && (
                        <button
                          className="text-xs underline mt-1 hover:text-gray-800"
                          onClick={() => setShowInsightModal(true)}
                        >
                          Read more
                        </button>
                      )}
                    </div>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4 mt-3 sm:mt-4">
            {/* Audio button */}
            {pronunciation && (
              <button
                onClick={() =>
                  handlePronunciation(nameHangul || nameRomanized, true)
                }
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full"
                aria-label="Play pronunciation"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.797L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.797A1 1 0 019.383 3.076zM12 5a1 1 0 011.414 0C14.495 6.081 15 7.448 15 9s-.505 2.919-1.586 4a1 1 0 01-1.414-1.414C12.63 10.927 13 10.017 13 9s-.37-1.927-1-2.586A1 1 0 0112 5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            {/* Previous button */}
            <button
              onClick={prevCard}
              className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full"
              aria-label="Previous card"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Flip button */}
            <button
              onClick={flipCard}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3 px-6 rounded-lg"
            >
              FLIP
            </button>

            {/* Next button */}
            <button
              onClick={nextCard}
              className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full"
              aria-label="Next card"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Flag button */}
            <button
              onClick={handleFlag}
              className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full"
              aria-label="Flag issue"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 01.707 1.707L13.414 9l3.293 3.293A1 1 0 0116 14H4a1 1 0 01-1-1V5z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Flag Issue Modal */}
        {showFlagModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm">
              <h3 className="text-lg font-semibold text-white mb-4">
                Flag Issue
              </h3>
              {flagSubmitted ? (
                <p className="text-green-400 text-center">
                  Issue reported successfully!
                </p>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm">
                    Report an issue with this flashcard:
                  </p>
                  <textarea
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-500"
                    rows="4"
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    placeholder="Describe the issue..."
                  ></textarea>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={closeFlagModal}
                      className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitFlag}
                      disabled={!flagReason.trim()}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm disabled:opacity-50"
                    >
                      Submit Flag
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Insight Modal */}
        {showInsightModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-bold text-yellow-400">
                  Point Insight
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  {nameRomanized || nameEnglish}
                </p>
              </div>
              <div className="p-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {insightText ||
                    "This point has the potential to affect the associated meridian. Be responsible."}
                </p>
              </div>
              <div className="p-4 border-t border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowInsightModal(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Pronunciation Breakdown Modal */}
        {showPronunciationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-bold text-yellow-400">
                  Pronunciation Guide
                </h3>
                <p className="text-sm text-gray-300 mt-1">{nameRomanized}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Break down each syllable to learn proper pronunciation
                </p>
              </div>
              <div className="p-4 space-y-3">
                {pronunciationBreakdown.map((syllableObj, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-400 font-bold text-lg">
                        {syllableObj.syllable}
                      </span>
                      <span className="text-gray-400 text-xs">
                        Syllable {index + 1}
                      </span>
                    </div>
                    <div className="text-gray-300 text-sm">
                      <span className="font-medium">How to say:</span>{" "}
                      {syllableObj.pronunciation}
                    </div>
                  </div>
                ))}

                {pronunciationBreakdown.length === 0 && (
                  <div className="text-center text-gray-400 py-4">
                    <p>No pronunciation breakdown available for this term.</p>
                  </div>
                )}

                <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 rounded-lg">
                  <h4 className="text-yellow-400 font-semibold text-sm mb-1">
                    💡 Tip:
                  </h4>
                  <p className="text-gray-300 text-xs">
                    Practice each syllable slowly, then combine them smoothly.
                    Use the audio button on the flashcard to hear the full
                    pronunciation.
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowPronunciationModal(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg text-sm"
                >
                  Close
                </button>
              </div>{" "}
            </div>
          </div>
        )}
      </div>
    );
  },
);

// Add display name for debugging
Flashcard.displayName = "Flashcard";

export default Flashcard;
