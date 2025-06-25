import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import DailySession from "./components/DailySession";
import FlashcardSession from "./components/FlashcardSession";
import BodyMapInteractiveNew from "./components/BodyMapInteractiveNew.jsx";
import Settings from "./components/Settings";
import Progress from "./components/Progress";
import Quiz from "./components/Quiz";
import QuizSelection from "./components/QuizSelection";
import FlaggedIssues from "./components/FlaggedIssues";
import DisclaimerModal from "./components/DisclaimerModal";
import { SettingsProvider } from "./context/SettingsContext";
import { OptimizationTester } from "./utils/optimizationTester";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [sessionMode, setSessionMode] = useState(null);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Development mode - add optimization tester to window for console access
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.optimizationTester = new OptimizationTester();
      window.runOptimizationTests = () =>
        window.optimizationTester.runAllTests();
      console.log(
        "🔧 Dev Mode: Use window.runOptimizationTests() to run performance tests",
      );
    }
  }, []);

  // Check if user has seen disclaimer on first load
  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem(
      "meridian-mastery-disclaimer-accepted",
    );
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true);
    }
  }, []);

  // Handle disclaimer acceptance
  const handleDisclaimerAccept = () => {
    console.log("🔄 handleDisclaimerAccept called");
    localStorage.setItem("meridian-mastery-disclaimer-accepted", "true");
    localStorage.setItem(
      "meridian-mastery-disclaimer-date",
      new Date().toISOString(),
    );
    console.log("✅ Disclaimer accepted, setting showDisclaimer to false");
    setShowDisclaimer(false);
  };

  // Navigation function
  const navigateTo = (page, options = {}) => {
    setCurrentPage(page);
    if (options.sessionMode) {
      setSessionMode(options.sessionMode);
    } else if (page === "flashcards" && !options.sessionMode) {
      // Default flashcards to 'all' mode (pressure points only, no Hohn Soo)
      setSessionMode("all");
    }
    if (options.shuffleMode !== undefined) {
      setShuffleMode(options.shuffleMode);
    }
    if (options.quizType) {
      setQuizOptions(options);
    }
  };

  // Main page rendering logic with error handling
  const renderCurrentPage = () => {
    try {
      switch (currentPage) {
        case "home":
          return <Home navigateTo={navigateTo} />;
        case "session":
          return <DailySession navigateTo={navigateTo} />;
        case "flashcards":
          return (
            <FlashcardSession
              navigateTo={navigateTo}
              sessionMode={sessionMode}
              shuffleMode={shuffleMode}
            />
          );
        case "bodymap":
          return <BodyMapInteractiveNew navigateTo={navigateTo} />;
        case "quiz-selection":
          return <QuizSelection navigateTo={navigateTo} />;
        case "quiz":
          return (
            <Quiz
              navigateTo={navigateTo}
              sessionMode={sessionMode}
              quizOptions={quizOptions}
            />
          );
        case "progress":
          return <Progress navigateTo={navigateTo} />;
        case "settings":
          return (
            <Settings
              navigateTo={navigateTo}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          );
        case "flagged-issues":
          return <FlaggedIssues navigateTo={navigateTo} />;
        default:
          return <Home navigateTo={navigateTo} />;
      }
    } catch (error) {
      console.error("Error rendering page:", error);
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">Error: {error.message}</p>{" "}
            <button
              onClick={() => setCurrentPage("home")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Return to Home{" "}
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <SettingsProvider>
      <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
        <div className="bg-white dark:bg-gray-900 min-h-screen">
          {renderCurrentPage()}
        </div>
        {/* Disclaimer Modal */}
        <DisclaimerModal
          isOpen={showDisclaimer}
          onAccept={handleDisclaimerAccept}
        />
      </div>
    </SettingsProvider>
  );
}

export default App;
