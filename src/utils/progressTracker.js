// Progress tracking utility for Meridian Mastery app
import { getAllPoints } from "./dataLoader";

// In-memory cache to reduce localStorage access
let progressCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 30000; // 30 seconds

// Debounced save function to batch localStorage writes
let saveTimeout = null;
const debouncedSave = (progress) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem("meridianMasteryProgress", JSON.stringify(progress));
      console.log("Progress saved to localStorage");
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  }, 500); // Save after 500ms of inactivity
};

// Load progress from localStorage with caching
const loadProgress = () => {
  const now = Date.now();

  // Return cached data if it's still fresh
  if (
    progressCache &&
    cacheTimestamp &&
    now - cacheTimestamp < CACHE_DURATION
  ) {
    return progressCache;
  }

  try {
    const savedProgress = localStorage.getItem("meridianMasteryProgress");
    progressCache = savedProgress
      ? JSON.parse(savedProgress)
      : {
          points: {},
          sessions: [],
          mastery: {},
          dailySessions: { current: 0, total: 10 },
          totalQuizAttempts: 0,
          retentionScores: {},
        };
    cacheTimestamp = now;
  } catch (error) {
    console.error("Failed to load progress:", error);
    progressCache = {
      points: {},
      sessions: [],
      mastery: {},
      dailySessions: { current: 0, total: 10 },
      totalQuizAttempts: 0,
      retentionScores: {},
    };
  }

  return progressCache;
};

// Save progress to localStorage with debouncing
const saveProgress = (progress) => {
  progressCache = progress;
  cacheTimestamp = Date.now();
  debouncedSave(progress);
};

// Force immediate save (for critical operations)
const saveProgressImmediate = (progress) => {
  progressCache = progress;
  cacheTimestamp = Date.now();
  clearTimeout(saveTimeout);
  try {
    localStorage.setItem("meridianMasteryProgress", JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save progress immediately:", error);
  }
};

// Clear cache (useful for testing or data refresh)
export const clearProgressCache = () => {
  progressCache = null;
  cacheTimestamp = null;
  clearTimeout(saveTimeout);
};

// --- Existing ProgressTracker code ---

export class ProgressTracker {
  static STORAGE_KEY = "meridian-mastery-progress";
  static RETENTION_THRESHOLD = 0.7; // 70% retention score required to consider a point mastered

  static async getProgress() {
    try {
      const progress = localStorage.getItem(this.STORAGE_KEY);
      const parsed = progress
        ? JSON.parse(progress)
        : await this.initializeProgress();

      // Ensure backward compatibility - add missing fields
      if (!parsed.sessionHistory) {
        parsed.sessionHistory = [];
      }
      if (!parsed.studiedPoints) {
        parsed.studiedPoints = {};
      }
      if (!parsed.meridianProgress) {
        parsed.meridianProgress = {};
      }

      return parsed;
    } catch (error) {
      console.error("Error loading progress, resetting:", error);
      // If there's an error, reset and return fresh progress
      localStorage.removeItem(this.STORAGE_KEY);
      return await this.initializeProgress();
    }
  }

  static async initializeProgress() {
    try {
      const points = await getAllPoints();

      // Ensure points is an array
      if (!Array.isArray(points)) {
        console.error("getAllPoints() did not return an array:", points);
        throw new Error("Invalid points data format");
      }

      const initialProgress = {
        studiedPoints: {},
        lastSessionDate: null,
        totalSessions: 0,
        totalQuizAttempts: 0,
        meridianProgress: {},
        retentionScores: {},
        masteryLevels: {},
        sessionHistory: [],
      };

      // Initialize progress for each point
      points.forEach((point) => {
        if (point && point.id) {
          initialProgress.studiedPoints[point.id] = {
            lastStudied: null,
            studyCount: 0,
            quizAttempts: 0,
            correctAnswers: 0,
          };
          initialProgress.retentionScores[point.id] = 0;
          initialProgress.masteryLevels[point.id] = 0;
        }
      });

      // Initialize meridian progress
      const meridians = [
        ...new Set(points.map((p) => p.meridian).filter(Boolean)),
      ];
      meridians.forEach((meridian) => {
        initialProgress.meridianProgress[meridian] = {
          pointsStudied: 0,
          totalPoints: points.filter((p) => p.meridian === meridian).length,
          masteryLevel: 0,
        };
      });

      this.saveProgress(initialProgress);
      return initialProgress;
    } catch (error) {
      console.error("Failed to initialize progress:", error);
      // Return minimal progress structure if everything fails
      return {
        studiedPoints: {},
        lastSessionDate: null,
        totalSessions: 0,
        totalQuizAttempts: 0,
        meridianProgress: {},
        retentionScores: {},
        masteryLevels: {},
        sessionHistory: [],
      };
    }
  }

  static saveProgress(progress) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }

  static async studyPoint(pointId, meridian) {
    try {
      const progress = await this.getProgress();
      const now = new Date().toISOString();

      // Update point progress
      if (!progress.studiedPoints[pointId]) {
        progress.studiedPoints[pointId] = {
          lastStudied: null,
          studyCount: 0,
          quizAttempts: 0,
          correctAnswers: 0,
        };
      }

      progress.studiedPoints[pointId].lastStudied = now;
      progress.studiedPoints[pointId].studyCount++;

      // Update meridian progress
      if (meridian && progress.meridianProgress[meridian]) {
        const allPoints = await getAllPoints();
        if (Array.isArray(allPoints)) {
          progress.meridianProgress[meridian].pointsStudied = Object.keys(
            progress.studiedPoints,
          ).filter((pid) => {
            const point = allPoints.find((ap) => ap.id === pid);
            return point && point.meridian === meridian;
          }).length;
        }
      }

      this.saveProgress(progress);
    } catch (error) {
      console.error("Failed to study point:", error);
    }
  }

  static async recordQuizAttempt(pointId, isCorrect, meridian) {
    try {
      const progress = await this.getProgress();
      const now = new Date().toISOString();

      // Initialize point progress if needed
      if (!progress.studiedPoints[pointId]) {
        progress.studiedPoints[pointId] = {
          lastStudied: null,
          studyCount: 0,
          quizAttempts: 0,
          correctAnswers: 0,
        };
      }

      // Update point progress
      progress.studiedPoints[pointId].quizAttempts++;
      if (isCorrect) {
        progress.studiedPoints[pointId].correctAnswers++;
      }

      // Update retention score
      const point = progress.studiedPoints[pointId];
      const retentionScore =
        point.quizAttempts > 0 ? point.correctAnswers / point.quizAttempts : 0;
      progress.retentionScores[pointId] = retentionScore;

      // Update mastery level
      progress.masteryLevels[pointId] = this.calculateMasteryLevel(
        retentionScore,
        point.studyCount,
      );

      // Update meridian progress
      if (meridian && progress.meridianProgress[meridian]) {
        const allPoints = await getAllPoints();
        if (Array.isArray(allPoints)) {
          const meridianPoints = allPoints.filter(
            (p) => p.meridian === meridian,
          );
          const meridianMastery =
            meridianPoints.reduce(
              (sum, p) => sum + (progress.masteryLevels[p.id] || 0),
              0,
            ) / meridianPoints.length;
          progress.meridianProgress[meridian].masteryLevel = meridianMastery;
        }
      }

      // Increment total quiz attempts
      progress.totalQuizAttempts = (progress.totalQuizAttempts || 0) + 1;

      this.saveProgress(progress);
    } catch (error) {
      console.error("Failed to record quiz attempt:", error);
    }
  }

  static calculateMasteryLevel(retentionScore, studyCount) {
    // Simple mastery calculation for now
    // Can be refined based on spaced repetition principles later
    if (retentionScore >= 0.9 && studyCount >= 5) return 5; // Mastered
    if (retentionScore >= 0.7 && studyCount >= 3) return 4; // Proficient
    if (retentionScore >= 0.5 && studyCount >= 2) return 3; // Competent
    if (retentionScore > 0) return 2; // Practiced
    if (studyCount > 0) return 1; // Started
    return 0; // New
  }

  static async getPointsNeedingReview() {
    try {
      const progress = await this.getProgress();
      const allPoints = await getAllPoints();

      if (!Array.isArray(allPoints)) {
        console.error("getAllPoints did not return an array");
        return [];
      }

      const now = new Date();

      // Filter points based on review criteria
      return allPoints.filter((point) => {
        if (!point || !point.id) return false;

        const stats = progress.studiedPoints[point.id];

        // If never studied, needs review
        if (!stats) return true;

        const lastStudiedDate = stats.lastStudied
          ? new Date(stats.lastStudied)
          : null;
        const daysSinceLastStudied = lastStudiedDate
          ? (now - lastStudiedDate) / (1000 * 60 * 60 * 24)
          : Infinity;

        // Needs review if:
        // 1. Hasn't been studied in a while (e.g., 7 days for mastery < 5, 30 days for mastery 5)
        // 2. Has low mastery level (< 4)
        const masteryLevel = this.calculateMasteryLevel(
          stats.correctAnswers / (stats.quizAttempts || 1),
          stats.studyCount,
        );

        if (masteryLevel < 4 && daysSinceLastStudied >= 7) return true;
        if (masteryLevel >= 4 && daysSinceLastStudied >= 30) return true;

        return false;
      });
    } catch (error) {
      console.error("Error getting points needing review:", error);
      return [];
    }
  }

  static async getPointStats(pointId) {
    try {
      const progress = await this.getProgress();
      return (
        progress.studiedPoints[pointId] || {
          lastStudied: null,
          studyCount: 0,
          quizAttempts: 0,
          correctAnswers: 0,
        }
      );
    } catch (error) {
      console.error("Error getting point stats:", error);
      return {
        lastStudied: null,
        studyCount: 0,
        quizAttempts: 0,
        correctAnswers: 0,
      };
    }
  }

  static async getStats() {
    try {
      const progress = await this.getProgress();
      const allPoints = await getAllPoints();

      if (!Array.isArray(allPoints)) {
        console.error("getAllPoints did not return an array");
        return {
          totalPoints: 0,
          studiedPointsCount: 0,
          overallProgressPercentage: 0,
          totalSessions: 0,
          averageMastery: 0,
          totalQuizAttempts: 0,
        };
      }

      const totalPoints = allPoints.length;
      const studiedPointsCount = Object.keys(progress.studiedPoints).length;
      const totalSessions = progress.totalSessions || 0;

      // Calculate overall mastery level (average of all masteryLevels)
      const totalMastery = Object.values(progress.masteryLevels).reduce(
        (sum, level) => sum + level,
        0,
      );
      const averageMastery = totalPoints > 0 ? totalMastery / totalPoints : 0;

      return {
        totalPoints,
        studiedPointsCount,
        overallProgressPercentage:
          totalPoints > 0
            ? Math.round((studiedPointsCount / totalPoints) * 100)
            : 0,
        totalSessions,
        averageMastery: Math.round(averageMastery * 10) / 10, // Round to 1 decimal place
        totalQuizAttempts: progress.totalQuizAttempts || 0,
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      return {
        totalPoints: 0,
        studiedPointsCount: 0,
        overallProgressPercentage: 0,
        totalSessions: 0,
        averageMastery: 0,
        totalQuizAttempts: 0,
      };
    }
  }

  static async completeSession(sessionType, cardsViewed = 0) {
    try {
      const progress = await this.getProgress();
      progress.totalSessions = (progress.totalSessions || 0) + 1;
      progress.lastSessionDate = new Date().toISOString();

      // Ensure sessionHistory exists (backward compatibility)
      if (!progress.sessionHistory) {
        progress.sessionHistory = [];
      }

      // Record session details in sessionHistory
      progress.sessionHistory.push({
        type: sessionType,
        timestamp: new Date().toISOString(),
        cardsViewed: cardsViewed,
        // Add more session details here if needed
      });
      this.saveProgress(progress);
    } catch (error) {
      console.error("Error completing session:", error);
    }
  }

  static async resetProgress() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      // Re-initialize after removal
      await this.initializeProgress();
    } catch (error) {
      console.error("Error resetting progress:", error);
    }
  }

  // --- New/Corrected Quiz Functions ---

  static async getQuizStats(pointId) {
    try {
      const progress = await this.getProgress();
      const pointStats = progress.studiedPoints[pointId] || {};
      return {
        quizAttempts: pointStats.quizAttempts || 0,
        correctAnswers: pointStats.correctAnswers || 0,
      };
    } catch (error) {
      console.error("Error getting quiz stats:", error);
      return {
        quizAttempts: 0,
        correctAnswers: 0,
      };
    }
  }
}

export default ProgressTracker;
