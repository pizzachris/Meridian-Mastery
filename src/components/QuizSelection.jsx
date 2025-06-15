import React, { useState, memo, useCallback, useMemo } from "react";
import Logo from "./Logo";

const QuizSelection = memo(({ navigateTo }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Memoized quiz types array to prevent recreation on each render
  const quizTypes = useMemo(
    () => [
      {
        id: "translations",
        title: "Translation Mastery",
        description: "Korean ↔ English translations and spelling",
        icon: "🈳",
        difficulty: "Beginner",
        color: "from-green-800 to-green-900",
        borderColor: "border-green-600",
        numberOfQuestions: 10,
        focus: "translations",
      },
      {
        id: "healing-properties",
        title: "Healing Properties",
        description: "Learn therapeutic functions and applications",
        icon: "🌿",
        difficulty: "Intermediate",
        color: "from-blue-800 to-blue-900",
        borderColor: "border-blue-600",
        numberOfQuestions: 15,
        focus: "healing",
      },
      {
        id: "martial-effects",
        title: "Martial Applications",
        description: "Combat effects and pressure point strikes",
        icon: "👊",
        difficulty: "Advanced",
        color: "from-red-800 to-red-900",
        borderColor: "border-red-600",
        numberOfQuestions: 15,
        focus: "martial",
      },
      {
        id: "meridian-matching",
        title: "Meridian Matching",
        description: "Match pressure points to their meridians",
        icon: "🧘",
        difficulty: "Intermediate",
        color: "from-purple-800 to-purple-900",
        borderColor: "border-purple-600",
        numberOfQuestions: 12,
        focus: "meridians",
      },
      {
        id: "anatomy-locations",
        title: "Anatomy & Locations",
        description: "Master point locations on the body",
        icon: "🫁",
        difficulty: "Intermediate",
        color: "from-indigo-800 to-indigo-900",
        borderColor: "border-indigo-600",
        numberOfQuestions: 12,
        focus: "anatomy",
      },
      {
        id: "mixed-challenge",
        title: "Mixed Challenge",
        description: "Comprehensive test of all knowledge areas",
        icon: "🎯",
        difficulty: "Expert",
        color: "from-yellow-800 to-yellow-900",
        borderColor: "border-yellow-600",
        numberOfQuestions: 20,
        focus: "comprehensive",
      },
    ],
    [],
  );

  // Memoized navigation handlers
  const startQuiz = useCallback(
    (quiz) => {
      if (isNavigating) return;

      setIsNavigating(true);
      navigateTo("quiz", {
        quizType: quiz.id,
        numberOfQuestions: quiz.numberOfQuestions,
        type: quiz.id,
      });
    },
    [navigateTo, isNavigating],
  );

  const goHome = useCallback(() => {
    navigateTo("home");
  }, [navigateTo]);
  return (
    <div className="min-h-screen bg-black text-white mobile-safe">
      <div className="container mx-auto px-4 py-8 max-w-2xl mobile-header-safe">
        {/* Header */}
        <header className="text-center mb-8">
          <button
            onClick={goHome}
            disabled={isNavigating}
            className={`inline-block mb-4 text-yellow-400 hover:text-yellow-300 text-sm font-medium ${isNavigating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            ← Back to Home
          </button>
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <Logo className="w-16 h-16 mr-4" />
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
              onClick={() => startQuiz(quiz)}
              disabled={isNavigating}
              className={`p-6 rounded-lg border-2 ${quiz.borderColor} bg-gradient-to-br ${quiz.color} hover:scale-105 transform transition-all duration-200 text-left ${
                isNavigating ? "opacity-50 cursor-not-allowed" : ""
              } ${selectedQuiz === quiz.id ? "ring-2 ring-yellow-400" : ""}`}
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
});

QuizSelection.displayName = "QuizSelection";

export default QuizSelection;
