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
    { id: "LargeIntestine", name: "Large Intestine", element: "element-metal", view: "side" }
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

  // Handle point click - zoom to 200x200px area
  const handlePointClick = (point) => {
    setSelectedPoint(point);
    // Create zoom region centered on point
    setZoomRegion({
      x: Math.max(0, point.x - 0.1), // 10% on each side = 20% total width
      y: Math.max(0, point.y - 0.1),
      width: 0.2,
      height: 0.2
    });
  };

  // Clear selection and return to meridian selector
  const clearSelection = () => {
    setSelectedMeridian("");
    setSelectedPoint(null);
    setZoomRegion(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
        ) : (
          // Body Map View
          <div className="max-w-6xl mx-auto">
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
              />

              {/* Points Overlay - positioned relative to image */}
              {points.map((point, index) => (
                <button
                  key={index}
                  onClick={() => handlePointClick(point)}
                  className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white hover:bg-red-400 hover:scale-125 transition-all shadow-lg cursor-pointer"
                  style={{
                    left: `${point.x * 100}%`,
                    top: `${point.y * 100}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                  title={`${point.id}: ${point.name}`}
                />
              ))}

              {/* Zoom Region Overlay */}
              {zoomRegion && (
                <div
                  className="absolute border-4 border-yellow-400 bg-yellow-400/10 rounded"
                  style={{
                    left: `${zoomRegion.x * 100}%`,
                    top: `${zoomRegion.y * 100}%`,
                    width: `${zoomRegion.width * 100}%`,
                    height: `${zoomRegion.height * 100}%`
                  }}
                />
              )}
            </div>

            {/* Selected Point Info */}
            {selectedPoint && (
              <div className="mt-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-400/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-yellow-400">
                    {selectedPoint.id}: {selectedPoint.name}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedPoint(null);
                      setZoomRegion(null);
                    }}
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-300 mb-2">
                  <strong>Meridian:</strong> {selectedPoint.meridian}
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Region:</strong> {selectedPoint.region}
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>View:</strong> {selectedPoint.view}
                </p>
                {selectedPoint.description && (
                  <p className="text-gray-300">
                    <strong>Description:</strong> {selectedPoint.description}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyMapInteractiveNew;
