// filepath: c:\Users\pizza\Desktop\meridian master GPT 2nd attempt\src\components\Progress.jsx
import React, { useState, useEffect, useCallback } from "react";
import { ProgressTracker } from "../utils/progressTracker";

const Progress = ({ navigateTo }) => {
  const [progressData, setProgressData] = useState(
    ProgressTracker.initializeProgress(),
  );

  // Optimized progress loading with reduced frequency
  const loadProgress = useCallback(() => {
    const currentProgress = ProgressTracker.getProgress();
    setProgressData(currentProgress);
  }, []);

  useEffect(() => {
    loadProgress();

    // Reduced frequency: every 10 seconds instead of 2
    const refreshInterval = setInterval(loadProgress, 10000);

    return () => clearInterval(refreshInterval);
  }, [loadProgress]);
  // Refresh progress data on demand
  const refreshProgress = useCallback(() => {
    loadProgress();
  }, [loadProgress]);

  const getProgressPercentage = (current, total) => {
    return Math.round((current / total) * 100);
  };

  const getProgressBarWidth = (current, total) => {
    return `${(current / total) * 100}%`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header with Logo */}
        <header className="text-center mb-8">
          <button
            onClick={() => navigateTo("home")}
            className="inline-block mb-4 text-yellow-400 hover:text-yellow-300 text-sm font-medium"
          >
            ← Back to Home
          </button>

          {/* Logo and Title */}
          <div className="flex items-center justify-center mb-6">
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

        {/* Progress Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-yellow-400 mb-2">PROGRESS</h3>
        </div>

        {/* Progress Cards */}
        <div className="space-y-4">
          {/* Daily Sessions */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-yellow-600 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-yellow-400 font-semibold text-lg">
                Daily Sessions
              </h4>
              <span className="text-white font-bold">
                {progressData.dailySessions.current}/
                {progressData.dailySessions.total}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-red-600 to-red-700 h-3 rounded-full transition-all duration-500"
                style={{
                  width: getProgressBarWidth(
                    progressData.dailySessions.current,
                    progressData.dailySessions.total,
                  ),
                }}
              ></div>
            </div>
            <div className="text-right text-gray-400 text-sm">
              {getProgressPercentage(
                progressData.dailySessions.current,
                progressData.dailySessions.total,
              )}
              % Complete
            </div>
          </div>

          {/* Meridians */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-yellow-600 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-yellow-400 font-semibold text-lg">
                Meridians
              </h4>
              <span className="text-white font-bold">
                {progressData.meridians.current}/{progressData.meridians.total}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-red-600 to-red-700 h-3 rounded-full transition-all duration-500"
                style={{
                  width: getProgressBarWidth(
                    progressData.meridians.current,
                    progressData.meridians.total,
                  ),
                }}
              ></div>
            </div>
            <div className="text-right text-gray-400 text-sm">
              {getProgressPercentage(
                progressData.meridians.current,
                progressData.meridians.total,
              )}
              % Complete
            </div>
          </div>

          {/* Maek Chi Ki / Cha Ki */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-yellow-600 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-yellow-400 font-semibold text-lg">
                Maek Chi Ki / Cha Ki
              </h4>
              <span className="text-white font-bold">
                {progressData.maekChiKi.current}/{progressData.maekChiKi.total}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-red-600 to-red-700 h-3 rounded-full transition-all duration-500"
                style={{
                  width: getProgressBarWidth(
                    progressData.maekChiKi.current,
                    progressData.maekChiKi.total,
                  ),
                }}
              ></div>
            </div>
            <div className="text-right text-gray-400 text-sm">
              {getProgressPercentage(
                progressData.maekChiKi.current,
                progressData.maekChiKi.total,
              )}
              % Complete
            </div>
          </div>

          {/* Quiz Performance */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-blue-600 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-blue-400 font-semibold text-lg">
                Quiz Mastery
              </h4>
              <span className="text-white font-bold">
                {progressData.masteredPoints?.size || 0} Points
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              Average Retention:{" "}
              {progressData.retentionScores?.size > 0
                ? Math.round(
                    Array.from(progressData.retentionScores.values()).reduce(
                      (a, b) => a + b,
                      0,
                    ) / progressData.retentionScores.size,
                  )
                : 0}
              %
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center mt-8 p-4 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-600 rounded-lg">
          <p className="text-yellow-400 text-sm font-medium mb-1">
            Progress comes with
          </p>
          <p className="text-yellow-400 text-sm font-medium">practice.</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-8">
          <button
            onClick={() => navigateTo("session")}
            className="w-full bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg border border-yellow-600 transition-all duration-200"
          >
            CONTINUE TRAINING
          </button>

          <button
            onClick={() => navigateTo("quiz")}
            className="w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg border border-blue-600 transition-all duration-200"
          >
            🧠 TEST KNOWLEDGE
          </button>

          <button
            onClick={() => navigateTo("flashcards")}
            className="w-full bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 hover:from-yellow-800/40 hover:to-yellow-700/40 border border-yellow-600 text-yellow-400 py-3 px-6 rounded-lg transition-all duration-200"
          >
            REVIEW FLASHCARDS
          </button>
        </div>

        <div className="text-center text-gray-400 text-sm mt-8">
          Master your meridians.
          <br />
          Restore your power.
        </div>
      </div>
    </div>
  );
};

export default Progress;
