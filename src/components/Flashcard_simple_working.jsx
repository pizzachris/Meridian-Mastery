import React, { useState, useEffect } from "react";
import flashcardsData from "../data/flashcards.json";
import { ProgressTracker } from "../utils/progressTracker";

const Flashcard = ({ navigateTo, selectedPointId, sessionMode }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const allFlashcards = flashcardsData.flashcards;
  const flashcards = allFlashcards || [];
  const card = flashcards[currentCard];

  // Handle navigation from BodyMap with selectedPointId
  useEffect(() => {
    if (selectedPointId && flashcards.length > 0) {
      const pointIndex = flashcards.findIndex(
        (card) => card.id === selectedPointId,
      );
      if (pointIndex !== -1) {
        setCurrentCard(pointIndex);
      }
    }
  }, [selectedPointId, flashcards]);

  const nextCard = () => {
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
    if (card && !isFlipped) {
      ProgressTracker.studyPoint(card.id, card.meridian);
    }
    setIsFlipped(!isFlipped);
  };

  // Loading state
  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading flashcards...</p>
        </div>
      </div>
    );
  }

  // No card available
  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-red-400 mb-4">No flashcard data available</p>
          <button
            onClick={() => navigateTo("home")}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateTo("home")}
            className="bg-gray-700 hover:bg-gray-600 p-3 rounded-xl transition-all duration-300"
          >
            <span className="text-lg">🏠</span>
          </button>

          {/* Progress */}
          <div className="flex-1 mx-4">
            <div className="bg-gray-800 rounded-full h-2">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentCard + 1) / flashcards.length) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-1">
              {currentCard + 1} / {flashcards.length}
            </p>
          </div>
        </div>

        {/* Flashcard */}
        <div
          className="bg-gray-800 rounded-2xl p-8 mb-6 min-h-96 cursor-pointer hover:bg-gray-750 transition-all duration-300 shadow-2xl"
          onClick={flipCard}
        >
          {!isFlipped ? (
            // Front of card
            <div className="text-center space-y-6">
              <div className="text-3xl font-bold text-yellow-400 mb-4">
                {card.nameHangul}
              </div>
              <div className="text-xl text-white">{card.nameEnglish}</div>
              <div className="text-lg text-gray-300">Point: {card.number}</div>
              <div className="text-base text-gray-400">
                Meridian: {card.meridian}
              </div>
              <div className="mt-8 text-sm text-gray-500">Tap to flip</div>
            </div>
          ) : (
            // Back of card
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400 mb-2">
                  {card.nameEnglish}
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  {card.number} - {card.meridian} Meridian
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-blue-400 mb-1">
                    Location:
                  </h4>
                  <p className="text-sm text-gray-300">{card.location}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-green-400 mb-1">
                    Healing Function:
                  </h4>
                  <p className="text-sm text-gray-300">
                    {card.healingFunction}
                  </p>
                </div>

                {card.martialApplication && (
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-1">
                      Martial Application:
                    </h4>
                    <p className="text-sm text-gray-300">
                      {card.martialApplication}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                Tap to flip back
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between space-x-4">
          <button
            onClick={prevCard}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-xl transition-all duration-300 font-semibold"
          >
            ← Previous
          </button>
          <button
            onClick={nextCard}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-xl transition-all duration-300 font-semibold"
          >
            Next →
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 text-center">
          <div className="text-xs text-gray-500">
            Element: <span className="text-gray-300">{card.element}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
