// Lazy data loader with code splitting and caching
class LazyDataLoader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
  }

  async loadData(dataType) {
    // Return cached data if available
    if (this.cache.has(dataType)) {
      return this.cache.get(dataType);
    }

    // Return existing loading promise to avoid duplicate requests
    if (this.loadingPromises.has(dataType)) {
      return this.loadingPromises.get(dataType);
    }

    // Create new loading promise
    const loadingPromise = this.createLoadingPromise(dataType);
    this.loadingPromises.set(dataType, loadingPromise);

    try {
      const data = await loadingPromise;
      this.cache.set(dataType, data);
      this.loadingPromises.delete(dataType);
      return data;
    } catch (error) {
      this.loadingPromises.delete(dataType);
      throw error;
    }
  }

  async createLoadingPromise(dataType) {
    switch (dataType) {
      case "all-points":
        const { default: allPoints } = await import(
          "../data/meridian_mastery_points_bilateral.json"
        );
        return this.transformAllPoints(allPoints);

      case "maek-chi-ki":
        const { default: maekChiKi } = await import("../data/maek_chi_ki.json");
        return this.transformMaekPoints(maekChiKi, "Maek Chi Ki");

      case "maek-cha-ki":
        const { default: maekChaKi } = await import("../data/maek_cha_ki.json");
        return this.transformMaekPoints(maekChaKi, "Maek Cha Ki");

      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }
  transformAllPoints(data) {
    return data.map((point, index) => ({
      id: point.id || `point_${index}`,
      nameEnglish: point["English Translation (Verified)"] || "",
      nameHangul: point["Korean Name (Hangul)"] || "",
      nameRomanized: point["Romanized Korean"] || "",
      meridian: point["Meridian Name"]
        ? point["Meridian Name"].replace(/\s*\([^)]*\)/, "").trim()
        : "",
      point_number: point["Point Number"] || "",
      location: point["Anatomical Location"] || "",
      healingFunction: point["Healing Function"] || "",
      martialApplication: point["Martial Application"] || "",
      bilateral: point.Bilateral === "Yes",
      insight: point.Insight || "",
      element: this.getElementFromMeridian(point["Meridian Name"]),
    }));
  }
  transformMaekPoints(data, defaultMeridian) {
    return data.map((point, index) => ({
      id:
        point.id ||
        `${defaultMeridian.toLowerCase().replace(/\s+/g, "_")}_${index}`,
      nameEnglish: point.english || point.nameEnglish || "",
      nameHangul: point.hangul || point.nameHangul || "",
      nameRomanized: point.romanized || point.nameRomanized || "",
      meridian: point.meridian || defaultMeridian,
      point_number: point.point_number || point.number || "",
      location: point.location || "",
      healingFunction: point.healingFunction || point["Healing Function"] || "",
      martialApplication:
        point.martialApplication || point["Martial Application"] || "",
      bilateral: point.bilateral !== "No",
      insight: point.insight || "",
    }));
  }

  getElementFromMeridian(meridianName) {
    if (!meridianName) return "earth";
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
      "Triple Burner": "fire",
      Liver: "wood",
      Gallbladder: "wood",
      Governing: "extraordinary",
      Conception: "extraordinary",
    };
    return elementMap[normalizedName] || "earth";
  }

  // Preload critical data
  async preloadCriticalData() {
    try {
      // Load most common data types in background
      await Promise.all([
        this.loadData("all-points"),
        this.loadData("maek-chi-ki"),
      ]);
    } catch (error) {
      console.warn("Failed to preload critical data:", error);
    }
  }

  // Clear cache when needed
  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  // Get cache size for debugging
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      loadingPromises: this.loadingPromises.size,
      cachedTypes: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
const dataLoader = new LazyDataLoader();

// Enhanced data loader functions with lazy loading
export const getAllPoints = async () => {
  return dataLoader.loadData("all-points");
};

export const getMaekChiKiPoints = async () => {
  return dataLoader.loadData("maek-chi-ki");
};

export const getMaekChaKiPoints = async () => {
  return dataLoader.loadData("maek-cha-ki");
};

// Utility functions with caching
const meridianCache = new Map();
const regionCache = new Map();

export const getPointsByMeridian = async (meridian) => {
  if (meridianCache.has(meridian)) {
    return meridianCache.get(meridian);
  }

  const allPoints = await getAllPoints();

  // Clean up the meridian name for matching
  // Remove parentheses and abbreviations to match the transformed data
  const cleanMeridian = meridian.replace(/\s*\([^)]*\)/, "").trim();

  console.log(
    `🔍 Searching for meridian: "${meridian}" -> cleaned: "${cleanMeridian}"`,
  );

  const meridianPoints = allPoints.filter((point) => {
    if (!point.meridian) return false;

    const pointMeridian = point.meridian.toLowerCase();
    const searchMeridian = cleanMeridian.toLowerCase();

    // Direct match
    if (pointMeridian === searchMeridian) return true;

    // Handle some common variations
    const variations = {
      "urinary bladder": "bladder",
      bladder: "urinary bladder",
      "triple burner": "triple heater",
      "triple heater": "triple burner",
    };

    if (
      variations[searchMeridian] &&
      pointMeridian === variations[searchMeridian]
    )
      return true;
    if (
      variations[pointMeridian] &&
      searchMeridian === variations[pointMeridian]
    )
      return true;

    return false;
  });

  console.log(
    `✅ Found ${meridianPoints.length} points for "${cleanMeridian}"`,
  );
  if (meridianPoints.length > 0) {
    console.log(
      "📋 Sample points:",
      meridianPoints
        .slice(0, 3)
        .map((p) => `${p.point_number}: ${p.nameEnglish}`),
    );
  } else {
    console.log(
      "❌ No points found. Available meridians:",
      [...new Set(allPoints.map((p) => p.meridian))].slice(0, 10),
    );
  }

  meridianCache.set(meridian, meridianPoints);
  return meridianPoints;
};

export const getPointsByRegion = async (region) => {
  if (regionCache.has(region)) {
    return regionCache.get(region);
  }

  const allPoints = await getAllPoints();
  const regionPoints = allPoints.filter(
    (point) =>
      point.location &&
      point.location.toLowerCase().includes(region.toLowerCase()),
  );

  regionCache.set(region, regionPoints);
  return regionPoints;
};

export const getPointsByTheme = async (theme) => {
  const allPoints = await getAllPoints();

  switch (theme.toLowerCase()) {
    case "healing":
      return allPoints.filter(
        (point) => point.healingFunction && point.healingFunction.trim() !== "",
      );
    case "martial":
      return allPoints.filter(
        (point) =>
          point.martialApplication && point.martialApplication.trim() !== "",
      );
    default:
      return allPoints;
  }
};

// Combined data loader for mixed sessions
export const getCombinedData = async () => {
  const [allPoints, maekChiKi, maekChaKi] = await Promise.all([
    getAllPoints(),
    getMaekChiKiPoints(),
    getMaekChaKiPoints(),
  ]);

  return [...allPoints, ...maekChiKi, ...maekChaKi];
};

// Preload critical data on module load
dataLoader.preloadCriticalData();

// Export utilities
export const clearDataCaches = () => {
  dataLoader.clearCache();
  meridianCache.clear();
  regionCache.clear();
};

export const getDataCacheStats = () => {
  return {
    ...dataLoader.getCacheStats(),
    meridianCacheSize: meridianCache.size,
    regionCacheSize: regionCache.size,
  };
};
