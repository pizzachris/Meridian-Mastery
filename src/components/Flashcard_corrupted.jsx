import React, { useState, useEffect } from "react";
import flashcardsData from "../data/flashcards.json";
import { ProgressTracker } from "../utils/progressTracker";

const Flashcard = ({ navigateTo, selectedPointId, sessionMode }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userStats, setUserStats] = useState({});
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flagSubmitted, setFlagSubmitted] = useState(false);
  const allFlashcards = flashcardsData.flashcards;
  // Filter flashcards based on session mode
  const getFilteredFlashcards = () => {
    if (!sessionMode) return allFlashcards;

    switch (sessionMode) {
      case "meridian":
        // For now, return all cards - you can add specific meridian filtering logic here
        return allFlashcards;
      case "region":
        // Filter by body regions - you can add specific region filtering logic here
        return allFlashcards;
      case "theme":
        // Filter by healing themes - you can add specific theme filtering logic here
        return allFlashcards;
      case "maek-chi-ki":
        // Filter cards relevant for fist/hand techniques
        return allFlashcards.filter(
          (card) =>
            card.martialApplication &&
            (card.martialApplication.toLowerCase().includes("fist") ||
              card.martialApplication.toLowerCase().includes("hand") ||
              card.martialApplication.toLowerCase().includes("arm") ||
              card.martialApplication.toLowerCase().includes("finger") ||
              card.martialApplication.toLowerCase().includes("wrist") ||
              card.martialApplication.toLowerCase().includes("grip") ||
              card.martialApplication.toLowerCase().includes("strike")),
        );
      case "maek-cha-ki":
        // Filter cards relevant for foot/leg techniques
        return allFlashcards.filter(
          (card) =>
            card.martialApplication &&
            (card.martialApplication.toLowerCase().includes("foot") ||
              card.martialApplication.toLowerCase().includes("leg") ||
              card.martialApplication.toLowerCase().includes("ankle") ||
              card.martialApplication.toLowerCase().includes("knee") ||
              card.martialApplication.toLowerCase().includes("kick") ||
              card.martialApplication.toLowerCase().includes("stance") ||
              card.martialApplication.toLowerCase().includes("balance")),
        );
      default:
        return allFlashcards;
    }
  };

  const flashcards = getFilteredFlashcards();
  const card = flashcards[currentCard];

  // Handle navigation from BodyMap with selectedPointId
  useEffect(() => {
    if (selectedPointId) {
      const pointIndex = flashcards.findIndex(
        (card) => card.id === selectedPointId,
      );
      if (pointIndex !== -1) {
        setCurrentCard(pointIndex);
      }
    }
  }, [selectedPointId, flashcards]);
  // Load user stats for current card
  useEffect(() => {
    if (card) {
      const stats = ProgressTracker.getQuizStats(card.id);
      setUserStats(stats);
    }
  }, [currentCard, card]);

  const nextCard = () => {
    // Track progress when moving to next card (studying current card)
    if (card) {
      ProgressTracker.studyPoint(card.id, card.meridian);
    }
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentCard(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length,
    );
  };

  const flipCard = () => {
    // Track progress when flipping card (studying point)
    if (card && !isFlipped) {
      ProgressTracker.studyPoint(card.id, card.meridian);
    }
    setIsFlipped(!isFlipped);
  };
  const startQuiz = () => {
    navigateTo("quiz", { sessionMode: "flashcard-review" });
  };

  const handleFlag = () => {
    setShowFlagModal(true);
  };

  const submitFlag = () => {
    if (!flagReason.trim()) return;

    // Store flag data in localStorage for now (could be sent to a server in production)
    const flagData = {
      pointId: card.id,
      pointNumber: card.number,
      pointName: card.nameEnglish,
      reason: flagReason,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    // Get existing flags or initialize array
    const existingFlags = JSON.parse(
      localStorage.getItem("meridian-mastery-flags") || "[]",
    );
    existingFlags.push(flagData);
    localStorage.setItem(
      "meridian-mastery-flags",
      JSON.stringify(existingFlags),
    );

    setFlagSubmitted(true);
    setFlagReason("");

    // Auto-close modal after showing success
    setTimeout(() => {
      setShowFlagModal(false);
      setFlagSubmitted(false);
    }, 2000);
  };

  const closeFlagModal = () => {
    setShowFlagModal(false);
    setFlagReason("");
    setFlagSubmitted(false);
  };

  const getElementColor = (element) => {
    const colors = {
      wood: "border-green-500 bg-green-500/10",
      fire: "border-red-500 bg-red-500/10",
      earth: "border-yellow-500 bg-yellow-500/10",
      metal: "border-gray-400 bg-gray-400/10",
      water: "border-blue-500 bg-blue-500/10",
      violet: "border-purple-500 bg-purple-500/10",
    };
    return colors[element] || "border-gray-500 bg-gray-500/10";
  };
  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen kuk-sool-gradient text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header with Logo */}
        <header className="text-center mb-8">
          <button
            onClick={() => navigateTo(sessionMode ? "session" : "home")}
            className="inline-block mb-4 text-yellow-400 hover:text-yellow-300 text-sm font-medium"
          >
            ← Back to {sessionMode ? "Session Selection" : "Home"}
          </button>

          {/* Logo and Title */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 border-yellow-500 mr-4">
              {/* Triple spiral logo */}
              <div className="relative">
                <div className="w-8 h-8 border-2 border-yellow-400 rounded-full"></div>
                <div className="absolute inset-1 border border-yellow-400/60 rounded-full"></div>
                <div className="absolute inset-2 border border-yellow-400/30 rounded-full"></div>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">MERIDIAN</h1>
              <h2 className="text-xl text-gray-300">MASTERY COACH</h2>
            </div>
          </div>
        </header>
        {!isFlipped ? (
          // Front of card - Point Name
          <div className="text-center mb-8">
            {/* Point Number */}
            <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-6 py-2 rounded-lg inline-block mb-6 border border-yellow-600">
              <span className="font-bold">{card.number} ↔</span>
            </div>

            {/* Korean Name */}
            <div
              className="text-6xl font-bold text-yellow-400 mb-4"
              style={{ fontFamily: "serif" }}
            >
              {card.nameHangul}
            </div>

            {/* English Name */}
            <div className="text-3xl font-bold text-white mb-8">
              {card.nameEnglish}
            </div>
          </div>
        ) : (
          // Back of card - Details
          <div className="space-y-6 mb-8">
            {/* Point identifier at top */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-6 py-2 rounded-lg inline-block border border-yellow-600">
                <span className="font-bold">{card.number} ↔</span>
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mt-2">
                {card.nameRomanized}
              </h3>
              <h4 className="text-xl text-gray-300">{card.nameEnglish}</h4>
              <p className="text-sm text-gray-400 mt-1">
                {card.meridian} Meridian
              </p>
            </div>
            {/* Striking Effect */}
            <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-600 rounded-lg p-4">
              <h4 className="font-bold text-yellow-400 mb-2">
                STRIKING EFFECT:
              </h4>
              <p className="text-gray-200 text-sm">{card.martialApplication}</p>
            </div>
            {/* Observed Effects */}
            <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-600 rounded-lg p-4">
              <h4 className="font-bold text-yellow-400 mb-2">
                Observed effects of strike:
              </h4>
              <p className="text-gray-200 text-sm">{card.healingFunction}</p>
            </div>
            {/* Theoretical Effects */}
            <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-600 rounded-lg p-4">
              <h4 className="font-bold text-yellow-400 mb-2">
                Theoretical effects:
              </h4>
              <p className="text-gray-200 text-sm">{card.martialApplication}</p>
            </div>{" "}
            {/* GPT Guided Insight */}
            <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-600 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-yellow-400">
                  GPT-GUIDED INSIGHT
                </h4>
                {userStats.isMastered && (
                  <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded border border-green-500">
                    ✓ MASTERED
                  </span>
                )}
              </div>
              <p className="text-gray-200 text-sm mb-3">
                {ProgressTracker.generateInsight(card, userStats)}
              </p>
              {userStats.totalAttempts > 0 && (
                <div className="text-xs text-gray-400 border-t border-gray-600 pt-2">
                  Quiz Performance: {userStats.retentionScore}% (
                  {userStats.attempts.correct}/{userStats.totalAttempts}{" "}
                  correct)
                </div>
              )}
            </div>
          </div>
        )}{" "}
        {/* Bottom Controls */}
        <div className="space-y-4">
          {/* Navigation and Flip Controls */}
          <div className="flex justify-between items-center">
            {/* Sound Button */}
            <button
              className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600"
              onClick={() => {
                /* Add sound functionality */
              }}
            >
              <svg
                className="w-6 h-6 text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            </button>

            {/* Navigation buttons */}
            <button
              onClick={prevCard}
              className="text-gray-400 hover:text-white px-4 py-2"
            >
              ←
            </button>

            {/* Flip Button */}
            <button
              onClick={flipCard}
              className="bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-lg border border-yellow-600"
            >
              FLIP
            </button>

            <button
              onClick={nextCard}
              className="text-gray-400 hover:text-white px-4 py-2"
            >
              →
            </button>

            {/* Flag Button */}
            <button
              className="w-12 h-12 bg-orange-800 hover:bg-orange-700 rounded-lg flex items-center justify-center border border-orange-600"
              onClick={handleFlag}
              title="Report an issue with this card"
            >
              <svg
                className="w-6 h-6 text-orange-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
              </svg>
            </button>
          </div>

          {/* Card counter */}
          <div className="text-center text-gray-400 text-sm mb-4">
            {currentCard + 1}/{flashcards.length}
          </div>

          {/* Quiz Button */}
          <button
            onClick={startQuiz}
            className="w-full bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 hover:from-yellow-800/40 hover:to-yellow-700/40 border border-yellow-600 text-yellow-400 py-3 px-6 rounded-lg font-bold"
          >
            🧠 TEST YOUR KNOWLEDGE
          </button>
        </div>
        {/* Flag Modal */}
        {showFlagModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-orange-600 rounded-lg p-6 max-w-md w-full">
              {!flagSubmitted ? (
                <>
                  <h3 className="text-xl font-bold text-orange-400 mb-4">
                    Report Issue
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Found a problem with{" "}
                    <span className="text-yellow-400 font-semibold">
                      {card.number} - {card.nameEnglish}
                    </span>
                    ? Let us know so we can improve the content.
                  </p>

                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-bold mb-2">
                      What's the issue?
                    </label>
                    <select
                      value={flagReason}
                      onChange={(e) => setFlagReason(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Select an issue type...</option>
                      <option value="incorrect-translation">
                        Incorrect Korean translation
                      </option>
                      <option value="wrong-location">
                        Wrong anatomical location
                      </option>
                      <option value="incorrect-function">
                        Incorrect healing function
                      </option>
                      <option value="wrong-meridian">
                        Wrong meridian assignment
                      </option>
                      <option value="martial-application-error">
                        Martial application error
                      </option>
                      <option value="spelling-grammar">
                        Spelling or grammar error
                      </option>
                      <option value="missing-information">
                        Missing important information
                      </option>
                      <option value="other">Other issue</option>
                    </select>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={submitFlag}
                      disabled={!flagReason.trim()}
                      className={`flex-1 py-2 px-4 rounded font-bold ${
                        flagReason.trim()
                          ? "bg-orange-800 hover:bg-orange-700 text-white border border-orange-600"
                          : "bg-gray-700 text-gray-500 border border-gray-600 cursor-not-allowed"
                      }`}
                    >
                      Submit Report
                    </button>

                    <button
                      onClick={closeFlagModal}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded border border-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-green-400 text-4xl mb-4">✓</div>
                  <h3 className="text-xl font-bold text-green-400 mb-2">
                    Report Submitted
                  </h3>
                  <p className="text-gray-300">
                    Thank you for helping us improve the content!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;
