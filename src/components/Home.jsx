import React, { memo } from "react";
import Logo from "./Logo";

const Home = memo(({ navigateTo }) => {
  // Memoized navigation handlers for better performance - TEMPORARILY DISABLED DUE TO HOOK ERROR
  const handleNavigateToSession = () => {
    navigateTo("session");
  };
  const handleNavigateToFlashcards = () => {
    navigateTo("flashcards", { sessionMode: "all" });
  };

  const handleNavigateToQuiz = () => {
    navigateTo("quiz-selection");
  };

  const handleNavigateToProgress = () => {
    navigateTo("progress");
  };

  const handleNavigateToSettings = () => {
    navigateTo("settings");
  };

  const handleNavigateToFlagged = useCallback(() => {
    navigateTo("flagged-issues");
  }, [navigateTo]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white korean-flow-pattern yin-yang-flow mobile-safe">
      <div className="container mx-auto px-4 py-6 sm:py-8 mobile-header-safe">
        {/* Header with Korean Aesthetic - Enhanced Mobile */}
        <header className="text-center mb-6 sm:mb-12 relative px-2">
          {/* Logo positioned perfectly centered where the circle outline appears */}
          <div className="flex justify-center mb-4">
            <Logo className="w-24 h-24" />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-1 sm:mb-4 bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-600 bg-clip-text text-transparent leading-tight">
            Meridian Mastery
          </h1>
          <p className="text-sm sm:text-lg text-yellow-400 font-medium mb-2 px-2">
            국술원 • Pressure Points
          </p>

          {/* Short Dedication */}
          <p className="text-xs sm:text-sm text-center text-gray-400 mt-2 mb-4 px-4 italic leading-relaxed">
            With gratitude to{" "}
            <strong className="text-yellow-300">
              Grandmaster In-Hyuk Suh (Kuk Sa Nym)
            </strong>
            , Master Barry Harmon,
            <br />
            and my teachers for lighting the way.{" "}
            <button
              onClick={() => navigateTo("settings", { scrollTo: "about" })}
              className="underline cursor-pointer hover:text-yellow-300 transition-colors"
            >
              Read full dedication
            </button>
          </p>

          <div className="w-20 sm:w-24 h-1 mx-auto bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"></div>
        </header>{" "}
        {/* Main Navigation with Five Elements Flow - Better Mobile Layout */}
        <div className="max-w-xs sm:max-w-md mx-auto space-y-3 sm:space-y-6 px-2">
          <button
            onClick={handleNavigateToSession}
            className="w-full btn-primary text-base sm:text-xl relative overflow-hidden group py-4"
          >
            <span className="relative z-10">🥋 Start Daily Session</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>

          <div className="grid grid-cols-1 gap-2 sm:gap-4">
            {/* Wood Element - Growth & Learning */}
            <button
              onClick={handleNavigateToFlashcards}
              className="w-full element-wood font-semibold py-4 px-3 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
            >
              <span className="relative z-10">🌿 Flashcards</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-300/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
            {/* Fire Element - Energy & Testing */}
            <button
              onClick={handleNavigateToQuiz}
              className="w-full element-fire font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
            >
              <span className="relative z-10">🔥 Quiz Mode</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-300/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>{" "}
            {/* Water Element - Flow & Mapping */}
            <button
              onClick={() => navigateTo("bodymap")}
              className="w-full element-water font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
            >
              <span className="relative z-10">💧 Body Map</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
            {/* Earth Element - Foundation & Progress */}
            <button
              onClick={handleNavigateToProgress}
              className="w-full element-earth font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
            >
              <span className="relative z-10">🌍 Progress</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
            {/* Metal Element - Structure & Settings */}
            <button
              onClick={handleNavigateToSettings}
              className="w-full element-metal font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
            >
              <span className="relative z-10">⚙️ Settings</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300/20 to-gray-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
          </div>
        </div>
        {/* Korean Traditional Footer with Five Elements Flow */}
        <footer className="mt-12 sm:mt-16 text-center text-gray-400 px-4 relative">
          {/* Traditional Korean Decoration */}
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            </div>
          </div>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light mb-2 sm:mb-4">
            Master your meridians.
          </p>
          <p className="text-xs sm:text-sm">
            Based on traditional Korean/TCM principles
            <br />
            Master R. Barry Harmon's pressure point manual
          </p>
        </footer>
      </div>
    </div>
  );
});

Home.displayName = "Home";

export default Home;
