// Cache for loaded data to avoid re-importing
let cachedAllPointsData = null;
let cachedMaekChiKiData = null;
let cachedMaekChaKiData = null;

// Cache for transformed data to avoid re-processing
let transformedAllPointsCache = null;
let transformedMaekChiKiCache = null;
let transformedMaekChaKiCache = null;

// Cache by meridian to speed up meridian-specific queries
const meridianCache = new Map();
const regionCache = new Map();

// Dynamic import functions for better performance
const loadAllPointsData = async () => {
  if (!cachedAllPointsData) {
    try {
      const module = await import(
        "../data/meridian_mastery_points_bilateral.json"
      );
      cachedAllPointsData = module.default;
    } catch (error) {
      console.error("Failed to load all points data:", error);
      cachedAllPointsData = [];
    }
  }
  return cachedAllPointsData;
};

const loadMaekChiKiData = async () => {
  if (!cachedMaekChiKiData) {
    try {
      const module = await import("../data/maek_chi_ki.json");
      cachedMaekChiKiData = module.default;
    } catch (error) {
      console.error("Failed to load Maek Chi Ki data:", error);
      cachedMaekChiKiData = [];
    }
  }
  return cachedMaekChiKiData;
};

const loadMaekChaKiData = async () => {
  if (!cachedMaekChaKiData) {
    try {
      const module = await import("../data/maek_cha_ki.json");
      cachedMaekChaKiData = module.default;
    } catch (error) {
      console.error("Failed to load Maek Cha Ki data:", error);
      cachedMaekChaKiData = [];
    }
  }
  return cachedMaekChaKiData;
};

// Clear all caches - useful for hot reloading or data refresh
export const clearDataCaches = () => {
  cachedAllPointsData = null;
  cachedMaekChiKiData = null;
  cachedMaekChaKiData = null;
  transformedAllPointsCache = null;
  transformedMaekChiKiCache = null;
  transformedMaekChaKiCache = null;
  meridianCache.clear();
  regionCache.clear();
};

// Helper function to get element from meridian name
const getElementFromMeridian = (meridianName) => {
  if (!meridianName) return "earth"; // Default to earth (gold color)

  // Normalize the meridian name by removing parentheses and codes
  const normalizedName = meridianName.replace(/\s*\([^)]*\)/, "").trim();

  const elementMap = {
    Lung: "metal",
    "Large Intestine": "metal",
    Stomach: "earth",
    Spleen: "earth",
    Heart: "fire",
    "Small Intestine": "fire",
    Bladder: "water",
    "Urinary Bladder": "water",
    Kidney: "water",
    Pericardium: "fire",
    "Triple Heater": "fire",
    "Triple Warmer": "fire",
    Gallbladder: "wood",
    Liver: "wood",
    "Governing Vessel": "extraordinary",
    "Conception Vessel": "extraordinary",
    Governing: "extraordinary",
    Conception: "extraordinary",
  };

  return elementMap[normalizedName] || "earth"; // Default to earth for unknown meridians
};

// Transform simple point data to flashcard format (for Maek Chi Ki and Maek Cha Ki)
const transformSimpleToFlashcards = (data) => {
  console.log("transformSimpleToFlashcards called with:", data);
  console.log("Data type:", typeof data);
  console.log("Is array:", Array.isArray(data));

  if (!data) {
    console.error("Data is undefined or null");
    return [];
  }

  if (!Array.isArray(data)) {
    console.error("Invalid data format: expected array, got:", typeof data);
    return [];
  }

  try {
    const result = data
      .map((point, index) => {
        try {
          if (!point) {
            console.warn(`Point at index ${index} is undefined/null`);
            return null;
          }

          // Handle both formats: complex format from bilateral JSON and simple format
          let transformedPoint;

          if (point["Point Number"] || point["Meridian Name"]) {
            // Complex format from bilateral JSON
            transformedPoint = {
              id: point.id || index + 1,
              point_number: point["Point Number"] || "",
              hangul: point["Korean Name (Hangul)"] || "",
              romanized: point["Romanized Korean"] || "",
              english: point["English Translation (Verified)"] || "",
              meridian: point["Meridian Name"]
                ? point["Meridian Name"].replace(/\s*\([^)]*\)/, "").trim()
                : "",
              element:
                point.Element || getElementFromMeridian(point["Meridian Name"]),
              bilateral: point.Bilateral === "Yes" || point.Bilateral === true,
              insight: point.Insight || "",
              location: point["Anatomical Location"] || "",
              healingFunction: point["Healing Function"] || "",
              martialApplication: point["Martial Application"] || "",
            };
          } else {
            // Simple format already has the correct field names
            transformedPoint = {
              id: point.id || index + 1,
              point_number: point.point_number || "",
              hangul: point.hangul || "",
              romanized: point.romanized || "",
              english: point.english || "",
              meridian: point.meridian || "",
              element: point.element || "earth",
              bilateral: point.bilateral === "Yes" || point.bilateral === true,
              insight: point.insight || "",
            };
          }

          // Legacy support - also include the original field names for backward compatibility
          transformedPoint.number = transformedPoint.point_number;
          transformedPoint.nameHangul = transformedPoint.hangul;
          transformedPoint.nameRomanized = transformedPoint.romanized;
          transformedPoint.nameEnglish = transformedPoint.english;

          return transformedPoint;
        } catch (error) {
          console.error(
            `Error transforming point at index ${index}:`,
            error,
            point,
          );
          return null;
        }
      })
      .filter(Boolean);

    console.log("transformSimpleToFlashcards result:", result);
    return result;
  } catch (error) {
    console.error("Error in transformSimpleToFlashcards:", error);
    return [];
  }
};

// Transform point data to flashcard format
const transformToFlashcards = (data) => {
  if (!Array.isArray(data)) {
    console.error("Invalid data format: expected array");
    return [];
  }

  return data
    .map((point, index) => {
      try {
        // The data comes from the new bilateral JSON structure
        const transformedPoint = {
          id: point.id || index + 1, // Map to the expected field names
          point_number: point["Point Number"] || "",
          hangul: point["Korean Name (Hangul)"] || "",
          romanized: point["Romanized Korean"] || "",
          english: point["English Translation (Verified)"] || "",
          meridian: point["Meridian Name"]
            ? point["Meridian Name"].replace(/\s*\([^)]*\)/, "").trim()
            : "",
          element:
            point.Element || getElementFromMeridian(point["Meridian Name"]),
          location: point["Anatomical Location"] || "",
          healingFunction: point["Healing Function"] || "",
          martialApplication: point["Martial Application"] || "",
          bilateral: point.Bilateral === "Yes",
          sharedNameIndicator: point["Shared Name Indicator"] || null,
          insight: point.Insight || "",
          // Legacy support - also include the original field names for backward compatibility
          number: point["Point Number"] || "",
          nameHangul: point["Korean Name (Hangul)"] || "",
          nameRomanized: point["Romanized Korean"] || "",
          nameEnglish: point["English Translation (Verified)"] || "",
        };

        return transformedPoint;
      } catch (error) {
        console.error("Error transforming point:", error);
        return null;
      }
    })
    .filter(Boolean);
};

// Define regions based on common meridian groupings
const regionMap = {
  "Lung (LU)": "Arm",
  "Large Intestine (LI)": "Arm",
  "Stomach (ST)": "Leg",
  "Spleen (SP)": "Leg",
  "Heart (HT)": "Arm",
  "Small Intestine (SI)": "Arm",
  "Urinary Bladder (UB)": "Back", // UB channel runs along back and leg
  "Kidney (KI)": "Leg", // KI channel runs along leg and abdomen/chest
  "Pericardium (PC)": "Arm",
  "Triple Burner (TB)": "Arm",
  "Gallbladder (GB)": "Leg", // GB channel runs along head and leg
  "Liver (LV)": "Leg",
  "Conception Vessel (CV)": "Trunk", // Midline
  "Governing Vessel (GV)": "Back", // Midline
};

// Function to get points by meridian name
export const getPointsByMeridian = async (meridianName) => {
  console.log("getPointsByMeridian called with:", meridianName);

  try {
    const allPointsData = await loadAllPointsData();

    if (meridianName === "All") {
      return transformToFlashcards(allPointsData);
    }

    // Check cache first
    if (meridianCache.has(meridianName)) {
      console.log("Cache hit for meridian:", meridianName);
      return meridianCache.get(meridianName);
    }

    // Filter the raw data first, then transform
    const filteredData = allPointsData.filter((point) => {
      const pointMeridianName = point["Meridian Name"] || "";
      // Direct exact match - no processing needed since the meridian names from Daily Session match exactly
      const isMatch = pointMeridianName === meridianName;
      if (isMatch) {
        console.log(
          "Found matching point:",
          point["Point Number"],
          "for meridian:",
          meridianName,
        );
      }
      return isMatch;
    });

    console.log(
      `Found ${filteredData.length} points for meridian: ${meridianName}`,
    );

    // Sort by point number to ensure anatomical order (e.g., LU1, LU2, LU3...)
    filteredData.sort((a, b) => {
      const aNum = parseInt(a["Point Number"]?.match(/\d+/)?.[0] || "0");
      const bNum = parseInt(b["Point Number"]?.match(/\d+/)?.[0] || "0");
      return aNum - bNum;
    });

    const transformed = transformToFlashcards(filteredData);

    // Update cache
    meridianCache.set(meridianName, transformed);

    return transformed;
  } catch (error) {
    console.error("Error in getPointsByMeridian:", error);
    return [];
  }
};

// Function to get points by region
export const getPointsByRegion = async (regionName) => {
  try {
    const allPointsData = await loadAllPointsData();
    if (regionName === "All") {
      return transformToFlashcards(allPointsData);
    }

    // Check cache first
    if (regionCache.has(regionName)) {
      console.log("Cache hit for region:", regionName);
      return regionCache.get(regionName);
    }

    const filteredData = allPointsData.filter(
      (point) => regionMap[point.meridian_name] === regionName,
    );
    const transformed = transformToFlashcards(filteredData);

    // Update cache
    regionCache.set(regionName, transformed);

    return transformed;
  } catch (error) {
    console.error("Error in getPointsByRegion:", error);
    return [];
  }
};

// Function to get points by theme (currently not supported by data structure)
export const getPointsByTheme = async (themeName) => {
  try {
    // Need to determine how themes are defined in the JSON if needed
    console.warn(`Theme filtering not yet implemented for theme: ${themeName}`);
    return []; // Return empty array or all data, depending on desired behavior
  } catch (error) {
    console.error("Error in getPointsByTheme:", error);
    return [];
  }
};

// Function to get Maek Chi Ki points
export const getMaekChiKiPoints = async () => {
  try {
    const maekChiKiData = await loadMaekChiKiData();
    console.log("getMaekChiKiPoints called, data:", maekChiKiData);
    console.log("maekChiKiData type:", typeof maekChiKiData);
    console.log("maekChiKiData is array:", Array.isArray(maekChiKiData));

    // Check cache
    if (transformedMaekChiKiCache) {
      console.log("Using cached Maek Chi Ki data");
      return transformedMaekChiKiCache;
    }

    const result = transformSimpleToFlashcards(maekChiKiData);
    console.log("transformSimpleToFlashcards result:", result);

    // Update cache
    transformedMaekChiKiCache = result;

    return result;
  } catch (error) {
    console.error("Error in getMaekChiKiPoints:", error);
    return [];
  }
};

// Function to get Maek Cha Ki points
export const getMaekChaKiPoints = async () => {
  try {
    const maekChaKiData = await loadMaekChaKiData();

    // Check cache
    if (transformedMaekChaKiCache) {
      console.log("Using cached Maek Cha Ki data");
      return transformedMaekChaKiCache;
    }

    const result = transformSimpleToFlashcards(maekChaKiData);

    // Update cache
    transformedMaekChaKiCache = result;

    return result;
  } catch (error) {
    console.error("Error in getMaekChaKiPoints:", error);
    return [];
  }
};

// Placeholder for future functions (e.g., getPointsBySearch)
export const getPointsBySearch = (query) => {
  // Implement search logic if needed
  console.warn(`Search functionality not yet implemented for query: ${query}`);
  return []; // Return empty array or all data
};

// Get all points
export const getAllPoints = async () => {
  try {
    const allPointsData = await loadAllPointsData();

    // Check transformed cache
    if (transformedAllPointsCache) {
      console.log("Using cached all points data");
      return transformedAllPointsCache;
    }

    if (!allPointsData || !Array.isArray(allPointsData)) {
      console.error(
        "allPointsData is not available or not an array:",
        allPointsData,
      );
      return [];
    }

    const transformed = transformToFlashcards(allPointsData);

    // Update cache
    transformedAllPointsCache = transformed;

    return transformed;
  } catch (error) {
    console.error("Error in getAllPoints:", error);
    return [];
  }
};

// Get meridian colors based on Five Elements
export const getMeridianColor = (meridian) => {
  const colors = {
    Lung: "#FFD700", // Gold
    "Large Intestine": "#FFD700", // Gold
    Stomach: "#FFA500", // Orange
    Spleen: "#FFA500", // Orange
    Heart: "#FF0000", // Red
    "Small Intestine": "#FF0000", // Red
    Bladder: "#0000FF", // Blue
    Kidney: "#0000FF", // Blue
    Pericardium: "#FF0000", // Red
    "Triple Warmer": "#FF0000", // Red
    Gallbladder: "#00FF00", // Green
    Liver: "#00FF00", // Green
    "Governing Vessel": "#800080", // Purple
    "Conception Vessel": "#800080", // Purple
  };

  // Normalize the meridian name for lookup
  const normalizedMeridian = meridian.replace(/\s*\([^)]*\)/, "").trim();

  return colors[normalizedMeridian] || "#FFFFFF";
};

// Get all meridians
export const getAllMeridians = () => {
  try {
    // Extract unique meridian names from the full dataset
    const meridians = new Set(
      allPointsData
        .map((point) => point.meridian_name?.replace(/\s*\([^)]*\)/, "").trim())
        .filter(Boolean),
    );
    return Array.from(meridians);
  } catch (error) {
    console.error("Error getting meridians:", error);
    return [];
  }
};

// Get all body regions
export const getAllRegions = () => {
  return ["head", "chest", "abdomen", "arms", "legs"];
};

// Get all themes
export const getAllThemes = () => {
  return ["healing", "martial", "maek-chi-ki", "maek-cha-ki"];
};

// Get point by ID
export const getPointById = (id) => {
  if (!id) return null;

  try {
    // Find the point in the full dataset by ID
    const point = allPointsData.find((p) => p.id === id);
    return point ? transformToFlashcards([point])[0] : null;
  } catch (error) {
    console.error(`Error getting point with ID ${id}:`, error);
    return null;
  }
};

// Get points by element
export const getPointsByElement = (element) => {
  if (!element) return [];

  try {
    // Filter by element from the full dataset
    const filtered = allPointsData.filter(
      (point) =>
        getElementFromMeridian(point.meridian_name).toLowerCase() ===
        element.toLowerCase(),
    );
    return transformToFlashcards(filtered);
  } catch (error) {
    console.error(`Error getting points for element ${element}:`, error);
    return [];
  }
};

// Get all elements
export const getAllElements = () => {
  try {
    const elements = new Set(
      allPointsData
        .map((point) => getElementFromMeridian(point.meridian_name))
        .filter((element) => element !== "unknown"),
    );
    return Array.from(elements);
  } catch (error) {
    console.error("Error getting elements:", error);
    return [];
  }
};
