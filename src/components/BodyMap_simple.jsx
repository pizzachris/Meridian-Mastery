import React, { useState, useEffect } from "react";
import flashcardsData from "../data/flashcards.json";
import ZoomedRegion from "./ZoomedRegion";

const BodyMap = ({ navigateTo }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedMeridian, setSelectedMeridian] = useState(null);
  const [viewSide, setViewSide] = useState("front");
  const [svgContent, setSvgContent] = useState("");
  const [svgLoaded, setSvgLoaded] = useState(false);
  const [showZoomedRegion, setShowZoomedRegion] = useState(false);
  // Body regions
  const bodyRegions = {
    "HEAD & NECK": [
      "head",
      "neck",
      "face",
      "temple",
      "forehead",
      "chin",
      "throat",
    ],
    ARMS: ["arm", "elbow", "wrist", "hand", "finger", "shoulder"],
    TRUNK: ["chest", "back", "spine", "abdomen"],
    LEGS: ["leg", "knee", "thigh", "calf", "shin"],
    FEET: ["foot", "toe", "ankle", "heel", "sole"],
  };

  // Get meridian colors based on Five Elements
  const getMeridianColor = (meridian) => {
    const colors = {
      // Metal Element (Lung, Large Intestine) - White/Gray
      Lung: "#e5e7eb",
      "Large Intestine": "#e5e7eb",

      // Earth Element (Stomach, Spleen) - Yellow/Golden
      Stomach: "#fbbf24",
      Spleen: "#fbbf24",

      // Fire Element (Heart, Small Intestine, Pericardium, Triple Burner) - Red
      Heart: "#ef4444",
      "Small Intestine": "#ef4444",
      Pericardium: "#f87171",
      "Triple Burner": "#f87171",

      // Water Element (Kidney, Bladder) - Blue/Black
      Kidney: "#3b82f6",
      "Urinary Bladder": "#1e40af",
      Bladder: "#1e40af",

      // Wood Element (Liver, Gallbladder) - Green
      Liver: "#10b981",
      "Gall Bladder": "#059669",
      Gallbladder: "#059669",

      // Special Vessels - Purple
      "Governing Vessel": "#8b5cf6",
      "Conception Vessel": "#a855f7",
    };
    return colors[meridian] || "#6b7280";
  };

  // Get unique meridians from filtered points
  const getAvailableMeridians = (regionPoints) => {
    const meridians = [...new Set(regionPoints.map((point) => point.meridian))];
    return meridians.sort();
  }; // Load SVG content
  useEffect(() => {
    const svgFileName =
      viewSide === "front" ? "body_front.svg" : "body_back.svg";
    console.log("Loading SVG:", svgFileName);

    // Use relative path for better compatibility with Vite dev server
    const relativePath = `/${svgFileName}`;
    console.log("Full SVG path:", relativePath);

    fetch(relativePath)
      .then((response) => {
        console.log("SVG fetch response:", response.status, response.ok);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((svgText) => {
        console.log("SVG loaded successfully, length:", svgText.length);
        console.log("SVG content preview:", svgText.substring(0, 200));
        console.log("Setting svgContent and svgLoaded to true");
        setSvgContent(svgText);
        setSvgLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
        console.log("Falling back to basic SVG");
        setSvgLoaded(false);
        // Use fallback SVG
        setFallbackSvg();
      });
  }, [viewSide]);
  const setFallbackSvg = () => {
    const getRegionStyle = (regionName) => {
      const isSelected = selectedRegion === regionName;
      const colors = {
        "HEAD & NECK": { base: "#fbbf24", light: "#fde047" },
        TRUNK: { base: "#ef4444", light: "#f87171" },
        ARMS: { base: "#10b981", light: "#34d399" },
        LEGS: { base: "#3b82f6", light: "#60a5fa" },
        FEET: { base: "#8b5cf6", light: "#a78bfa" },
      };

      const color = colors[regionName] || { base: "#6b7280", light: "#9ca3af" };

      return {
        fill: isSelected ? `${color.base}99` : `${color.base}33`, // More opaque when selected
        stroke: isSelected ? color.light : color.base,
        strokeWidth: isSelected ? "4" : "2",
        opacity: isSelected ? "0.9" : "0.6",
      };
    };

    const fallbackSvg = `
      <svg width="300" height="600" viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg" style="background: transparent;">
        <rect width="300" height="600" fill="#1f2937"/>
        
        <!-- Simple Human Figure -->
        <g id="human-figure">
          <!-- Head -->
          <circle cx="150" cy="60" r="25" fill="#DDBF94" stroke="#374151" stroke-width="2"/>
          
          <!-- Neck -->
          <rect x="140" y="85" width="20" height="15" fill="#DDBF94" stroke="#374151" stroke-width="1"/>
          
          <!-- Torso -->
          <rect x="120" y="100" width="60" height="120" fill="#DDBF94" stroke="#374151" stroke-width="2"/>
          
          <!-- Arms -->
          <rect x="90" y="110" width="25" height="80" fill="#DDBF94" stroke="#374151" stroke-width="2"/>
          <rect x="185" y="110" width="25" height="80" fill="#DDBF94" stroke="#374151" stroke-width="2"/>
          
          <!-- Hands -->
          <circle cx="102" cy="200" r="8" fill="#DDBF94" stroke="#374151" stroke-width="1"/>
          <circle cx="198" cy="200" r="8" fill="#DDBF94" stroke="#374151" stroke-width="1"/>
          
          <!-- Legs -->
          <rect x="130" y="220" width="20" height="100" fill="#DDBF94" stroke="#374151" stroke-width="2"/>
          <rect x="150" y="220" width="20" height="100" fill="#DDBF94" stroke="#374151" stroke-width="2"/>
          
          <!-- Feet -->
          <ellipse cx="140" cy="330" rx="15" ry="8" fill="#DDBF94" stroke="#374151" stroke-width="1"/>
          <ellipse cx="160" cy="330" rx="15" ry="8" fill="#DDBF94" stroke="#374151" stroke-width="1"/>
        </g>
        
        <!-- Clickable Region boundaries with dynamic colors -->
        <rect x="125" y="45" width="50" height="40" 
              fill="${getRegionStyle("HEAD & NECK").fill}" 
              stroke="${getRegionStyle("HEAD & NECK").stroke}" 
              stroke-width="${getRegionStyle("HEAD & NECK").strokeWidth}" 
              opacity="${getRegionStyle("HEAD & NECK").opacity}"
              style="cursor: pointer; transition: all 0.3s ease;" 
              data-region="HEAD & NECK"/>
              
        <rect x="115" y="100" width="70" height="120" 
              fill="${getRegionStyle("TRUNK").fill}" 
              stroke="${getRegionStyle("TRUNK").stroke}" 
              stroke-width="${getRegionStyle("TRUNK").strokeWidth}" 
              opacity="${getRegionStyle("TRUNK").opacity}"
              style="cursor: pointer; transition: all 0.3s ease;" 
              data-region="TRUNK"/>
              
        <rect x="85" y="105" width="35" height="90" 
              fill="${getRegionStyle("ARMS").fill}" 
              stroke="${getRegionStyle("ARMS").stroke}" 
              stroke-width="${getRegionStyle("ARMS").strokeWidth}" 
              opacity="${getRegionStyle("ARMS").opacity}"
              style="cursor: pointer; transition: all 0.3s ease;" 
              data-region="ARMS"/>
              
        <rect x="180" y="105" width="35" height="90" 
              fill="${getRegionStyle("ARMS").fill}" 
              stroke="${getRegionStyle("ARMS").stroke}" 
              stroke-width="${getRegionStyle("ARMS").strokeWidth}" 
              opacity="${getRegionStyle("ARMS").opacity}"
              style="cursor: pointer; transition: all 0.3s ease;" 
              data-region="ARMS"/>
              
        <rect x="125" y="220" width="50" height="100" 
              fill="${getRegionStyle("LEGS").fill}" 
              stroke="${getRegionStyle("LEGS").stroke}" 
              stroke-width="${getRegionStyle("LEGS").strokeWidth}" 
              opacity="${getRegionStyle("LEGS").opacity}"
              style="cursor: pointer; transition: all 0.3s ease;" 
              data-region="LEGS"/>
              
        <rect x="120" y="315" width="60" height="25" 
              fill="${getRegionStyle("FEET").fill}" 
              stroke="${getRegionStyle("FEET").stroke}" 
              stroke-width="${getRegionStyle("FEET").strokeWidth}" 
              opacity="${getRegionStyle("FEET").opacity}"
              style="cursor: pointer; transition: all 0.3s ease;" 
              data-region="FEET"/>
              
        <!-- Region Labels for better UX -->
        <text x="150" y="68" text-anchor="middle" fill="white" font-size="8" font-weight="bold" pointer-events="none">HEAD</text>
        <text x="150" y="160" text-anchor="middle" fill="white" font-size="8" font-weight="bold" pointer-events="none">TRUNK</text>
        <text x="102" y="155" text-anchor="middle" fill="white" font-size="7" font-weight="bold" pointer-events="none">ARM</text>
        <text x="198" y="155" text-anchor="middle" fill="white" font-size="7" font-weight="bold" pointer-events="none">ARM</text>
        <text x="150" y="275" text-anchor="middle" fill="white" font-size="8" font-weight="bold" pointer-events="none">LEGS</text>
        <text x="150" y="330" text-anchor="middle" fill="white" font-size="7" font-weight="bold" pointer-events="none">FEET</text>
      </svg>
    `;
    setSvgContent(fallbackSvg);
    setSvgLoaded(true);
  };

  // Filter points based on selected region
  const filterPointsByRegion = (region) => {
    if (!region || !bodyRegions[region]) return [];

    const regionKeywords = bodyRegions[region];

    return flashcardsData.flashcards.filter((point) => {
      const pointName = point.nameEnglish?.toLowerCase() || "";
      const pointLocation = point.location?.toLowerCase() || "";
      const pointNumber = point.number?.toLowerCase() || "";

      return regionKeywords.some(
        (keyword) =>
          pointName.includes(keyword) ||
          pointLocation.includes(keyword) ||
          pointNumber.includes(keyword),
      );
    });
  };

  const currentPoints = selectedRegion
    ? filterPointsByRegion(selectedRegion)
    : [];
  // Handle SVG region clicks
  const handleSvgRegionClick = (regionName) => {
    setSelectedRegion(regionName);
    setSelectedPoint(null);
    setShowZoomedRegion(true);
  };

  // Handle point selection in zoomed view
  const handlePointSelect = (point) => {
    setSelectedPoint(point);
    setSelectedMeridian(point.meridian);
  };

  // Close zoomed region
  const closeZoomedRegion = () => {
    setShowZoomedRegion(false);
  }; // Process SVG content to add click handlers
  const processSvgContent = (svgString) => {
    // Add global function to window for SVG onclick handlers
    window.selectRegion = handleSvgRegionClick;

    // Remove any existing navigation links that might cause page changes
    let processedSvg = svgString.replace(/href="[^"]*"/g, "");
    processedSvg = processedSvg.replace(/<a[^>]*>/g, "").replace(/<\/a>/g, "");

    // Add selected class to the currently selected region
    if (selectedRegion) {
      const regionPattern = new RegExp(`data-region="${selectedRegion}"`, "g");
      processedSvg = processedSvg.replace(
        regionPattern,
        `data-region="${selectedRegion}" class="region-selected"`,
      );
    }

    // Enhance region hover and click styles
    const styleEnhancement = `
      <style>
        .region-zone {
          cursor: pointer !important;
          transition: all 0.3s ease !important;
        }
        .region-zone:hover {
          fill: rgba(59, 130, 246, 0.3) !important;
          stroke: rgba(59, 130, 246, 0.8) !important;
          stroke-width: 3 !important;
        }
        .region-zone.region-selected {
          fill: rgba(59, 130, 246, 0.4) !important;
          stroke: rgba(59, 130, 246, 1) !important;
          stroke-width: 4 !important;
        }
      </style>
    `;

    // Add enhanced styles to SVG
    processedSvg = processedSvg.replace("</svg>", styleEnhancement + "</svg>");

    return processedSvg;
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4">
      <style>{`
        .body-svg-container svg {
          background: transparent !important;
          max-width: 100%;
          height: auto;
        }
        .body-svg-container svg .region-zone {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .body-svg-container svg .region-zone:hover {
          fill: rgba(59, 130, 246, 0.3) !important;
          stroke: rgba(59, 130, 246, 0.8) !important;
          stroke-width: 3 !important;
        }
        .body-svg-container svg .region-selected {
          fill: rgba(59, 130, 246, 0.4) !important;
          stroke: rgba(59, 130, 246, 1) !important;
          stroke-width: 4 !important;
        }
        .body-svg-container svg rect[data-region] {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .body-svg-container svg rect[data-region]:hover {
          stroke-width: 5px !important;
          filter: drop-shadow(0 0 10px currentColor);
        }
        .body-svg-container svg rect[data-region].selected {
          stroke-width: 6px !important;
          filter: drop-shadow(0 0 15px currentColor);
        }
          opacity: 0.8 !important;
          stroke-width: 3;
          filter: brightness(1.2);
        }
        .body-svg-container svg rect[data-region]:active {
          opacity: 1 !important;
          stroke-width: 4;
          filter: brightness(1.3);
        }
        .region-selected {
          stroke-width: 4 !important;
          opacity: 0.9 !important;
          filter: brightness(1.2);
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .mobile-stack {
            display: flex;
            flex-direction: column;
          }
          .mobile-body-container {
            order: 1;
            margin-bottom: 1rem;
          }
          .mobile-controls-container {
            order: 2;
          }
          .mobile-meridians-container {
            order: 3;
            margin-top: 1rem;
          }
          .body-svg-container {
            max-width: 280px;
            margin: 0 auto;
          }
          .mobile-compact {
            padding: 0.75rem;
          }
          .mobile-compact h2 {
            font-size: 1.125rem;
            margin-bottom: 0.75rem;
          }
          .mobile-compact h3 {
            font-size: 1rem;
            margin-bottom: 0.5rem;
          }
        }
        
        /* Touch-friendly interactions */
        @media (hover: none) and (pointer: coarse) {
          .body-svg-container svg rect[data-region]:hover {
            opacity: initial;
            stroke-width: initial;
            filter: initial;
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            Body Map - Meridian Points
          </h1>
          <button
            onClick={() => navigateTo("home")}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-sm sm:text-base"
          >
            ← Back to Home
          </button>
        </div>
        {/* View Toggle */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          <div className="bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setViewSide("front")}
              className={`px-4 sm:px-6 py-2 rounded text-sm sm:text-base ${
                viewSide === "front"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white"
              } transition-colors`}
            >
              Front View
            </button>
            <button
              onClick={() => setViewSide("back")}
              className={`px-4 sm:px-6 py-2 rounded text-sm sm:text-base ${
                viewSide === "back"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white"
              } transition-colors`}
            >
              Back View
            </button>
          </div>
        </div>
        {/* Main Content Layout - Mobile Optimized */}
        <div className="mobile-stack lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Left Column - Body Display */}
          <div className="mobile-body-container space-y-4 sm:space-y-6">
            {/* SVG Body Display */}
            <div className="bg-gray-800 mobile-compact sm:p-6 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center">
                Body {viewSide === "front" ? "Front" : "Back"}
              </h2>
              {/* Instructions */}
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 text-center">
                {selectedRegion
                  ? `Viewing ${selectedRegion} region`
                  : "Tap on colored regions to select body areas"}
              </p>{" "}
              <div className="flex justify-center">
                {/* Debug information */}
                <div className="mb-4 p-2 bg-gray-700 rounded text-xs">
                  <div>svgLoaded: {svgLoaded.toString()}</div>
                  <div>svgContent length: {svgContent.length}</div>
                  <div>viewSide: {viewSide}</div>
                </div>

                {/* Debug logging */}
                {console.log(
                  "Render debug - svgLoaded:",
                  svgLoaded,
                  "svgContent length:",
                  svgContent.length,
                )}
                {svgLoaded ? (
                  <div
                    className="body-svg-container max-w-xs sm:max-w-sm bg-transparent rounded-lg overflow-hidden"
                    onClick={(e) => {
                      // Prevent default navigation
                      e.preventDefault();
                      e.stopPropagation();

                      // Check if clicked element has data-region attribute
                      let target = e.target;
                      let region = target.getAttribute("data-region");

                      // If no direct data-region, check if it's a region-zone or if parent has data-region
                      if (!region) {
                        // Check if clicked element is a region-zone
                        if (target.classList.contains("region-zone")) {
                          region = target.getAttribute("data-region");
                        }
                        // Check parent elements for data-region
                        let parent = target.parentElement;
                        while (parent && !region) {
                          if (parent.getAttribute("data-region")) {
                            region = parent.getAttribute("data-region");
                            break;
                          }
                          if (parent.classList.contains("region-zone")) {
                            region = parent.getAttribute("data-region");
                            break;
                          }
                          parent = parent.parentElement;
                        }
                      }

                      if (region) {
                        handleSvgRegionClick(region);
                      }
                    }}
                    style={{ touchAction: "manipulation" }}
                    dangerouslySetInnerHTML={{
                      __html: processSvgContent(svgContent),
                    }}
                  />
                ) : (
                  // Temporary test: try direct img tag
                  <div className="flex flex-col items-center space-y-4">
                    <img
                      src={`/${viewSide === "front" ? "body_front.svg" : "body_back.svg"}`}
                      alt={`Body ${viewSide}`}
                      className="max-w-xs sm:max-w-sm"
                      onLoad={() => console.log("IMG loaded successfully")}
                      onError={(e) => console.log("IMG failed to load:", e)}
                    />
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">
                        SVG fetch failed, showing IMG fallback
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {selectedRegion && (
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-700 rounded-lg text-center">
                  <p className="text-base sm:text-lg font-medium text-blue-400">
                    Selected: {selectedRegion}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {currentPoints.length} acupressure points found
                  </p>
                  <button
                    onClick={() => setShowZoomedRegion(true)}
                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    View Detailed Region
                  </button>
                </div>
              )}
            </div>

            {/* Meridian Selection - Shows below body when region is selected (Mobile specific positioning) */}
            {selectedRegion && currentPoints.length > 0 && (
              <div className="mobile-meridians-container bg-gray-800 mobile-compact sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                  Available Meridians in {selectedRegion}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {getAvailableMeridians(currentPoints).map((meridian) => (
                    <button
                      key={meridian}
                      onClick={() =>
                        setSelectedMeridian(
                          selectedMeridian === meridian ? null : meridian,
                        )
                      }
                      className={`p-2 sm:p-3 text-xs sm:text-sm rounded transition-all duration-200 ${
                        selectedMeridian === meridian
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                          style={{
                            backgroundColor: getMeridianColor(meridian),
                          }}
                        ></div>
                        <span className="truncate">{meridian}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {selectedMeridian && (
                  <button
                    onClick={() => setSelectedMeridian(null)}
                    className="mt-2 sm:mt-3 w-full p-2 text-xs sm:text-sm bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                  >
                    Clear Meridian Filter
                  </button>
                )}
              </div>
            )}
          </div>{" "}
          {/* Right Column - Controls and Points */}
          <div className="mobile-controls-container space-y-4 sm:space-y-6">
            {/* Region Selection */}
            <div className="bg-gray-800 mobile-compact sm:p-6 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Select Body Region
              </h2>
              <div className="space-y-1 sm:space-y-2">
                {Object.keys(bodyRegions).map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      setSelectedRegion(region);
                      setSelectedPoint(null);
                      setSelectedMeridian(null);
                    }}
                    className={`w-full p-2 sm:p-3 text-left rounded transition-all duration-200 ${
                      selectedRegion === region
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base">{region}</span>
                      {selectedRegion === region && (
                        <span className="text-blue-200 text-xs sm:text-sm">
                          ({filterPointsByRegion(region).length} points)
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick actions */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-600">
                <button
                  onClick={() => {
                    setSelectedRegion(null);
                    setSelectedPoint(null);
                    setSelectedMeridian(null);
                  }}
                  className="w-full p-2 text-xs sm:text-sm bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {/* Points List */}
            <div className="bg-gray-800 mobile-compact sm:p-6 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                {selectedRegion
                  ? `${selectedRegion} Points`
                  : "Acupressure Points"}
              </h2>

              {currentPoints.length > 0 ? (
                <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
                  {currentPoints
                    .filter(
                      (point) =>
                        !selectedMeridian ||
                        point.meridian === selectedMeridian,
                    )
                    .map((point, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedPoint(point)}
                        className={`p-2 sm:p-3 rounded cursor-pointer transition-colors ${
                          selectedPoint?.id === point.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div
                            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: getMeridianColor(point.meridian),
                            }}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm sm:text-base truncate">
                              {point.number} - {point.nameEnglish}
                            </div>
                            <div className="text-xs sm:text-sm opacity-75 truncate">
                              {point.meridian}
                            </div>
                            <div className="text-xs opacity-60 truncate">
                              {point.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">
                  {selectedRegion
                    ? `No points found for ${selectedRegion}`
                    : "Select a body region to view points"}
                </p>
              )}
            </div>
          </div>
        </div>{" "}
        {/* Selected Point Details */}
        {selectedPoint && (
          <div className="mt-4 sm:mt-6 bg-gray-800 mobile-compact sm:p-6 rounded-lg">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
              {selectedPoint.point}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-2">
                  Details
                </h3>
                <div className="space-y-1 text-sm sm:text-base">
                  <p>
                    <strong>Meridian:</strong> {selectedPoint.meridian}
                  </p>
                  <p>
                    <strong>Location:</strong> {selectedPoint.location}
                  </p>
                  {selectedPoint.depth && (
                    <p>
                      <strong>Depth:</strong> {selectedPoint.depth}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-2">
                  Functions
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  {selectedPoint.functions}
                </p>{" "}
              </div>
            </div>
          </div>
        )}
        {/* Zoomed Region Modal */}
        {showZoomedRegion && selectedRegion && (
          <ZoomedRegion
            region={selectedRegion
              .toLowerCase()
              .replace(/ & /g, "-")
              .replace(/ /g, "-")}
            viewSide={viewSide}
            selectedMeridian={selectedMeridian}
            onPointSelect={handlePointSelect}
            onClose={closeZoomedRegion}
          />
        )}
      </div>
    </div>
  );
};

export default BodyMap;
