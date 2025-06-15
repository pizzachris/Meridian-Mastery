import React, { useState } from "react";
import Logo from "./Logo";

const DisclaimerModal = ({ isOpen, onAccept }) => {
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-yellow-600 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          {" "}
          <div className="flex items-center justify-center mb-4">
            <Logo className="w-12 h-12 mr-3" />
            <div className="text-left">
              <h1 className="text-xl font-bold text-white">MERIDIAN</h1>
              <h2 className="text-lg text-gray-300">MASTERY</h2>
            </div>
          </div>
          <h3 className="text-xl font-bold text-yellow-400 text-center">
            ⚠️ Important Disclaimer
          </h3>
        </div>
        {/* Content */}
        <div className="p-6 text-white space-y-4">
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
            <h4 className="font-bold text-red-400 mb-2">🚨 SAFETY WARNING</h4>
            <p className="text-sm text-gray-300">
              This application is for <strong>EDUCATIONAL PURPOSES ONLY</strong>
              . Pressure point techniques can be dangerous if applied
              incorrectly.
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-300">
            <p>
              <strong className="text-yellow-400">
                Before practicing any techniques:
              </strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>You must have proper training from a qualified instructor</li>
              <li>
                Practice only under direct supervision of a certified martial
                arts master
              </li>
              <li>
                Never apply pressure point techniques on yourself or others
                without expertise
              </li>
              <li>Improper application can cause serious injury or harm</li>
            </ul>

            <div className="border-t border-gray-600 pt-3 mt-4">
              <p>
                <strong className="text-yellow-400">This app provides:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Theoretical knowledge for study purposes</li>
                <li>Traditional Korean/TCM point locations and names</li>
                <li>Historical martial arts education content</li>
                <li>Memory aids for martial arts students</li>
              </ul>
            </div>

            <div className="bg-gray-800 border border-gray-600 rounded p-3 mt-4">
              <p className="text-xs text-gray-400">
                Content is based on traditional Kuk Sool Won teachings and
                Master R. Barry Harmon's pressure point manual. Always defer to
                your instructor's guidance.
              </p>
            </div>
          </div>
        </div>{" "}
        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <div className="space-y-3">
            <label className="flex items-start text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mr-3 mt-1 w-4 h-4 accent-yellow-500 flex-shrink-0"
              />
              <span>
                I understand this is for{" "}
                <strong className="text-yellow-400">
                  educational purposes only
                </strong>{" "}
                and should not practice these techniques without proper
                instruction and supervision from a qualified martial arts
                instructor.
              </span>
            </label>

            <button
              onClick={() => {
                if (isChecked) {
                  onAccept();
                } else {
                  // Visual feedback for unchecked state
                  const button = document.activeElement;
                  button.classList.add("animate-pulse");
                  setTimeout(
                    () => button.classList.remove("animate-pulse"),
                    1000,
                  );
                }
              }}
              disabled={!isChecked}
              className={`w-full font-bold py-3 px-6 rounded-lg border transition-all duration-200 ${
                isChecked
                  ? "bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white border-yellow-600 cursor-pointer"
                  : "bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed"
              }`}
            >
              {isChecked
                ? "I UNDERSTAND - ENTER APP"
                : "PLEASE READ AND ACCEPT ABOVE"}
            </button>

            {!isChecked && (
              <p className="text-xs text-red-400 text-center animate-pulse">
                ⚠️ You must acknowledge the safety requirements to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
