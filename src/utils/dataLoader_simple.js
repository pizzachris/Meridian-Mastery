// Import data directly for now to fix loading issues
import allPointsData from "../data/meridian_mastery_points_bilateral.json";
import maekChiKiData from "../data/maek_chi_ki.json";
import maekChaKiData from "../data/maek_cha_ki.json";

// Cache for transformed data to avoid re-processing
let transformedAllPointsCache = null;
let transformedMaekChiKiCache = null;
let transformedMaekChaKiCache = null;

// Cache by meridian to speed up meridian-specific queries
const meridianCache = new Map();
const regionCache = new Map();

// Get all pressure points with proper field mapping and caching
export const getAllPoints = async () => {
  if (transformedAllPointsCache) {
    return transformedAllPointsCache;
  }

  try {
    const transformedData = allPointsData.map((point) => ({
      id: point.id || point.ID || `point_${Math.random()}`,
      nameEnglish:
        point.nameEnglish || point.english || point.name_english || "",
      nameHangul: point.nameHangul || point.hangul || point.name_hangul || "",
      nameRomanized:
        point.nameRomanized || point.romanized || point.name_romanized || "",
      meridian: point.meridian || point.Meridian || "",
      number: point.number || point.Number || point.point_number || "",
      location: point.location || point.Location || "",
      tcmFunction:
        point.tcmFunction || point.tcm_function || point.TCMFunction || "",
      healingFunction:
        point.healingFunction ||
        point.healing_function ||
        point.HealingFunction ||
        "",
      martialApplication:
        point.martialApplication ||
        point.martial_application ||
        point.MartialApplication ||
        "",
      warningNote:
        point.warningNote || point.warning_note || point.WarningNote || "",
      side: point.side || point.Side || "bilateral",
      insights: point.insights || point.Insights || "",
    }));

    transformedAllPointsCache = transformedData;
    return transformedData;
  } catch (error) {
    console.error("Error loading all points:", error);
    return [];
  }
};

// Get Maek Chi Ki points with proper field mapping
export const getMaekChiKiPoints = async () => {
  if (transformedMaekChiKiCache) {
    return transformedMaekChiKiCache;
  }

  try {
    const transformedData = maekChiKiData.map((point) => ({
      id: point.id || point.ID || `maek_chi_ki_${Math.random()}`,
      nameEnglish:
        point.nameEnglish || point.english || point.name_english || "",
      nameHangul: point.nameHangul || point.hangul || point.name_hangul || "",
      nameRomanized:
        point.nameRomanized || point.romanized || point.name_romanized || "",
      meridian: point.meridian || point.Meridian || "Maek Chi Ki",
      number: point.number || point.Number || point.point_number || "",
      location: point.location || point.Location || "",
      tcmFunction:
        point.tcmFunction || point.tcm_function || point.TCMFunction || "",
      healingFunction:
        point.healingFunction ||
        point.healing_function ||
        point.HealingFunction ||
        "",
      martialApplication:
        point.martialApplication ||
        point.martial_application ||
        point.MartialApplication ||
        "",
      warningNote:
        point.warningNote || point.warning_note || point.WarningNote || "",
      side: point.side || point.Side || "bilateral",
      insights: point.insights || point.Insights || "",
    }));

    transformedMaekChiKiCache = transformedData;
    return transformedData;
  } catch (error) {
    console.error("Error loading Maek Chi Ki points:", error);
    return [];
  }
};

// Get Maek Cha Ki points with proper field mapping
export const getMaekChaKiPoints = async () => {
  if (transformedMaekChaKiCache) {
    return transformedMaekChaKiCache;
  }

  try {
    const transformedData = maekChaKiData.map((point) => ({
      id: point.id || point.ID || `maek_cha_ki_${Math.random()}`,
      nameEnglish:
        point.nameEnglish || point.english || point.name_english || "",
      nameHangul: point.nameHangul || point.hangul || point.name_hangul || "",
      nameRomanized:
        point.nameRomanized || point.romanized || point.name_romanized || "",
      meridian: point.meridian || point.Meridian || "Maek Cha Ki",
      number: point.number || point.Number || point.point_number || "",
      location: point.location || point.Location || "",
      tcmFunction:
        point.tcmFunction || point.tcm_function || point.TCMFunction || "",
      healingFunction:
        point.healingFunction ||
        point.healing_function ||
        point.HealingFunction ||
        "",
      martialApplication:
        point.martialApplication ||
        point.martial_application ||
        point.MartialApplication ||
        "",
      warningNote:
        point.warningNote || point.warning_note || point.WarningNote || "",
      side: point.side || point.Side || "bilateral",
      insights: point.insights || point.Insights || "",
    }));

    transformedMaekChaKiCache = transformedData;
    return transformedData;
  } catch (error) {
    console.error("Error loading Maek Cha Ki points:", error);
    return [];
  }
};

// Get points by meridian with caching
export const getPointsByMeridian = async (meridian) => {
  if (meridianCache.has(meridian)) {
    return meridianCache.get(meridian);
  }

  try {
    const allPoints = await getAllPoints();
    const meridianPoints = allPoints.filter(
      (point) =>
        point.meridian &&
        point.meridian.toLowerCase() === meridian.toLowerCase(),
    );

    meridianCache.set(meridian, meridianPoints);
    return meridianPoints;
  } catch (error) {
    console.error(`Error loading points for meridian ${meridian}:`, error);
    return [];
  }
};

// Get points by region with caching
export const getPointsByRegion = async (region) => {
  if (regionCache.has(region)) {
    return regionCache.get(region);
  }

  try {
    const allPoints = await getAllPoints();
    const regionPoints = allPoints.filter(
      (point) =>
        point.location &&
        point.location.toLowerCase().includes(region.toLowerCase()),
    );

    regionCache.set(region, regionPoints);
    return regionPoints;
  } catch (error) {
    console.error(`Error loading points for region ${region}:`, error);
    return [];
  }
};

// Get points by theme - this is a simple implementation
export const getPointsByTheme = async (theme) => {
  try {
    const allPoints = await getAllPoints();

    switch (theme.toLowerCase()) {
      case "healing":
        return allPoints.filter(
          (point) =>
            point.healingFunction && point.healingFunction.trim() !== "",
        );
      case "martial":
        return allPoints.filter(
          (point) =>
            point.martialApplication && point.martialApplication.trim() !== "",
        );
      case "tcm":
        return allPoints.filter(
          (point) => point.tcmFunction && point.tcmFunction.trim() !== "",
        );
      default:
        return allPoints;
    }
  } catch (error) {
    console.error(`Error loading points for theme ${theme}:`, error);
    return [];
  }
};

// Utility functions for data analysis
export const getAvailableMeridians = async () => {
  try {
    const allPoints = await getAllPoints();
    const meridians = [
      ...new Set(allPoints.map((point) => point.meridian).filter(Boolean)),
    ];
    return meridians.sort();
  } catch (error) {
    console.error("Error getting available meridians:", error);
    return [];
  }
};

export const getAvailableRegions = async () => {
  try {
    const allPoints = await getAllPoints();
    const regions = [
      ...new Set(
        allPoints
          .map((point) => point.location)
          .filter(Boolean)
          .map((location) => {
            // Extract main body regions from location descriptions
            const lowerLocation = location.toLowerCase();
            if (
              lowerLocation.includes("head") ||
              lowerLocation.includes("face") ||
              lowerLocation.includes("forehead")
            )
              return "Head";
            if (
              lowerLocation.includes("neck") ||
              lowerLocation.includes("throat")
            )
              return "Neck";
            if (
              lowerLocation.includes("chest") ||
              lowerLocation.includes("breast")
            )
              return "Chest";
            if (
              lowerLocation.includes("back") ||
              lowerLocation.includes("spine")
            )
              return "Back";
            if (
              lowerLocation.includes("arm") ||
              lowerLocation.includes("elbow") ||
              lowerLocation.includes("wrist") ||
              lowerLocation.includes("hand")
            )
              return "Arm";
            if (
              lowerLocation.includes("leg") ||
              lowerLocation.includes("knee") ||
              lowerLocation.includes("ankle") ||
              lowerLocation.includes("foot")
            )
              return "Leg";
            if (
              lowerLocation.includes("abdomen") ||
              lowerLocation.includes("stomach") ||
              lowerLocation.includes("belly")
            )
              return "Abdomen";
            return "Other";
          }),
      ),
    ];
    return regions.sort();
  } catch (error) {
    console.error("Error getting available regions:", error);
    return [];
  }
};

// Combined data loader for mixed sessions
export const getCombinedData = async () => {
  try {
    const [allPoints, maekChiKi, maekChaKi] = await Promise.all([
      getAllPoints(),
      getMaekChiKiPoints(),
      getMaekChaKiPoints(),
    ]);

    return [...allPoints, ...maekChiKi, ...maekChaKi];
  } catch (error) {
    console.error("Error loading combined data:", error);
    return [];
  }
};

// Validation function to check data integrity
export const validateDataIntegrity = async () => {
  try {
    const allPoints = await getAllPoints();
    const maekChiKi = await getMaekChiKiPoints();
    const maekChaKi = await getMaekChaKiPoints();

    const issues = [];

    // Check for missing required fields
    const checkRequiredFields = (points, dataType) => {
      points.forEach((point, index) => {
        if (!point.nameEnglish || point.nameEnglish.trim() === "") {
          issues.push(`${dataType}[${index}]: Missing nameEnglish`);
        }
        if (!point.nameHangul || point.nameHangul.trim() === "") {
          issues.push(`${dataType}[${index}]: Missing nameHangul`);
        }
        if (!point.nameRomanized || point.nameRomanized.trim() === "") {
          issues.push(`${dataType}[${index}]: Missing nameRomanized`);
        }
      });
    };

    checkRequiredFields(allPoints, "AllPoints");
    checkRequiredFields(maekChiKi, "MaekChiKi");
    checkRequiredFields(maekChaKi, "MaekChaKi");

    return {
      isValid: issues.length === 0,
      issues,
      stats: {
        totalPoints: allPoints.length,
        maekChiKiPoints: maekChiKi.length,
        maekChaKiPoints: maekChaKi.length,
        uniqueMeridians: await getAvailableMeridians().then((m) => m.length),
        uniqueRegions: await getAvailableRegions().then((r) => r.length),
      },
    };
  } catch (error) {
    console.error("Error validating data integrity:", error);
    return {
      isValid: false,
      issues: ["Failed to validate data integrity"],
      stats: {},
    };
  }
};
