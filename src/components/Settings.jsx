import React, { useState, useEffect, useCallback, useMemo } from "react";
import DisclaimerModal from "./DisclaimerModal";
import pwaInstaller from "../utils/pwaInstaller";
import { ProgressTracker } from "../utils/progressTracker";
import Logo from "./Logo";
import { useSettings } from "../context/SettingsContext";

// Debounce utility for localStorage saves
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const Settings = ({ navigateTo, darkMode, setDarkMode }) => {
  const { showElementalModal, setShowElementalModal } = useSettings();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [autoFlip, setAutoFlip] = useState(() => {
    try {
      return localStorage.getItem("meridian-mastery-auto-flip") === "true";
    } catch (error) {
      console.error("Failed to load auto-flip setting:", error);
      return false;
    }
  });
  const [showRomanization, setShowRomanization] = useState(() => {
    try {
      return (
        localStorage.getItem("meridian-mastery-show-romanization") !== "false"
      );
    } catch (error) {
      console.error("Failed to load romanization setting:", error);
      return true;
    }
  });
  const [voicePronunciation, setVoicePronunciation] = useState(() => {
    try {
      return (
        localStorage.getItem("meridian-mastery-voice-pronunciation") === "true"
      );
    } catch (error) {
      console.error("Failed to load voice pronunciation setting:", error);
      return false;
    }
  });
  const [cardsPerSession, setCardsPerSession] = useState(() => {
    try {
      return localStorage.getItem("meridian-mastery-cards-per-session") || "10";
    } catch (error) {
      console.error("Failed to load cards per session setting:", error);
      return "10";
    }
  });
  const [shuffleCards, setShuffleCards] = useState(() => {
    try {
      return localStorage.getItem("meridian-mastery-shuffle-cards") !== "false";
    } catch (error) {
      console.error("Failed to load shuffle cards setting:", error);
      return true;
    }
  });
  const [pwaStatus, setPwaStatus] = useState(pwaInstaller.getStatus());
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Consolidated localStorage save function with debouncing
  const saveSettingsToStorage = useCallback(
    debounce((settings) => {
      try {
        const settingsToSave = {
          "meridian-mastery-auto-flip": settings.autoFlip,
          "meridian-mastery-show-romanization": settings.showRomanization,
          "meridian-mastery-voice-pronunciation": settings.voicePronunciation,
          "meridian-mastery-cards-per-session": settings.cardsPerSession,
          "meridian-mastery-shuffle-cards": settings.shuffleCards,
        };

        Object.entries(settingsToSave).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
      } catch (error) {
        console.error("Failed to save settings:", error);
        setError("Failed to save settings");
      }
    }, 300),
    [],
  );

  // Save all settings when any setting changes
  useEffect(() => {
    saveSettingsToStorage({
      autoFlip,
      showRomanization,
      voicePronunciation,
      cardsPerSession,
      shuffleCards,
    });
  }, [
    autoFlip,
    showRomanization,
    voicePronunciation,
    cardsPerSession,
    shuffleCards,
    saveSettingsToStorage,
  ]);
  // Optimized PWA status monitoring - less frequent updates
  useEffect(() => {
    const updatePWAStatus = () => {
      try {
        setPwaStatus(pwaInstaller.getStatus());
      } catch (error) {
        console.error("Failed to update PWA status:", error);
        setError("Failed to update PWA status");
      }
    };

    // Check immediately, then every 5 seconds instead of every second
    updatePWAStatus();
    const interval = setInterval(updatePWAStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInstallPWA = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await pwaInstaller.install();
      if (success) {
        setPwaStatus(pwaInstaller.getStatus());
      } else {
        throw new Error("Failed to install PWA");
      }
    } catch (error) {
      console.error("Failed to install PWA:", error);
      setError("Failed to install app. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const exportProgress = () => {
    try {
      setIsLoading(true);
      setError(null);

      const progressData = localStorage.getItem("meridian-mastery-progress");
      const flagsData = localStorage.getItem("meridian-mastery-flags");
      const settingsData = {
        autoFlip,
        showRomanization,
        voicePronunciation,
        cardsPerSession,
        shuffleCards,
      };

      const data = {
        progress: progressData ? JSON.parse(progressData) : {},
        flags: flagsData ? JSON.parse(flagsData) : [],
        settings: settingsData,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `meridian-mastery-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export data:", error);
      setError("Failed to export data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const importData = () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = async (e) => {
        try {
          setIsLoading(true);
          setError(null);

          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = JSON.parse(e.target.result);

              // Validate data structure
              if (!data.version || !data.exportDate) {
                throw new Error("Invalid file format");
              }

              // Import progress data
              if (data.progress) {
                localStorage.setItem(
                  "meridian-mastery-progress",
                  JSON.stringify(data.progress),
                );
              }

              // Import flags data
              if (data.flags) {
                localStorage.setItem(
                  "meridian-mastery-flags",
                  JSON.stringify(data.flags),
                );
              }

              // Import settings data
              if (data.settings) {
                const {
                  autoFlip,
                  showRomanization,
                  voicePronunciation,
                  cardsPerSession,
                  shuffleCards,
                } = data.settings;
                setAutoFlip(autoFlip);
                setShowRomanization(showRomanization);
                setVoicePronunciation(voicePronunciation);
                setCardsPerSession(cardsPerSession);
                setShuffleCards(shuffleCards);
              }

              // Reload app to apply changes
              window.location.reload();
            } catch (error) {
              console.error("Failed to import data:", error);
              setError("Failed to import data. Invalid file format.");
            } finally {
              setIsLoading(false);
            }
          };
          reader.readAsText(file);
        } catch (error) {
          console.error("Failed to read file:", error);
          setError("Failed to read file. Please try again.");
          setIsLoading(false);
        }
      };
      input.click();
    } catch (error) {
      console.error("Failed to import data:", error);
      setError("Failed to import data. Please try again.");
    }
  };

  const resetAllData = () => {
    try {
      if (
        confirm(
          "Are you sure you want to reset all progress data? This cannot be undone.",
        )
      ) {
        setIsLoading(true);
        setError(null);

        // Reset progress data
        localStorage.removeItem("meridian-mastery-progress");
        localStorage.removeItem("meridian-mastery-flags");

        // Reset settings to defaults
        setAutoFlip(false);
        setShowRomanization(true);
        setVoicePronunciation(false);
        setCardsPerSession("10");
        setShuffleCards(true);

        // Reset progress tracker
        ProgressTracker.resetProgress();

        // Reload app to apply changes
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to reset data:", error);
      setError("Failed to reset data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-yellow-400">Loading settings...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center py-8 px-4 mobile-safe">
      {/* Header with just Logo */}
      <div className="flex flex-col items-center mb-8 mobile-header-safe">
        {/* Logo Home Button */}
        <button
          onClick={() => navigateTo("home")}
          className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
          aria-label="Go to Home"
        >
          <Logo />
        </button>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Error Display */}
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        <div className="max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-6">
          {/* Theme Toggle */}
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Dark Mode</h3>
                <p className="text-gray-400 text-sm">
                  Toggle between light and dark themes
                </p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? "bg-yellow-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
          {/* Study Preferences */}
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-lg mb-4">Study Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Auto-flip cards</span>
                <input
                  type="checkbox"
                  checked={autoFlip}
                  onChange={(e) => setAutoFlip(e.target.checked)}
                  className="w-4 h-4 accent-yellow-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Show romanization</span>
                <input
                  type="checkbox"
                  checked={showRomanization}
                  onChange={(e) => setShowRomanization(e.target.checked)}
                  className="w-4 h-4 accent-yellow-500"
                />
              </div>{" "}
              <div className="flex items-center justify-between">
                <span>Voice pronunciation</span>
                <input
                  type="checkbox"
                  checked={voicePronunciation}
                  onChange={(e) => setVoicePronunciation(e.target.checked)}
                  className="w-4 h-4 accent-yellow-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Element theory popups</span>
                <input
                  type="checkbox"
                  checked={showElementalModal}
                  onChange={(e) => setShowElementalModal(e.target.checked)}
                  className="w-4 h-4 accent-yellow-500"
                />
              </div>
            </div>
          </div>
          {/* Session Settings */}
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-lg mb-4">Session Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Cards per session</span>
                <select
                  value={cardsPerSession}
                  onChange={(e) => setCardsPerSession(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="all">All</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span>Shuffle cards</span>
                <input
                  type="checkbox"
                  checked={shuffleCards}
                  onChange={(e) => setShuffleCards(e.target.checked)}
                  className="w-4 h-4 accent-yellow-500"
                />
              </div>
            </div>
          </div>
          {/* PWA Installation */}
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-lg mb-4 text-yellow-400">
              📱 Install App
            </h3>

            {pwaStatus.isStandalone ? (
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-3 sm:p-4">
                <div className="flex items-center text-green-400 mb-2">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  App Installed!
                </div>
                <p className="text-sm text-gray-300">
                  You're using the installed version. Enjoy offline access to
                  all your pressure point knowledge!
                </p>
              </div>
            ) : pwaStatus.canInstall ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-300">
                  Install this app for offline access and a better experience.
                </p>
                <button
                  onClick={handleInstallPWA}
                  disabled={isLoading}
                  className={`w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Installing..." : "Install Meridian Mastery"}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Works offline • No app store needed • Instant access
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-300">
                  Install instructions for {pwaStatus.platform}:
                </p>
                <div className="bg-gray-700 rounded-lg p-3">
                  {pwaInstaller
                    .getInstallInstructions()
                    .steps.map((step, index) => (
                      <p
                        key={index}
                        className="text-xs text-gray-300 mb-1 last:mb-0"
                      >
                        {step}
                      </p>
                    ))}
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Installing gives you offline access and faster loading
                </p>
              </div>
            )}

            {/* Offline Status */}
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Connection Status:</span>
                <span
                  className={`font-medium ${pwaStatus.isOnline ? "text-green-400" : "text-red-400"}`}
                >
                  {pwaStatus.isOnline ? "🟢 Online" : "🔴 Offline"}
                </span>
              </div>
            </div>
          </div>{" "}
          {/* About Section */}
          <div
            className="bg-gray-800 border border-gray-600 rounded-lg p-4 sm:p-6"
            id="about"
          >
            <h3 className="font-semibold text-lg mb-4">About</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>
                <strong>Meridian Mastery v1.0</strong>
              </p>
              <p>
                Based on traditional Korean/TCM principles as taught in Kuk Sool
                Won.
              </p>
              <p>
                Content verified from Master R. Barry Harmon's pressure point
                manual.
              </p>
              <p className="mt-4 pt-4 border-t border-gray-600">
                © 2025 Meridian Mastery. For educational purposes.
              </p>
            </div>

            {/* Full Dedication */}
            <div className="prose prose-sm text-gray-300 max-w-xl mx-auto mt-6 pt-6 border-t border-gray-600">
              <h4 className="text-lg font-semibold text-center text-yellow-400 mb-4">
                Dedication
              </h4>{" "}
              <p className="text-sm leading-relaxed mb-4">
                This app is humbly dedicated to those who have shaped my martial
                arts journey and made this work possible.
              </p>{" "}
              <p className="text-sm leading-relaxed mb-4">
                <strong className="text-yellow-300">
                  Grandmaster In-Hyuk Suh (Kuk Sa Nym)
                </strong>{" "}
                – whose vision, dedication, and transmission of traditional
                Korean martial knowledge laid the foundation for all of us who
                follow. It is with deep respect and gratitude that this app is
                offered in his honor.
              </p>
              <p className="text-sm leading-relaxed mb-4">
                <strong className="text-yellow-300">Master Barry Harmon</strong>{" "}
                – for his invaluable work in documenting the meridian and
                pressure point systems, ensuring this knowledge is preserved and
                made accessible for dedicated students.
              </p>
              <p className="text-sm leading-relaxed mb-4">
                <strong className="text-yellow-300">Master Gary Evarts</strong>{" "}
                – my first instructor, whose teaching and leadership introduced
                me to this path and provided the strong roots I continue to grow
                from.
              </p>
              <p className="text-sm leading-relaxed mb-4">
                <strong className="text-yellow-300">Master Jason Lee</strong> –
                both mentor and friend, whose example continues to guide me not
                only in martial practice, but in becoming a more compassionate
                and balanced human being.
              </p>
              <p className="italic mt-6 text-center text-yellow-400 text-sm">
                Thank you for lighting the way.
              </p>
            </div>
          </div>
          {/* Safety Disclaimer */}
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-lg mb-4 text-red-400">
              ⚠️ Safety Disclaimer
            </h3>
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-300 mb-3">
                <strong className="text-red-400">
                  FOR EDUCATIONAL PURPOSES ONLY
                </strong>
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                This application provides theoretical knowledge only. Pressure
                point techniques can be dangerous if applied incorrectly.{" "}
                <strong>
                  Never practice these techniques without proper training and
                  supervision from a qualified martial arts instructor.
                </strong>
              </p>
            </div>
            <div className="space-y-2 text-xs text-gray-400">
              <p>
                <strong>Requirements for practice:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Certified martial arts instructor supervision</li>
                <li>Proper training in pressure point application</li>
                <li>Understanding of safety protocols and contraindications</li>
                <li>Knowledge of potential risks and proper techniques</li>
              </ul>
              <p className="mt-3 pt-2 border-t border-gray-700">
                Disclaimer accepted on:{" "}
                {(() => {
                  const date = localStorage.getItem(
                    "meridian-mastery-disclaimer-date",
                  );
                  return date
                    ? new Date(date).toLocaleDateString()
                    : "Not recorded";
                })()}
              </p>
            </div>

            <button
              onClick={() => setShowDisclaimer(true)}
              className="w-full mt-4 bg-yellow-800/30 hover:bg-yellow-700/40 border border-yellow-600 text-yellow-400 py-2 px-4 rounded-lg text-sm transition-all duration-200"
            >
              📋 View Full Disclaimer
            </button>
          </div>
          {/* Data Management */}
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-lg mb-4">Data Management</h3>
            <div className="space-y-3">
              <button
                onClick={exportProgress}
                disabled={isLoading}
                className={`w-full bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 px-4 rounded-xl text-sm sm:text-base transition-all duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Exporting..." : "Export Progress"}
              </button>
              <button
                onClick={importData}
                disabled={isLoading}
                className={`w-full bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 px-4 rounded-xl text-sm sm:text-base transition-all duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Importing..." : "Import Data"}
              </button>
              <button
                onClick={resetAllData}
                disabled={isLoading}
                className={`w-full bg-red-700 hover:bg-red-600 text-white py-2 sm:py-3 px-4 rounded-xl text-sm sm:text-base transition-all duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Resetting..." : "Reset All Data"}
              </button>
            </div>
          </div>
          {/* Developer Tools */}
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-lg mb-4">Developer Tools</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigateTo("flagged-issues")}
                className="w-full bg-orange-700 hover:bg-orange-600 text-white py-2 px-4 rounded-xl flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
                </svg>
                View Flagged Issues
              </button>
              <div className="text-xs text-gray-400 text-center">
                {(() => {
                  try {
                    const flags = JSON.parse(
                      localStorage.getItem("meridian-mastery-flags") || "[]",
                    );
                    return `${flags.length} issues reported`;
                  } catch (error) {
                    console.error("Failed to load flags:", error);
                    return "0 issues reported";
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Modal */}
      <DisclaimerModal
        isOpen={showDisclaimer}
        onAccept={() => setShowDisclaimer(false)}
      />
    </div>
  );
};

export default Settings;
