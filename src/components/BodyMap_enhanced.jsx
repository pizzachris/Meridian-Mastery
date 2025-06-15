import React, { useState, useEffect, useCallback, useMemo } from "react";
import flashcardsData from "../data/flashcards.json";
import { ProgressTracker } from "../utils/progressTracker";
import {
  setupTouchGestures,
  getOptimalTouchTargetSize,
} from "../utils/mobileOptimization";
import { useInViewport } from "../utils/virtualScrolling";

const BodyMap = React.memo(({ navigateTo }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedMeridian, setSelectedMeridian] = useState(null);
  const [viewSide, setViewSide] = useState("front"); // 'front' or 'back'
  const [highlightedRegion, setHighlightedRegion] = useState(null);
  const [pointPositions, setPointPositions] = useState({});

  // Define body regions with their associated points
  const bodyRegions = {
    "HEAD & NECK": [
      "head",
      "neck",
      "face",
      "temple",
      "forehead",
      "chin",
      "throat",
      "occiput",
      "nape",
      "vertex",
      "ear",
      "eye",
    ],
    ARMS: [
      "arm",
      "elbow",
      "wrist",
      "hand",
      "finger",
      "shoulder",
      "upper arm",
      "forearm",
    ],
    TRUNK: [
      "chest",
      "back",
      "spine",
      "intercostal",
      "clavicle",
      "scapula",
      "thoracic",
      "lumbar",
      "abdomen",
      "epigastrium",
    ],
    LEGS: [
      "leg",
      "knee",
      "thigh",
      "calf",
      "posterior thigh",
      "posterior leg",
      "shin",
      "lateral leg",
    ],
    FEET: [
      "foot",
      "toe",
      "ankle",
      "heel",
      "sole",
      "lateral foot",
      "medial foot",
    ],
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

  // Enhanced anatomical positioning system
  const getAnatomicalPosition = (point, regionName, viewSide) => {
    const basePositions = {
      front: {
        "HEAD & NECK": {
          // Facial and anterior head points
          center: { x: 150, y: 60 },
          positions: [
            { x: 150, y: 30 }, // top of head
            { x: 140, y: 45 },
            { x: 160, y: 45 }, // temples
            { x: 135, y: 55 },
            { x: 165, y: 55 }, // eyes area
            { x: 150, y: 65 }, // nose
            { x: 150, y: 75 }, // mouth
            { x: 150, y: 85 }, // chin
            { x: 135, y: 100 },
            { x: 165, y: 100 }, // neck sides
            { x: 150, y: 110 }, // throat
          ],
        },
        ARMS: {
          positions: [
            // Left arm
            { x: 105, y: 130 }, // left shoulder
            { x: 95, y: 150 }, // left upper arm
            { x: 85, y: 180 }, // left elbow area
            { x: 75, y: 210 }, // left elbow
            { x: 70, y: 240 }, // left forearm
            { x: 65, y: 270 }, // left wrist
            { x: 60, y: 285 }, // left hand
            // Right arm
            { x: 195, y: 130 }, // right shoulder
            { x: 205, y: 150 }, // right upper arm
            { x: 215, y: 180 }, // right elbow area
            { x: 225, y: 210 }, // right elbow
            { x: 230, y: 240 }, // right forearm
            { x: 235, y: 270 }, // right wrist
            { x: 240, y: 285 }, // right hand
          ],
        },
        TRUNK: {
          positions: [
            { x: 150, y: 130 }, // upper chest center
            { x: 130, y: 140 },
            { x: 170, y: 140 }, // upper chest sides
            { x: 120, y: 160 },
            { x: 180, y: 160 }, // chest sides
            { x: 150, y: 170 }, // chest center
            { x: 150, y: 200 }, // solar plexus
            { x: 130, y: 220 },
            { x: 170, y: 220 }, // lower ribs
            { x: 150, y: 240 }, // abdomen upper
            { x: 150, y: 270 }, // abdomen center
            { x: 150, y: 300 }, // lower abdomen
          ],
        },
        LEGS: {
          positions: [
            // Left leg
            { x: 125, y: 350 }, // left hip
            { x: 125, y: 380 }, // left upper thigh
            { x: 125, y: 420 }, // left mid thigh
            { x: 125, y: 450 }, // left knee
            { x: 125, y: 480 }, // left upper shin
            { x: 125, y: 520 }, // left lower shin
            // Right leg
            { x: 175, y: 350 }, // right hip
            { x: 175, y: 380 }, // right upper thigh
            { x: 175, y: 420 }, // right mid thigh
            { x: 175, y: 450 }, // right knee
            { x: 175, y: 480 }, // right upper shin
            { x: 175, y: 520 }, // right lower shin
          ],
        },
        FEET: {
          positions: [
            // Left foot
            { x: 125, y: 540 }, // left ankle
            { x: 120, y: 560 }, // left foot top
            { x: 130, y: 560 }, // left foot side
            { x: 125, y: 575 }, // left foot center
            // Right foot
            { x: 175, y: 540 }, // right ankle
            { x: 170, y: 560 }, // right foot top
            { x: 180, y: 560 }, // right foot side
            { x: 175, y: 575 }, // right foot center
          ],
        },
      },
      back: {
        "HEAD & NECK": {
          positions: [
            { x: 150, y: 30 }, // top of head (back)
            { x: 150, y: 45 }, // occiput
            { x: 140, y: 55 },
            { x: 160, y: 55 }, // sides of head
            { x: 150, y: 65 }, // back of head center
            { x: 135, y: 100 },
            { x: 165, y: 100 }, // neck sides
            { x: 150, y: 110 }, // nape
          ],
        },
        ARMS: {
          positions: [
            // Left arm (back view)
            { x: 105, y: 130 }, // left shoulder back
            { x: 95, y: 150 }, // left upper arm back
            { x: 85, y: 180 }, // left elbow area back
            { x: 75, y: 210 }, // left elbow back
            { x: 70, y: 240 }, // left forearm back
            { x: 65, y: 270 }, // left wrist back
            // Right arm (back view)
            { x: 195, y: 130 }, // right shoulder back
            { x: 205, y: 150 }, // right upper arm back
            { x: 215, y: 180 }, // right elbow area back
            { x: 225, y: 210 }, // right elbow back
            { x: 230, y: 240 }, // right forearm back
            { x: 235, y: 270 }, // right wrist back
          ],
        },
        TRUNK: {
          positions: [
            { x: 150, y: 130 }, // upper back center
            { x: 130, y: 140 },
            { x: 170, y: 140 }, // upper back sides
            { x: 150, y: 160 }, // spine upper
            { x: 150, y: 180 }, // spine mid
            { x: 150, y: 200 }, // spine center
            { x: 150, y: 220 }, // spine lower
            { x: 150, y: 240 }, // lumbar upper
            { x: 150, y: 270 }, // lumbar center
            { x: 150, y: 300 }, // sacrum
          ],
        },
        LEGS: {
          positions: [
            // Left leg (back view)
            { x: 125, y: 350 }, // left hip back
            { x: 125, y: 380 }, // left posterior thigh upper
            { x: 125, y: 420 }, // left posterior thigh mid
            { x: 125, y: 450 }, // left knee back
            { x: 125, y: 480 }, // left calf upper
            { x: 125, y: 520 }, // left calf lower
            // Right leg (back view)
            { x: 175, y: 350 }, // right hip back
            { x: 175, y: 380 }, // right posterior thigh upper
            { x: 175, y: 420 }, // right posterior thigh mid
            { x: 175, y: 450 }, // right knee back
            { x: 175, y: 480 }, // right calf upper
            { x: 175, y: 520 }, // right calf lower
          ],
        },
        FEET: {
          positions: [
            // Left foot (back view)
            { x: 125, y: 540 }, // left ankle back
            { x: 125, y: 560 }, // left heel
            { x: 125, y: 575 }, // left sole
            // Right foot (back view)
            { x: 175, y: 540 }, // right ankle back
            { x: 175, y: 560 }, // right heel
            { x: 175, y: 575 }, // right sole
          ],
        },
      },
    };

    const regionPositions =
      basePositions[viewSide]?.[regionName]?.positions || [];
    const pointIndex =
      Math.abs(
        point.id.hashCode ? point.id.hashCode() : point.id.charCodeAt(0),
      ) % regionPositions.length;
    return regionPositions[pointIndex] || { x: 150, y: 300 };
  };

  // Filter points by region and view side
  const getPointsForRegion = (regionName) => {
    const regionKeywords = bodyRegions[regionName] || [];
    return flashcardsData.flashcards.filter((card) => {
      const location = card.location.toLowerCase();
      const isBackPoint =
        location.includes("back") ||
        location.includes("spine") ||
        location.includes("posterior") ||
        location.includes("scapula") ||
        location.includes("vertebra") ||
        location.includes("occiput") ||
        location.includes("nape") ||
        card.meridian === "Urinary Bladder" ||
        card.meridian === "Bladder" ||
        card.meridian === "Governing Vessel";

      const matchesRegion = regionKeywords.some((keyword) =>
        location.includes(keyword),
      );

      if (viewSide === "back") {
        return matchesRegion && isBackPoint;
      } else {
        return matchesRegion && !isBackPoint;
      }
    });
  };

  // Get unique meridians for current region
  const getMeridiansForRegion = (regionName) => {
    const points = getPointsForRegion(regionName);
    const meridians = [...new Set(points.map((point) => point.meridian))];
    return meridians.sort();
  };

  // Get points for selected meridian in current region
  const getPointsForMeridian = (regionName, meridian) => {
    const regionPoints = getPointsForRegion(regionName);
    return regionPoints.filter((point) => point.meridian === meridian);
  };

  // Event handlers
  const handleRegionSelect = (region) => {
    setSelectedRegion(selectedRegion === region ? null : region);
    setSelectedMeridian(null);
    setSelectedPoint(null);
  };

  const handleMeridianSelect = (meridian) => {
    setSelectedMeridian(selectedMeridian === meridian ? null : meridian);
    setSelectedPoint(null);
  };

  const handlePointSelect = (point) => {
    setSelectedPoint(selectedPoint?.id === point.id ? null : point);
  };

  const handleViewPoint = () => {
    if (selectedPoint) {
      ProgressTracker.viewPoint(selectedPoint.id, selectedPoint.meridian);
      navigateTo("flashcards", { selectedPointId: selectedPoint.id });
    }
  };

  // SVG interaction handlers
  const handleSVGRegionClick = (event) => {
    const regionElement = event.target.closest(".region-zone");
    if (regionElement) {
      const region = regionElement.getAttribute("data-region");
      if (region) {
        handleRegionSelect(region);
      }
    }
  };

  const handleSVGRegionHover = (event) => {
    const regionElement = event.target.closest(".region-zone");
    if (regionElement) {
      const region = regionElement.getAttribute("data-region");
      setHighlightedRegion(region);
    } else {
      setHighlightedRegion(null);
    }
  };

  // Render pressure points on the SVG
  const renderPressurePoints = () => {
    if (!selectedMeridian || !selectedRegion) return null;

    const points = getPointsForMeridian(selectedRegion, selectedMeridian);
    const meridianColor = getMeridianColor(selectedMeridian);

    return points.map((point, index) => {
      const position = getAnatomicalPosition(point, selectedRegion, viewSide);
      const isSelected = selectedPoint?.id === point.id;

      return (
        <g key={point.id}>
          <circle
            cx={position.x}
            cy={position.y}
            r={isSelected ? 8 : 6}
            fill={meridianColor}
            stroke={isSelected ? "#1f2937" : "#374151"}
            strokeWidth={isSelected ? 3 : 2}
            className="pressure-point cursor-pointer transition-all duration-200 hover:r-8"
            onClick={() => handlePointSelect(point)}
            style={{
              filter: isSelected
                ? "drop-shadow(0 0 8px rgba(0,0,0,0.5))"
                : "none",
            }}
          />
          <text
            x={position.x}
            y={position.y - 12}
            textAnchor="middle"
            fontSize="10"
            fill="#1f2937"
            className="pointer-events-none font-medium"
          >
            {point.name}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Meridian Body Map
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore acupressure points by selecting body regions and meridians.
            Switch between front and back views to discover all pressure points.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Region & Meridian Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Body Regions
              </h2>

              {/* Region Selection */}
              <div className="space-y-3 mb-8">
                {Object.keys(bodyRegions).map((region) => (
                  <button
                    key={region}
                    onClick={() => handleRegionSelect(region)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left font-medium ${
                      selectedRegion === region
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : highlightedRegion === region
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {region}
                    {selectedRegion === region && (
                      <span className="block text-sm text-blue-600 mt-1">
                        {getPointsForRegion(region).length} points available
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Meridian Selection */}
              {selectedRegion && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Meridians in {selectedRegion}
                  </h3>
                  <div className="space-y-2">
                    {getMeridiansForRegion(selectedRegion).map((meridian) => (
                      <button
                        key={meridian}
                        onClick={() => handleMeridianSelect(meridian)}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                          selectedMeridian === meridian
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        style={{
                          backgroundColor:
                            selectedMeridian === meridian
                              ? `${getMeridianColor(meridian)}20`
                              : undefined,
                        }}
                      >
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-3"
                            style={{
                              backgroundColor: getMeridianColor(meridian),
                            }}
                          ></div>
                          <span className="font-medium">{meridian}</span>
                          <span className="ml-auto text-sm text-gray-500">
                            {
                              getPointsForMeridian(selectedRegion, meridian)
                                .length
                            }
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Point Details */}
              {selectedPoint && (
                <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {selectedPoint.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Location:</strong> {selectedPoint.location}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Meridian:</strong> {selectedPoint.meridian}
                  </p>
                  <button
                    onClick={handleViewPoint}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    View Full Details
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Center Panel - Body Diagram */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* View Toggle */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewSide("front")}
                    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                      viewSide === "front"
                        ? "bg-white text-blue-600 shadow-md"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Front View
                  </button>
                  <button
                    onClick={() => setViewSide("back")}
                    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                      viewSide === "back"
                        ? "bg-white text-blue-600 shadow-md"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Back View
                  </button>
                </div>
              </div>

              {/* SVG Body Diagram */}
              <div className="flex justify-center">
                <div className="relative">
                  <svg
                    width="300"
                    height="600"
                    viewBox="0 0 300 600"
                    className="border border-gray-200 rounded-lg bg-gray-50"
                    onClick={handleSVGRegionClick}
                    onMouseMove={handleSVGRegionHover}
                    onMouseLeave={() => setHighlightedRegion(null)}
                  >
                    {/* Load the appropriate SVG content */}
                    <image
                      href={`/body_${viewSide}.svg`}
                      width="300"
                      height="600"
                      x="0"
                      y="0"
                    />

                    {/* Region highlighting overlay */}
                    {highlightedRegion && (
                      <style>{`
                        .region-zone[data-region="${highlightedRegion}"] {
                          fill: rgba(59, 130, 246, 0.2) !important;
                          stroke: #3b82f6 !important;
                          stroke-width: 2 !important;
                        }
                      `}</style>
                    )}

                    {selectedRegion && (
                      <style>{`
                        .region-zone[data-region="${selectedRegion}"] {
                          fill: rgba(34, 197, 94, 0.2) !important;
                          stroke: #22c55e !important;
                          stroke-width: 3 !important;
                        }
                      `}</style>
                    )}

                    {/* Render pressure points */}
                    {renderPressurePoints()}
                  </svg>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 text-center text-gray-600 space-y-2">
                <p className="text-sm">
                  Click on body regions to explore meridians and pressure points
                </p>
                {selectedRegion && !selectedMeridian && (
                  <p className="text-sm text-blue-600">
                    Select a meridian from the left panel to view pressure
                    points
                  </p>
                )}
                {selectedMeridian && (
                  <p className="text-sm text-green-600">
                    Click on pressure points to view detailed information
                  </p>
                )}
              </div>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
});

// Helper function for string hashing
String.prototype.hashCode = function () {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

export default BodyMap;
