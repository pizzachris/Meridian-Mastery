// Mobile touch gesture handler for flashcards
import React from "react";

export class TouchGestureHandler {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      threshold: 50, // minimum distance for swipe
      velocityThreshold: 0.3, // minimum velocity for swipe
      maxTime: 300, // maximum time for swipe
      ...options,
    };

    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.isScrolling = null;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.init();
  }

  init() {
    if (!this.element) return;

    this.element.addEventListener("touchstart", this.onTouchStart, {
      passive: false,
    });
    this.element.addEventListener("touchmove", this.onTouchMove, {
      passive: false,
    });
    this.element.addEventListener("touchend", this.onTouchEnd, {
      passive: false,
    });
  }

  onTouchStart(e) {
    if (e.touches.length > 1) return; // ignore multi-touch

    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
    this.isScrolling = null;
  }

  onTouchMove(e) {
    if (e.touches.length > 1) return; // ignore multi-touch

    const touch = e.touches[0];
    const deltaX = touch.clientX - this.startX;
    const deltaY = touch.clientY - this.startY;

    // Determine scroll direction on first move
    if (this.isScrolling === null) {
      this.isScrolling = Math.abs(deltaY) > Math.abs(deltaX);
    }

    // Prevent default if horizontal swipe
    if (!this.isScrolling) {
      e.preventDefault();
    }
  }

  onTouchEnd(e) {
    if (!this.startTime) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - this.startX;
    const deltaY = touch.clientY - this.startY;
    const deltaTime = Date.now() - this.startTime;

    // Don't trigger if vertical scroll
    if (this.isScrolling) return;

    // Check if swipe meets criteria
    const distance = Math.abs(deltaX);
    const velocity = distance / deltaTime;

    if (
      distance > this.options.threshold &&
      velocity > this.options.velocityThreshold &&
      deltaTime < this.options.maxTime
    ) {
      const direction = deltaX > 0 ? "right" : "left";
      this.triggerSwipe(direction, { distance, velocity, deltaTime });
    }

    // Reset
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.isScrolling = null;
  }

  triggerSwipe(direction, details) {
    const event = new CustomEvent("swipe", {
      detail: { direction, ...details },
    });
    this.element.dispatchEvent(event);
  }

  destroy() {
    if (!this.element) return;

    this.element.removeEventListener("touchstart", this.onTouchStart);
    this.element.removeEventListener("touchmove", this.onTouchMove);
    this.element.removeEventListener("touchend", this.onTouchEnd);
  }
}

// Mobile-specific utilities
export const MobileUtils = {
  // Check if device is mobile
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  },

  // Check if device is iOS
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  // Check if device is Android
  isAndroid() {
    return /Android/.test(navigator.userAgent);
  },

  // Get device pixel ratio for high-DPI displays
  getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
  },

  // Get viewport dimensions
  getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },

  // Prevent zoom on iOS
  preventZoom() {
    if (this.isIOS()) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        );
      }
    }
  },

  // Enable smooth scrolling
  enableSmoothScrolling() {
    document.documentElement.style.scrollBehavior = "smooth";
  },

  // Optimize for mobile performance
  optimizeForMobile() {
    // Prevent zoom
    this.preventZoom();

    // Enable smooth scrolling
    this.enableSmoothScrolling();

    // Add mobile-specific classes
    document.body.classList.add("mobile-optimized");

    // Optimize touch events
    document.body.style.touchAction = "manipulation";
  },

  // Handle safe area insets for notched devices
  handleSafeAreaInsets() {
    const root = document.documentElement;

    // CSS custom properties for safe area insets
    root.style.setProperty("--safe-area-inset-top", "env(safe-area-inset-top)");
    root.style.setProperty(
      "--safe-area-inset-right",
      "env(safe-area-inset-right)",
    );
    root.style.setProperty(
      "--safe-area-inset-bottom",
      "env(safe-area-inset-bottom)",
    );
    root.style.setProperty(
      "--safe-area-inset-left",
      "env(safe-area-inset-left)",
    );
  },

  // Vibration feedback (if supported)
  vibrate(pattern = 50) {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  },
};

// Setup touch gestures on an element
export const setupTouchGestures = (element, callbacks = {}) => {
  if (!element) return () => {};

  const handler = new TouchGestureHandler(element, {
    onSwipeLeft: callbacks.onSwipeLeft,
    onSwipeRight: callbacks.onSwipeRight,
    onTap: callbacks.onTap,
    threshold: callbacks.threshold || 50,
  });

  return () => {
    handler.destroy();
  };
};

// React hook for touch gestures
export const useTouchGestures = (ref, callbacks = {}) => {
  const gestureHandler = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;

    gestureHandler.current = new TouchGestureHandler(ref.current);

    const handleSwipe = (e) => {
      const { direction } = e.detail;

      if (direction === "left" && callbacks.onSwipeLeft) {
        callbacks.onSwipeLeft(e.detail);
      } else if (direction === "right" && callbacks.onSwipeRight) {
        callbacks.onSwipeRight(e.detail);
      }
    };

    ref.current.addEventListener("swipe", handleSwipe);

    return () => {
      if (gestureHandler.current) {
        gestureHandler.current.destroy();
      }
      if (ref.current) {
        ref.current.removeEventListener("swipe", handleSwipe);
      }
    };
  }, [ref, callbacks]);

  return gestureHandler.current;
};

// Get optimal touch target size for mobile devices
export const getOptimalTouchTargetSize = () => {
  // iOS Human Interface Guidelines recommend 44pt minimum
  // Android Material Design recommends 48dp minimum
  // We'll use 44px as a safe minimum across platforms
  return {
    minWidth: "44px",
    minHeight: "44px",
    recommendedPadding: "12px",
  };
};

// Check if device is mobile
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

// Get device pixel ratio for high-DPI displays
export const getDevicePixelRatio = () => {
  return window.devicePixelRatio || 1;
};

// Optimize image loading for mobile
export const getOptimizedImageSrc = (src, width, height) => {
  const pixelRatio = getDevicePixelRatio();
  const optimizedWidth = Math.round(width * pixelRatio);
  const optimizedHeight = Math.round(height * pixelRatio);

  // In a real app, you might use a service like Cloudinary or ImageKit
  // For now, we'll just return the original src
  return src;
};

// Debounce function for performance
export const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for scroll/resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
