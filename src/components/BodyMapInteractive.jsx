import React, { useState, useEffect } from "react";

const BodyMapInteractive = ({ navigateTo }) => {
  // State management
  const [currentView, setCurrentView] = useState("front"); // front, back, side
  const [currentRegion, setCurrentRegion] = useState("full"); // full, head, trunk, arms, legs, feet
  const [selectedMeridian, setSelectedMeridian] = useState(""); // Lung, LargeIntestine, Stomach, etc.  const [points, setPoints] = useState([]);

  // Load polyline paths for full body meridian visualization
  const [pathData, setPathData] = useState([]);
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
    Gallbladder: "#32CD32", // Lime green (Wood element)    'Liver': '#228B22', // Forest green (Wood element)
    GoverningVessel: "#8B0000", // Deep crimson (Fire element)
    ConceptionVessel: "#4682B4", // Cool silver-blue (Water element)
  };
  // Define which views each meridian is visible on
  const meridianVisibility = {
    Lung: ["front"], // Lung meridian only visible from front
    LargeIntestine: ["front", "back"], // Large Intestine visible from front and back
    Stomach: ["front"], // Stomach meridian visible from front
    Spleen: ["front"], // Spleen meridian visible from front
    Heart: ["front"], // Heart meridian visible from front
    SmallIntestine: ["back"], // Small Intestine primarily visible from back
    Bladder: ["back"], // Bladder meridian visible from back
    Kidney: ["front"], // Kidney meridian visible from front
    Pericardium: ["front"], // Pericardium visible from front
    TripleWarmer: ["back"], // Triple Warmer visible from back
    Gallbladder: ["side"], // Gallbladder meridian visible from side
    Liver: ["front"], // Liver meridian visible from front
    GoverningVessel: ["back"], // Governing Vessel runs along spine - visible from back
    ConceptionVessel: ["front"], // Conception Vessel runs along front midline - visible from front
  };

  // Check if current meridian should be visible on current view
  const isMeridianVisibleOnCurrentView = () => {
    if (!selectedMeridian) return false;
    const visibleViews = meridianVisibility[selectedMeridian] || [];
    return visibleViews.includes(currentView);
  };

  // Get meridian color
  const getMeridianColor = () => {
    return meridianColors[selectedMeridian] || "#FFD700"; // Default to gold
  }; // Available meridians (all 12 main meridians plus 2 special meridians)
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
  // Load points data when view, region, or meridian changes
  useEffect(() => {
    if (selectedMeridian && currentRegion !== "full") {
      // Only load pressure points for individual region views
      const filename = `${currentRegion}_${currentView}_${selectedMeridian}.json`;

      fetch(`/data/${filename}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Loaded pressure points for region:", data);
          setPoints(data.points || data || []);
        })
        .catch((err) => {
          console.log(`Points file not found: ${filename}`, err);
          setPoints([]);
        });
    } else {
      // Clear points when on full body view or no meridian selected
      setPoints([]);
    }
  }, [currentView, currentRegion, selectedMeridian]);
  // Load polyline paths for full body meridian visualization
  useEffect(() => {
    if (
      selectedMeridian &&
      currentRegion === "full" &&
      isMeridianVisibleOnCurrentView()
    ) {
      // Only load polyline paths if meridian is visible on current view
      const filename = `${currentView}_${selectedMeridian}_path.json`;

      fetch(`/paths/${filename}`)
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
      // Clear paths when not on full body view, no meridian selected, or meridian not visible on current view
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
          return "/regions/side_full.png";
      }
    }

    // For zoomed regions, use consistent {region}_{view}.png format
    return `/regions/${currentRegion}_${currentView}.png`;
  };
  // Transform coordinates from region-specific to full body coordinates
  const transformCoordinates = (point) => {
    // If we're in a zoomed region, use coordinates as-is
    if (currentRegion !== "full") {
      return { x: point.x, y: point.y };
    }

    // Transform coordinates based on the region and view
    // These mappings need to match where each region appears on the full body image
    const regionMappings = {
      front: {
        arms: {
          offsetX: 0.0,
          offsetY: 0.0, // Arms region position on full body
          scaleX: 0.25,
          scaleY: 0.5, // Scale factor for arms region
        },
        trunk: {
          offsetX: 0.25,
          offsetY: 0.25, // Trunk region position on full body
          scaleX: 0.5,
          scaleY: 0.4, // Scale factor for trunk region
        },
        head: {
          offsetX: 0.35,
          offsetY: 0.05, // Head region position on full body
          scaleX: 0.3,
          scaleY: 0.2, // Scale factor for head region
        },
        legs: {
          offsetX: 0.3,
          offsetY: 0.65, // Legs region position on full body
          scaleX: 0.4,
          scaleY: 0.25, // Scale factor for legs region
        },
        feet: {
          offsetX: 0.35,
          offsetY: 0.9, // Feet region position on full body
          scaleX: 0.3,
          scaleY: 0.1, // Scale factor for feet region
        },
      },
      // Add back and side mappings when needed
    };

    // Get the region from the point data or current context
    const pointRegion =
      point.region
        ?.replace("_front", "")
        .replace("_back", "")
        .replace("_side", "") || "trunk";
    const mapping = regionMappings[currentView]?.[pointRegion];

    if (!mapping) {
      console.warn(
        `No coordinate mapping found for region: ${pointRegion}, view: ${currentView}`,
      );
      return { x: point.x, y: point.y }; // Return original coordinates as fallback
    }

    // Transform the coordinates
    const transformedX = mapping.offsetX + point.x * mapping.scaleX;
    const transformedY = mapping.offsetY + point.y * mapping.scaleY;

    return { x: transformedX, y: transformedY };
  };
  const handlePointClick = (point) => {
    if (navigateTo) {
      const meridian = selectedMeridian || point.meridian;
      const element = meridianElements[meridian];

      // Navigate to flashcards with the specific point and element info
      navigateTo("flashcards", {
        sessionMode: "single-point",
        pointId: point.id,
        meridian: meridian,
        element: element,
      });
    }
  };

  // Handle region button click (not image click)
  const handleRegionButtonClick = (region) => {
    setCurrentRegion(region);
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
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Full Screen Image Container */}
      <div className="relative w-full h-screen">
        <img
          src={getCurrentImagePath()}
          alt={`${currentView} view - ${currentRegion}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.log("Image failed to load:", e.target.src);
          }}
        />
        {/* UI Elements positioned over image text boxes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Front/Back/Side Buttons - match image text box positions */}
          <div
            className="pointer-events-auto absolute"
            style={{
              top: "16.3%",
              left: "19.9%",
              width: "35.5%",
              height: "5.1%",
            }}
          >
            <div className="flex h-full">
              <button
                onClick={() => setCurrentView("front")}
                className={`flex-1 text-sm font-semibold transition-all ${
                  currentView === "front"
                    ? "bg-red-700 text-white"
                    : "bg-transparent text-white hover:bg-white/20"
                }`}
              >
                FRONT
              </button>
              <button
                onClick={() => setCurrentView("back")}
                className={`flex-1 text-sm font-semibold transition-all ${
                  currentView === "back"
                    ? "bg-red-700 text-white"
                    : "bg-transparent text-white hover:bg-white/20"
                }`}
              >
                BACK
              </button>
              <button
                onClick={() => setCurrentView("side")}
                className={`flex-1 text-sm font-semibold transition-all ${
                  currentView === "side"
                    ? "bg-red-700 text-white"
                    : "bg-transparent text-white hover:bg-white/20"
                }`}
              >
                SIDE
              </button>
            </div>
          </div>

          {/* Logo Home Button - match image position */}
          <button
            onClick={handleLogoClick}
            className="pointer-events-auto absolute bg-transparent hover:bg-white/20 transition-all rounded"
            style={{
              top: "3.5%",
              left: "11.2%",
              width: "13.5%",
              height: "9.2%",
            }}
            title="Return to Home"
          >
            {/* Invisible clickable area over logo */}
          </button>

          {/* Region Buttons - match image text box positions (only on full view) */}
          {currentRegion === "full" && (
            <>
              {/* Head & Neck */}
              <button
                onClick={() => handleRegionButtonClick("head")}
                className="pointer-events-auto absolute bg-transparent hover:bg-yellow-400/30 transition-all text-sm font-bold text-yellow-400 flex items-center justify-center"
                style={{
                  top: "33.8%",
                  left: "40.5%",
                  width: "18.9%",
                  height: "6.5%",
                }}
              >
                HEAD & NECK
              </button>

              {/* Arms */}
              <button
                onClick={() => handleRegionButtonClick("arms")}
                className="pointer-events-auto absolute bg-transparent hover:bg-yellow-400/30 transition-all text-sm font-bold text-yellow-400 flex items-center justify-center"
                style={{
                  top: "41%",
                  left: "40.5%",
                  width: "8.7%",
                  height: "6.5%",
                }}
              >
                ARMS
              </button>

              {/* Trunk */}
              <button
                onClick={() => handleRegionButtonClick("trunk")}
                className="pointer-events-auto absolute bg-transparent hover:bg-yellow-400/30 transition-all text-sm font-bold text-yellow-400 flex items-center justify-center"
                style={{
                  top: "48.3%",
                  left: "40.5%",
                  width: "8.7%",
                  height: "6.5%",
                }}
              >
                TRUNK
              </button>

              {/* Legs */}
              <button
                onClick={() => handleRegionButtonClick("legs")}
                className="pointer-events-auto absolute bg-transparent hover:bg-yellow-400/30 transition-all text-sm font-bold text-yellow-400 flex items-center justify-center"
                style={{
                  top: "55.3%",
                  left: "40.5%",
                  width: "8.7%",
                  height: "6.5%",
                }}
              >
                LEGS
              </button>

              {/* Feet */}
              <button
                onClick={() => handleRegionButtonClick("feet")}
                className="pointer-events-auto absolute bg-transparent hover:bg-yellow-400/30 transition-all text-sm font-bold text-yellow-400 flex items-center justify-center"
                style={{
                  top: "62.4%",
                  left: "40.5%",
                  width: "8.7%",
                  height: "6.5%",
                }}
              >
                FEET
              </button>

              {/* Meridian Selector Area */}
              <div
                className="pointer-events-auto absolute"
                style={{
                  top: "69.5%",
                  left: "21%",
                  width: "35.8%",
                  height: "7.2%",
                }}
              >
                <select
                  value={selectedMeridian}
                  onChange={(e) => setSelectedMeridian(e.target.value)}
                  className="w-full h-full bg-black/50 border border-yellow-400 text-yellow-400 px-2 text-sm font-bold"
                >
                  <option value="">MERIDIAN SELECTOR</option>
                  {availableMeridians.map((meridian) => (
                    <option
                      key={meridian}
                      value={meridian}
                      className="bg-black text-yellow-400"
                    >
                      {meridian}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
        {/* Back to Full View Button (when zoomed) */}
        {currentRegion !== "full" && (
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={resetToFull}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold"
            >
              ← Back to Full View
            </button>
          </div>
        )}{" "}
        {/* Polyline Paths (only on full body view with meridian selected and visible on current view) */}
        {currentRegion === "full" &&
          selectedMeridian &&
          pathData.length > 0 &&
          isMeridianVisibleOnCurrentView() && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d={pathData
                  .map((p, i) => {
                    const x = parseFloat(p.x.replace("%", ""));
                    const y = parseFloat(p.y.replace("%", ""));
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
                stroke={getMeridianColor()}
                strokeWidth="0.5"
                fill="none"
                className="drop-shadow-lg"
                style={{ filter: "drop-shadow(0 0 0.1 rgba(0,0,0,0.5))" }}
              />
            </svg>
          )}
        {/* Pressure Points Overlay (only on individual region views with meridian selected) */}
        {currentRegion !== "full" &&
          selectedMeridian &&
          points.map((point, index) => (
            <button
              key={index}
              onClick={() => handlePointClick(point)}
              className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white hover:bg-red-400 hover:scale-125 transition-all z-40"
              style={{
                left: `${point.x * 100}%`,
                top: `${point.y * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
              title={point.name || point.id}
            />
          ))}{" "}
      </div>
    </div>
  );
};

export default BodyMapInteractive;
