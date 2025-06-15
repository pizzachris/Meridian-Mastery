import React, { useState, useEffect } from "react";
import flashcardsData from "../data/flashcards.json";
import { ProgressTracker } from "../utils/progressTracker";

const Quiz = ({ navigateTo, sessionMode, quizOptions }) => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, skipped: 0 });
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [meridianStats, setMeridianStats] = useState({});

  useEffect(() => {
    generateQuizQuestions();
  }, []);

  const generateQuizQuestions = () => {
    setIsLoading(true);

    setTimeout(() => {
      const allFlashcards = [...flashcardsData];
      const questions = [];
      const questionCount = 10;

      // Determine user experience level
      const userProgress = ProgressTracker.getUserProgress();
      const isBeginnerUser =
        !userProgress ||
        Object.values(userProgress.meridians || {}).every((score) => score < 5);

      let availablePoints = [];

      // Filter points based on quiz options or session mode
      if (quizOptions && quizOptions.quizType) {
        if (quizOptions.quizType === "beginner") {
          availablePoints = allFlashcards.filter(
            (point) => point.difficulty === "beginner",
          );
        } else if (quizOptions.quizType === "intermediate") {
          availablePoints = allFlashcards.filter(
            (point) => point.difficulty === "intermediate",
          );
        } else if (quizOptions.quizType === "advanced") {
          availablePoints = allFlashcards.filter(
            (point) => point.difficulty === "advanced",
          );
        }

        if (isBeginnerUser) {
          availablePoints = availablePoints.filter(
            (point) =>
              point.difficulty === "beginner" ||
              point.difficulty === "intermediate",
          );
        }
      } else {
        availablePoints = allFlashcards;
      }

      // Apply session mode filters
      if (sessionMode) {
        if (sessionMode === "meridian") {
          const selectedMeridian = quizOptions?.selectedMeridian;
          if (selectedMeridian) {
            availablePoints = availablePoints.filter(
              (point) => point.meridian === selectedMeridian,
            );
          }
        } else if (sessionMode === "region") {
          const selectedRegion = quizOptions?.selectedRegion;
          if (selectedRegion) {
            availablePoints = availablePoints.filter(
              (point) => point.bodyRegion === selectedRegion,
            );
          }
        } else if (sessionMode === "theme") {
          const selectedTheme = quizOptions?.selectedTheme;
          if (selectedTheme) {
            availablePoints = availablePoints.filter(
              (point) =>
                point.martialApplications?.includes(selectedTheme) ||
                point.healingProperties?.includes(selectedTheme),
            );
          }
        } else if (
          sessionMode === "maek-chi-ki" ||
          sessionMode === "maek-cha-ki"
        ) {
          availablePoints = availablePoints.filter(
            (point) => point.martialType === sessionMode,
          );
        }
      }

      if (availablePoints.length < 5) {
        availablePoints = allFlashcards.slice(0, Math.max(10, questionCount));
      }

      // Shuffle and select points for questions
      const shuffledPoints = [...availablePoints].sort(
        () => Math.random() - 0.5,
      );
      const selectedPoints = shuffledPoints.slice(
        0,
        Math.min(questionCount, shuffledPoints.length),
      );

      // Create different types of questions
      selectedPoints.forEach((point) => {
        if (availablePoints.length === 0) {
          return;
        }

        const questionTypes = [
          "korean-english",
          "meridian-match",
          "healing-properties",
          "martial-effects",
        ];
        const randomType =
          questionTypes[Math.floor(Math.random() * questionTypes.length)];

        let question = {};

        switch (randomType) {
          case "korean-english":
            question = createKoreanEnglishQuestion(point, availablePoints);
            break;
          case "meridian-match":
            question = createMeridianMatchQuestion(point, availablePoints);
            break;
          case "healing-properties":
            question = createHealingPropertiesQuestion(point, availablePoints);
            break;
          case "martial-effects":
            question = createMartialEffectsQuestion(point, availablePoints);
            break;
          default:
            question = createKoreanEnglishQuestion(point, availablePoints);
        }

        if (question && question.question) {
          questions.push(question);
        }
      });

      setQuizQuestions(questions);
      setIsLoading(false);
    }, 800);
  };

  const createKoreanEnglishQuestion = (point, allPoints) => {
    const wrongAnswers = [];
    const usedAnswers = new Set([point.englishName]);

    while (wrongAnswers.length < 3 && usedAnswers.size < allPoints.length) {
      const randomPoint =
        allPoints[Math.floor(Math.random() * allPoints.length)];
      if (
        !wrongAnswers.includes(randomPoint.englishName) &&
        randomPoint.englishName !== point.englishName
      ) {
        wrongAnswers.push(randomPoint.englishName);
        usedAnswers.add(randomPoint.englishName);
      }
    }

    const options = [point.englishName, ...wrongAnswers].sort(
      () => Math.random() - 0.5,
    );

    return {
      id: `korean-english-${point.id}`,
      type: "korean-english",
      question: `What is the English name for the Korean pressure point "${point.koreanName}"?`,
      options: options,
      correctAnswer: options.indexOf(point.englishName),
      explanation: `${point.koreanName} translates to "${point.englishName}" in English.`,
      meridian: point.meridian,
      pointData: point,
    };
  };

  const createMeridianMatchQuestion = (point, allPoints) => {
    const wrongMeridians = [];
    const allMeridians = [...new Set(allPoints.map((p) => p.meridian))];

    while (wrongMeridians.length < 3) {
      const randomMeridian =
        allMeridians[Math.floor(Math.random() * allMeridians.length)];
      if (
        !wrongMeridians.includes(randomMeridian) &&
        randomMeridian !== point.meridian
      ) {
        wrongMeridians.push(randomMeridian);
      }
    }

    const options = [point.meridian, ...wrongMeridians].sort(
      () => Math.random() - 0.5,
    );

    return {
      id: `meridian-match-${point.id}`,
      type: "meridian-match",
      question: `Which meridian does the pressure point "${point.englishName}" belong to?`,
      options: options,
      correctAnswer: options.indexOf(point.meridian),
      explanation: `${point.englishName} is located on the ${point.meridian} meridian.`,
      meridian: point.meridian,
      pointData: point,
    };
  };

  const createHealingPropertiesQuestion = (point, allPoints) => {
    if (!point.healingProperties || point.healingProperties.length === 0) {
      return createKoreanEnglishQuestion(point, allPoints);
    }

    const correctProperty = point.healingProperties[0];
    const wrongProperties = [];

    allPoints.forEach((p) => {
      if (p.healingProperties) {
        p.healingProperties.forEach((prop) => {
          if (!wrongProperties.includes(prop) && prop !== correctProperty) {
            wrongProperties.push(prop);
          }
        });
      }
    });

    const selectedWrong = wrongProperties
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [correctProperty, ...selectedWrong].sort(
      () => Math.random() - 0.5,
    );

    return {
      id: `healing-${point.id}`,
      type: "healing-properties",
      question: `What is a primary healing property of the "${point.englishName}" pressure point?`,
      options: options,
      correctAnswer: options.indexOf(correctProperty),
      explanation: `${point.englishName} is known for its ${correctProperty} healing properties.`,
      meridian: point.meridian,
      pointData: point,
    };
  };

  const createMartialEffectsQuestion = (point, allPoints) => {
    if (!point.martialApplications || point.martialApplications.length === 0) {
      return createKoreanEnglishQuestion(point, allPoints);
    }

    const correctEffect = point.martialApplications[0];
    const wrongEffects = [];

    allPoints.forEach((p) => {
      if (p.martialApplications) {
        p.martialApplications.forEach((effect) => {
          if (!wrongEffects.includes(effect) && effect !== correctEffect) {
            wrongEffects.push(effect);
          }
        });
      }
    });

    const selectedWrong = wrongEffects
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [correctEffect, ...selectedWrong].sort(
      () => Math.random() - 0.5,
    );

    return {
      id: `martial-${point.id}`,
      type: "martial-effects",
      question: `What is a martial application of the "${point.englishName}" pressure point?`,
      options: options,
      correctAnswer: options.indexOf(correctEffect),
      explanation: `${point.englishName} can be used for ${correctEffect} in martial applications.`,
      meridian: point.meridian,
      pointData: point,
    };
  };

  const handleAnswerSelection = (answerIndex) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answerIndex);
    }
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;

    setScore((prevScore) => ({
      ...prevScore,
      correct: isAnswerCorrect ? prevScore.correct + 1 : prevScore.correct,
      incorrect: !isAnswerCorrect
        ? prevScore.incorrect + 1
        : prevScore.incorrect,
    }));

    setMeridianStats((prevStats) => {
      const meridian = currentQuestion.meridian;
      return {
        ...prevStats,
        [meridian]: {
          correct:
            (prevStats[meridian]?.correct || 0) + (isAnswerCorrect ? 1 : 0),
          total: (prevStats[meridian]?.total || 0) + 1,
        },
      };
    });

    setIsCorrect(isAnswerCorrect);
    setIsAnswerSubmitted(true);

    if (isAnswerCorrect) {
      ProgressTracker.recordProgress(currentQuestion.pointData, "quiz", true);
    }
  };

  const goToNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(false);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const skipQuestion = () => {
    setScore((prevScore) => ({
      ...prevScore,
      skipped: prevScore.skipped + 1,
    }));
    goToNextQuestion();
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(false);
    setScore({ correct: 0, incorrect: 0, skipped: 0 });
    setMeridianStats({});
    setQuizCompleted(false);
    setIsLoading(true);
    generateQuizQuestions();
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 border-yellow-500 mx-auto animate-pulse">
              <div className="relative">
                <div className="w-10 h-10 border-2 border-yellow-400 rounded-full"></div>
                <div className="absolute inset-1 border border-yellow-400/60 rounded-full"></div>
                <div className="absolute inset-2 border border-yellow-400/30 rounded-full"></div>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            Preparing Your Quiz
          </h2>
          <p className="text-gray-300 mb-8">
            Generating personalized questions based on your progress and
            preferences...
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (quizCompleted) {
    const totalQuestions = quizQuestions.length;
    const correctAnswers = score.correct;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    const meridianPerformance = Object.entries(meridianStats)
      .filter(([_, stats]) => stats.total >= 2)
      .map(([meridian, stats]) => {
        const percentage = Math.round((stats.correct / stats.total) * 100);
        return [meridian, stats.correct, percentage];
      })
      .sort((a, b) => b[2] - a[2]);

    const topMeridian = meridianPerformance[0] || ["None", 0, 0];

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <header className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 border-yellow-500 mr-4">
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

          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-yellow-400 mb-4">
              Quiz Complete!
            </h3>
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-yellow-600 rounded-lg p-6 mb-6">
              <div className="text-6xl font-bold text-yellow-400 mb-2">
                {percentage}%
              </div>
              <div className="text-lg text-white">
                {correctAnswers}/{totalQuestions} Correct
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {percentage >= 80
                  ? "🏆 Excellent mastery!"
                  : percentage >= 60
                    ? "✨ Good progress, keep practicing!"
                    : "📚 More study needed. Review the material and try again."}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <div className="text-sm text-gray-400 font-medium">Correct</div>
                <div className="text-2xl text-green-400">{score.correct}</div>
              </div>
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <div className="text-sm text-gray-400 font-medium">
                  Incorrect
                </div>
                <div className="text-2xl text-red-400">{score.incorrect}</div>
              </div>
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <div className="text-sm text-gray-400 font-medium">Skipped</div>
                <div className="text-2xl text-yellow-400">{score.skipped}</div>
              </div>
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <div className="text-sm text-gray-400 font-medium">
                  Points Covered
                </div>
                <div className="text-2xl text-blue-400">
                  {quizQuestions.length}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-bold text-yellow-400 mb-4">
                Meridian Performance
              </h4>
              {topMeridian[0] !== "None" && (
                <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4 mb-6">
                  <div className="text-sm text-blue-400 font-medium">
                    Best Performance
                  </div>
                  <div className="text-lg text-white">{topMeridian[0]}</div>
                  <div className="text-xs text-gray-400">
                    {topMeridian[1]} correct answers
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={restartQuiz}
                className="w-full bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg border border-yellow-600"
              >
                QUIZ AGAIN
              </button>
              <button
                onClick={() => navigateTo("quiz-selection")}
                className="w-full bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 hover:from-yellow-800/40 hover:to-yellow-700/40 border border-yellow-600 text-yellow-400 py-3 px-6 rounded-lg"
              >
                TRY DIFFERENT QUIZ
              </button>
              <button
                onClick={() => navigateTo("home")}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-600 text-gray-400 py-3 px-6 rounded-lg"
              >
                BACK TO HOME
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main quiz interface
  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <header className="text-center mb-8">
          <button
            onClick={() => navigateTo("quiz-selection")}
            className="inline-block mb-4 text-yellow-400 hover:text-yellow-300 text-sm font-medium"
          >
            ← Back to Quiz Selection
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 border-yellow-500 mr-3">
              <div className="relative">
                <div className="w-6 h-6 border-2 border-yellow-400 rounded-full"></div>
                <div className="absolute inset-1 border border-yellow-400/60 rounded-full"></div>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-white">MERIDIAN MASTERY</h1>
              <h2 className="text-sm text-gray-400">Knowledge Quiz</h2>
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </span>
            <span>
              {Math.round((currentQuestionIndex / quizQuestions.length) * 100)}%
              Complete
            </span>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(currentQuestionIndex / quizQuestions.length) * 100}%`,
              }}
            ></div>
          </div>
        </header>

        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-yellow-600 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelection(index)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    selectedAnswer === index
                      ? isAnswerSubmitted
                        ? index === currentQuestion.correctAnswer
                          ? "bg-green-900/50 border-green-500 text-green-100"
                          : "bg-red-900/50 border-red-500 text-red-100"
                        : "bg-yellow-900/30 border-yellow-500 text-yellow-100"
                      : isAnswerSubmitted &&
                          index === currentQuestion.correctAnswer
                        ? "bg-green-900/50 border-green-500 text-green-100"
                        : "bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500"
                  }`}
                >
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {isAnswerSubmitted && (
            <div
              className={`p-4 rounded-lg border mb-6 ${
                isCorrect
                  ? "bg-green-900/20 border-green-600 text-green-100"
                  : "bg-red-900/20 border-red-600 text-red-100"
              }`}
            >
              <div className="font-bold mb-2">
                {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
              </div>
              <div className="text-sm">{currentQuestion.explanation}</div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {!isAnswerSubmitted ? (
            <>
              <button
                onClick={skipQuestion}
                className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-200 font-medium py-3 px-6 rounded-lg border border-gray-600"
              >
                SKIP
              </button>
              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className={`flex-1 font-bold py-3 px-6 rounded-lg ${
                  selectedAnswer !== null
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                SUBMIT
              </button>
            </>
          ) : (
            <button
              onClick={goToNextQuestion}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              {currentQuestionIndex < quizQuestions.length - 1
                ? "NEXT QUESTION"
                : "VIEW RESULTS"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
