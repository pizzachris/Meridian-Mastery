import React from "react";
import Logo from "./Logo";

const Home = ({ navigateTo }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-yellow-400">
            MERIDIAN MASTERY
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            Master the Ancient Art of Pressure Points
          </p>
          {/* Dedication restored */}
          <p className="text-xs sm:text-sm text-center text-yellow-300 mt-2 mb-4 px-4 italic leading-relaxed">
            With gratitude to <strong className="text-yellow-400">Grandmaster In-Hyuk Suh (Kuk Sa Nym)</strong>, Master Barry Harmon,<br />
            and my teachers for lighting the way.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button
            onClick={() => navigateTo("session")}
            className="bg-red-800 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg border border-yellow-600 transition-all duration-200"
          >
            📚 DAILY SESSION
          </button>

          <button
            onClick={() => navigateTo("flashcards")}
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg border border-blue-600 transition-all duration-200"
          >
            🗃️ FLASHCARDS
          </button>

          <button
            onClick={() => navigateTo("quiz-selection")}
            className="bg-green-800 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg border border-green-600 transition-all duration-200"
          >
            🧠 QUIZ
          </button>

          <button
            onClick={() => navigateTo("progress")}
            className="bg-purple-800 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg border border-purple-600 transition-all duration-200"
          >
            📊 PROGRESS
          </button>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigateTo("settings")}
            className="text-gray-400 hover:text-yellow-400 text-sm"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
