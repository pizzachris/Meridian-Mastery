import React from "react";

const Home = ({ navigateTo }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Meridian Mastery</h1>
      <div className="max-w-md mx-auto space-y-4">
        <button
          onClick={() => navigateTo("session")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg"
        >
          🥋 Start Daily Session
        </button>
        <button
          onClick={() => navigateTo("flashcards")}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg"
        >
          🌿 Flashcards
        </button>
        <button
          onClick={() => navigateTo("quiz-selection")}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg"
        >
          📝 Quiz Mode
        </button>
        <button
          onClick={() => navigateTo("body-map")}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg"
        >
          🎯 Body Map
        </button>
        <button
          onClick={() => navigateTo("progress")}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg"
        >
          📊 Progress
        </button>
        <button
          onClick={() => navigateTo("settings")}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg"
        >
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
};

export default Home;
