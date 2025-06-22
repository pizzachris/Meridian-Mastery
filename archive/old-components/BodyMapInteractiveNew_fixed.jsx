import React, { useState, useEffect } from "react";
import Logo from "./Logo";

const BodyMapInteractiveNew = ({ navigateTo }) => {
  const [currentView, setCurrentView] = useState("side");
  const [selectedMeridian, setSelectedMeridian] = useState("");
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showZoomedView, setShowZoomedView] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Available meridians - only complete ones
  const availableMeridians = [
    { id: "Lung", name: "Lung", element: "element-metal", view: "front" },
    { id: "LargeIntestine", name: "Large Intestine", element: "element-metal", view: "front" }
  ];

  // Auto-switch view when meridian is selected
  useEffect(() => {
    if (selectedMeridian) {
      const meridian = availableMeridians.find(m => m.id === selectedMeridian);
      if (meridian && meridian.view !== currentView) {
        setCurrentView(meridian.view);
      }
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
      // Use region-specific image for zoom
      return `/regions/${currentView}_view_full_cleaned.png`;
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

  // Clear selection and return to meridian selector
  const clearSelection = () => {
    setSelectedMeridian("");
    setSelectedPoint(null);
    setShowZoomedView(false);
    setIsFlipped(false);
  };

  // Get meridian abbreviation for badge
  const getMeridianAbbreviation = (meridianName) => {
    const abbrevMap = {
      Lung: "LU",
      LargeIntestine: "LI"
    };
    return abbrevMap[meridianName] || "UN";
  };

  // Get element colors
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

        {/* Back Button - appears when meridian is selected */}
        {selectedMeridian && (
          <button
            onClick={clearSelection}
            className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-400/30 text-blue-400 font-bold text-sm hover:text-blue-300 hover:bg-black/90 transition-colors"
            title="Back to Meridian Selector"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="pt-16 pb-4 px-4">
        {!selectedMeridian ? (
          // Meridian Selector View
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 text-yellow-400">Select a Meridian</h1>
              <p className="text-gray-300">Choose a meridian to view pressure points</p>
            </div>
            
            {/* Meridian Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              {availableMeridians.map((meridian) => (
                <button
                  key={meridian.id}
                  onClick={() => handleMeridianSelect(meridian.id)}
                  className={`${meridian.element} font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-center`}
                >
                  {meridian.name}
                </button>
              ))}
            </div>
          </div>
        ) : showZoomedView && selectedPoint ? (
          // Zoomed View with Flashcard
          <div className="max-w-4xl mx-auto">
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
                    alt={`Zoomed ${currentView} view`}
                    className="w-full h-auto block"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      // Zoom to focus on the selected point region
                      transform: `scale(3) translate(${(0.5 - selectedPoint.x) * 33.33}%, ${(0.5 - selectedPoint.y) * 33.33}%)`,
                      transformOrigin: "center"
                    }}
                  />
                  
                  {/* Highlight the selected point */}
                  <div
                    className="absolute w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-lg z-10"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)"
                    }}
                  />
                </div>

                <button
                  onClick={closeZoom}
                  className="w-full mt-4 element-water font-bold py-3 px-6 rounded-xl text-sm transition-all duration-300 transform hover:scale-105"
                >
                  ← Back to Full View
                </button>
              </div>

              {/* Flashcard */}
              <div className="flex-1 max-w-md">
                <div
                  className={`relative w-full h-80 transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 w-full h-full backface-hidden">
                    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-xl h-full flex flex-col justify-center items-center p-6 relative">
                      {/* Meridian badge */}
                      <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 ${getElementColors().bg} ${getElementColors().text} px-4 py-2 rounded-lg border-2 ${getElementColors().border}`}>
                        <span className="text-sm font-bold">
                          {getMeridianAbbreviation(selectedMeridian)}{selectedPoint.id?.replace(/\D/g, '')} • METAL
                        </span>
                      </div>

                      {/* Korean characters */}
                      <div className="text-5xl font-bold text-yellow-400 mb-4 text-center mt-16">
                        {selectedPoint.name_korean || selectedPoint.name}
                      </div>
                      
                      {/* English translation */}
                      <div className="text-xl text-white text-center font-medium">
                        {selectedPoint.name_english || selectedPoint.name}
                      </div>
                      
                      {/* Romanized Korean */}
                      <div className="text-base text-gray-300 text-center mt-2">
                        {selectedPoint.name_romanized || selectedPoint.name}
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400 rounded-xl h-full p-4 text-xs flex flex-col overflow-hidden">
                      {/* Header */}
                      <div className="text-center mb-3 border-b border-gray-700 pb-2 flex-shrink-0">
                        <h2 className="text-sm font-bold text-yellow-400 mb-1">
                          {selectedPoint.name_romanized || selectedPoint.name}
                        </h2>
                        <p className="text-gray-300 text-xs">{selectedPoint.name_korean || selectedPoint.name}</p>
                        <p className="text-gray-400 text-xs">
                          {selectedPoint.id} {selectedMeridian} Meridian
                        </p>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2 overflow-y-auto">
                        {/* Location */}
                        {selectedPoint.location && (
                          <div className="bg-yellow-600 text-black p-2 rounded">
                            <h3 className="font-bold text-xs mb-1">LOCATION:</h3>
                            <p className="text-xs leading-tight">{selectedPoint.location}</p>
                          </div>
                        )}

                        {/* Technique */}
                        {selectedPoint.technique && (
                          <div className="bg-red-600 text-white p-2 rounded">
                            <h3 className="font-bold text-xs mb-1">TECHNIQUE:</h3>
                            <p className="text-xs leading-tight">{selectedPoint.technique}</p>
                          </div>
                        )}

                        {/* Notes */}
                        {selectedPoint.notes && (
                          <div className="bg-blue-600 text-white p-2 rounded">
                            <h3 className="font-bold text-xs mb-1">NOTES:</h3>
                            <p className="text-xs leading-tight">{selectedPoint.notes}</p>
                          </div>
                        )}

                        {/* Region */}
                        {selectedPoint.region && (
                          <div className="bg-green-600 text-white p-2 rounded">
                            <h3 className="font-bold text-xs mb-1">REGION:</h3>
                            <p className="text-xs leading-tight">{selectedPoint.region}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flip Card Button */}
                <button
                  onClick={flipCard}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {isFlipped ? "Show Front" : "Show Details"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Body Map View
          <div className="max-w-6xl mx-auto">
            {/* Master Your Meridians Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Master Your Meridians
              </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Body Map */}
              <div className="flex-1">
                <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={getCurrentImagePath()}
                    alt={`${currentView} view`}
                    className="w-full h-auto block"
                    style={{
                      maxWidth: "100%",
                      height: "auto"
                    }}
                  />

                  {/* Points Overlay */}
                  {points.map((point, index) => (
                    <button
                      key={index}
                      onClick={() => handlePointClick(point)}
                      className="point-button absolute bg-red-500 rounded-full border-2 border-white hover:bg-red-400 hover:scale-125 transition-all shadow-lg cursor-pointer"
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

              {/* Meridian Selector on Right */}
              <div className="lg:w-48 w-full">
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-400/30">
                  <h3 className="text-yellow-400 font-bold text-center mb-4">SELECT MERIDIAN</h3>
                  <div className="space-y-3">
                    {availableMeridians.map((meridian) => (
                      <button
                        key={meridian.id}
                        onClick={() => handleMeridianSelect(meridian.id)}
                        className={`w-full ${meridian.element} font-semibold py-3 px-4 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 ${selectedMeridian === meridian.id ? 'ring-2 ring-yellow-400' : ''}`}
                      >
                        {meridian.name}
                      </button>
                    ))}
                  </div>
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
