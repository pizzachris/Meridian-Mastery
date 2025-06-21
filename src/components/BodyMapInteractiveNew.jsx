import React, { useState, useEffect } from "react";

const BodyMapInteractive = ({ navigateTo }) => {
  // State management
  const [currentView, setCurrentView] = useState("side"); // Start with side view as specified
  const [selectedMeridian, setSelectedMeridian] = useState(""); 
  const [meridianData, setMeridianData] = useState(null);
  const [zoomedPoint, setZoomedPoint] = useState(null);
  const [showFlashcard, setShowFlashcard] = useState(false);

  // Available meridians - only show completed ones for now (Lung and Large Intestine)
  const availableMeridians = [
    { name: "Lung", view: "front", color: "#E6E6FA" },
    { name: "LargeIntestine", view: "side", color: "#F5F5DC" }
  ];

  // Load meridian data when a meridian is selected
  useEffect(() => {
    if (selectedMeridian) {
      const meridianInfo = availableMeridians.find(m => m.name === selectedMeridian);
      if (meridianInfo) {
        // Switch to the appropriate view for this meridian
        setCurrentView(meridianInfo.view);
        
        // Load the meridian data
        const filename = `${selectedMeridian.toLowerCase()}_meridian_with_regions.json`;
        fetch(`/data/${filename}`)
          .then((res) => res.json())
          .then((data) => {
            console.log("Loaded meridian data:", data);
            setMeridianData(data);
          })
          .catch((err) => {
            console.log(`Meridian file not found: ${filename}`, err);
            setMeridianData(null);
          });
      }
    } else {
      setMeridianData(null);
    }
  }, [selectedMeridian]);

  // Get current image path
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
  const handleMeridianSelect = (meridianName) => {
    setSelectedMeridian(meridianName);
    setZoomedPoint(null);
    setShowFlashcard(false);
  };

  // Handle point click - zoom to 200x200px area
  const handlePointClick = (point) => {
    console.log("Point clicked:", point);
    setZoomedPoint(point);
    setShowFlashcard(true);
  };

  // Handle back to meridian selector
  const handleBackToMeridianSelector = () => {
    setSelectedMeridian("");
    setZoomedPoint(null);
    setShowFlashcard(false);
  };

  // Handle logo click - return to home
  const handleLogoClick = () => {
    if (navigateTo) {
      navigateTo("home");
    }
  };

  // Close flashcard
  const closeFlashcard = () => {
    setShowFlashcard(false);
    setZoomedPoint(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header with Logo and Back Button */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
        {/* Logo - Home Button */}
        <button
          onClick={handleLogoClick}
          className="element-earth font-bold py-2 px-4 rounded-xl text-sm transition-all duration-300 transform hover:scale-105"
        >
          🏠 MERIDIAN MASTERY
        </button>

        {/* Back Button - only show when meridian is selected */}
        {selectedMeridian && (
          <button
            onClick={handleBackToMeridianSelector}
            className="element-water font-bold py-2 px-4 rounded-xl text-sm transition-all duration-300 transform hover:scale-105"
          >
            ← Back to Meridians
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="relative w-full h-screen pt-16">
        {/* Body Image Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Body Image */}
          <div className="relative max-w-full max-h-full">
            <img
              src={getCurrentImagePath()}
              alt={`${currentView} view body map`}
              className="max-w-full max-h-full object-contain"
              style={{
                filter: zoomedPoint ? 'blur(2px)' : 'none',
                transition: 'filter 0.3s ease'
              }}
              onLoad={(e) => {
                console.log(`Image loaded: ${e.target.src}`);
              }}
              onError={(e) => {
                console.log("Image failed to load:", e.target.src);
              }}
            />

            {/* Meridian Points Overlay */}
            {selectedMeridian && meridianData && meridianData.points && (
              <>
                {/* Meridian Path Line */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 20 }}
                >
                  <path
                    d={meridianData.points.map((point, index) => 
                      `${index === 0 ? 'M' : 'L'} ${point.x * 100}% ${point.y * 100}%`
                    ).join(' ')}
                    stroke={availableMeridians.find(m => m.name === selectedMeridian)?.color || "#FFD700"}
                    strokeWidth="3"
                    fill="none"
                    opacity="0.8"
                    style={{ filter: "drop-shadow(0 0 3px rgba(0,0,0,0.8))" }}
                  />
                </svg>

                {/* Individual Points */}
                {meridianData.points.map((point, index) => (
                  <button
                    key={point.id}
                    onClick={() => handlePointClick(point)}
                    className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white hover:bg-red-400 hover:scale-125 transition-all shadow-lg cursor-pointer z-30"
                    style={{
                      left: `${point.x * 100}%`,
                      top: `${point.y * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    title={`${point.id}: ${point.name}`}
                  />
                ))}
              </>
            )}

            {/* Zoomed Point View */}
            {zoomedPoint && (
              <div
                className="absolute border-4 border-yellow-400 bg-black/20 backdrop-blur-sm"
                style={{
                  left: `${Math.max(0, Math.min(zoomedPoint.x * 100 - 10, 80))}%`,
                  top: `${Math.max(0, Math.min(zoomedPoint.y * 100 - 10, 80))}%`,
                  width: '200px',
                  height: '200px',
                  zIndex: 40
                }}
              >
                <div className="w-full h-full relative overflow-hidden">
                  <img
                    src={getCurrentImagePath()}
                    alt="Zoomed view"
                    className="absolute"
                    style={{
                      left: `${-(zoomedPoint.x * 100 - 10)}%`,
                      top: `${-(zoomedPoint.y * 100 - 10)}%`,
                      width: '1000%',
                      height: '1000%',
                      objectFit: 'contain'
                    }}
                  />
                  {/* Centered point in zoom */}
                  <div
                    className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Meridian Selector - Vertical Stack on Right Side */}
        {!selectedMeridian && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
            <div className="flex flex-col gap-3">
              <div className="text-center text-sm font-bold text-yellow-400 mb-2">
                SELECT MERIDIAN
              </div>
              {availableMeridians.map((meridian) => (
                <button
                  key={meridian.name}
                  onClick={() => handleMeridianSelect(meridian.name)}
                  className="element-fire font-semibold py-3 px-4 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 min-w-[120px] text-center"
                >
                  {meridian.name === "LargeIntestine" ? "Large Intestine" : meridian.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Flashcard Modal */}
      {showFlashcard && zoomedPoint && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4">
          <div className="card w-full max-w-md max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-yellow-400">
                {zoomedPoint.id}: {zoomedPoint.name}
              </h3>
              <button
                onClick={closeFlashcard}
                className="text-red-400 hover:text-red-300 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-blue-300">Meridian:</span>
                <span className="ml-2 text-white">{zoomedPoint.meridian || selectedMeridian}</span>
              </div>
              
              {zoomedPoint.region && (
                <div>
                  <span className="font-semibold text-blue-300">Region:</span>
                  <span className="ml-2 text-white">{zoomedPoint.region}</span>
                </div>
              )}
              
              {zoomedPoint.description && (
                <div>
                  <span className="font-semibold text-blue-300">Description:</span>
                  <p className="ml-2 text-white mt-1">{zoomedPoint.description}</p>
                </div>
              )}
              
              <div>
                <span className="font-semibold text-blue-300">View:</span>
                <span className="ml-2 text-white capitalize">{currentView}</span>
              </div>
            </div>
            
            <button
              onClick={closeFlashcard}
              className="element-metal w-full mt-4 py-2 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Close Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyMapInteractive;
