import React, { useState, useEffect } from "react";

const BodyMapInteractive = ({ navigateTo }) => {
  // State management
  const [currentView, setCurrentView] = useState("front"); // front, back, side
  const [currentRegion, setCurrentRegion] = useState("full"); // full, head, trunk, arms, legs, feet
  const [selectedMeridian, setSelectedMeridian] = useState(""); // Lung, LargeIntestine, Stomach, etc.
  const [points, setPoints] = useState([]);
  const [pathData, setPathData] = useState([]);

  // Available meridians for the selector
  const availableMeridians = [
    "Lung",
    "LargeIntestine",
    "Stomach",
    "Spleen",
    "Heart",
    "SmallIntestine",
    "Bladder",
    "Kidney",
    "Pericardium",
    "TripleWarmer",
    "Gallbladder",
    "Liver",
    "GoverningVessel",
    "ConceptionVessel",
  ];

  // Meridian color mapping (based on Korean martial arts system)
  const meridianColors = {
    Lung: "#E6E6FA", // Light lavender/white (Metal element)
    LargeIntestine: "#F5F5DC", // Beige/cream (Metal element)
    Stomach: "#FFD700", // Gold/yellow (Earth element)
    Spleen: "#DAA520", // Dark gold (Earth element)
    Heart: "#FF6B6B", // Red (Fire element)
    SmallIntestine: "#FF4500", // Orange-red (Fire element)
    Bladder: "#4169E1", // Royal blue (Water element)
    Kidney: "#191970", // Midnight blue (Water element)
    Pericardium: "#DC143C", // Crimson (Fire element)
    TripleWarmer: "#FF7F50", // Coral (Fire element)
    Gallbladder: "#32CD32", // Lime green (Wood element)
    Liver: "#228B22", // Forest green (Wood element)
    GoverningVessel: "#8B0000", // Deep crimson (Fire element)
    ConceptionVessel: "#4682B4", // Cool silver-blue (Water element)
  };

  // Define which views each meridian is visible on
  const meridianVisibility = {
    Lung: ["front"],
    LargeIntestine: ["front", "back"],
    Stomach: ["front"],
    Spleen: ["front"],
    Heart: ["front"],
    SmallIntestine: ["back"],
    Bladder: ["back"],
    Kidney: ["front"],
    Pericardium: ["front"],
    TripleWarmer: ["back"],
    Gallbladder: ["side"],
    Liver: ["front"],
    GoverningVessel: ["back"],
    ConceptionVessel: ["front"],
  };

  // Check if current meridian should be visible on current view
  const isMeridianVisibleOnCurrentView = () => {
    if (!selectedMeridian) return false;
    const visibleViews = meridianVisibility[selectedMeridian] || [];
    return visibleViews.includes(currentView);
  };

  // Load pressure points data when meridian or region changes
  useEffect(() => {
    if (selectedMeridian && currentRegion !== "full") {
      const filename = `${currentRegion}_${currentView}_${selectedMeridian}.json`;
      fetch(`/data/${filename}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Loaded points for region:", data);
          setPoints(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.log(`Points file not found: ${filename}`, err);
          setPoints([]);
        });
    } else {
      setPoints([]);
    }
  }, [selectedMeridian, currentRegion, currentView]);

  // Load meridian path data for full body visualization
  useEffect(() => {
    if (
      selectedMeridian &&
      currentRegion === "full" &&
      isMeridianVisibleOnCurrentView()
    ) {
      const filename = `meridian_${selectedMeridian.toLowerCase()}_${currentView}.json`;
      fetch(`/data/${filename}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Loaded meridian path for full body:", data);
          setPathData(data.path || data || []);
        })
        .catch((err) => {
          console.log(`Path file not found: ${filename}`, err);
          setPathData([]);
        });
    } else {
      setPathData([]);
    }
  }, [currentView, currentRegion, selectedMeridian]);

  // Get current image path
  const getCurrentImagePath = () => {
    if (currentRegion === "full") {
      switch (currentView) {
        case "front":
          return "/regions/front_full.png";
        case "back":
          return "/regions/back_full.png";
        case "side":
          return "/regions/side_full.png";
        default:
          return "/regions/front_full.png";
      }
    }

    // For zoomed regions, use consistent {region}_{view}.png format
    return `/regions/${currentRegion}_${currentView}.png`;
  };

  // Transform coordinates from region-specific to full body coordinates
  const transformCoordinates = (point) => {
    // If we're in a zoomed region, use coordinates as-is since they're mapped to the region image
    if (currentRegion !== "full") {
      return { x: point.x, y: point.y };
    }

    // For full body view, we would need transformation logic here
    // This would map region coordinates to full body coordinates
    return { x: point.x, y: point.y };
  };

  // Handle region button clicks
  const handleRegionButtonClick = (region) => {
    setCurrentRegion(region);
  };

  // Handle point clicks
  const handlePointClick = (point) => {
    console.log("Point clicked:", point);
    // Add point interaction logic here
  };

  // Reset to full view
  const resetToFull = () => {
    setCurrentRegion("full");
  };

  // Handle logo click - go back to home
  const handleLogoClick = () => {
    if (navigateTo) {
      navigateTo("home");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Body Map Container */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Body Image - fills container and maintains aspect ratio */}
        <div className="relative w-full h-full">
          <img
            src={getCurrentImagePath()}
            alt={`${currentView} view - ${currentRegion}`}
            className="w-full h-full object-contain"
            onError={(e) => {
              console.log("Image failed to load:", e.target.src);
            }}
          />

          {/* Overlay Container for all interactive elements */}
          <div className="absolute inset-0">
            {/* Control Panel - Fixed position overlay */}
            <div className="absolute top-4 left-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-400/30 max-w-xs">
              {/* Logo */}
              <div className="mb-4">
                <button
                  onClick={handleLogoClick}
                  className="text-yellow-400 font-bold text-lg hover:text-yellow-300 transition-colors"
                >
                  ← MERIDIAN MASTERY
                </button>
              </div>

              {/* View Controls */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">VIEW</div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentView("front")}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                      currentView === "front"
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    FRONT
                  </button>
                  <button
                    onClick={() => setCurrentView("back")}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                      currentView === "back"
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    BACK
                  </button>
                  <button
                    onClick={() => setCurrentView("side")}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                      currentView === "side"
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    SIDE
                  </button>
                </div>
              </div>

              {/* Region Controls */}
              {currentRegion === "full" && (
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">REGION ZOOM</div>
                  <div className="grid grid-cols-2 gap-1">
                    {["head", "arms", "trunk", "legs", "feet"].map((region) => (
                      <button
                        key={region}
                        onClick={() => handleRegionButtonClick(region)}
                        className="px-2 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded transition-all"
                      >
                        {region.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Full View Button (when zoomed) */}
              {currentRegion !== "full" && (
                <div className="mb-4">
                  <button
                    onClick={resetToFull}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-all"
                  >
                    ← Back to Full View
                  </button>
                </div>
              )}

              {/* Meridian Selector */}
              <div>
                <div className="text-xs text-gray-400 mb-2">MERIDIAN</div>
                <select
                  value={selectedMeridian}
                  onChange={(e) => setSelectedMeridian(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 text-white px-2 py-1 text-sm rounded focus:border-yellow-400 focus:outline-none"
                >
                  <option value="">Select Meridian...</option>
                  {availableMeridians.map((meridian) => (
                    <option key={meridian} value={meridian}>
                      {meridian}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Meridian Path Overlay */}
            {selectedMeridian &&
              isMeridianVisibleOnCurrentView() &&
              pathData.length > 0 && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 30 }}
                >
                  <path
                    d={pathData.join(" ")}
                    stroke={meridianColors[selectedMeridian] || "#FFD700"}
                    strokeWidth="3"
                    fill="none"
                    opacity="0.8"
                    style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.8))" }}
                  />
                </svg>
              )}

            {/* Pressure Points Overlay - mapped to image coordinates */}
            {selectedMeridian &&
              points.map((point, index) => {
                const transformedPoint = transformCoordinates(point);
                return (
                  <button
                    key={index}
                    onClick={() => handlePointClick(point)}
                    className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white hover:bg-red-400 hover:scale-125 transition-all shadow-lg"
                    style={{
                      left: `${transformedPoint.x * 100}%`,
                      top: `${transformedPoint.y * 100}%`,
                      transform: "translate(-50%, -50%)",
                      zIndex: 40,
                    }}
                    title={`${point.id}: ${point.name || point.name_english}`}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyMapInteractive;
