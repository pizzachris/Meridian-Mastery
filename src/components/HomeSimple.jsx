import React from "react";
import Logo from "./Logo";

// Simplified Home component without hooks to debug React issues
const Home = ({ navigateTo }) => {
  console.log("🏠 Home component rendering with React version:", React.version);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Meridian Mastery Coach
          </h1>
          <p className="text-gray-300 text-lg">
            Master Traditional Korean Medicine pressure points
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Daily Session */}
          <button
            onClick={() => navigateTo("session")}
            className="w-full element-metal font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
          >
            <span className="relative z-10">⚡ Daily Session</span>
          </button>

          {/* Flashcard Practice */}
          <button
            onClick={() => navigateTo("flashcards", { sessionMode: "all" })}
            className="w-full element-wood font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
          >
            <span className="relative z-10">🎯 Flashcards</span>
          </button>

          {/* Quiz Mode */}
          <button
            onClick={() => navigateTo("quiz-selection")}
            className="w-full element-fire font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
          >
            <span className="relative z-10">🔥 Quiz Mode</span>
          </button>

          {/* Body Map */}
          <button
            onClick={() => navigateTo("bodymap")}
            className="w-full element-water font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
          >
            <span className="relative z-10">💧 Body Map</span>
          </button>

          {/* Progress */}
          <button
            onClick={() => navigateTo("progress")}
            className="w-full element-earth font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
          >
            <span className="relative z-10">🌍 Progress</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => navigateTo("settings")}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
          >
            <span className="relative z-10">⚙️ Settings</span>
          </button>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>Traditional Korean Medicine • Kuk Sool Won</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
