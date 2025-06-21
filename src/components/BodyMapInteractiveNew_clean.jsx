import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import { getAllPoints } from "../utils/dataLoaderOptimized";

const BodyMapInteractiveNew = ({ navigateTo }) => {
  const [currentView, setCurrentView] = useState("side");
  const [selectedMeridian, setSelectedMeridian] = useState("");
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showZoomedView, setShowZoomedView] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [allFlashcardData, setAllFlashcardData] = useState([]);

  // Available meridians - only complete ones
  const availableMeridians = [
    { id: "Lung", name: "Lung", element: "element-metal", view: "front" },
    { id: "LargeIntestine", name: "Large Intestine", element: "element-metal", view: "front" }
  ];

  // Load all flashcard data on component mount
  useEffect(() => {
    const loadFlashcardData = async () => {
      try {
        const allPoints = await getAllPoints();
        setAllFlashcardData(allPoints);
        console.log('Loaded flashcard data:', allPoints.length, 'points');
      } catch (error) {
        console.error('Failed to load flashcard data:', error);
      }
    };
    loadFlashcardData();
  }, []);

  // Auto-switch view when meridian is selected
  useEffect(() => {
    if (selectedMeridian) {
      const meridian = availableMeridians.find(m => m.id === selectedMeridian);
      if (meridian && meridian.view !== currentView) {
        setCurrentView(meridian.view);
      }
    } else {
      // Reset to side view when no meridian selected (home state)
      setCurrentView("side");
    }
  }, [selectedMeridian]);

  // Load meridian data when meridian is selected
  useEffect(() => {
    if (selectedMeridian) {
      const filename = `${selectedMeridian.toLowerCase()}_meridian_with_regions.json`;
      fetch(`/data/${filename}`)
        .then(res => res.json())
        .then(data => {
          console.log(`Loaded meridian data for ${selectedMeridian}:`, data);
          setPoints(data.points || []);
        })
        .catch(err => {
          console.error(`Failed to load meridian data: ${filename}`, err);
          setPoints([]);
        });
    } else {
      setPoints([]);
    }
  }, [selectedMeridian]);

  // Get current image path
  const getCurrentImagePath = () => {
    if (showZoomedView && selectedPoint) {
      // Get region-specific image for true zoom
      const regionMap = {
        "Trunk Front": "/region images final/trunk_front_manual_v1.png",
        "Trunk Back": "/region images final/trunk_back_manual_v1.png", 
        "Arms Front": "/region images final/arms_front_manual_v6.png",
        "Arms Back": "/region images final/arms_back_manual_v1.png",
        "Legs Front": "/region images final/legs_front_manual_v4.png",
        "Legs Back": "/region images final/legs_back_manual_v1.png",
        "Feet Front": "/region images final/feet_front_manual_v4.png",
        "Feet Back": "/region images final/feet_back_manual_final.png",
        "Head Front": "/region images final/head_neck_front_manual_v4.png",
        "Head Back": "/region images final/head_neck_back_manual_v1.png"
      };
      
      const regionImage = regionMap[selectedPoint.region];
      if (regionImage) {
        return regionImage;
      }
    }
    
    switch (currentView) {
      case "front":
        return "/regions/front_view_full_cleaned.png";
      case "back":
        return "/regions/back_view_full_cleaned.png";
      case "side":
        return "/regions/side_full_cleaned.png";
      default:
        return "/regions/side_full_cleaned.png";
    }
  };

  // Find flashcard data for selected point
  const getFlashcardData = (point) => {
    if (!allFlashcardData.length) return null;
    
    // Try to match by point ID (like LU2, LI4, etc.)
    let flashcard = allFlashcardData.find(card => 
      card.pointNumber === point.id || 
      card.nameRomanized?.toLowerCase() === point.name.toLowerCase()
    );
    
    // If not found, try partial matches
    if (!flashcard) {
      const pointNum = point.id.replace(/[A-Z]+/, ''); // Extract number part
      flashcard = allFlashcardData.find(card => 
        card.pointNumber?.toString().includes(pointNum) &&
        card.meridianName?.toLowerCase().includes(selectedMeridian.toLowerCase())
      );
    }
    
    return flashcard;
  };

  // Handle meridian selection
  const handleMeridianSelect = (meridianId) => {
    setSelectedMeridian(meridianId);
    setSelectedPoint(null);
    setShowZoomedView(false);
    setIsFlipped(false);
  };

  // Handle point click - zoom to that region
  const handlePointClick = (point) => {
    console.log("Point clicked:", point);
    setSelectedPoint(point);
    setShowZoomedView(true);
    setIsFlipped(false); // Start with front side of flashcard
  };

  // Close zoom and flashcard
  const closeZoom = () => {
    setSelectedPoint(null);
    setShowZoomedView(false);
    setIsFlipped(false);
  };

  // Flip flashcard
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Clear selection and return to home view
  const clearSelection = () => {
    setSelectedMeridian("");
    setSelectedPoint(null);
    setShowZoomedView(false);
    setIsFlipped(false);
  };

  // Get meridian abbreviation for badge
  const getMeridianAbbreviation = (meridianName, pointNumber) => {
    const abbrevMap = {
      Lung: "LU",
      LargeIntestine: "LI",
      "Large Intestine": "LI"
    };
    const abbrev = abbrevMap[meridianName] || "UN";
    const number = pointNumber?.replace(/[A-Z]+/, '') || '';
    return `${abbrev}${number}`;
  };

  // Get element colors for Metal element
  const getElementColors = () => ({
    bg: "bg-gray-600",
    text: "text-white",
    border: "border-gray-400"
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header with Logo and Back Button */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
        {/* Logo - Home Button */}
        <button
          onClick={() => navigateTo("home")}
          className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-yellow-400/30 hover:border-yellow-400 transition-colors"
          title="Return to Home"
        >
          <Logo className="w-8 h-8 text-yellow-400" />
        </button>

        {/* Back Button - appears when meridian is selected or in zoom view */}
        {(selectedMeridian || showZoomedView) && (
          <button
            onClick={showZoomedView ? closeZoom : clearSelection}
            className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-400/30 text-blue-400 font-bold text-sm hover:text-blue-300 hover:bg-black/90 transition-colors"
            title={showZoomedView ? "Back to Body Map" : "Back to Home"}
          >
            ← {showZoomedView ? "Full View" : "Back"}
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="pt-16 pb-4 px-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {showZoomedView && selectedPoint ? (
          // Zoomed View with Flashcard
          <div className="max-w-6xl mx-auto">
            {/* Master Your Meridians Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Master Your Meridians
              </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Zoomed Region View */}
              <div className="flex-1">
                <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={getCurrentImagePath()}
                    alt={`${selectedPoint.region} region`}
                    className="w-full h-auto block"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  
                  {/* Highlight the selected point - position based on region image */}
                  <div
                    className="absolute w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg z-10 animate-pulse"
                    style={{
                      left: `${selectedPoint.x * 100}%`,
                      top: `${selectedPoint.y * 100}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                  />
                </div>
              </div>

              {/* Flashcard */}
              <div className="flex-1 max-w-md">
                {(() => {
                  const flashcardData = getFlashcardData(selectedPoint);
                  return (
                    <div
                      className={`relative w-full h-96 transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
                    >
                      {/* Front Side */}
                      <div className="absolute inset-0 w-full h-full backface-hidden">
                        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-xl h-full flex flex-col justify-center items-center p-6 relative">
                          {/* Meridian badge */}
                          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 ${getElementColors().bg} ${getElementColors().text} px-4 py-2 rounded-lg border-2 ${getElementColors().border}`}>
                            <span className="text-sm font-bold">
                              {getMeridianAbbreviation(selectedMeridian, selectedPoint.id)} • METAL
                            </span>
                          </div>

                          {/* Korean Hangul */}
                          <div className="text-4xl font-bold text-yellow-400 mb-4 text-center mt-16">
                            {flashcardData?.nameHangul || flashcardData?.hangul || selectedPoint.name}
                          </div>
                          
                          {/* English translation */}
                          <div className="text-xl text-white text-center font-medium">
                            {flashcardData?.nameEnglish || flashcardData?.englishTranslation || selectedPoint.name}
                          </div>
                          
                          {/* Romanized Korean */}
                          <div className="text-base text-gray-300 text-center mt-2">
                            {flashcardData?.nameRomanized || selectedPoint.name}
                          </div>

                          {/* Flip indicator */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm">
                            Tap card to flip
                          </div>
                        </div>
                      </div>

                      {/* Back Side - Real flashcard back */}
                      <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400 rounded-xl h-full p-4 text-xs flex flex-col overflow-hidden">
                          {/* Header */}
                          <div className="text-center mb-3 border-b border-gray-700 pb-2 flex-shrink-0">
                            <h2 className="text-sm font-bold text-yellow-400 mb-1">
                              {flashcardData?.nameRomanized || selectedPoint.name}
                            </h2>
                            <p className="text-gray-300 text-xs">
                              {flashcardData?.nameHangul || selectedPoint.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {getMeridianAbbreviation(selectedMeridian, selectedPoint.id)} {selectedMeridian} Meridian
                            </p>
                          </div>

                          {/* Information sections - scrollable */}
                          <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
                            {/* Location */}
                            {flashcardData?.location && (
                              <div className="bg-yellow-600 text-black p-2 rounded">
                                <h3 className="font-bold text-xs mb-1">LOCATION:</h3>
                                <p className="text-xs leading-relaxed">{flashcardData.location}</p>
                              </div>
                            )}

                            {/* Striking Effect */}
                            <div className="bg-yellow-600 text-black p-2 rounded">
                              <h3 className="font-bold text-xs mb-1">STRIKING EFFECT:</h3>
                              <p className="text-xs leading-relaxed">
                                {flashcardData?.martialApplication || 
                                 "The point is usually struck to an upward direction with a blunt edge."}
                              </p>
                            </div>

                            {/* Observed Effects */}
                            <div className="bg-yellow-600 text-black p-2 rounded">
                              <h3 className="font-bold text-xs mb-1">OBSERVED EFFECTS:</h3>
                              <p className="text-xs leading-relaxed">
                                {flashcardData?.healingFunction || 
                                 "Light to moderate knockout. Liver dysfunction in theory. Be responsible."}
                              </p>
                            </div>

                            {/* Insight */}
                            <div className="bg-yellow-600 text-black p-2 rounded">
                              <h3 className="font-bold text-xs mb-1">INSIGHT:</h3>
                              <p className="text-xs leading-relaxed">
                                {flashcardData?.insightText && flashcardData.insightText.length > 150
                                  ? flashcardData.insightText.substring(0, 150) + "..."
                                  : flashcardData?.insightText || 
                                    "This point has the potential to affect the associated meridian. Be responsible."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Card controls */}
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={flipCard}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    Flip Card
                  </button>
                  <button
                    onClick={closeZoom}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Home View - Body Model with Meridian Selector on Right
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
            {/* Main content area with title and body model */}
            <div className="flex-1">
              <div className="text-center mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Master Your Meridians
                </h1>
                <p className="text-gray-300">
                  {selectedMeridian 
                    ? `${selectedMeridian} Meridian Points - Click a point to zoom in`
                    : "Select a meridian to view pressure points"}
                </p>
              </div>
              
              {/* Body Map Container */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                {/* Body Image */}
                <img
                  src={getCurrentImagePath()}
                  alt={`${currentView} view`}
                  className="w-full h-auto block"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    imageRendering: "auto"
                  }}
                />
                
                {/* Points Overlay - only show when meridian is selected */}
                {selectedMeridian && points.map((point, index) => (
                  <button
                    key={index}
                    onClick={() => handlePointClick(point)}
                    className="absolute bg-red-500 rounded-full border-2 border-white hover:bg-red-400 hover:scale-125 transition-all shadow-lg cursor-pointer w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                    style={{
                      left: `${point.x * 100}%`,
                      top: `${point.y * 100}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                    title={`${point.id}: ${point.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Meridian Selector - Right side */}
            <div className="lg:w-64 lg:flex-shrink-0">
              <div className="lg:sticky lg:top-4">
                <h2 className="text-lg font-bold text-yellow-400 mb-4 text-center lg:text-left">
                  {selectedMeridian ? "Switch Meridian" : "Select Meridian"}
                </h2>
                <div className="flex flex-col gap-3">
                  {availableMeridians.map((meridian) => (
                    <button
                      key={meridian.id}
                      onClick={() => handleMeridianSelect(meridian.id)}
                      className={`${meridian.element} font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-center ${
                        selectedMeridian === meridian.id ? 'ring-2 ring-yellow-400' : ''
                      }`}
                    >
                      {meridian.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyMapInteractiveNew;
