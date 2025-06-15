import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context with default values
const SettingsContext = createContext({
  showElementalModal: true, // Default to showing the modal
  setShowElementalModal: () => {},
});

// Create a provider component
export const SettingsProvider = ({ children }) => {
  // Initialize state from localStorage if available, otherwise use default
  const [showElementalModal, setShowElementalModal] = useState(() => {
    try {
      const savedValue = localStorage.getItem(
        "meridian-mastery-show-elemental-modal",
      );
      // If the value has never been set, default to true (show modal)
      return savedValue === null ? true : savedValue === "true";
    } catch (error) {
      console.error("Failed to load elemental modal setting:", error);
      return true; // Default to showing modal on error
    }
  });

  // Update localStorage when the setting changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "meridian-mastery-show-elemental-modal",
        showElementalModal.toString(),
      );
    } catch (error) {
      console.error("Failed to save elemental modal setting:", error);
    }
  }, [showElementalModal]);

  // The value that will be provided to consumers of this context
  const value = {
    showElementalModal,
    setShowElementalModal,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook for easier context consumption
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export default SettingsContext;
