import React, { useState, useEffect } from "react";
import {
  getAllPoints,
  getPointsByMeridian,
  getPointsByRegion,
  getPointsByTheme,
  getMaekChiKiPoints,
  getMaekChaKiPoints,
} from "../utils/dataLoader";
import { ProgressTracker } from "../utils/progressTracker";
import PronunciationManager from "../utils/pronunciation";
import TriskelionLogo from "./TriskelionLogo";

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

const Flashcard = ({
  navigateTo,
  selectedPointId,
  sessionMode,
  shuffleMode = false,
}) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userStats, setUserStats] = useState({});
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flagSubmitted, setFlagSubmitted] = useState(false);
  const [pronunciation, setPronunciation] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize pronunciation manager and load progress
  useEffect(() => {
    const initialize = async () => {
      try {
        const manager = new PronunciationManager();
        await manager.loadVoices();
        setPronunciation(manager);
        setProgress(ProgressTracker.getProgress());
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
      try {
        let cards = [];

        if (!sessionMode || sessionMode === "all") {
          cards = getAllPoints();
        } else if (sessionMode.startsWith("meridian-")) {
          const meridian = sessionMode.replace("meridian-", "");
          cards = getPointsByMeridian(meridian);
        } else if (sessionMode.startsWith("region-")) {
          const region = sessionMode.replace("region-", "");
          cards = getPointsByRegion(region);
        } else if (sessionMode.startsWith("theme-")) {
          const theme = sessionMode.replace("theme-", "");
          cards = getPointsByTheme(theme);
        } else if (sessionMode === "maek-chi-ki") {
          cards = getMaekChiKiPoints();
        } else if (sessionMode === "maek-cha-ki") {
          cards = getMaekChaKiPoints();
        } else {
          cards = getAllPoints();
        }

        if (!cards || cards.length === 0) {
          throw new Error("No cards available for selected mode.");
        }

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
        setIsFlipped(false);
        setError(null);
      } catch (error) {
        console.error("Failed to load flashcards:", error);
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

  const nextCard = () => {
    if (flashcards.length === 0) return;

    // Record study event
    if (flashcards.length > 0 && currentCard < flashcards.length) {
      const card = flashcards[currentCard];
      if (card) {
        try {
          ProgressTracker.studyPoint(card.id, card.meridian);
          setProgress(ProgressTracker.getProgress());
        } catch (error) {
          console.error("Failed to update progress:", error);
        }
      }
    }

    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    if (flashcards.length === 0) return;
    setIsFlipped(false);
    setCurrentCard(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length,
    );
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePronunciation = async (text, isKorean = false) => {
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
  };

  const handleFlag = () => {
    setShowFlagModal(true);
    setFlagSubmitted(false);
    setFlagReason("");
  };

  const submitFlag = () => {
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
  };

  const closeFlagModal = () => {
    setShowFlagModal(false);
    setFlagReason("");
    setFlagSubmitted(false);
  };

  const startQuiz = () => {
    navigateTo("quiz", { sessionMode });
  };

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
          </button>
        </div>
      </div>
    );
  }

  const currentCardData = flashcards[currentCard];
  if (!currentCardData) {
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
          </button>
        </div>
      </div>
    );
  }

  // Get card data
  const pointNumber = currentCardData.point_number || currentCardData.number;
  const nameHangul = currentCardData.hangul || currentCardData.nameHangul;
  const nameRomanized =
    currentCardData.romanized || currentCardData.nameRomanized;
  const nameEnglish = currentCardData.english || currentCardData.nameEnglish;
  const meridianName = currentCardData.meridian;
  const element = getElementFromMeridian(meridianName);
  const location =
    currentCardData.location || currentCardData["Anatomical Location"];
  const healingFunction =
    currentCardData.healingFunction || currentCardData["Healing Function"];
  const martialApplication =
    currentCardData.martialApplication ||
    currentCardData["Martial Application"];
  const insightText = currentCardData.insight;
  const isBilateral =
    currentCardData.bilateral === true || currentCardData.bilateral === "Yes";

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header - matching mockup */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {/* Logo and title - clickable to go home */}
        <button
          onClick={() => navigateTo("home")}
          className="flex items-center space-x-3 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <TriskelionLogo size={32} />
          <div className="text-left">
            <h1 className="text-lg font-bold">MERIDIAN</h1>
            <p className="text-sm opacity-80">MASTERY COACH</p>
          </div>
        </button>

        {/* Progress counter */}
        <div className="text-yellow-400 text-sm">
          {currentCard + 1} / {flashcards.length}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
        {/* Progress Bar */}
        <div className="w-full max-w-md mb-6">
          <div className="bg-gray-800 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentCard + 1) / flashcards.length) * 100}%`,
              }}
            ></div>
          </div>
          <div className="text-center text-gray-400 text-sm mt-2">
            {sessionMode.includes("meridian")
              ? "Meridian Study"
              : sessionMode.includes("maek")
                ? sessionMode.replace("-", " ").toUpperCase()
                : "Study Session"}
          </div>
        </div>

        {/* Flashcard */}
        <div className="w-full max-w-md mx-auto">
          <div
            className={`relative w-full h-96 transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
          >
            {/* Front Side - matching mockup design exactly */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-xl h-full flex flex-col justify-center items-center p-6 relative">
                {/* Element badge in corner */}
                <div className="absolute top-4 right-4 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                  {element.toUpperCase()}
                </div>

                {/* Point number in red box at top */}
                <div className="bg-red-600 text-white px-6 py-2 rounded-lg mb-6">
                  <span className="text-xl font-bold">
                    {pointNumber}
                    {isBilateral ? " ⇔" : ""}
                  </span>
                </div>

                {/* Korean characters - large and prominent */}
                <div className="text-6xl font-bold text-yellow-400 mb-4 text-center">
                  {nameHangul}
                </div>

                {/* English translation */}
                <div className="text-xl text-white text-center">
                  {nameEnglish}
                </div>

                {/* Romanized Korean */}
                <div className="text-lg text-gray-300 text-center mt-2">
                  {nameRomanized}
                </div>
              </div>
            </div>

            {/* Back Side - matching detailed mockup */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400 rounded-xl h-full p-4 text-sm overflow-y-auto">
                {/* Header with point info */}
                <div className="text-center mb-4">
                  <h2 className="text-lg font-bold text-yellow-400 mb-1">
                    {nameRomanized || nameEnglish}
                  </h2>
                  <p className="text-gray-300">
                    {pointNumber} {meridianName} Meridian
                  </p>
                </div>

                {/* Information sections */}
                <div className="space-y-3">
                  {/* Striking Effect */}
                  {martialApplication && (
                    <div className="bg-yellow-600 text-black p-2 rounded">
                      <h3 className="font-bold text-xs mb-1">
                        STRIKING EFFECT:
                      </h3>
                      <p className="text-xs">{martialApplication}</p>
                    </div>
                  )}

                  {/* Observed Effects */}
                  {healingFunction && (
                    <div className="bg-yellow-600 text-black p-2 rounded">
                      <h3 className="font-bold text-xs mb-1">
                        OBSERVED EFFECTS OF STRIKE:
                      </h3>
                      <p className="text-xs">{healingFunction}</p>
                    </div>
                  )}

                  {/* Theoretical Effects */}
                  <div className="bg-yellow-600 text-black p-2 rounded">
                    <h3 className="font-bold text-xs mb-1">
                      THEORETICAL EFFECTS:
                    </h3>
                    <p className="text-xs">May cause a knockout.</p>
                  </div>

                  {/* CPT Guided Insight */}
                  {insightText && (
                    <div className="bg-yellow-600 text-black p-2 rounded">
                      <h3 className="font-bold text-xs mb-1">
                        CPT GUIDED INSIGHT:
                      </h3>
                      <p className="text-xs">{insightText}</p>
                    </div>
                  )}

                  {/* Location */}
                  {location && (
                    <div className="text-gray-300">
                      <h3 className="font-bold text-yellow-400 text-xs mb-1">
                        LOCATION:
                      </h3>
                      <p className="text-xs">{location}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          {/* Audio button */}
          {pronunciation && (
            <button
              onClick={() =>
                handlePronunciation(nameHangul || nameRomanized, true)
              }
              className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full"
              aria-label="Play pronunciation"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
    </div>
  );
};

export default Flashcard;
