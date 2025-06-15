import React, { useState, useEffect, useCallback } from "react";
import {
  getAllPoints,
  getPointsByMeridian,
  getPointsByRegion,
  getPointsByTheme,
} from "../utils/dataLoader";
import { ProgressTracker } from "../utils/progressTracker";
import PronunciationManager from "../utils/pronunciation";
import "../styles/Quiz.css";
import Logo from "./Logo";

// Helper function to shuffle array
const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper function to generate options for multiple choice
const generateOptions = (card, allCards) => {
  if (!card || !Array.isArray(allCards)) return [];

  const otherCards = allCards.filter((c) => c.id !== card.id);
  const options = [card.nameEnglish];

  // Get 3 random incorrect options
  while (options.length < 4 && otherCards.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherCards.length);
    const option = otherCards[randomIndex].nameEnglish;
    if (!options.includes(option)) {
      options.push(option);
    }
    otherCards.splice(randomIndex, 1);
  }

  return shuffleArray(options);
};

const Quiz = ({ navigateTo, sessionMode, quizOptions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionResults, setSessionResults] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [pronunciation, setPronunciation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Generate quiz questions from flashcards - memoized for performance
  const generateQuizQuestions = useCallback(async () => {
    console.log("🎯 Starting to generate quiz questions...");
    console.log("🎯 Session mode:", sessionMode);
    console.log("🎯 Quiz options:", quizOptions);

    try {
      let sourceCards = await getAllPoints();
      console.log("🎯 Got source cards:", sourceCards.length);

      if (!sourceCards || sourceCards.length === 0) {
        throw new Error("No cards available");
      }
      // Check user progress to determine difficulty level
      const userProgress = await ProgressTracker.getProgress();
      const totalQuizAttempts = userProgress?.totalQuizAttempts || 0;
      const isBeginnerUser = totalQuizAttempts < 20; // First 20 quiz attempts

      console.log("🎯 User progress:", { totalQuizAttempts, isBeginnerUser });
      // Filter based on session mode or focus on points needing review
      const pointsNeedingReview =
        await ProgressTracker.getPointsNeedingReview();
      console.log("🎯 Points needing review:", pointsNeedingReview.length);

      if (
        pointsNeedingReview?.length > 0 &&
        Math.random() > 0.3 &&
        !isBeginnerUser
      ) {
        // 70% chance to quiz on points needing review (only for experienced users)
        sourceCards = sourceCards.filter((card) =>
          pointsNeedingReview.includes(card.id),
        );
        console.log("🎯 Filtered to review points:", sourceCards.length);
      }

      // Apply session mode filters
      if (sessionMode) {
        switch (sessionMode.type) {
          case "meridian":
            sourceCards = await getPointsByMeridian(sessionMode.meridian);
            break;
          case "region":
            sourceCards = await getPointsByRegion(sessionMode.region);
            break;
          case "theme":
            sourceCards = await getPointsByTheme(sessionMode.theme);
            break;
          default:
            break;
        }
      }

      if (!sourceCards || sourceCards.length === 0) {
        throw new Error("No cards available for selected mode");
      }

      // Generate questions based on quiz type
      const quizType = quizOptions?.type || "mixed-challenge";
      const questionTypes = getQuestionTypesForQuizType(
        quizType,
        isBeginnerUser,
      );
      console.log("🎯 Question types for quiz:", questionTypes);

      // Filter valid cards first
      const validCards = sourceCards.filter((card) => {
        // Validate card has minimum required properties
        const isValid =
          card &&
          card.id &&
          card.nameEnglish &&
          card.nameHangul &&
          card.nameRomanized &&
          card.meridian;

        if (!isValid && card) {
          console.log("🎯 Invalid card:", {
            id: card.id,
            nameEnglish: card.nameEnglish,
            nameHangul: card.nameHangul,
            nameRomanized: card.nameRomanized,
            meridian: card.meridian,
          });
        }

        return isValid;
      });

      console.log(
        "🎯 Valid cards after filtering:",
        validCards.length,
        "out of",
        sourceCards.length,
      );

      if (validCards.length === 0) {
        throw new Error("No valid cards available for quiz generation");
      }

      // Generate questions asynchronously
      console.log("🎯 Generating questions for", validCards.length, "cards");
      const questionPromises = validCards.map(async (card, index) => {
        const questionType =
          questionTypes[Math.floor(Math.random() * questionTypes.length)];
        console.log(
          `🎯 Generating question ${index + 1}/${validCards.length}, type: ${questionType}`,
        );
        return await generateQuestion(card, questionType);
      });

      const questions = await Promise.all(questionPromises);
      const validQuestions = questions.filter(Boolean); // Remove any null questions

      console.log(
        "🎯 Generated questions:",
        validQuestions.length,
        "out of",
        questions.length,
      );

      if (validQuestions.length === 0) {
        throw new Error("Failed to generate valid questions");
      }

      // Shuffle and limit number of questions
      const numberOfQuestions = quizOptions?.numberOfQuestions || 10;
      const shuffledQuestions = shuffleArray(validQuestions).slice(
        0,
        numberOfQuestions,
      );
      setQuizQuestions(shuffledQuestions);
      setError(null);
    } catch (error) {
      console.error("Error generating quiz questions:", error);
      setError(error.message);
      setQuizQuestions([]);
    }
  }, [sessionMode, quizOptions]);

  // Initialize pronunciation manager
  useEffect(() => {
    try {
      const manager = new PronunciationManager();
      setPronunciation(manager);
    } catch (error) {
      console.error("Failed to initialize pronunciation manager:", error);
    }
  }, []);

  // Generate quiz questions from flashcards
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        await generateQuizQuestions();
      } catch (error) {
        console.error("Failed to generate quiz questions:", error);
        setError("Failed to load quiz questions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadQuiz();
  }, [sessionMode, quizOptions, generateQuizQuestions]);

  const getQuestionTypesForQuizType = (quizType, isBeginnerUser) => {
    switch (quizType) {
      case "translations":
        return isBeginnerUser
          ? ["korean-name-english-choices", "simple-korean-to-english"]
          : [
              "korean-to-english",
              "english-to-korean",
              "english-to-korean-spelling",
            ];

      case "healing-properties":
        return isBeginnerUser
          ? ["healing-properties-basic"]
          : ["healing-properties-advanced", "function"];

      case "martial-effects":
        return isBeginnerUser
          ? ["martial-effects-intro"]
          : ["martial-effects-detailed"];

      case "meridian-matching":
        return ["meridian-basic", "meridian"];

      case "anatomy-locations":
        return ["location", "point-number-match"];

      case "mixed-challenge":
        return [
          "korean-name-english-choices",
          "simple-korean-to-english",
          "location",
          "function",
          "meridian-basic",
          "healing-properties-basic",
          "martial-effects-intro",
        ];

      default:
        return ["korean-name-english-choices", "simple-korean-to-english"];
    }
  };
  const generateQuestion = async (card, type) => {
    console.log(`🎯 Generating question for card ${card.id}, type: ${type}`);

    try {
      // Validate card object
      if (!card || !card.id) {
        console.error("🎯 Invalid card object:", card);
        return null;
      }

      const allCards = await getAllPoints();
      const incorrectOptions = allCards
        .filter((c) => c && c.id !== card.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // Ensure we have enough options
      if (incorrectOptions.length < 3) {
        console.warn("🎯 Not enough incorrect options available");
        return null;
      }

      console.log(`🎯 Card properties:`, {
        nameHangul: card.nameHangul,
        nameRomanized: card.nameRomanized,
        nameEnglish: card.nameEnglish,
        location: card.location,
        healingFunction: card.healingFunction,
        martialApplication: card.martialApplication,
      });

      switch (type) {
        case "korean-name-english-choices":
          if (!card.nameHangul || !card.nameRomanized || !card.nameEnglish) {
            console.error(
              "Missing required Korean/English names for card:",
              card.id,
            );
            return null;
          }
          return {
            question: `What does "${card.nameHangul}" (${card.nameRomanized}) mean in English?`,
            subtext: `Point ${card.number || card.point_number} on ${card.meridian} meridian`,
            correctAnswer: card.nameEnglish,
            options: [
              card.nameEnglish,
              ...incorrectOptions.map((c) => c.nameEnglish).filter(Boolean),
            ].sort(() => Math.random() - 0.5),
            card,
            type,
            isEasy: true,
          };
        case "simple-korean-to-english":
          if (
            !card.nameHangul ||
            !card.nameRomanized ||
            !card.nameEnglish ||
            !card.location
          ) {
            console.error(
              "Missing required properties for simple-korean-to-english:",
              card.id,
            );
            return null;
          }
          return {
            question: `What is the English name for "${card.nameHangul}" (${card.nameRomanized})?`,
            subtext: `Point ${card.number || card.point_number} | Location: ${card.location}`,
            correctAnswer: card.nameEnglish,
            options: [
              card.nameEnglish,
              ...incorrectOptions.map((c) => c.nameEnglish).filter(Boolean),
            ].sort(() => Math.random() - 0.5),
            card,
            type,
            isEasy: true,
          };

        case "point-number-match":
          if (
            !card.nameHangul ||
            !card.nameEnglish ||
            !card.nameRomanized ||
            (!card.number && !card.point_number)
          ) {
            console.error(
              "Missing required properties for point-number-match:",
              card.id,
            );
            return null;
          }
          return {
            question: `Which Korean name corresponds to point "${card.number || card.point_number}"?`,
            subtext: `English: ${card.nameEnglish} | Romanized: ${card.nameRomanized}`,
            correctAnswer: card.nameHangul,
            options: [
              card.nameHangul,
              ...incorrectOptions.map((c) => c.nameHangul).filter(Boolean),
            ].sort(() => Math.random() - 0.5),
            card,
            type,
            isEasy: true,
          };

        case "meridian-basic":
          if (
            !card.nameHangul ||
            !card.nameRomanized ||
            !card.nameEnglish ||
            !card.meridian
          ) {
            console.error(
              "Missing required properties for meridian-basic:",
              card.id,
            );
            return null;
          }
          return {
            question: `"${card.nameHangul}" (${card.nameRomanized}) belongs to which meridian?`,
            subtext: `Point ${card.number || card.point_number} | English: ${card.nameEnglish}`,
            correctAnswer: card.meridian,
            options: [
              card.meridian,
              ...incorrectOptions.map((c) => c.meridian).filter(Boolean),
            ].sort(() => Math.random() - 0.5),
            card,
            type,
            isEasy: true,
          };

        case "healing-properties-basic":
          if (!card.nameEnglish || !card.healingFunction) {
            console.error(
              "Missing required properties for healing-properties-basic:",
              card.id,
            );
            return null;
          }
          return {
            question: `What is the main healing function of ${card.nameEnglish} (${card.number || card.point_number})?`,
            subtext: `Korean: ${card.nameHangul} (${card.nameRomanized})`,
            correctAnswer: card.healingFunction,
            options: [
              card.healingFunction,
              ...incorrectOptions.map((c) => c.healingFunction).filter(Boolean),
            ].sort(() => Math.random() - 0.5),
            card,
            type,
            isEasy: true,
          };

        case "martial-effects-intro":
          if (!card.nameEnglish || !card.martialApplication) {
            console.error(
              "Missing required properties for martial-effects-intro:",
              card.id,
            );
            return null;
          }
          return {
            question: `What is the martial application of ${card.nameEnglish} (${card.number || card.point_number})?`,
            subtext: `Korean: ${card.nameHangul} (${card.nameRomanized})`,
            correctAnswer: card.martialApplication,
            options: [
              card.martialApplication,
              ...incorrectOptions
                .map((c) => c.martialApplication)
                .filter(Boolean),
            ].sort(() => Math.random() - 0.5),
            card,
            type,
            isEasy: true,
          };

        default:
          if (!card.nameHangul || !card.nameRomanized || !card.nameEnglish) {
            console.error(
              "Missing required properties for default question:",
              card.id,
            );
            return null;
          }
          return {
            question: `What is the English name for "${card.nameHangul}" (${card.nameRomanized})?`,
            subtext: `Point ${card.number}`,
            correctAnswer: card.nameEnglish,
            options: [
              card.nameEnglish,
              ...incorrectOptions.map((c) => c.nameEnglish),
            ].sort(() => Math.random() - 0.5),
            card,
            type,
            isEasy: true,
          };
      }
    } catch (error) {
      console.error("Error generating question:", error);
      return null;
    }
  };
  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) return;

    try {
      const currentQuestion = quizQuestions[currentQuestionIndex];

      if (!currentQuestion) {
        console.error("No current question available");
        setError("Question data is missing. Please try again.");
        return;
      }

      if (!currentQuestion.card || !currentQuestion.card.id) {
        console.error("Question card data is invalid:", currentQuestion);
        setError("Question card data is invalid. Please try again.");
        return;
      }

      const correct = selectedAnswer === currentQuestion.correctAnswer;

      setIsCorrect(correct);
      setShowResult(true);

      // Record the attempt with validation
      await ProgressTracker.recordQuizAttempt(
        currentQuestion.card.id,
        correct,
        currentQuestion.card.meridian || "Unknown",
      );

      // Update session results
      setSessionResults((prev) => [
        ...prev,
        {
          question: currentQuestion,
          selectedAnswer,
          isCorrect: correct,
        },
      ]);
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setError("Failed to submit answer. Please try again.");
    }
  };

  const handleNextQuestion = () => {
    try {
      setSelectedAnswer(null);
      setShowResult(false);

      if (currentQuestionIndex + 1 >= quizQuestions.length) {
        setSessionComplete(true);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to move to next question:", error);
      setError("Failed to move to next question. Please try again.");
    }
  };

  const restartQuiz = () => {
    try {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setSessionComplete(false);
      setSessionResults([]);
      generateQuizQuestions();
    } catch (error) {
      console.error("Failed to restart quiz:", error);
      setError("Failed to restart quiz. Please try again.");
    }
  };

  const handlePronunciation = (text, isKorean = false) => {
    if (!pronunciation || !text) return;

    try {
      if (isKorean) {
        pronunciation.speakKorean(text);
      } else {
        pronunciation.speakRomanized(text);
      }
    } catch (error) {
      console.error("Failed to play pronunciation:", error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigateTo("home")}
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || quizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    const correctAnswers = sessionResults.filter((r) => r.isCorrect).length;
    const totalQuestions = sessionResults.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">
            Quiz Complete!
          </h2>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {percentage}%
              </div>
              <p className="text-gray-400">
                {correctAnswers} correct out of {totalQuestions} questions
              </p>
            </div>

            <div className="space-y-4">
              {sessionResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    result.isCorrect ? "bg-green-900/50" : "bg-red-900/50"
                  }`}
                >
                  <p className="font-medium">{result.question.question}</p>
                  <p className="text-sm text-gray-400">
                    {result.question.subtext}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm">
                      Your answer:{" "}
                      <span
                        className={
                          result.isCorrect ? "text-green-400" : "text-red-400"
                        }
                      >
                        {result.selectedAnswer}
                      </span>
                    </p>
                    {!result.isCorrect && (
                      <p className="text-sm text-green-400">
                        Correct answer: {result.question.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={restartQuiz}
              className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigateTo("home")}
              className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center py-8 px-4 mobile-safe">
      {/* Header: Logo and Back Button */}
      <div className="w-full max-w-lg mx-auto mb-8 flex justify-between items-center mobile-header-safe">
        {/* Logo Home Button */}
        <button
          onClick={() => navigateTo("home")}
          className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
          aria-label="Go to Home"
        >
          <Logo className="w-8 h-8" />
        </button>

        {/* Back to Daily Sessions Button */}
        <button
          onClick={() => navigateTo("daily-session")}
          className="text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center"
          aria-label="Back to Daily Sessions"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h14"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Quiz Content */}
      <div className="max-w-md mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </span>
            <span>
              {Math.round(
                ((currentQuestionIndex + 1) / quizQuestions.length) * 100,
              )}
              %
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentQuestion.question}
          </h2>
          {currentQuestion.subtext && (
            <p className="text-gray-400 text-sm mb-4">
              {currentQuestion.subtext}
            </p>
          )}

          {/* Answer options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(option)}
                className={`w-full p-4 text-left rounded-lg transition-colors ${
                  showResult
                    ? option === currentQuestion.correctAnswer
                      ? "bg-green-900/50 border border-green-500"
                      : option === selectedAnswer
                        ? "bg-red-900/50 border border-red-500"
                        : "bg-gray-700/50"
                    : selectedAnswer === option
                      ? "bg-yellow-500/20 border border-yellow-500"
                      : "bg-gray-700/50 hover:bg-gray-600/50"
                }`}
                disabled={showResult}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => navigateTo("home")}
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            Exit Quiz
          </button>

          {showResult ? (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              {currentQuestionIndex + 1 >= quizQuestions.length
                ? "Finish"
                : "Next Question"}
            </button>
          ) : (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                selectedAnswer
                  ? "bg-yellow-500 text-black hover:bg-yellow-400"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
