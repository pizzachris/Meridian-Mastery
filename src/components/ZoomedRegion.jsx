import React, { useState, useEffect } from "react";
import { getAllPoints } from "../utils/dataLoader";

const ZoomedRegion = ({
  region,
  viewSide,
  selectedMeridian,
  onPointSelect,
  onClose,
}) => {
  const [svgContent, setSvgContent] = useState("");
  const [points, setPoints] = useState([]);
  // Region coordinate mappings for zoomed views
  const regionViewBoxes = {
    "head-neck": {
      front: { viewBox: "75 10 150 120", scale: 2.5 },
      back: { viewBox: "75 10 150 120", scale: 2.5 },
    },
    arms: {
      front: { viewBox: "40 120 220 200", scale: 1.8 },
      back: { viewBox: "40 120 220 200", scale: 1.8 },
    },
    trunk: {
      front: { viewBox: "90 120 120 150", scale: 2.2 },
      back: { viewBox: "90 120 120 150", scale: 2.2 },
    },
    legs: {
      front: { viewBox: "90 300 120 250", scale: 1.5 },
      back: { viewBox: "90 300 120 250", scale: 1.5 },
    },
    feet: {
      front: { viewBox: "90 520 120 80", scale: 2.8 },
      back: { viewBox: "90 520 120 80", scale: 2.8 },
    },
  };

  // Get meridian color
  const getMeridianColor = (meridian) => {
    const colors = {
      Lung: "#e5e7eb",
      "Large Intestine": "#e5e7eb",
      Stomach: "#fbbf24",
      Spleen: "#fbbf24",
      Heart: "#ef4444",
      "Small Intestine": "#ef4444",
      Pericardium: "#f87171",
      "Triple Burner": "#f87171",
      Kidney: "#3b82f6",
      "Urinary Bladder": "#1e40af",
      Bladder: "#1e40af",
      Liver: "#10b981",
      "Gall Bladder": "#059669",
      Gallbladder: "#059669",
      "Governing Vessel": "#8b5cf6",
      "Conception Vessel": "#a855f7",
    };
    return colors[meridian] || "#6b7280";
  };

  // Load SVG and filter points for region
  useEffect(() => {
    const loadSvgAndPoints = async () => {
      try {
        // Load appropriate SVG
        const svgPath =
          viewSide === "front" ? "/body_front.svg" : "/body_back.svg";

        const response = await fetch(svgPath);
        if (response.ok) {
          let svgText = await response.text();

          // Modify SVG for zoomed view
          const regionConfig = regionViewBoxes[region];
          if (regionConfig && regionConfig[viewSide]) {
            const { viewBox, scale } = regionConfig[viewSide];
            svgText = svgText.replace(
              /viewBox="[^"]*"/,
              `viewBox="${viewBox}"`,
            );
            svgText = svgText.replace(
              /width="300" height="600"/,
              `width="${300 * scale}" height="${300 * scale}"`,
            );
          }

          setSvgContent(svgText);
        } // Filter flashcard points for this region
        const regionKeywords = {
          "head-neck": [
            "head",
            "neck",
            "face",
            "temple",
            "forehead",
            "chin",
            "throat",
            "ear",
            "eye",
            "nose",
            "skull",
            "cervical",
          ],
          arms: [
            "arm",
            "elbow",
            "wrist",
            "hand",
            "finger",
            "shoulder",
            "forearm",
            "bicep",
            "tricep",
          ],
          trunk: [
            "chest",
            "back",
            "spine",
            "abdomen",
            "stomach",
            "liver",
            "lung",
            "heart",
            "thorax",
            "rib",
          ],
          legs: [
            "leg",
            "knee",
            "thigh",
            "calf",
            "shin",
            "hip",
            "femur",
            "tibia",
          ],
          feet: ["foot", "toe", "ankle", "heel", "sole", "arch"],
        };

        const keywords = regionKeywords[region] || [];
        const filteredPoints = getAllPoints().filter((point) =>
          keywords.some(
            (keyword) =>
              point.location?.toLowerCase().includes(keyword) ||
              point.nameEnglish?.toLowerCase().includes(keyword) ||
              point.nameRomanized?.toLowerCase().includes(keyword) ||
              point.number?.toLowerCase().includes(keyword),
          ),
        );

        setPoints(filteredPoints);
      } catch (error) {
        console.error("Error loading zoomed region:", error);
      }
    };

    if (region) {
      loadSvgAndPoints();
    }
  }, [region, viewSide]);

  // Get detailed coordinates for pressure points in zoomed view
  const getZoomedPointCoordinates = (point, regionConfig) => {
    // Enhanced coordinate mapping for zoomed regions
    const coordinateMap = {
      "head-neck": {
        front: {
          // Coordinates based on 300x600 SVG
          GV20: { x: 150, y: 30 }, // Top of head
          "EX-HN5": { x: 150, y: 45 }, // Forehead center
          "GV24.5": { x: 150, y: 52 }, // Third eye point
          ST8: { x: 125, y: 60 }, // Temple
          GB14: { x: 175, y: 60 }, // Temple
          ST2: { x: 135, y: 70 }, // Under eye
          ST3: { x: 165, y: 70 }, // Under eye
          LI20: { x: 142, y: 75 }, // Nose side
          LI19: { x: 158, y: 75 }, // Nose side
          GV26: { x: 150, y: 82 }, // Under nose
          ST6: { x: 130, y: 90 }, // Jaw
          ST7: { x: 170, y: 90 }, // Jaw
          CV24: { x: 150, y: 98 }, // Chin center
          GV14: { x: 150, y: 115 }, // Neck back
        },
        back: {
          GV20: { x: 150, y: 30 },
          GV16: { x: 150, y: 67 },
          GB20: { x: 130, y: 70 },
          GB20: { x: 170, y: 70 },
          GV15: { x: 150, y: 82 },
          GV14: { x: 150, y: 105 },
        },
      },
      trunk: {
        front: {
          CV17: { x: 150, y: 170 }, // Heart center
          CV12: { x: 150, y: 190 }, // Solar plexus
          CV8: { x: 150, y: 210 }, // Navel
          CV6: { x: 150, y: 230 }, // Lower abdomen
          CV4: { x: 150, y: 250 }, // Lower dantian
          LU1: { x: 125, y: 150 }, // Lung point
          LU1: { x: 175, y: 150 }, // Lung point
          ST25: { x: 120, y: 210 }, // Side abdomen
          ST25: { x: 180, y: 210 }, // Side abdomen
        },
        back: {
          GV14: { x: 150, y: 115 },
          GV11: { x: 150, y: 170 },
          GV6: { x: 150, y: 210 },
          GV4: { x: 150, y: 250 },
          BL13: { x: 130, y: 155 },
          BL13: { x: 170, y: 155 },
          BL20: { x: 130, y: 195 },
          BL20: { x: 170, y: 195 },
          BL23: { x: 130, y: 235 },
          BL23: { x: 170, y: 235 },
        },
      },
      arms: {
        front: {
          LI15: { x: 105, y: 130 }, // Shoulder
          LI15: { x: 195, y: 130 },
          LI11: { x: 85, y: 180 }, // Elbow
          LI11: { x: 215, y: 180 },
          LI4: { x: 65, y: 290 }, // Hand
          LI4: { x: 235, y: 290 },
          PC6: { x: 70, y: 260 }, // Wrist
          PC6: { x: 230, y: 260 },
        },
        back: {
          LI15: { x: 105, y: 130 },
          LI15: { x: 195, y: 130 },
          SI9: { x: 100, y: 150 },
          SI9: { x: 200, y: 150 },
          LI11: { x: 85, y: 180 },
          LI11: { x: 215, y: 180 },
          SI3: { x: 65, y: 290 },
          SI3: { x: 235, y: 290 },
        },
      },
      legs: {
        front: {
          ST31: { x: 125, y: 340 }, // Hip/thigh
          ST31: { x: 175, y: 340 },
          ST36: { x: 125, y: 410 }, // Knee
          ST36: { x: 175, y: 410 },
          ST40: { x: 125, y: 480 }, // Calf
          ST40: { x: 175, y: 480 },
          SP6: { x: 125, y: 520 }, // Ankle
          SP6: { x: 175, y: 520 },
        },
        back: {
          BL36: { x: 125, y: 360 },
          BL36: { x: 175, y: 360 },
          BL40: { x: 125, y: 410 },
          BL40: { x: 175, y: 410 },
          BL57: { x: 125, y: 480 },
          BL57: { x: 175, y: 480 },
          BL60: { x: 125, y: 530 },
          BL60: { x: 175, y: 530 },
        },
      },
      feet: {
        front: {
          ST41: { x: 125, y: 550 }, // Ankle front
          ST41: { x: 175, y: 550 },
          ST44: { x: 125, y: 570 }, // Foot top
          ST44: { x: 175, y: 570 },
          LV3: { x: 120, y: 575 }, // Foot top
          LV3: { x: 180, y: 575 },
          KI1: { x: 125, y: 585 }, // Foot sole
          KI1: { x: 175, y: 585 },
        },
        back: {
          BL60: { x: 125, y: 550 },
          BL60: { x: 175, y: 550 },
          BL62: { x: 120, y: 565 },
          BL62: { x: 180, y: 565 },
          KI1: { x: 125, y: 585 },
          KI1: { x: 175, y: 585 },
        },
      },
    };

    const regionMap = coordinateMap[region];
    if (!regionMap || !regionMap[viewSide]) return null;

    // Try to find point by code or name
    const coords =
      regionMap[viewSide][point.code] ||
      regionMap[viewSide][point.name] ||
      regionMap[viewSide][point.english_name];

    return coords;
  };

  if (!region) return null;

  const regionConfig = regionViewBoxes[region];
  if (!regionConfig || !regionConfig[viewSide]) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {region.replace("-", " & ")} - {viewSide} View
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Zoomed Body Region */}
        <div className="relative mb-6">
          {svgContent ? (
            <div
              className="relative bg-gray-50 rounded-lg overflow-hidden"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-gray-500">Loading detailed view...</div>
            </div>
          )}

          {/* Overlay pressure points */}
          {svgContent &&
            points.map((point, index) => {
              const coords = getZoomedPointCoordinates(point, regionConfig);
              if (!coords) return null;

              const meridianColor = getMeridianColor(point.meridian);
              const isSelected = selectedMeridian === point.meridian;
              const opacity = selectedMeridian && !isSelected ? 0.3 : 1;

              return (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${(coords.x / 300) * 100}%`,
                    top: `${(coords.y / 600) * 100}%`,
                    opacity,
                  }}
                  onClick={() => onPointSelect(point)}
                >
                  <div
                    className="w-3 h-3 rounded-full border-2 border-white shadow-lg hover:scale-150 transition-transform"
                    style={{ backgroundColor: meridianColor }}
                    title={`${point.code}: ${point.name || point.english_name}`}
                  />
                  {isSelected && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap z-10">
                      <div className="font-semibold">{point.code}</div>
                      <div>{point.name || point.english_name}</div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Points List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Pressure Points in this Region
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {points.map((point, index) => {
                const meridianColor = getMeridianColor(point.meridian);
                const isSelected = selectedMeridian === point.meridian;

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => onPointSelect(point)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: meridianColor }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {point.code}
                        </div>
                        <div className="text-sm text-gray-600">
                          {point.name || point.english_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {point.meridian} • {point.location}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Point Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Point Details
            </h3>
            {points.find((p) => selectedMeridian === p.meridian) ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                {(() => {
                  const point = points.find(
                    (p) => selectedMeridian === p.meridian,
                  );
                  return (
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-lg">
                          {point.code}
                        </span>
                        <h4 className="text-xl font-bold text-gray-800">
                          {point.name || point.english_name}
                        </h4>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Meridian:</span>
                        <div
                          className="inline-block ml-2 px-2 py-1 rounded text-white text-sm"
                          style={{
                            backgroundColor: getMeridianColor(point.meridian),
                          }}
                        >
                          {point.meridian}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Location:</span>
                        <p className="mt-1">{point.location}</p>
                      </div>
                      {point.benefits && (
                        <div>
                          <span className="text-sm text-gray-600">
                            Benefits:
                          </span>
                          <p className="mt-1">{point.benefits}</p>
                        </div>
                      )}
                      {point.technique && (
                        <div>
                          <span className="text-sm text-gray-600">
                            Technique:
                          </span>
                          <p className="mt-1">{point.technique}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                Click on a pressure point to see details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoomedRegion;
