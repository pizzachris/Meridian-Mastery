import React, { useState } from "react";
import Logo from "./Logo";

const DisclaimerModalSimple = ({ isOpen, onAccept }) => {
  console.log("📋 DisclaimerModalSimple rendering, isOpen:", isOpen);
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    console.log("📋 Checkbox changed:", checked);
    setIsChecked(checked);
  };

  const handleAcceptClick = () => {
    console.log("🔄 Accept button clicked, isChecked:", isChecked);
    if (isChecked) {
      console.log("✅ Checkbox is checked, calling onAccept");
      onAccept();
    } else {
      console.log("❌ Checkbox not checked");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <Logo className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Medical Disclaimer</h2>
          </div>

          <div className="space-y-4 mb-6">
            <p className="text-sm">
              <strong>IMPORTANT:</strong> This application is for educational
              purposes only and should not be used as a substitute for
              professional medical advice, diagnosis, or treatment.
            </p>

            <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">
                ⚠️ Safety Warning
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>
                  • Do not apply pressure to points without proper training
                </li>
                <li>• Consult qualified practitioners before use</li>
                <li>• Not intended for medical treatment</li>
                <li>• Educational reference only</li>
              </ul>
            </div>

            <p className="text-xs text-gray-600">
              By continuing, you acknowledge that this app is for learning
              Traditional Korean Medicine concepts and should not replace
              professional medical care.
            </p>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="disclaimer-accept"
              className="mr-3"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="disclaimer-accept" className="text-sm">
              I understand this is for educational purposes only and will
              consult medical professionals for health concerns.
            </label>
          </div>

          <button
            onClick={handleAcceptClick}
            disabled={!isChecked}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              isChecked
                ? "bg-red-700 hover:bg-red-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModalSimple;
