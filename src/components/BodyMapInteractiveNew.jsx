import React, { useState, useEffect } from "react";

const BodyMapInteractive = ({ navigateTo }) => {
  // State management
  const [currentView, setCurrentView] = useState("front"); // front, back, side
  const [currentRegion, setCurrentRegion] = useState("full"); // full, head, trunk, arms, legs, feet
  const [selectedMeridian, setSelectedMeridian] = useState(""); // Lung, LargeIntestine, Stomach, etc.
  const [points, setPoints] = useState([]);
  const [pathData, setPathData] = useState([]);
  const [regionButtons, setRegionButtons] = useState([]);

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

  // Load region button coordinates based on current view
  useEffect(() => {
    let buttonFile = "region_buttons.json"; // default
    
    // Use view-specific button maps if available
    if (currentView === "back") {
      buttonFile = "button_map_back.json";
    } else if (currentView === "side") {
      buttonFile = "button_map_side.json";
    }

    fetch(`/data/${buttonFile}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Loaded region buttons for ${currentView}:`, data);
        setRegionButtons(data || []);
      })
      .catch((err) => {
        console.log(`Button map not found: ${buttonFile}`, err);
        // Fallback to default region buttons
        setRegionButtons([
          {
            type: "box",
            label: "Head & Neck",
            x: 0.35, y: 0.05, width: 0.3, height: 0.2
          },
          {
            type: "box", 
            label: "Arms",
            x: 0.05, y: 0.25, width: 0.2, height: 0.4
          },
          {
            type: "box",
            label: "Trunk", 
            x: 0.25, y: 0.25, width: 0.5, height: 0.4
          },
          {
            type: "box",
            label: "Legs",
            x: 0.3, y: 0.65, width: 0.4, height: 0.25
          },
          {
            type: "box",
            label: "Feet",
            x: 0.35, y: 0.9, width: 0.3, height: 0.1
          }
        ]);
      });
  }, [currentView]);

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
    SmallIntestine: ["front", "back"],
    Bladder: ["back"],
    Kidney: ["front", "back"],
    Pericardium: ["front"],
    TripleWarmer: ["front", "back"],
    Gallbladder: ["side", "front"],
    Liver: ["front"],
    GoverningVessel: ["back"],
    ConceptionVessel: ["front"],
  };

  // Check if selected meridian is visible on current view
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
          // Try alternative filename format
          const altFilename = `${currentRegion}s_${currentView}_${selectedMeridian}.json`;
          fetch(`/data/${altFilename}`)
            .then((res) => res.json())
            .then((data) => {
              console.log("Loaded points for region (alt format):", data);
              setPoints(Array.isArray(data) ? data : []);
            })
            .catch((err2) => {
              console.log(`Alternative points file not found: ${altFilename}`, err2);
              setPoints([]);
            });
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

  // Handle region button clicks from JSON coordinates
  const handleRegionButtonClick = (regionLabel) => {
    console.log("Region clicked:", regionLabel);
    
    // Map button labels to region names
    const labelToRegion = {
      "Head & Neck": "head",
      "Arms": "arms", 
      "Trunk": "trunk",
      "Legs": "legs",
      "Feet": "feet",
      // Handle logo click
      "logo home button": "home",
      // Handle view switches
      "Front, Back, Side": "view-switch"
    };

    const region = labelToRegion[regionLabel];
    
    if (region === "home") {
      if (navigateTo) {
        navigateTo("home");
      }
    } else if (region === "view-switch" || regionLabel === "Front, Back, Side") {
      // Cycle through views: front -> back -> side -> front
      const views = ["front", "back", "side"];
      const currentIndex = views.indexOf(currentView);
      const nextView = views[(currentIndex + 1) % views.length];
      console.log(`Switching from ${currentView} to ${nextView}`);
      setCurrentView(nextView);
    } else if (region) {
      setCurrentRegion(region);
    }
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

          {/* Clear Meridian Button - appears when meridian is selected */}
          {selectedMeridian && (
            <button
              onClick={() => setSelectedMeridian("")}
              className="absolute top-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-yellow-400/30 text-yellow-400 font-bold text-sm hover:text-yellow-300 hover:bg-black/90 transition-colors"
              title="Clear Meridian Selection"
            >
              Clear
            </button>
          )}

          {/* Back Button - appears when in zoomed region - positioned to avoid logo */}
          {currentRegion !== "full" && (
            <button
              onClick={resetToFull}
              className={`absolute top-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-blue-400/30 text-blue-400 font-bold text-sm hover:text-blue-300 hover:bg-black/90 transition-colors ${
                selectedMeridian ? 'right-20' : 'right-4'
              }`}
              title="Back to Full Body Map"
            >
              ← Back
            </button>
          )}

          {/* Overlay Container for all interactive elements */}
          <div className="absolute inset-0">
            {/* Control Panel - DISABLED - Using JSON positioned elements instead */}
            {false && (
            <div className="absolute top-2 left-2 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-yellow-400/30 max-w-xs">
              {/* Logo */}
              <div className="mb-2 sm:mb-4">
                <button
                  onClick={handleLogoClick}
                  className="text-yellow-400 font-bold text-sm sm:text-lg hover:text-yellow-300 transition-colors"
                >
                  ← MERIDIAN MASTERY
                </button>
              </div>

              {/* View Controls */}
              <div className="mb-2 sm:mb-4">
                <div className="text-xs text-gray-400 mb-1 sm:mb-2">VIEW</div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentView("front")}
                    className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded transition-all ${
                      currentView === "front"
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    FRONT
                  </button>
                  <button
                    onClick={() => setCurrentView("back")}
                    className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded transition-all ${
                      currentView === "back"
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    BACK
                  </button>
                  <button
                    onClick={() => setCurrentView("side")}
                    className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded transition-all ${
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
            )}

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

          {/* Invisible Overlay Buttons - Using JSON coordinates */}
          {currentRegion === "full" && regionButtons.map((button, index) => {
            // Handle meridian selector separately - invisible until clicked
            if (button.label === "Meridian Selector") {
              return (
                <select
                  key={index}
                  value={selectedMeridian}
                  onChange={(e) => setSelectedMeridian(e.target.value)}
                  className="absolute bg-transparent border-none outline-none text-transparent cursor-pointer"
                  style={{
                    left: `${button.x * 100}%`,
                    top: `${button.y * 100}%`,
                    width: `${button.width * 100}%`,
                    height: `${button.height * 100}%`,
                    zIndex: 50,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    fontSize: '16px' // Prevent zoom on iOS
                  }}
                  title="Select Meridian"
                  aria-label="Select Meridian"
                >
                  <option value="">Select Meridian...</option>
                  {availableMeridians.map((meridian) => (
                    <option key={meridian} value={meridian}>
                      {meridian}
                    </option>
                  ))}
                </select>
              );
            } else if (button.label === "Front, Back, Side") {
              return (
                <button
                  key={index}
                  onClick={() => {
                    const views = ["front", "back", "side"];
                    const currentIndex = views.indexOf(currentView);
                    const nextView = views[(currentIndex + 1) % views.length];
                    setCurrentView(nextView);
                  }}
                  className="absolute bg-transparent border-none outline-none cursor-pointer"
                  style={{
                    left: `${button.x * 100}%`,
                    top: `${button.y * 100}%`,
                    width: `${button.width * 100}%`,
                    height: `${button.height * 100}%`,
                    zIndex: 45
                  }}
                  title={`Current: ${currentView.toUpperCase()} - Click to switch`}
                  aria-label="Switch View"
                />
              );
            } else if (button.label === "logo home button") {
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (navigateTo) {
                      navigateTo("home");
                    }
                  }}
                  className="absolute bg-transparent border-none outline-none cursor-pointer"
                  style={{
                    left: `${button.x * 100}%`,
                    top: `${button.y * 100}%`,
                    width: `${button.width * 100}%`,
                    height: `${button.height * 100}%`,
                    zIndex: 45
                  }}
                  title="Return to Home"
                  aria-label="Home"
                />
              );
            }
            
            // Regular invisible buttons for region navigation (Head & Neck, Arms, Trunk, Legs, Feet)
            return (
              <button
                key={index}
                onClick={() => handleRegionButtonClick(button.label)}
                className="absolute bg-transparent border-none outline-none cursor-pointer"
                style={{
                  left: `${button.x * 100}%`,
                  top: `${button.y * 100}%`,
                  width: `${button.width * 100}%`,
                  height: `${button.height * 100}%`,
                  zIndex: 45
                }}
                title={button.label}
                aria-label={button.label}
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
