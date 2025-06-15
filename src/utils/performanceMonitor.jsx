// Performance Monitoring Utility for Mobile Optimization
// Tracks app performance metrics and provides optimization insights

import React from "react";

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
    this.isEnabled =
      process.env.NODE_ENV === "development" ||
      localStorage.getItem("performance-debug") === "true";

    if (this.isEnabled) {
      this.initializeObservers();
    }
  }

  initializeObservers() {
    // Performance Observer for measuring render times
    if ("PerformanceObserver" in window) {
      try {
        const perfObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric(entry.name, entry.duration);
          }
        });

        perfObserver.observe({
          entryTypes: ["measure", "navigation", "paint"],
        });
        this.observers.push(perfObserver);
      } catch (error) {
        console.warn("Performance Observer not supported:", error);
      }
    }

    // Long Task Observer for detecting performance bottlenecks
    if ("PerformanceObserver" in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn("Long task detected:", {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
            });
          }
        });

        longTaskObserver.observe({ entryTypes: ["longtask"] });
        this.observers.push(longTaskObserver);
      } catch (error) {
        console.warn("Long Task Observer not supported:", error);
      }
    }
  }

  // Record custom performance metrics
  recordMetric(name, value, category = "general") {
    if (!this.isEnabled) return;

    const timestamp = performance.now();
    const metric = {
      name,
      value,
      category,
      timestamp,
      session: this.getSessionId(),
    };

    if (!this.metrics.has(category)) {
      this.metrics.set(category, []);
    }

    this.metrics.get(category).push(metric);

    // Log significant performance issues
    if (value > 100) {
      // 100ms threshold
      console.warn(`Performance warning: ${name} took ${value.toFixed(2)}ms`);
    }
  }

  // Measure function execution time
  measureFunction(fn, name) {
    if (!this.isEnabled) return fn();

    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    this.recordMetric(name, duration, "function");

    return result;
  }

  // Measure async function execution time
  async measureAsyncFunction(fn, name) {
    if (!this.isEnabled) return fn();

    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    this.recordMetric(name, duration, "async-function");

    return result;
  }

  // Start a custom measurement
  startMeasurement(name) {
    if (!this.isEnabled) return null;

    performance.mark(`${name}-start`);
    return name;
  }

  // End a custom measurement
  endMeasurement(name) {
    if (!this.isEnabled) return;

    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }

  // Get memory usage information
  getMemoryUsage() {
    if (!performance.memory) return null;

    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
      percentage: Math.round(
        (performance.memory.usedJSHeapSize /
          performance.memory.jsHeapSizeLimit) *
          100,
      ),
    };
  }

  // Get Core Web Vitals
  getCoreWebVitals() {
    return new Promise((resolve) => {
      const metrics = {};

      // Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.startTime;

        if (Object.keys(metrics).length === 3) {
          resolve(metrics);
        }
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay (FID)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          metrics.fid = entry.processingStart - entry.startTime;
        });

        if (Object.keys(metrics).length === 3) {
          resolve(metrics);
        }
      }).observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        metrics.cls = clsValue;

        if (Object.keys(metrics).length === 3) {
          resolve(metrics);
        }
      }).observe({ entryTypes: ["layout-shift"] });

      // Timeout fallback
      setTimeout(() => {
        resolve(metrics);
      }, 5000);
    });
  }

  // Get performance insights and recommendations
  getPerformanceInsights() {
    const insights = [];
    const memory = this.getMemoryUsage();

    if (memory) {
      if (memory.percentage > 80) {
        insights.push({
          type: "memory",
          severity: "high",
          message: `High memory usage: ${memory.percentage}%. Consider reducing cached data.`,
        });
      } else if (memory.percentage > 60) {
        insights.push({
          type: "memory",
          severity: "medium",
          message: `Moderate memory usage: ${memory.percentage}%. Monitor for memory leaks.`,
        });
      }
    }

    // Check for slow functions
    const functionMetrics = this.metrics.get("function") || [];
    const slowFunctions = functionMetrics.filter((metric) => metric.value > 50);

    if (slowFunctions.length > 0) {
      insights.push({
        type: "performance",
        severity: "medium",
        message: `${slowFunctions.length} slow functions detected. Consider optimization.`,
        details: slowFunctions.map((fn) => ({
          name: fn.name,
          duration: fn.value,
        })),
      });
    }

    return insights;
  }

  // Export metrics for analysis
  exportMetrics() {
    const export_data = {
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      memory: this.getMemoryUsage(),
      metrics: Object.fromEntries(this.metrics),
      insights: this.getPerformanceInsights(),
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
    };

    return export_data;
  }

  // Get network connection information
  getConnectionInfo() {
    if (!navigator.connection) return null;

    return {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData,
    };
  }

  // Generate session ID
  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return this.sessionId;
  }

  // Clear all metrics
  clearMetrics() {
    this.metrics.clear();
  }

  // Cleanup
  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// React hook for using performance monitoring
export const usePerformanceMonitor = () => {
  const monitorRef = React.useRef(null);

  if (!monitorRef.current) {
    monitorRef.current = new PerformanceMonitor();
  }

  React.useEffect(() => {
    return () => {
      if (monitorRef.current) {
        monitorRef.current.destroy();
      }
    };
  }, []);

  return monitorRef.current;
};

// HOC for measuring component render performance
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
  return React.memo((props) => {
    const monitor = usePerformanceMonitor();

    React.useEffect(() => {
      monitor.recordMetric(
        `${componentName}-mount`,
        performance.now(),
        "component",
      );

      return () => {
        monitor.recordMetric(
          `${componentName}-unmount`,
          performance.now(),
          "component",
        );
      };
    }, [monitor]);

    const measurementId = monitor.startMeasurement(`${componentName}-render`);

    React.useLayoutEffect(() => {
      if (measurementId) {
        monitor.endMeasurement(measurementId);
      }
    });

    return <WrappedComponent {...props} />;
  });
};

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for manual measurements
export const measureRender = (name, fn) => {
  return performanceMonitor.measureFunction(fn, `render-${name}`);
};

export const measureAsync = async (name, fn) => {
  return performanceMonitor.measureAsyncFunction(fn, `async-${name}`);
};
