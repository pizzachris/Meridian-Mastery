// Safe mobile optimization utils with fallbacks
// This file provides fallback implementations to prevent import errors

// Fallback touch target size
export const getOptimalTouchTargetSize = () => ({
  minWidth: "44px",
  minHeight: "44px",
  recommendedPadding: "12px",
});

// Fallback touch gesture setup (no-op in fallback mode)
export const setupTouchGestures = (element, callbacks = {}) => {
  console.log("Touch gestures disabled - using fallback implementation");
  return () => {}; // Return cleanup function
};

// Other fallback utilities
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

export const getDevicePixelRatio = () => {
  return window.devicePixelRatio || 1;
};

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
