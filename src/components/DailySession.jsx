import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { ProgressTracker } from "../utils/progressTracker";
import Logo from "./Logo";
import { getOptimalTouchTargetSize } from "../utils/mobileOptimization";

// Memoized study mode components for performance
const StudyModeCard = memo(({ mode, isSelected, onSelect, isNavigating }) => {
  const touchSize = getOptimalTouchTargetSize();

  return (
    <button
      onClick={() => onSelect(mode.id)}
      disabled={isNavigating}
      className={`p-3 sm:p-4 border-2 rounded-lg transition-all duration-200 text-left w-full ${
        isSelected
          ? "border-yellow-400 bg-yellow-400 bg-opacity-20"
          : "border-gray-600 hover:border-yellow-400 hover:border-opacity-50"
      } ${isNavigating ? "opacity-50 cursor-not-allowed" : ""}`}
      style={{ minHeight: touchSize.minHeight, minWidth: touchSize.minWidth }}
    >
      <h3 className="text-sm sm:text-base font-semibold text-yellow-400 mb-1">
        {mode.name}
      </h3>
      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
        {mode.description}
      </p>
    </button>
  );
});

const HiddenModeCard = memo(({ mode, onStart, isNavigating }) => {
  const touchSize = getOptimalTouchTargetSize();

  return (
    <button
      onClick={() => onStart(mode.id)}
      disabled={isNavigating}
      className={`bg-gradient-to-br from-red-800 to-red-900 border-2 border-red-600 p-3 sm:p-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 text-center ${
        isNavigating ? "opacity-50 cursor-not-allowed" : ""
      }`}
      style={{ minHeight: touchSize.minHeight, minWidth: touchSize.minWidth }}
    >
      <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{mode.icon}</div>
      <h3 className="text-sm sm:text-base font-bold text-yellow-400 mb-1">
        {mode.name}
      </h3>
      <p className="text-xs text-gray-300">{mode.description}</p>
    </button>
  );
});

const DailySession = memo(({ navigateTo }) => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState(null);

  // Memoized study mode configurations
  const studyModes = useMemo(
    () => [
      {
        id: "meridian",
        name: "By Meridian",
        description: "Study points organized by meridian pathways",
      },
      {
        id: "region",
        name: "By Region",
        description: "Study points by body regions",
      },
      {
        id: "theme",
        name: "By Theme",
        description: "Study points by healing themes",
      },
    ],
    [],
  );

  const hiddenModes = useMemo(
    () => [
      {
        id: "maek-chi-ki",
        name: "Maek Chi Ki",
        icon: "👊",
        description: "Fist techniques",
      },
      {
        id: "maek-cha-ki",
        name: "Maek Cha Ki",
        icon: "🦶",
        description: "Foot techniques",
      },
    ],
    [],
  );
  // Memoized navigation handlers for better performance
  const handleStartSession = useCallback(
    (sessionMode) => {
      if (isNavigating) return;

      setIsNavigating(true);
      setError(null);

      try {
        // Validate mode
        if (!sessionMode) {
          throw new Error("Please select a study mode");
        }

        // Track session completion
        ProgressTracker.completeSession(sessionMode);

        // Navigate to flashcards
        navigateTo("flashcards", {
          sessionMode: sessionMode,
          shuffleMode: shuffleMode,
        });
      } catch (error) {
        console.error("Failed to start session:", error);
        setError("Failed to start session. Please try again.");
        setIsNavigating(false);
      }
    },
    [navigateTo, shuffleMode, isNavigating],
  );

  const handleStartQuiz = useCallback(
    (mode) => {
      if (isNavigating) return;

      setIsNavigating(true);
      setError(null);

      try {
        // Validate mode
        if (!mode) {
          throw new Error("Please select a study mode");
        }

        // Track session completion
        ProgressTracker.completeSession(`quiz-${mode}`);

        // Navigate to quiz
        navigateTo("quiz", { sessionMode: mode, shuffleMode });
      } catch (error) {
        console.error("Failed to start quiz:", error);
        setError(error.message);
        setIsNavigating(false);
      }
    },
    [navigateTo, isNavigating],
  );

  const handleModeSelection = useCallback((mode) => {
    setSelectedMode(mode);
    setError(null);
  }, []);

  const toggleShuffleMode = useCallback(() => {
    setShuffleMode((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {" "}
        {/* Header */}
        <header className="text-center mb-8">
          {" "}
          <button
            onClick={() => navigateTo("home")}
            disabled={isNavigating}
            className={`mb-4 text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center ${
              isNavigating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Go to Home"
          >
            <Logo />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Daily Session</h1>
          <p className="text-gray-300">Choose your study mode</p>
        </header>{" "}
        {/* Error Display */}
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}{" "}
        {/* Study Mode Selection Grid */}
        <div className="max-w-lg mx-auto mb-8">
          {/* Top Row: BY REGION */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setSelectedMode("region")}
              disabled={isNavigating}
              className={`px-8 py-3 rounded-lg border transition-all duration-200 ${
                selectedMode === "region"
                  ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                  : "border-gray-600 hover:border-gray-500 text-white"
              } ${isNavigating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              BY REGION
            </button>
          </div>{" "}
          {/* Middle Row: Hidden Mode + BY THEME + Hidden Mode */}
          <div className="flex justify-between items-center mb-4">
            {" "}
            {/* Left Hidden: Maek Chi Ki */}
            <button
              onClick={() => setSelectedMode("maek-chi-ki")}
              disabled={isNavigating}
              className={`flex flex-col items-center space-y-2 transition-all duration-200 group ${
                selectedMode === "maek-chi-ki"
                  ? "text-red-400"
                  : "text-gray-400 hover:text-red-400"
              } ${isNavigating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div
                className={`relative w-12 h-12 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  selectedMode === "maek-chi-ki"
                    ? "border-red-400 shadow-lg shadow-red-400/30"
                    : "border-red-700 group-hover:border-red-500"
                }`}
              >
                {/* Triple spiral background pattern */}
                <div className="absolute inset-1 rounded-full border border-red-600/30"></div>
                <div className="absolute inset-2 rounded-full border border-red-500/20"></div>
                {/* Fist icon */}
                <span className="text-xl">👊</span>
              </div>
              <span className="text-xs font-medium">MAEK CHI KI</span>
            </button>
            {/* Center: BY THEME */}
            <button
              onClick={() => setSelectedMode("theme")}
              disabled={isNavigating}
              className={`px-8 py-3 rounded-lg border transition-all duration-200 ${
                selectedMode === "theme"
                  ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                  : "border-gray-600 hover:border-gray-500 text-white"
              } ${isNavigating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              BY THEME
            </button>{" "}
            {/* Right Hidden: Maek Cha Ki */}
            <button
              onClick={() => setSelectedMode("maek-cha-ki")}
              disabled={isNavigating}
              className={`flex flex-col items-center space-y-2 transition-all duration-200 group ${
                selectedMode === "maek-cha-ki"
                  ? "text-red-400"
                  : "text-gray-400 hover:text-red-400"
              } ${isNavigating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div
                className={`relative w-12 h-12 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  selectedMode === "maek-cha-ki"
                    ? "border-red-400 shadow-lg shadow-red-400/30"
                    : "border-red-700 group-hover:border-red-500"
                }`}
              >
                {/* Triple spiral background pattern */}
                <div className="absolute inset-1 rounded-full border border-red-600/30"></div>
                <div className="absolute inset-2 rounded-full border border-red-500/20"></div>
                {/* Foot icon */}
                <span className="text-xl">🦶</span>
              </div>
              <span className="text-xs font-medium">MAEK CHA KI</span>
            </button>
          </div>
          {/* Bottom Row: BY MERIDIAN */}
          <div className="flex justify-center">
            <button
              onClick={() => setSelectedMode("meridian")}
              disabled={isNavigating}
              className={`px-8 py-3 rounded-lg border transition-all duration-200 ${
                selectedMode === "meridian"
                  ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                  : "border-gray-600 hover:border-gray-500 text-white"
              } ${isNavigating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              BY MERIDIAN
            </button>
          </div>
        </div>
        {/* Region Selection (when BY REGION is selected) */}
        {selectedMode === "region" && (
          <div className="max-w-md mx-auto mb-8">
            <p className="text-center text-yellow-400 mb-4">
              Select a region to train.
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { id: "head", name: "Head & Neck" },
                { id: "chest", name: "Chest & Abdomen" },
                { id: "arms", name: "Arms" },
                { id: "legs", name: "Legs" },
              ].map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedMode(`region-${region.id}`)}
                  disabled={isNavigating}
                  className={`py-2 px-3 text-yellow-400 hover:text-yellow-300 border border-yellow-400/30 rounded hover:border-yellow-400/60 transition-all duration-200 ${
                    isNavigating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Meridian Selection (when BY MERIDIAN is selected) */}
        {selectedMode === "meridian" && (
          <div className="max-w-md mx-auto mb-8">
            <p className="text-center text-yellow-400 mb-4">
              Select a meridian to train.
            </p>{" "}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                "Lung (LU)",
                "Large Intestine (LI)",
                "Stomach (ST)",
                "Spleen (SP)",
                "Heart (HT)",
                "Small Intestine (SI)",
                "Urinary Bladder (UB)",
                "Kidney (KI)",
                "Pericardium (PC)",
                "Triple Burner (TB)",
                "Gallbladder (GB)",
                "Liver (LV)",
                "Conception Vessel (CV)",
                "Governing Vessel (GV)",
              ].map((meridian) => (
                <button
                  key={meridian}
                  onClick={() => setSelectedMode(`meridian-${meridian}`)}
                  disabled={isNavigating}
                  className={`py-2 px-3 text-yellow-400 hover:text-yellow-300 border border-yellow-400/30 rounded hover:border-yellow-400/60 transition-all duration-200 ${
                    isNavigating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {meridian}
                </button>
              ))}
            </div>
          </div>
        )}{" "}
        {/* Start Buttons */}
        {selectedMode && (
          <div className="max-w-md mx-auto space-y-3">
            {/* Shuffle Mode Toggle - only show for modes that support it */}
            {!selectedMode.includes("maek-chi-ki") &&
              !selectedMode.includes("maek-cha-ki") && (
                <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Study Mode</h3>
                      <p className="text-gray-400 text-sm">
                        {shuffleMode
                          ? "Random order for mixed practice"
                          : "Natural order for systematic learning"}
                      </p>
                    </div>
                    <button
                      onClick={() => setShuffleMode(!shuffleMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        shuffleMode ? "bg-yellow-500" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          shuffleMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span className={!shuffleMode ? "text-yellow-400" : ""}>
                      Ordered
                    </span>
                    <span className={shuffleMode ? "text-yellow-400" : ""}>
                      Shuffle
                    </span>
                  </div>
                </div>
              )}

            <button
              onClick={() => handleStartSession(selectedMode)}
              disabled={isNavigating}
              className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 ${
                isNavigating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              BEGIN FLASHCARDS
            </button>

            <button
              onClick={() => handleStartQuiz(selectedMode)}
              disabled={isNavigating}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 ${
                isNavigating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              🧠 START QUIZ MODE
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

DailySession.displayName = "DailySession";

export default DailySession;
