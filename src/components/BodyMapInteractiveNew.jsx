


import React, { useState, useEffect, useRef } from "react";
import Logo from "./Logo";

// Add CSS for image container and image
const styleSheet = `
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  overflow: hidden;
  padding: 0;
}
.meridian-image {
  display: block;
  max-width: none;
  max-height: none;
  width: auto;
  height: auto;
}
`;
if (typeof document !== 'undefined' && !document.getElementById('meridian-image-style')) {
  const style = document.createElement('style');
  style.id = 'meridian-image-style';
  style.innerHTML = styleSheet;
  document.head.appendChild(style);
}

// Correct IMAGE_DIMENSIONS object
const IMAGE_DIMENSIONS = {
  front: {
    desktop: { width: 693, height: 1656 },
    mobile: { width: 693, height: 1656 }
  },
  back: {
    desktop: { width: 773, height: 1776 },
    mobile: { width: 773, height: 1776 }
  },
  side: {
    desktop: { width: 829, height: 1569 },
    mobile: { width: 829, height: 1569 }
  }
};

// ...existing code...

const BodyMapInteractiveNew = ({ navigateTo }) => {
  // Debug overlay toggle (must be inside component)
  const [debugMode, setDebugMode] = useState(false);
  // Refs for image and container
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [imgDims, setImgDims] = useState({ width: 0, height: 0, offsetX: 0, offsetY: 0 });

  // For pinch-to-zoom and pan
  const mapContainerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState(null);

  // CRITICAL: Restore all required state variables for Body Map logic
  const [currentView, setCurrentView] = useState("side");
  const [selectedMeridian, setSelectedMeridian] = useState("");
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showZoomedView, setShowZoomedView] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [allFlashcardData, setAllFlashcardData] = useState([]);
  const [showHT9Popup, setShowHT9Popup] = useState(false);
  const [popupPoint, setPopupPoint] = useState(null);
  const [availableMeridians, setAvailableMeridians] = useState([]);

  // Touch event handlers for pinch-to-zoom and pan
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setDragging(true);
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };
  const handleTouchMove = (e) => {
    if (dragging && e.touches.length === 1 && lastTouch) {
      const dx = e.touches[0].clientX - lastTouch.x;
      const dy = e.touches[0].clientY - lastTouch.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      // Pinch zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (mapContainerRef.current && mapContainerRef.current.lastDist) {
        const scale = dist / mapContainerRef.current.lastDist;
        setZoom((z) => Math.max(1, Math.min(z * scale, 3)));
      }
      mapContainerRef.current.lastDist = dist;
    }
  };
  const handleTouchEnd = (e) => {
    setDragging(false);
    setLastTouch(null);
    if (e.touches.length < 2 && mapContainerRef.current) {
      mapContainerRef.current.lastDist = null;
    }
  };

  // Update image dimensions and force re-render of points on resize or image load
  const handleResize = () => {
    const img = imgRef.current;
    const container = containerRef.current;
    if (img && container) {
      // Use the image's natural size for overlays and container
      setImgDims({
        width: img.naturalWidth,
        height: img.naturalHeight,
        offsetX: 0,
        offsetY: 0
      });
    }
  }

  // Update image dimensions on window resize and image load
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line
  }, []);

  // Load available meridians dynamically from JSON files
  useEffect(() => {
    const loadMeridianMetadata = async () => {
      const meridianFiles = ['lung', 'large_intestine', 'heart', 'stomach', 'spleen', 'small_intestine', 'pericardium'];
      const meridianData = [];
      
      for (const meridianFile of meridianFiles) {
        try {
          const response = await fetch(`/improved/${meridianFile}_meridian_with_regions.json`);
          const data = await response.json();
          
          meridianData.push({
            id: data.meridian.replace(/\s+/g, ''), // Remove spaces for ID (e.g., "Large Intestine" -> "LargeIntestine")
            name: data.meridian,
            element: `element-${data.element}`,
            view: data.view,
            views: data.views || [data.view] // Support multi-view or default to single view
          });
        } catch (error) {
          console.error(`Failed to load ${meridianFile} meridian metadata:`, error);
        }
      }
      
      setAvailableMeridians(meridianData);
      console.log('Loaded meridian metadata:', meridianData);
      // Remove auto-select: do NOT set first meridian as default
      // if (meridianData.length > 0 && selectedMeridian === "") {
      //   setSelectedMeridian(meridianData[0].id);
      // }
    };
    loadMeridianMetadata();
  }, []);

  // Load all flashcard data on component mount
  useEffect(() => {
    const loadFlashcardData = async () => {
      try {
        const allPoints = await getAllPoints();
        setAllFlashcardData(allPoints);
        console.log('Loaded flashcard data:', allPoints.length, 'points');
      } catch (error) {
        console.error('Failed to load flashcard data:', error);
      }
    };
    loadFlashcardData();
  }, []);

  // Auto-switch view when meridian is selected - REMOVED AUTO-SWITCHING
  // View switching is now controlled by user via toggle buttons only
  useEffect(() => {
    // Only reset to side view when no meridian is selected (home state)
    if (!selectedMeridian) {
      setCurrentView("side");
    }
  }, [selectedMeridian, availableMeridians]);

  // Load meridian data when meridian is selected (use mobile JSON for Lung on mobile)
  useEffect(() => {
    if (selectedMeridian) {
      let filename = '';
      if (selectedMeridian === 'Lung') {
        filename = 'lung_meridian_with_regions.json';
      } else if (selectedMeridian === 'LargeIntestine') {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
        filename = isMobile ? 'large_intestine_meridian_mobile.json' : 'large_intestine_meridian_with_regions.json';
      } else {
        const filenameMap = {
          'Heart': 'heart_meridian_with_regions.json',
          'Stomach': 'stomach_meridian_with_regions.json',
          'Spleen': 'spleen_meridian_with_regions.json',
          'SmallIntestine': 'small_intestine_meridian_with_regions.json',
          'Pericardium': 'pericardium_meridian_with_regions.json'
        };
        filename = filenameMap[selectedMeridian] || `${selectedMeridian.toLowerCase()}_meridian_with_regions.json`;
      }
      fetch(`/improved/${filename}`)
        .then(res => res.json())
        .then(data => {
          setPoints(data.points || []);
        })
        .catch(err => {
          setPoints([]);
        });
    } else {
      setPoints([]);
    }
  }, [selectedMeridian]);

  // Only Small Intestine should have a toggle
  const hasMultipleViews = () => selectedMeridian === "SmallIntestine";

  // Get available views for current meridian
  const getAvailableViews = () => {
    const meridian = availableMeridians.find(m => m.id === selectedMeridian);
    return meridian ? meridian.views : [currentView];
  };

  // Filter points by current view
  const getPointsForCurrentView = () => {
    // For Lung, always show all points (since all are front view)
    if (selectedMeridian === 'Lung') return points;
    if (!hasMultipleViews()) return points;
    return points.filter(point => point.view === currentView);
  };

  // Transform coordinates for different views
  const transformCoordinates = (point, meridianId) => {
    // For multi-view meridians, coordinates are already correct for their specific view
    return { x: point.x, y: point.y };
  };

  // Get current image path (use mobile-padded images for mobile, desktop for desktop)
  const getCurrentImagePath = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const base = "/improved_body_map_with_regions/improved_body_models_and_regions/";
    if (selectedMeridian === 'Lung' && isMobile && currentView === 'front') {
      // Use the new meridian-specific mobile image for Lung front view
      return "/improved/Lung_Meridian_Mobile.png";
    } else if (selectedMeridian === 'Heart' && currentView === 'front') {
      // Use the new meridian-specific image for Heart front view (desktop and mobile)
      return "/improved/Heart_Meridian.png";
    } else if ((selectedMeridian === 'LargeIntestine') && isMobile) {
      switch (currentView) {
        case "front":
          return base + "front_view_model_wide_padded_mobile.png";
        case "back":
          return base + "back_view_model_wide_padded_mobile.png";
        case "side":
        default:
          return base + "side_full_cleaned_padded_mobile.png";
      }
    } else if (selectedMeridian === 'Lung' && currentView === 'front') {
      // Use the new meridian-specific image for desktop Lung front view
      return "/improved/Lung_Meridian.png";
    } else {
      switch (currentView) {
        case "front":
          return base + "front_view_model_wide_padded.png";
        case "back":
          return base + "back_view_model_wide_padded.png";
        case "side":
        default:
          return base + "side_full_cleaned_padded.png";
      }
    }
  };

  // Find flashcard data for selected point
  const getFlashcardData = (point) => {
    if (!allFlashcardData.length) return null;
    
    // Try to match by point ID (like LU2, LI4, etc.)
    let flashcard = allFlashcardData.find(card => 
      card.pointNumber === point.id || 
      card.nameRomanized?.toLowerCase() === point.name.toLowerCase()
    );
    
    // If not found, try partial matches
    if (!flashcard) {
      const pointNum = point.id.replace(/[A-Z]+/, ''); // Extract number part
      flashcard = allFlashcardData.find(card => 
        card.pointNumber?.toString().includes(pointNum) &&
        card.meridianName?.toLowerCase().includes(selectedMeridian.toLowerCase())
      );
    }
    
    return flashcard;
  };

  // Handle meridian selection (auto-switch to correct view)
  const handleMeridianSelect = (meridianId) => {
    setSelectedMeridian(meridianId);
    setSelectedPoint(null);
    setShowZoomedView(false);
    setIsFlipped(false);
    // Auto-switch to correct view for this meridian
    const meridian = availableMeridians.find(m => m.id === meridianId);
    if (meridian) {
      // If the meridian has a preferred view, use it
      if (meridian.view) {
        setCurrentView(meridian.view);
      } else if (meridian.views && meridian.views.length > 0) {
        setCurrentView(meridian.views[0]);
      } else {
        setCurrentView("side");
      }
    }
  };

  // Handle point click - zoom to that region
  const handlePointClick = (point) => {
    console.log("Point clicked:", point);
    
    // Check for special popup (like HT9)
    if (point.popup) {
      setPopupPoint(point);
      setShowHT9Popup(true);
      return;
    }
    
    setSelectedPoint(point);
    setShowZoomedView(true);
    
    // Center and zoom in on the selected point
    // Wait for next tick so imgDims is up to date
    setTimeout(() => {
      let dims = IMAGE_DIMENSIONS[currentView] || IMAGE_DIMENSIONS.side;
      const width = imgDims.width || dims.width;
      const height = imgDims.height || dims.height;
      const offsetX = imgDims.offsetX || 0;
      const offsetY = imgDims.offsetY || 0;
      const { x, y } = transformCoordinates(point, selectedMeridian);
      const xPx = x * width + offsetX;
      const yPx = y * height + offsetY;
      // Center the point in the container
      const container = containerRef.current;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        // Set zoom to 2x (or keep previous if already zoomed in)
        setZoom(2);
        // Pan so the point is centered
        setOffset({
          x: centerX - xPx,
          y: centerY - yPx
        });
      }
    }, 0);
    setIsFlipped(false); // Start with front side of flashcard
  };

  // Close zoom and flashcard
  const closeZoom = () => {
    setSelectedPoint(null);
    setShowZoomedView(false);
    setIsFlipped(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Flip flashcard
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Clear selection and return to home view
  const clearSelection = () => {
    setSelectedMeridian("");
    setSelectedPoint(null);
    setShowZoomedView(false);
    setIsFlipped(false);
  };

  // Get meridian abbreviation for badge
  const getMeridianAbbreviation = (meridianName, pointNumber) => {
    const abbrevMap = {
      Lung: "LU",
      LargeIntestine: "LI",
      "Large Intestine": "LI",
      Heart: "HT",
      Stomach: "ST",
      Spleen: "SP",
      SmallIntestine: "SI",
      "Small Intestine": "SI",
      Pericardium: "PC"
    };
    const abbrev = abbrevMap[meridianName] || "UN";
    const number = pointNumber?.replace(/[A-Z]+/, '') || '';
    return `${abbrev}${number}`;
  };

  // Get element name for current meridian
  const getElementName = () => {
    const meridian = availableMeridians.find(m => m.id === selectedMeridian);
    if (!meridian) return "UNKNOWN";
    
    const elementMap = {
      'element-metal': 'METAL',
      'element-fire': 'FIRE',
      'element-earth': 'EARTH',
      'element-water': 'WATER',
      'element-wood': 'WOOD'
    };
    
    return elementMap[meridian.element] || "UNKNOWN";
  };

  // Get element colors
  const getElementColors = () => {
    const meridian = availableMeridians.find(m => m.id === selectedMeridian);
    if (!meridian) return { bg: "bg-gray-600", text: "text-white", border: "border-gray-400" };
    
    const colorMap = {
      'element-metal': { bg: "bg-gray-600", text: "text-white", border: "border-gray-400" },
      'element-fire': { bg: "bg-red-600", text: "text-white", border: "border-red-400" },
      'element-earth': { bg: "bg-yellow-600", text: "text-black", border: "border-yellow-400" },
      'element-water': { bg: "bg-blue-600", text: "text-white", border: "border-blue-400" },
      'element-wood': { bg: "bg-green-600", text: "text-white", border: "border-green-400" }
    };
    
    return colorMap[meridian.element] || { bg: "bg-gray-600", text: "text-white", border: "border-gray-400" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Sticky Header for mobile */}
      <div className="sticky top-0 z-50 flex items-center bg-black/80 backdrop-blur-md px-2 py-2 sm:py-2 border-b border-yellow-400/30">
        <button
          onClick={() => navigateTo("home")}
          className="bg-black/80 rounded-lg p-2 border border-yellow-400/30 hover:border-yellow-400 transition-colors touch-manipulation"
          title="Return to Home"
        >
          <Logo className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400" />
        </button>
        {/* Show back button only when a meridian is selected and not zoomed in */}
        {selectedMeridian && !showZoomedView && (
          <button
            onClick={clearSelection}
            className="ml-auto bg-black/80 rounded-lg px-4 py-2 border border-blue-400/30 text-blue-400 font-bold text-base hover:text-blue-300 hover:bg-black/90 transition-colors touch-manipulation"
            title="Back to Meridian Selector"
          >
            ← Back
          </button>
        )}
        {/* Show close button when zoomed in on a point */}
        {showZoomedView && (
          <button
            onClick={closeZoom}
            className="ml-auto bg-black/80 rounded-lg px-4 py-2 border border-blue-400/30 text-blue-400 font-bold text-base hover:text-blue-300 hover:bg-black/90 transition-colors touch-manipulation"
            title="Back to Body Map"
          >
            ← Full View
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="pt-24 sm:pt-16 pb-4 px-2 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {showZoomedView && selectedPoint ? (
          // Zoomed View with Flashcard
          <>
            <div className="max-w-6xl mx-auto">
              {/* Master Your Meridians Title */}
              <div className="text-center mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Master Your Meridians
                </h1>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
                {/* Body Model and Points Overlay */}
                <div className="flex-1">
            {/* Use exact pixel dimensions for zoomed view */}
            {(() => {
              // Debug: Show image natural bounds and (0,0) origin
              const showImageBounds = debugMode;
              let dims = IMAGE_DIMENSIONS[currentView] || IMAGE_DIMENSIONS.side;
              const width = imgDims.width || dims.width;
              const height = imgDims.height || dims.height;
              const offsetX = imgDims.offsetX || 0;
              const offsetY = imgDims.offsetY || 0;
              // Five Element color map for points
              const colorMap = {
                'element-metal': '#a3a3a3',
                'element-fire': '#ef4444',
                'element-earth': '#eab308',
                'element-water': '#3b82f6',
                'element-wood': '#22c55e'
              };
              let meridianColor = '#ef4444';
              if (selectedMeridian) {
                const meridian = availableMeridians.find(m => m.id === selectedMeridian);
                if (meridian && colorMap[meridian.element]) meridianColor = colorMap[meridian.element];
              }
              // Sort points by id (e.g., LI1, LI2, ...)
              let orderedPoints = getPointsForCurrentView();
              orderedPoints = orderedPoints.slice().sort((a, b) => {
                const getNum = (id) => parseInt((id||'').replace(/\D+/g, ''));
                return getNum(a.id) - getNum(b.id);
              });
              // Only enable pan/zoom and touchAction:none when a meridian is selected
              const enablePanZoom = !!selectedMeridian;
              return (
                <div
                  ref={containerRef}
                  className="image-container relative bg-gray-800 rounded-lg mx-auto touch-pan-x touch-pan-y"
                  style={{
                    width: width ? width + 'px' : undefined,
                    height: height ? height + 'px' : undefined,
                    minHeight: 0,
                    minWidth: 0,
                    boxSizing: 'border-box',
                    touchAction: enablePanZoom ? 'none' : 'auto',
                  }}
                  onTouchStart={enablePanZoom ? handleTouchStart : undefined}
                  onTouchMove={enablePanZoom ? handleTouchMove : undefined}
                  onTouchEnd={enablePanZoom ? handleTouchEnd : undefined}
                >
                  {/* Debug overlay toggle button */}
                  <button
                    style={{position:'absolute',top:8,right:8,zIndex:20,background:'#222',color:'#fff',padding:'4px 10px',borderRadius:6,border:'1px solid #facc15',fontSize:12,opacity:0.8}}
                    onClick={e => {e.stopPropagation();setDebugMode(d=>!d);}}
                  >
                    {debugMode ? 'Hide Debug' : 'Show Debug'}
                  </button>
                  <img
                    ref={imgRef}
                    src={selectedMeridian ? getCurrentImagePath() : "/improved_body_map_with_regions/improved_body_models_and_regions/side_full_cleaned_padded.png"}
                    alt={selectedMeridian ? `${currentView} view` : "Body Model Side View"}
                    className="meridian-image"
                    style={{
                      width: imgDims.width ? imgDims.width + 'px' : undefined,
                      height: imgDims.height ? imgDims.height + 'px' : undefined,
                      opacity: 1
                    }}
                    draggable={false}
                    onLoad={handleResize}
                  />
                  {/* Debug overlay grid and coordinates */}
                  {debugMode && (
                    <>
                      {/* Image natural bounds and (0,0) origin marker */}
                      {showImageBounds && (null)}
                      {/* Grid lines */}
                      {[0.25,0.5,0.75].map(f=>(
                        <React.Fragment key={f}>
                          <div style={{position:'absolute',left:`${f*100}%`,top:0,bottom:0,width:1,background:'#facc15',opacity:0.2,zIndex:15}} />
                          <div style={{position:'absolute',top:`${f*100}%`,left:0,right:0,height:1,background:'#facc15',opacity:0.2,zIndex:15}} />
                        </React.Fragment>
                      ))}
                      {/* Show all point coordinates */}
                      {orderedPoints.map((point,index)=>{
                        const {x,y}=transformCoordinates(point,selectedMeridian);
                        const xPx=x*width+offsetX;
                        const yPx=y*height+offsetY;
                        return (
                          <div key={index} style={{position:'absolute',left:xPx+10,top:yPx-10,zIndex:16,fontSize:10,color:'#facc15',background:'#222',padding:'1px 4px',borderRadius:3,opacity:0.8}}>
                            {point.id} ({x.toFixed(3)}, {y.toFixed(3)})
                          </div>
                        );
                      })}
                    </>
                  )}
                  {/* Points Overlay - only show when meridian is selected and points exist */}
                  {selectedMeridian && orderedPoints.length > 0 && orderedPoints.map((point, index) => {
                    const { x, y } = transformCoordinates(point, selectedMeridian);
                    const xPx = x * width + offsetX;
                    const yPx = y * height + offsetY;
                    return (
                      <button
                        key={index}
                        onClick={() => handlePointClick(point)}
                        className="absolute hover:scale-110 transition-all cursor-pointer"
                        style={{
                          width: 16,
                          height: 16,
                          left: xPx - 8,
                          top: yPx - 8,
                          padding: 0,
                          touchAction: 'manipulation',
                          background: 'transparent',
                          zIndex: 3,
                          border: 'none',
                        }}
                        tabIndex={0}
                        aria-label={point.name}
                      >
                        <span style={{
                          display: 'block',
                          width: 8,
                          height: 8,
                          background: meridianColor,
                          borderRadius: '50%',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          border: '2px solid white',
                          boxShadow: '0 0 4px #000',
                        }} />
                      </button>
                    );
                  })}
                </div>
              );
            })()}
                </div>

                {/* Flashcard and region close-up logic */}
                <div className="flex-1 max-w-md">
                  {/* Show close-up button if region exists */}
                  {selectedMeridian === 'Heart' && Array.isArray(points) && points.length > 0 && (
                    <>
                      <button
                        className="mb-4 bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded-lg text-sm sm:text-base transition-colors touch-manipulation"
                        onClick={() => setShowZoomedView('ht1-3')}
                      >
                        Arm Close Up for HT1, HT2, HT3
                      </button>
                      {showZoomedView === 'ht1-3' && (
                        <button
                          className="mb-4 ml-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-sm sm:text-base transition-colors touch-manipulation"
                          onClick={() => setShowZoomedView(true)}
                        >
                          Exit Close Up
                        </button>
                      )}
                    </>
                  )}
                  {(() => {
                    const flashcardData = getFlashcardData(selectedPoint);
                    const colors = getElementColors();
                    return (
                      <div
                        className={`relative w-full h-80 sm:h-96 transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
                      >
                        {/* Front Side */}
                        <div className="absolute inset-0 w-full h-full backface-hidden">
                          <div className={`bg-gradient-to-br from-gray-900 to-black border-2 ${colors.border} rounded-xl h-full flex flex-col justify-center items-center p-4 sm:p-6 relative`}>
                            {/* Meridian badge */}
                            <div className={`absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 ${colors.bg} ${colors.text} px-3 py-1 sm:px-4 sm:py-2 rounded-lg border-2 ${colors.border}`}>
                              <span className="text-xs sm:text-sm font-bold">
                                {getMeridianAbbreviation(selectedMeridian, selectedPoint.id)} • {getElementName()}
                              </span>
                            </div>

                            {/* Korean Hangul */}
                            <div className="text-2xl sm:text-4xl font-bold text-yellow-400 mb-2 sm:mb-4 text-center mt-12 sm:mt-16">
                              {flashcardData?.nameHangul || flashcardData?.hangul || selectedPoint.name}
                            </div>
                            
                            {/* English translation */}
                            <div className="text-lg sm:text-xl text-white text-center font-medium">
                              {flashcardData?.nameEnglish || flashcardData?.englishTranslation || selectedPoint.name}
                            </div>
                            
                            {/* Romanized Korean */}
                            <div className="text-sm sm:text-base text-gray-300 text-center mt-1 sm:mt-2">
                              {flashcardData?.nameRomanized || selectedPoint.name}
                            </div>

                            {/* Flip indicator */}
                            <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs sm:text-sm">
                              Tap card to flip
                            </div>
                          </div>
                        </div>

                        {/* Back Side - Real flashcard back */}
                        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                          <div className={`bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400 rounded-xl h-full p-3 sm:p-4 text-xs flex flex-col overflow-hidden`}>
                            {/* Header */}
                            <div className="text-center mb-2 sm:mb-3 border-b border-gray-700 pb-2 flex-shrink-0">
                              <h2 className="text-xs sm:text-sm font-bold text-yellow-400 mb-1">
                                {flashcardData?.nameRomanized || selectedPoint.name}
                              </h2>
                              <p className="text-gray-300 text-xs">
                                {flashcardData?.nameHangul || selectedPoint.name}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {getMeridianAbbreviation(selectedMeridian, selectedPoint.id)} {selectedMeridian} Meridian
                              </p>
                            </div>

                            {/* Information sections - scrollable */}
                            <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
                              {/* Location */}
                              {flashcardData?.location && (
                                <div className="bg-yellow-600 text-black p-2 rounded">
                                  <h3 className="font-bold text-xs mb-1">LOCATION:</h3>
                                  <p className="text-xs leading-relaxed">{flashcardData.location}</p>
                                </div>
                              )}

                              {/* Striking Effect */}
                              <div className="bg-yellow-600 text-black p-2 rounded">
                                <h3 className="font-bold text-xs mb-1">STRIKING EFFECT:</h3>
                                <p className="text-xs leading-relaxed">
                                  {flashcardData?.martialApplication || 
                                   "The point is usually struck to an upward direction with a blunt edge."}
                                </p>
                              </div>

                              {/* Observed Effects */}
                              <div className="bg-yellow-600 text-black p-2 rounded">
                                <h3 className="font-bold text-xs mb-1">OBSERVED EFFECTS:</h3>
                                <p className="text-xs leading-relaxed">
                                  {flashcardData?.healingFunction || 
                                   "Light to moderate knockout. Liver dysfunction in theory. Be responsible."}
                                </p>
                              </div>

                              {/* Insight */}
                              <div className="bg-yellow-600 text-black p-2 rounded">
                                <h3 className="font-bold text-xs mb-1">INSIGHT:</h3>
                                <p className="text-xs leading-relaxed">
                                  {flashcardData?.insightText && flashcardData.insightText.length > 150
                                    ? flashcardData.insightText.substring(0, 150) + "..."
                                    : flashcardData?.insightText || 
                                      "This point has the potential to affect the associated meridian. Be responsible."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  {/* Card controls - only one row */}
                  <div className="flex justify-center gap-4 sm:gap-6 mt-4 sm:mt-6">
                    <button
                      onClick={flipCard}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg text-sm sm:text-base transition-colors touch-manipulation"
                    >
                      Flip Card
                    </button>
                    <button
                      onClick={closeZoom}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg text-sm sm:text-base transition-colors touch-manipulation"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Home View - Body Model with Meridian Selector on Right
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
            {/* Main content area with title and body model */}
            <div className="flex-1">
              {/* Body Map Title */}
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Master Your Meridians
                </h1>
                <p className="text-gray-300 text-base sm:text-lg">
                  {selectedMeridian 
                    ? `${selectedMeridian} Meridian ${hasMultipleViews() ? `(${currentView} view)` : ''} - ${getPointsForCurrentView().length} points - Tap a point to zoom in`
                    : "Select a meridian below to begin exploring pressure points"}
                </p>
              </div>

              {/* Responsive Body Map Container */}
              {(() => {
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                let dims = IMAGE_DIMENSIONS[currentView] ? (isMobile ? IMAGE_DIMENSIONS[currentView].mobile : IMAGE_DIMENSIONS[currentView].desktop) : (isMobile ? IMAGE_DIMENSIONS.side.mobile : IMAGE_DIMENSIONS.side.desktop);
                const width = imgDims.width || 0;
                const height = imgDims.height || 0;
                const offsetX = imgDims.offsetX || 0;
                const offsetY = imgDims.offsetY || 0;
                const circleSize = 16;
                // Five Element color map for points
                const colorMap = {
                  'element-metal': '#a3a3a3',
                  'element-fire': '#ef4444',
                  'element-earth': '#eab308',
                  'element-water': '#3b82f6',
                  'element-wood': '#22c55e'
                };
                let meridianColor = '#ef4444';
                if (selectedMeridian) {
                  const meridian = availableMeridians.find(m => m.id === selectedMeridian);
                  if (meridian && colorMap[meridian.element]) meridianColor = colorMap[meridian.element];
                }
                // Sort points by id (e.g., LI1, LI2, ...)
              let orderedPoints = getPointsForCurrentView();
              // If Heart close-up is active, filter to HT1, HT2, HT3 only
              // Also, always render points overlay in close-up mode
              if (selectedMeridian === 'Heart' && showZoomedView === 'ht1-3') {
                orderedPoints = orderedPoints.filter(p => ['HT1','HT2','HT3'].includes(p.id));
              }
              // For Lung mobile, ensure points are aligned to the natural image size
              if (selectedMeridian === 'Lung' && typeof window !== 'undefined' && window.innerWidth < 640 && getCurrentImagePath().includes('Lung_Meridian_Mobile.png')) {
                // Override imgDims to use natural image size for mobile
                if (imgRef.current) {
                  imgDims.width = imgRef.current.naturalWidth;
                  imgDims.height = imgRef.current.naturalHeight;
                }
              }
              orderedPoints = orderedPoints.slice().sort((a, b) => {
                const getNum = (id) => parseInt((id||'').replace(/\D+/g, ''));
                return getNum(a.id) - getNum(b.id);
              });
                // Only enable pan/zoom and touchAction:none when a meridian is selected
                const enablePanZoom = !!selectedMeridian;
                return (
                  <div
                    ref={containerRef}
                    className="image-container relative bg-gray-800 rounded-lg mx-auto touch-pan-x touch-pan-y"
                    style={{
                      width: width + 'px',
                      height: height + 'px',
                      minHeight: 0,
                      minWidth: 0,
                      boxSizing: 'border-box',
                      touchAction: enablePanZoom ? 'none' : 'auto',
                    }}
                    onTouchStart={enablePanZoom ? handleTouchStart : undefined}
                    onTouchMove={enablePanZoom ? handleTouchMove : undefined}
                    onTouchEnd={enablePanZoom ? handleTouchEnd : undefined}
                  >
                    {/* Debug overlay toggle button */}
                    <button
                      style={{position:'absolute',top:8,right:8,zIndex:20,background:'#222',color:'#fff',padding:'4px 10px',borderRadius:6,border:'1px solid #facc15',fontSize:12,opacity:0.8}}
                      onClick={e => {e.stopPropagation();setDebugMode(d=>!d);}}
                    >
                      {debugMode ? 'Hide Debug' : 'Show Debug'}
                    </button>
                    <img
                      ref={imgRef}
                      src={selectedMeridian ? getCurrentImagePath() : "/improved_body_map_with_regions/improved_body_models_and_regions/side_full_cleaned_padded.png"}
                      alt={selectedMeridian ? `${currentView} view` : "Body Model Side View"}
                      className="meridian-image"
                      style={{
                        width: imgDims.width ? imgDims.width + 'px' : undefined,
                        height: imgDims.height ? imgDims.height + 'px' : undefined,
                        opacity: 1
                      }}
                      draggable={false}
                      onLoad={handleResize}
                    />
                    {/* Debug overlay grid and coordinates */}
                    {debugMode && (
                      <>
                        {/* Image natural bounds and (0,0) origin marker */}
                        {/* (Optional: add a marker if needed) */}
                        {/* Grid lines */}
                        {[0.25,0.5,0.75].map(f=>(
                          <React.Fragment key={f}>
                            <div style={{position:'absolute',left:`${f*100}%`,top:0,bottom:0,width:1,background:'#facc15',opacity:0.2,zIndex:15}} />
                            <div style={{position:'absolute',top:`${f*100}%`,left:0,right:0,height:1,background:'#facc15',opacity:0.2,zIndex:15}} />
                          </React.Fragment>
                        ))}
                        {/* Show all point coordinates */}
                        {orderedPoints.map((point,index)=>{
                          const {x,y}=transformCoordinates(point,selectedMeridian);
                          const xPx=x*width+offsetX;
                          const yPx=y*height+offsetY;
                          return (
                            <div key={index} style={{position:'absolute',left:xPx+10,top:yPx-10,zIndex:16,fontSize:10,color:'#facc15',background:'#222',padding:'1px 4px',borderRadius:3,opacity:0.8}}>
                              {point.id} ({x.toFixed(3)}, {y.toFixed(3)})
                            </div>
                          );
                        })}
                      </>
                    )}
                    {/* Points Overlay - only show when meridian is selected and points exist */}
                    {selectedMeridian && orderedPoints.length > 0 && orderedPoints.map((point, index) => {
                      const { x, y } = transformCoordinates(point, selectedMeridian);
                      const xPx = x * width + offsetX;
                      const yPx = y * height + offsetY;
                      return (
                        <button
                          key={index}
                          onClick={() => handlePointClick(point)}
                          className="absolute hover:scale-110 transition-all cursor-pointer"
                          style={{
                            width: 16,
                            height: 16,
                            left: xPx - 8,
                            top: yPx - 8,
                            padding: 0,
                            touchAction: 'manipulation',
                            background: 'transparent',
                            zIndex: 3,
                            border: 'none',
                          }}
                          tabIndex={0}
                          aria-label={point.name}
                        >
                          <span style={{
                            display: 'block',
                            width: 8,
                            height: 8,
                            background: meridianColor,
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            border: '2px solid white',
                            boxShadow: '0 0 4px #000',
                          }} />
                        </button>
                      );
                    })}
                  </div>
                );
              })()}

              {/* View Toggle Buttons - Only show for meridians with multiple views */}
              {hasMultipleViews() && (
                <div className="flex justify-center gap-2 mt-4">
                  {getAvailableViews().map(view => (
                    <button
                      key={view}
                      onClick={() => setCurrentView(view)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentView === view 
                          ? 'bg-yellow-400 text-black' 
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)} View
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Collapsible Meridian Selector for mobile */}
            <div className="lg:w-64 lg:flex-shrink-0 w-full mt-6 lg:mt-0">
              <details className="block lg:hidden mb-4" open>
                <summary className="text-base sm:text-lg font-bold text-yellow-400 mb-2 cursor-pointer">{selectedMeridian ? "Switch Meridian" : "Select Meridian"}</summary>
                <div className="flex flex-col gap-3">
                  {availableMeridians.map((meridian) => (
                    <button
                      key={meridian.id}
                      onClick={() => handleMeridianSelect(meridian.id)}
                      className={`${meridian.element} font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-center text-base touch-manipulation ${
                        selectedMeridian === meridian.id ? 'ring-2 ring-yellow-400' : ''
                      }`}
                    >
                      {meridian.name}
                    </button>
                  ))}
                </div>
              </details>
              <div className="hidden lg:block">
                <h2 className="text-base sm:text-lg font-bold text-yellow-400 mb-4 text-center lg:text-left">
                  {selectedMeridian ? "Switch Meridian" : "Select Meridian"}
                </h2>
                <div className="flex flex-col gap-3">
                  {availableMeridians.map((meridian) => (
                    <button
                      key={meridian.id}
                      onClick={() => handleMeridianSelect(meridian.id)}
                      className={`${meridian.element} font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-center text-base touch-manipulation ${
                        selectedMeridian === meridian.id ? 'ring-2 ring-yellow-400' : ''
                      }`}
                    >
                      {meridian.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Point Popup for HT9 only */}
      {showHT9Popup && popupPoint && popupPoint.id === "HT9" && popupPoint.popup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`bg-gradient-to-br ${popupPoint.popup.type === 'warning' ? 'from-red-900 to-black border-2 border-red-500' : 'from-gray-900 to-black border-2 border-gray-500'} rounded-xl max-w-md w-full p-6 relative`}>
            {/* Close button */}
            <button
              onClick={() => {
                setShowHT9Popup(false);
                setPopupPoint(null);
                // After closing popup, always show flashcard for HT9
                if (popupPoint && popupPoint.id === 'HT9') {
                  setSelectedPoint(popupPoint);
                  setShowZoomedView(true);
                }
              }}
              className={`absolute top-4 right-4 ${popupPoint.popup.type === 'warning' ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-gray-300'} text-2xl font-bold transition-colors`}
            >
              ×
            </button>
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className={`text-xl font-bold ${popupPoint.popup.type === 'warning' ? 'text-red-400' : 'text-gray-400'} mb-2`}>
                {popupPoint.popup.title}
              </h2>
            </div>
            {/* Content */}
            <div className="mb-6">
              <p className={`text-sm leading-relaxed ${popupPoint.popup.type === 'warning' ? 'text-red-200' : 'text-gray-300'}`}>
                {popupPoint.popup.message}
              </p>
            </div>
            {/* Action button */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowHT9Popup(false);
                  setPopupPoint(null);
                  if (popupPoint && popupPoint.id === 'HT9') {
                    setSelectedPoint(popupPoint);
                    setShowZoomedView(true);
                  }
                }}
                className={`flex-1 ${popupPoint.popup.type === 'warning' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-700'} text-white font-bold py-3 px-4 rounded-lg transition-colors`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BodyMapInteractiveNew;