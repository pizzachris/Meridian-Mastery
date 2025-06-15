import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Flashcard from "./Flashcard";
import {
  getPointsByMeridian,
  getPointsByRegion,
  getPointsByTheme,
  getAllMeridians,
  getAllRegions,
  getAllThemes,
} from "../utils/dataLoader";
import {
  updatePointProgress,
  recordSession,
  getPointMastery,
  generateInsight,
} from "../utils/progressTracker";
import TriskelionLogo from "./TriskelionLogo";

const modeButtons = [
  { key: "maekChiKi", label: "Maek Chi Ki" },
  { key: "region", label: "By Region" },
  { key: "theme", label: "By Theme" },
  { key: "meridian", label: "By Meridian" },
  { key: "maekChaKi", label: "Maek Cha Ki" },
];

const TrainingSession = ({ mode, onComplete }) => {
  const [points, setPoints] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
  });
  const [selectedFilter, setSelectedFilter] = useState("");
  const [availableFilters, setAvailableFilters] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [currentPointMastery, setCurrentPointMastery] = useState(0);
  const [currentPointInsight, setCurrentPointInsight] = useState(null);
  const [selectedMode, setSelectedMode] = useState(mode || "region");

  useEffect(() => {
    setSessionStartTime(new Date());
    switch (selectedMode) {
      case "meridian":
        setAvailableFilters(getAllMeridians());
        break;
      case "region":
        setAvailableFilters(getAllRegions());
        break;
      case "theme":
        setAvailableFilters(getAllThemes());
        break;
      default:
        setAvailableFilters([]);
    }
  }, [selectedMode]);

  useEffect(() => {
    if (!selectedFilter) return;

    let loadedPoints = [];
    switch (selectedMode) {
      case "meridian":
        loadedPoints = getPointsByMeridian(selectedFilter);
        break;
      case "region":
        loadedPoints = getPointsByRegion(selectedFilter);
        break;
      case "theme":
        loadedPoints = getPointsByTheme(selectedFilter);
        break;
      default:
        loadedPoints = [];
    }
    setPoints(loadedPoints);
    setCurrentIndex(0);
    setSessionStats({ correct: 0, incorrect: 0, total: loadedPoints.length });
  }, [selectedMode, selectedFilter]);

  useEffect(() => {
    if (points.length > 0 && currentIndex < points.length) {
      const currentPoint = points[currentIndex];
      const mastery = getPointMastery(currentPoint.id);
      setCurrentPointMastery(mastery);
      setCurrentPointInsight(generateInsight(currentPoint, { mastery }));
    }
  }, [points, currentIndex]);

  const handleAnswer = (isCorrect) => {
    const currentPoint = points[currentIndex];
    updatePointProgress(currentPoint.id, isCorrect);
    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      total: prev.total,
    }));
    if (currentIndex === points.length - 1) {
      const sessionData = {
        mode: selectedMode,
        filter: selectedFilter,
        stats: sessionStats,
        duration: new Date() - sessionStartTime,
        points: points.map((p) => ({
          id: p.id,
          correct: p.id === currentPoint.id ? isCorrect : null,
        })),
      };
      recordSession(sessionData);
      onComplete(sessionData);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Custom row for mode selection
  const renderModeRow = () => (
    <div className="flex justify-between items-center gap-2 mb-6">
      <button
        className={`px-3 py-2 font-bold rounded-lg border-2 border-gold bg-deepred text-gold text-xs uppercase tracking-wide shadow-lg hover:bg-gold hover:text-deepred transition-all duration-200`}
        onClick={() => setSelectedMode("maekChiKi")}
      >
        Maek Chi Ki
      </button>
      <button
        className={`px-3 py-2 font-bold rounded-lg border-2 border-gold bg-deepred text-gold text-xs uppercase tracking-wide shadow-lg hover:bg-gold hover:text-deepred transition-all duration-200 ${selectedMode === "region" ? "ring-2 ring-gold" : ""}`}
        onClick={() => setSelectedMode("region")}
      >
        By Region
      </button>
      <button
        className={`px-3 py-2 font-bold rounded-lg border-2 border-gold bg-deepred text-gold text-xs uppercase tracking-wide shadow-lg hover:bg-gold hover:text-deepred transition-all duration-200 ${selectedMode === "theme" ? "ring-2 ring-gold" : ""}`}
        onClick={() => setSelectedMode("theme")}
      >
        By Theme
      </button>
      <button
        className={`px-3 py-2 font-bold rounded-lg border-2 border-gold bg-deepred text-gold text-xs uppercase tracking-wide shadow-lg hover:bg-gold hover:text-deepred transition-all duration-200 ${selectedMode === "meridian" ? "ring-2 ring-gold" : ""}`}
        onClick={() => setSelectedMode("meridian")}
      >
        By Meridian
      </button>
      <button
        className={`px-3 py-2 font-bold rounded-lg border-2 border-gold bg-deepred text-gold text-xs uppercase tracking-wide shadow-lg hover:bg-gold hover:text-deepred transition-all duration-200`}
        onClick={() => setSelectedMode("maekChaKi")}
      >
        Maek Cha Ki
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark text-gold font-serif flex flex-col items-center py-6 px-2">
      <div className="w-16 h-16 mb-4 flex items-center justify-center">
        <TriskelionLogo size={56} />
      </div>
      <h2 className="text-2xl font-bold uppercase tracking-wide mb-2">
        Start Daily Session
      </h2>
      {renderModeRow()}
      <div className="text-center text-white font-sans mb-4">
        {selectedMode === "meridian" && "Select a meridian to train."}
        {selectedMode === "region" && "Select a region to train."}
        {selectedMode === "theme" && "Select a theme to train."}
        {selectedMode === "maekChiKi" && "Maek Chi Ki mode."}
        {selectedMode === "maekChaKi" && "Maek Cha Ki mode."}
      </div>
      {/* Filter selection */}
      {["meridian", "region", "theme"].includes(selectedMode) && (
        <div className="w-full max-w-xs mx-auto mb-4">
          <div className="grid grid-cols-1 gap-2">
            {availableFilters.map((filter) => (
              <button
                key={filter}
                className={`w-full px-4 py-2 bg-dark border-2 border-gold text-gold font-bold rounded-lg shadow hover:bg-gold hover:text-deepred transition-all duration-200 ${selectedFilter === filter ? "ring-2 ring-gold" : ""}`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Begin button */}
      <button
        className="mt-4 px-8 py-3 bg-deepred border-2 border-gold text-gold font-bold rounded-lg text-lg uppercase tracking-wide shadow-lg hover:bg-gold hover:text-deepred transition-all duration-200"
        onClick={() => setSelectedFilter(availableFilters[0])}
        disabled={!selectedFilter}
      >
        Begin
      </button>
    </div>
  );
};

export default TrainingSession;
