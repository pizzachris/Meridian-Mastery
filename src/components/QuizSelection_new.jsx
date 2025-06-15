import React from "react";

const QuizSelection = ({ navigateTo }) => {
  const quizTypes = [
    {
      id: "translations",
      title: "Translation Mastery",
      description: "Korean ↔ English translations and spelling",
      icon: "🈳",
      difficulty: "Beginner",
      color: "from-green-800 to-green-900",
      borderColor: "border-green-600",
    },
    {
      id: "healing-properties",
      title: "Healing Properties",
      description: "Learn therapeutic functions and applications",
      icon: "🌿",
      difficulty: "Intermediate",
      color: "from-blue-800 to-blue-900",
      borderColor: "border-blue-600",
    },
    {
      id: "martial-effects",
      title: "Martial Applications",
      description: "Combat effects and pressure point strikes",
      icon: "👊",
      difficulty: "Advanced",
      color: "from-red-800 to-red-900",
      borderColor: "border-red-600",
    },
    {
      id: "meridian-matching",
      title: "Meridian Matching",
      description: "Match pressure points to their meridians",
      icon: "🧘",
      difficulty: "Intermediate",
      color: "from-purple-800 to-purple-900",
      borderColor: "border-purple-600",
    },
    {
      id: "anatomy-locations",
      title: "Anatomy & Locations",
      description: "Anatomical positions and body regions",
      icon: "🫀",
      difficulty: "Advanced",
      color: "from-orange-800 to-orange-900",
      borderColor: "border-orange-600",
    },
    {
      id: "mixed-challenge",
      title: "Mixed Challenge",
      description: "All question types for complete mastery",
      icon: "🏆",
      difficulty: "Expert",
      color: "from-yellow-800 to-yellow-900",
      borderColor: "border-yellow-600",
    },
  ];

  const handleQuizStart = (quizType) => {
    navigateTo("quiz", { quizType });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <header className="text-center mb-8">
          <button
            onClick={() => navigateTo("home")}
            className="inline-block mb-4 text-yellow-400 hover:text-yellow-300 text-sm font-medium"
          >
            ← Back to Home
          </button>

          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 border-yellow-500 mr-4">
              <div className="relative">
                <div className="w-10 h-10 border-2 border-yellow-400 rounded-full"></div>
                <div className="absolute inset-1 border border-yellow-400/60 rounded-full"></div>
                <div className="absolute inset-2 border border-yellow-400/30 rounded-full"></div>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-white">MERIDIAN</h1>
              <h2 className="text-2xl text-gray-300">MASTERY COACH</h2>
            </div>
          </div>

          <h3 className="text-xl text-yellow-400 font-semibold mb-2">
            Choose Your Quiz Type
          </h3>
          <p className="text-gray-400 text-sm">
            Select a specialized quiz to focus your learning
          </p>
        </header>

        {/* Quiz Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {quizTypes.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => handleQuizStart(quiz.id)}
              className={`p-6 rounded-lg border-2 ${quiz.borderColor} bg-gradient-to-br ${quiz.color} hover:scale-105 transform transition-all duration-200 text-left`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl mb-2">{quiz.icon}</div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    quiz.difficulty === "Beginner"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : quiz.difficulty === "Intermediate"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : quiz.difficulty === "Advanced"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {quiz.difficulty}
                </span>
              </div>

              <h4 className="text-lg font-bold text-white mb-2">
                {quiz.title}
              </h4>
              <p className="text-sm text-gray-300">{quiz.description}</p>

              <div className="mt-4 flex items-center text-yellow-400 text-sm font-medium">
                <span>Start Quiz</span>
                <span className="ml-2">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Slogan at Bottom */}
        <footer className="text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-yellow-600/30 rounded-lg p-6">
            <div className="text-yellow-400 text-lg font-bold mb-2">
              Master the Ancient Art
            </div>
            <div className="text-gray-300 text-sm">
              "In knowing the pressure points, one knows the body.
              <br />
              In mastering the meridians, one masters the art."
            </div>
            <div className="text-gray-500 text-xs mt-3">
              — Traditional Korean Martial Arts Wisdom
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default QuizSelection;
