import React, { useState, useEffect } from "react";
import Logo from "./Logo";

const BodyMapInteractiveNew = ({ navigateTo }) => {
  const [currentView, setCurrentView] = useState("side");
  const [selectedMeridian, setSelectedMeridian] = useState("");
  const [points, setPoints] = useState([]);
  const [pathData, setPathData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [zoomRegion, setZoomRegion] = useState(null);
  // Available meridians - only complete ones
  const availableMeridians = [
    { id: "Lung", name: "Lung", element: "element-metal", view: "front" },
    { id: "LargeIntestine", name: "Large Intestine", element: "element-metal", view: "front" }
  ];

  // Meridian colors for visualization
  const meridianColors = {
    Lung: "#c0c0c0", // Metal element - silver
    LargeIntestine: "#c0c0c0" // Metal element - silver
  };

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

  // Get current image path - IMPORTANT: Keep exact original size
  const getCurrentImagePath = () => {
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
    setZoomRegion(null);
  };
  // Handle point click - zoom to 200x200px area and show flashcard
  const handlePointClick = (point) => {
    console.log("Point clicked:", point);
    setSelectedPoint(point);
    // Create 200x200px zoom region centered on point
    setZoomRegion({
      x: Math.max(0, Math.min(1 - 0.2, point.x - 0.1)), // Keep zoom within bounds
      y: Math.max(0, Math.min(1 - 0.2, point.y - 0.1)),
      width: 0.2, // 20% of image width
      height: 0.2 // 20% of image height
    });
  };

  // Close flashcard and zoom
  const closeFlashcard = () => {
    setSelectedPoint(null);
    setZoomRegion(null);
  };
  // Clear selection and return to meridian selector
  const clearSelection = () => {
    setSelectedMeridian("");
    closeFlashcard(); // This will clear both selectedPoint and zoomRegion
  };
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
      <div className="pt-16 pb-4 px-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {!selectedMeridian ? (
          // Meridian Selector View
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Master Your Meridians
              </h1>
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
        ) : (
          // Body Map View
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Master Your Meridians
              </h1>
              <p className="text-gray-300">{selectedMeridian} Meridian Points</p>
            </div>
            {/* Body Map Container - CRITICAL: Maintain exact image proportions */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              {/* Body Image - Natural size to maintain point accuracy */}
              <img
                src={getCurrentImagePath()}
                alt={`${currentView} view`}
                className="w-full h-auto block"
                style={{
                  maxWidth: "100%",
                  height: "auto", // CRITICAL: Let image maintain natural aspect ratio
                  imageRendering: "auto"
                }}
                onLoad={(e) => {
                  console.log(`Image loaded: ${e.target.src}`);
                  console.log(`Natural size: ${e.target.naturalWidth}x${e.target.naturalHeight}`);
                  console.log(`Display size: ${e.target.clientWidth}x${e.target.clientHeight}`);
                }}
              />              {/* Points Overlay - positioned relative to image */}
              {points.map((point, index) => (
                <button
                  key={index}
                  onClick={() => handlePointClick(point)}
                  className="absolute bg-red-500 rounded-full border-2 border-white hover:bg-red-400 hover:scale-125 transition-all shadow-lg cursor-pointer w-2 h-2 sm:w-3 sm:h-3"
                  style={{
                    left: `${point.x * 100}%`,
                    top: `${point.y * 100}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                  title={`${point.id}: ${point.name}`}
                />
              ))}{/* Zoom Region Overlay - 200x200px equivalent */}
              {zoomRegion && (
                <div
                  className="absolute border-4 border-yellow-400 bg-black/50 rounded-lg shadow-2xl overflow-hidden"
                  style={{
                    right: '20px',
                    top: '20px',
                    width: '200px',
                    height: '200px',
                    zIndex: 40
                  }}
                >
                  {/* Zoomed image view */}
                  <img
                    src={getCurrentImagePath()}
                    alt="Zoomed view"
                    className="absolute"
                    style={{
                      left: `${-(zoomRegion.x * 100 - 10)}%`,
                      top: `${-(zoomRegion.y * 100 - 10)}%`,
                      width: '500%',
                      height: '500%',
                      objectFit: 'contain'
                    }}
                  />
                  {/* Point in zoom window */}
                  {selectedPoint && (
                    <div
                      className="absolute w-2 h-2 bg-red-500 rounded-full border border-white"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  )}
                  {/* Zoom label */}
                  <div className="absolute top-1 left-1 text-xs font-bold text-yellow-400 bg-black/70 px-1 rounded">
                    ZOOM
                  </div>
                </div>
              )}
            </div>            {/* Flashcard - proper flashcard back styling */}
            {selectedPoint && (
              <div className="mt-6 max-w-2xl mx-auto">
                {/* Flashcard container with proper styling */}
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border-2 border-yellow-400/30">                  {/* Traditional Korean decorative border */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-yellow-400 to-blue-500 rounded-t-2xl"></div>
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4 pt-2">
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        {selectedPoint.id}
                      </h3>
                      <h4 className="text-xl font-semibold text-white mb-1">
                        {selectedPoint.name}
                      </h4>
                    </div>
                    <button
                      onClick={closeFlashcard}
                      className="text-red-400 hover:text-red-300 text-2xl font-bold min-w-[30px] min-h-[30px] bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      title="Close Card"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Card content */}
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="bg-black/30 rounded-lg p-3">
                          <span className="text-blue-300 font-semibold text-sm">MERIDIAN</span>
                          <p className="text-white font-bold">{selectedPoint.meridian || selectedMeridian}</p>
                        </div>
                        
                        {selectedPoint.region && (
                          <div className="bg-black/30 rounded-lg p-3">
                            <span className="text-blue-300 font-semibold text-sm">REGION</span>
                            <p className="text-white">{selectedPoint.region}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-black/30 rounded-lg p-3">
                          <span className="text-blue-300 font-semibold text-sm">VIEW</span>
                          <p className="text-white capitalize">{selectedPoint.view || currentView}</p>
                        </div>
                        
                        <div className="bg-black/30 rounded-lg p-3">
                          <span className="text-blue-300 font-semibold text-sm">COORDINATES</span>
                          <p className="text-white font-mono text-sm">
                            {Math.round(selectedPoint.x * 100)}%, {Math.round(selectedPoint.y * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {selectedPoint.description && (
                      <div className="bg-black/30 rounded-lg p-4">
                        <span className="text-blue-300 font-semibold text-sm">DESCRIPTION</span>
                        <p className="text-white mt-2 leading-relaxed">{selectedPoint.description}</p>
                      </div>
                    )}

                    {/* Additional traditional info */}
                    <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-lg p-4 border border-yellow-400/20">
                      <span className="text-yellow-400 font-semibold text-sm">TRADITIONAL KOREAN MEDICINE</span>
                      <p className="text-gray-300 mt-1 text-sm">
                        This pressure point is part of the {selectedPoint.meridian || selectedMeridian} meridian system used in Korean martial arts and healing practices.
                      </p>
                    </div>
                  </div>

                  {/* Close button */}
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={closeFlashcard}
                      className="element-water font-bold py-3 px-8 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Close Card
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyMapInteractiveNew;
