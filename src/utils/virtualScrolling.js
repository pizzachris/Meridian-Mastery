// Virtual Scrolling Utility for Mobile Performance
// Reduces memory usage by only rendering visible items

import React, { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Virtual scrolling hook for large lists
 * @param {Array} items - Full list of items
 * @param {number} itemHeight - Fixed height of each item
 * @param {number} containerHeight - Height of the scrollable container
 * @param {number} overscan - Number of items to render outside visible area
 */
export const useVirtualScrolling = (
  items = [],
  itemHeight = 100,
  containerHeight = 500,
  overscan = 5,
) => {
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const totalItems = items.length;
    if (totalItems === 0) return { start: 0, end: 0, visibleItems: [] };

    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(totalItems, start + visibleCount + overscan * 2);

    return {
      start,
      end,
      visibleItems: items.slice(start, end),
      offsetY: start * itemHeight,
      totalHeight: totalItems * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    ...visibleRange,
    handleScroll,
    scrollTop,
  };
};

/**
 * Pagination hook for mobile-friendly data loading
 * @param {Array} items - Full list of items
 * @param {number} pageSize - Number of items per page
 */
export const usePagination = (items = [], pageSize = 20) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedPages, setLoadedPages] = useState(new Set([0]));

  const totalPages = Math.ceil(items.length / pageSize);

  // Get currently visible items (all loaded pages)
  const visibleItems = useMemo(() => {
    const allLoadedItems = [];
    const sortedPages = Array.from(loadedPages).sort((a, b) => a - b);

    for (const page of sortedPages) {
      const start = page * pageSize;
      const end = Math.min(start + pageSize, items.length);
      allLoadedItems.push(...items.slice(start, end));
    }

    return allLoadedItems;
  }, [items, loadedPages, pageSize]);

  const loadPage = useCallback(
    (pageNumber) => {
      if (pageNumber >= 0 && pageNumber < totalPages) {
        setLoadedPages((prev) => new Set([...prev, pageNumber]));
        setCurrentPage(pageNumber);
      }
    },
    [totalPages],
  );

  const loadNextPage = useCallback(() => {
    const nextPage = Math.max(...loadedPages) + 1;
    if (nextPage < totalPages) {
      loadPage(nextPage);
    }
  }, [loadedPages, totalPages, loadPage]);

  const hasNextPage = useMemo(() => {
    return Math.max(...loadedPages) < totalPages - 1;
  }, [loadedPages, totalPages]);

  return {
    visibleItems,
    currentPage,
    totalPages,
    hasNextPage,
    loadPage,
    loadNextPage,
    loadedPages: Array.from(loadedPages),
  };
};

/**
 * Intersection Observer hook for lazy loading
 * @param {Object} options - Intersection Observer options
 */
export const useInViewport = (options = {}) => {
  const [inViewport, setInViewport] = useState(false);
  const [entry, setEntry] = useState(null);
  const elementRef = React.useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInViewport(entry.isIntersecting);
        setEntry(entry);
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [options]);

  return { elementRef, inViewport, entry };
};

/**
 * Memory-efficient list component wrapper
 */
export const VirtualList = ({
  items = [],
  itemHeight = 100,
  containerHeight = 500,
  renderItem,
  overscan = 5,
  className = "",
  onScroll,
}) => {
  const {
    visibleItems,
    offsetY,
    totalHeight,
    handleScroll: internalHandleScroll,
  } = useVirtualScrolling(items, itemHeight, containerHeight, overscan);

  const handleScroll = useCallback(
    (e) => {
      internalHandleScroll(e);
      onScroll?.(e);
    },
    [internalHandleScroll, onScroll],
  );

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => renderItem(item, index))}
        </div>
      </div>
    </div>
  );
};

/**
 * Debounced scroll handler for performance
 */
export const useScrollDebounce = (callback, delay = 100) => {
  const timeoutRef = React.useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
};

/**
 * Memory usage monitoring (development only)
 */
export const useMemoryMonitor = (enabled = false) => {
  const [memoryInfo, setMemoryInfo] = useState(null);

  useEffect(() => {
    if (!enabled || !performance.memory) return;

    const interval = setInterval(() => {
      setMemoryInfo({
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  return memoryInfo;
};
