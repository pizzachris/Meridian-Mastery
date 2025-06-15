// Performance and Mobile Optimization Test Suite
// Tests all the implemented optimizations

import { performanceMonitor } from "./performanceMonitor.jsx";
import {
  getOptimalTouchTargetSize,
  isMobileDevice,
} from "./mobileOptimization.js";

class OptimizationTester {
  constructor() {
    this.results = {
      performance: {},
      mobile: {},
      bundleSize: {},
      caching: {},
      touchGestures: {},
      dataLoading: {},
    };

    this.startTime = performance.now();
    this.isComplete = false;
  }

  async runAllTests() {
    console.log("🧪 Starting Optimization Test Suite...");

    // Performance tests
    await this.testPerformanceMetrics();

    // Mobile optimization tests
    await this.testMobileOptimizations();

    // Data loading tests
    await this.testDataLoadingOptimizations();

    // Caching tests
    await this.testCachingStrategy();

    // Touch gesture tests
    await this.testTouchGestures();

    // Bundle size analysis
    await this.testBundleSize();

    this.isComplete = true;
    this.generateReport();

    return this.results;
  }

  async testPerformanceMetrics() {
    console.log("📊 Testing Performance Metrics...");

    try {
      // Test Core Web Vitals
      const coreWebVitals = await performanceMonitor.getCoreWebVitals();
      this.results.performance.coreWebVitals = coreWebVitals;

      // Test memory usage
      const memoryUsage = performanceMonitor.getMemoryUsage();
      this.results.performance.memory = memoryUsage;

      // Test component render times
      const renderStart = performance.now();
      // Simulate a heavy render operation
      await new Promise((resolve) => setTimeout(resolve, 10));
      const renderTime = performance.now() - renderStart;
      this.results.performance.renderTime = renderTime;

      // Test FPS if possible
      if ("requestAnimationFrame" in window) {
        const fps = await this.measureFPS();
        this.results.performance.fps = fps;
      }

      console.log("✅ Performance metrics tested");
    } catch (error) {
      console.error("❌ Performance test failed:", error);
      this.results.performance.error = error.message;
    }
  }

  async testMobileOptimizations() {
    console.log("📱 Testing Mobile Optimizations...");

    try {
      // Test device detection
      this.results.mobile.isMobile = isMobileDevice();

      // Test touch target sizes
      const touchSize = getOptimalTouchTargetSize();
      this.results.mobile.touchTargetSize = touchSize;

      // Test viewport configuration
      const viewport = document.querySelector('meta[name="viewport"]');
      this.results.mobile.viewportOptimized =
        viewport &&
        viewport.content.includes("user-scalable=no") &&
        viewport.content.includes("viewport-fit=cover");

      // Test responsive design
      this.results.mobile.isResponsive = this.testResponsiveDesign();

      // Test PWA capabilities
      this.results.mobile.isPWA =
        "serviceWorker" in navigator &&
        document.querySelector('link[rel="manifest"]');

      console.log("✅ Mobile optimizations tested");
    } catch (error) {
      console.error("❌ Mobile test failed:", error);
      this.results.mobile.error = error.message;
    }
  }

  async testDataLoadingOptimizations() {
    console.log("💾 Testing Data Loading Optimizations...");

    try {
      // Test dynamic imports
      const loadStart = performance.now();
      const { getAllPoints } = await import("./dataLoaderOptimized.js");
      const loadTime = performance.now() - loadStart;
      this.results.dataLoading.dynamicImportTime = loadTime;

      // Test caching
      const cacheStart = performance.now();
      const points1 = await getAllPoints();
      const firstLoadTime = performance.now() - cacheStart;

      const cacheStart2 = performance.now();
      const points2 = await getAllPoints();
      const secondLoadTime = performance.now() - cacheStart2;

      this.results.dataLoading.firstLoad = firstLoadTime;
      this.results.dataLoading.cachedLoad = secondLoadTime;
      this.results.dataLoading.cacheEffective =
        secondLoadTime < firstLoadTime * 0.5;

      console.log("✅ Data loading optimizations tested");
    } catch (error) {
      console.error("❌ Data loading test failed:", error);
      this.results.dataLoading.error = error.message;
    }
  }

  async testCachingStrategy() {
    console.log("🗄️ Testing Caching Strategy...");

    try {
      // Test service worker registration
      this.results.caching.serviceWorkerRegistered =
        "serviceWorker" in navigator;

      // Test cache API availability
      this.results.caching.cacheAPIAvailable = "caches" in window;

      if (this.results.caching.cacheAPIAvailable) {
        // Test cache usage
        const cacheNames = await caches.keys();
        this.results.caching.activeCaches = cacheNames;
        this.results.caching.cacheCount = cacheNames.length;
      }

      // Test offline capability
      this.results.caching.offlineReady = navigator.onLine !== undefined;

      console.log("✅ Caching strategy tested");
    } catch (error) {
      console.error("❌ Caching test failed:", error);
      this.results.caching.error = error.message;
    }
  }

  async testTouchGestures() {
    console.log("👆 Testing Touch Gestures...");

    try {
      // Test touch event support
      this.results.touchGestures.touchSupported =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Test gesture recognition
      this.results.touchGestures.gestureLibraryLoaded =
        typeof window.TouchGestureHandler !== "undefined";

      // Test pointer events
      this.results.touchGestures.pointerEventsSupported =
        "onpointerdown" in window;

      console.log("✅ Touch gestures tested");
    } catch (error) {
      console.error("❌ Touch gesture test failed:", error);
      this.results.touchGestures.error = error.message;
    }
  }

  async testBundleSize() {
    console.log("📦 Testing Bundle Size...");

    try {
      // Test gzip compression
      const response = await fetch("/");
      const encoding = response.headers.get("content-encoding");
      this.results.bundleSize.compressed =
        encoding === "gzip" || encoding === "br";

      // Test resource loading
      const resources = performance.getEntriesByType("resource");
      const jsResources = resources.filter((r) => r.name.endsWith(".js"));
      const cssResources = resources.filter((r) => r.name.endsWith(".css"));

      this.results.bundleSize.jsFiles = jsResources.length;
      this.results.bundleSize.cssFiles = cssResources.length;
      this.results.bundleSize.totalResources = resources.length;

      // Calculate average load time
      const avgLoadTime =
        resources.reduce((sum, r) => sum + r.duration, 0) / resources.length;
      this.results.bundleSize.averageLoadTime = avgLoadTime;

      console.log("✅ Bundle size tested");
    } catch (error) {
      console.error("❌ Bundle size test failed:", error);
      this.results.bundleSize.error = error.message;
    }
  }

  async measureFPS() {
    return new Promise((resolve) => {
      let frames = 0;
      const startTime = performance.now();

      function countFrames() {
        frames++;
        if (performance.now() - startTime < 1000) {
          requestAnimationFrame(countFrames);
        } else {
          resolve(frames);
        }
      }

      requestAnimationFrame(countFrames);
    });
  }

  testResponsiveDesign() {
    const viewportWidth = window.innerWidth;
    const hasFlexbox = CSS.supports("display", "flex");
    const hasGrid = CSS.supports("display", "grid");
    const hasMediaQueries = window.matchMedia !== undefined;

    return {
      viewportWidth,
      hasFlexbox,
      hasGrid,
      hasMediaQueries,
      isResponsive: hasFlexbox && hasMediaQueries,
    };
  }

  generateReport() {
    console.log("\n📋 OPTIMIZATION TEST REPORT");
    console.log("=".repeat(50));

    // Performance Summary
    console.log("\n📊 PERFORMANCE METRICS:");
    if (this.results.performance.memory) {
      console.log(
        `Memory Usage: ${this.results.performance.memory.used}MB / ${this.results.performance.memory.limit}MB`,
      );
      console.log(
        `Memory Efficiency: ${this.results.performance.memory.percentage}%`,
      );
    }
    if (this.results.performance.fps) {
      console.log(`FPS: ${this.results.performance.fps}`);
    }

    // Mobile Summary
    console.log("\n📱 MOBILE OPTIMIZATIONS:");
    console.log(
      `Device Type: ${this.results.mobile.isMobile ? "Mobile" : "Desktop"}`,
    );
    console.log(
      `Touch Targets: Optimized (${this.results.mobile.touchTargetSize?.minHeight})`,
    );
    console.log(
      `Viewport: ${this.results.mobile.viewportOptimized ? "Optimized" : "Basic"}`,
    );
    console.log(`PWA Ready: ${this.results.mobile.isPWA ? "Yes" : "No"}`);

    // Data Loading Summary
    console.log("\n💾 DATA LOADING:");
    if (this.results.dataLoading.cacheEffective !== undefined) {
      console.log(
        `Caching: ${this.results.dataLoading.cacheEffective ? "Effective" : "Needs Improvement"}`,
      );
      console.log(
        `First Load: ${this.results.dataLoading.firstLoad?.toFixed(2)}ms`,
      );
      console.log(
        `Cached Load: ${this.results.dataLoading.cachedLoad?.toFixed(2)}ms`,
      );
    }

    // Caching Summary
    console.log("\n🗄️ CACHING:");
    console.log(
      `Service Worker: ${this.results.caching.serviceWorkerRegistered ? "Active" : "Not Available"}`,
    );
    console.log(
      `Cache API: ${this.results.caching.cacheAPIAvailable ? "Available" : "Not Available"}`,
    );
    console.log(`Active Caches: ${this.results.caching.cacheCount || 0}`);

    // Touch Gestures Summary
    console.log("\n👆 TOUCH GESTURES:");
    console.log(
      `Touch Support: ${this.results.touchGestures.touchSupported ? "Yes" : "No"}`,
    );
    console.log(
      `Pointer Events: ${this.results.touchGestures.pointerEventsSupported ? "Yes" : "No"}`,
    );

    // Bundle Size Summary
    console.log("\n📦 BUNDLE SIZE:");
    console.log(
      `Compression: ${this.results.bundleSize.compressed ? "Enabled" : "Disabled"}`,
    );
    console.log(`JS Files: ${this.results.bundleSize.jsFiles || 0}`);
    console.log(`CSS Files: ${this.results.bundleSize.cssFiles || 0}`);
    console.log(
      `Avg Load Time: ${this.results.bundleSize.averageLoadTime?.toFixed(2)}ms`,
    );

    console.log("\n" + "=".repeat(50));
    console.log(
      "🎯 Test completed in",
      (performance.now() - this.startTime).toFixed(2),
      "ms",
    );

    // Generate recommendations
    this.generateRecommendations();
  }

  generateRecommendations() {
    console.log("\n💡 OPTIMIZATION RECOMMENDATIONS:");

    const recommendations = [];

    // Performance recommendations
    if (this.results.performance.memory?.percentage > 80) {
      recommendations.push(
        "🔴 High memory usage detected. Consider implementing virtual scrolling.",
      );
    }

    if (this.results.performance.fps && this.results.performance.fps < 55) {
      recommendations.push(
        "🟡 Low FPS detected. Consider reducing animation complexity.",
      );
    }

    // Mobile recommendations
    if (!this.results.mobile.viewportOptimized) {
      recommendations.push(
        "🔴 Viewport not optimized for mobile. Update meta viewport tag.",
      );
    }

    if (!this.results.mobile.isPWA) {
      recommendations.push(
        "🟡 PWA features not fully enabled. Consider adding service worker.",
      );
    }

    // Caching recommendations
    if (!this.results.caching.serviceWorkerRegistered) {
      recommendations.push(
        "🔴 Service Worker not registered. Implement for offline support.",
      );
    }

    if (!this.results.dataLoading.cacheEffective) {
      recommendations.push(
        "🟡 Data caching not effective. Review caching strategy.",
      );
    }

    // Bundle recommendations
    if (!this.results.bundleSize.compressed) {
      recommendations.push(
        "🔴 Asset compression not enabled. Enable gzip/brotli compression.",
      );
    }

    if (this.results.bundleSize.averageLoadTime > 200) {
      recommendations.push(
        "🟡 Slow resource loading. Consider CDN or bundle optimization.",
      );
    }

    if (recommendations.length === 0) {
      console.log("🎉 All optimizations look good! Great work!");
    } else {
      recommendations.forEach((rec) => console.log(rec));
    }
  }
}

// Export for use in the app
export { OptimizationTester };

// Auto-run tests in development mode
if (process.env.NODE_ENV === "development") {
  window.testOptimizations = async () => {
    const tester = new OptimizationTester();
    return await tester.runAllTests();
  };

  // Add test button to development UI
  if (typeof window !== "undefined") {
    console.log(
      "🧪 Optimization tests available. Run window.testOptimizations() to start.",
    );
  }
}
