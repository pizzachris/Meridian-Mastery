import React, { useState, useEffect } from "react";
import Home from "./components/Home";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  // Navigation function
  const navigateTo = (page, options = {}) => {
    setCurrentPage(page);
  };

  // Simple test - just render Home component
  return (
    <div className="min-h-screen bg-black text-white">
      <div>App is loading...</div>
      <Home navigateTo={navigateTo} />
    </div>
  );
}

export default App;
