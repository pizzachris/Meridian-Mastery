// Enhanced data loader with virtual scrolling and progressive loading
import { memo } from "react";

class VirtualizedDataLoader {
  constructor() {
    this.cache = new Map();
    this.loadedChunks = new Set();
    this.chunkSize = 50; // Load 50 items at a time
    this.preloadBuffer = 10; // Preload 10 items ahead
  }

  // Progressive loading for large datasets
  async loadChunk(dataType, chunkIndex) {
    const cacheKey = `${dataType}_chunk_${chunkIndex}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const fullData = await this.loadFullData(dataType);
      const startIndex = chunkIndex * this.chunkSize;
      const endIndex = Math.min(startIndex + this.chunkSize, fullData.length);
      const chunk = fullData.slice(startIndex, endIndex);

      this.cache.set(cacheKey, chunk);
      this.loadedChunks.add(cacheKey);

      return chunk;
    } catch (error) {
      console.error(
        `Failed to load chunk ${chunkIndex} for ${dataType}:`,
        error,
      );
      return [];
    }
  }

  // Preload next chunks in background
  async preloadNextChunks(dataType, currentChunk) {
    const preloadPromises = [];
    for (let i = 1; i <= this.preloadBuffer; i++) {
      const nextChunk = currentChunk + i;
      preloadPromises.push(this.loadChunk(dataType, nextChunk));
    }

    // Don't wait for preloading to complete
    Promise.all(preloadPromises).catch((err) =>
      console.warn("Preload failed:", err),
    );
  }

  // Virtual scrolling hook
  useVirtualizedData(dataType, visibleRange) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadVisibleData = async () => {
        setLoading(true);
        const chunks = [];

        const startChunk = Math.floor(visibleRange.start / this.chunkSize);
        const endChunk = Math.ceil(visibleRange.end / this.chunkSize);

        for (
          let chunkIndex = startChunk;
          chunkIndex <= endChunk;
          chunkIndex++
        ) {
          const chunk = await this.loadChunk(dataType, chunkIndex);
          chunks.push(...chunk);
        }

        setData(chunks);
        setLoading(false);

        // Preload next chunks
        this.preloadNextChunks(dataType, endChunk);
      };

      loadVisibleData();
    }, [dataType, visibleRange.start, visibleRange.end]);

    return { data, loading };
  }

  async loadFullData(dataType) {
    if (this.cache.has(dataType)) {
      return this.cache.get(dataType);
    }

    let data;
    switch (dataType) {
      case "all-points":
        const { default: allPoints } = await import(
          "../data/meridian_mastery_points_bilateral.json"
        );
        data = this.transformAllPoints(allPoints);
        break;
      case "maek-chi-ki":
        const { default: maekChiKi } = await import("../data/maek_chi_ki.json");
        data = this.transformMaekPoints(maekChiKi, "Maek Chi Ki");
        break;
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }

    this.cache.set(dataType, data);
    return data;
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
      healingFunction: point.healingFunction || "",
      martialApplication: point.martialApplication || "",
      bilateral: point.bilateral !== "No",
      insight: point.insight || "",
    }));
  }

  // Memory cleanup
  clearOldChunks(keepRecentCount = 20) {
    if (this.loadedChunks.size > keepRecentCount * 2) {
      const chunksToRemove = Array.from(this.loadedChunks).slice(
        0,
        -keepRecentCount,
      );
      chunksToRemove.forEach((chunkKey) => {
        this.cache.delete(chunkKey);
        this.loadedChunks.delete(chunkKey);
      });
    }
  }
}

export const virtualizedDataLoader = new VirtualizedDataLoader();
export default VirtualizedDataLoader;
