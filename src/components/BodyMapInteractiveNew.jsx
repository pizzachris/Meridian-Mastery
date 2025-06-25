// Exact image dimensions for each view
const IMAGE_DIMENSIONS = {
  front: { width: 693, height: 1656 }, // front_view_model_wide_padded.png
  back: { width: 773, height: 1776 },  // back_view_model_wide_padded.png
  side: { width: 829, height: 1569 },  // side_full_cleaned_padded.png
};
import React, { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import { getAllPoints } from "../utils/dataLoaderOptimized";

const BodyMapInteractiveNew = ({ navigateTo }) => {
  // For pinch-to-zoom and pan
  const mapContainerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState(null);

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

  // Load meridian data when meridian is selected
  useEffect(() => {
    if (selectedMeridian) {
      // Proper filename mapping for meridian JSONs
      const filenameMap = {
        'Lung': 'lung',
        'LargeIntestine': 'large_intestine',
        'Heart': 'heart',
        'Stomach': 'stomach',
        'Spleen': 'spleen',
        'SmallIntestine': 'small_intestine',
        'Pericardium': 'pericardium'
      };
      const filename = `${filenameMap[selectedMeridian] || selectedMeridian.toLowerCase()}_meridian_with_regions.json`;
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
    if (!hasMultipleViews()) return points;
    return points.filter(point => point.view === currentView);
  };

  // Transform coordinates for different views
  const transformCoordinates = (point, meridianId) => {
    // For multi-view meridians, coordinates are already correct for their specific view
    return { x: point.x, y: point.y };
  };

  // Get current image path
  const getCurrentImagePath = () => {
    // Only use the improved_body_map_with_regions/Improved body models and regions/Improved body models and regions/ images
    switch (currentView) {
      case "front":
        return "/improved_body_map_with_regions/Improved body models and regions/Improved body models and regions/front_view_model_wide_padded.png";
      case "back":
        return "/improved_body_map_with_regions/Improved body models and regions/Improved body models and regions/back_view_model_wide_padded.png";
      case "side":
        return "/improved_body_map_with_regions/Improved body models and regions/Improved body models and regions/side_full_cleaned_padded.png";
      default:
        return "/improved_body_map_with_regions/Improved body models and regions/Improved body models and regions/side_full_cleaned_padded.png";
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
  // Handle meridian selection
  const handleMeridianSelect = (meridianId) => {
    setSelectedMeridian(meridianId);
    setSelectedPoint(null);
    setShowZoomedView(false);
    setIsFlipped(false);
    
    // Set starting view based on where the first point is located
    // This ensures users see points in order (SI1, SI2, etc.)
    const meridian = availableMeridians.find(m => m.id === meridianId);
    if (meridian) {
      if (meridian.views && meridian.views.length > 1) {
        // For multi-view meridians, start with the view that contains the first point
        // Small Intestine starts on "side" view where SI1 is located
        if (meridianId === "SmallIntestine") {
          setCurrentView("side"); // SI1 is on side view
        } else {
          setCurrentView(meridian.views[0]); // Default to first view in array
        }
      } else {
        // Single view meridians use their designated view
        setCurrentView(meridian.view);
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
    setIsFlipped(false); // Start with front side of flashcard
  };

  // Close zoom and flashcard
  const closeZoom = () => {
    setSelectedPoint(null);
    setShowZoomedView(false);
    setIsFlipped(false);
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
        {(selectedMeridian || showZoomedView) && (
          <button
            onClick={showZoomedView ? closeZoom : clearSelection}
            className="ml-auto bg-black/80 rounded-lg px-4 py-2 border border-blue-400/30 text-blue-400 font-bold text-base hover:text-blue-300 hover:bg-black/90 transition-colors touch-manipulation"
            title={showZoomedView ? "Back to Body Map" : "Back to Home"}
          >
            ← {showZoomedView ? "Full View" : "Back"}
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="pt-24 sm:pt-16 pb-4 px-2 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {showZoomedView && selectedPoint ? (
          // Zoomed View with Flashcard
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
            let dims = IMAGE_DIMENSIONS[currentView] || IMAGE_DIMENSIONS.side;
            return (
              <div
                className="relative bg-gray-800 rounded-lg overflow-hidden mx-auto"
                style={{
                  width: dims.width + 'px',
                  height: dims.height + 'px',
                  maxWidth: '100%',
                  maxHeight: '90vh',
                }}
              >
                <img
                  src={getCurrentImagePath()}
                  alt="Body Model"
                  style={{
                    width: dims.width + 'px',
                    height: dims.height + 'px',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                  draggable={false}
                />
                {/* Always render the side view image if no meridian is selected */}
                {!selectedMeridian && (
                  <img
                    src="/improved_body_map_with_regions/Improved body models and regions/Improved body models and regions/side_full_cleaned_padded.png"
                    alt="Body Model Side View"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: dims.width + 'px',
                      height: dims.height + 'px',
                      objectFit: 'contain',
                      pointerEvents: 'none',
                    }}
                    draggable={false}
                  />
                )}
                {/* Only render points if a meridian is selected, and use smallest supported size */}
                {selectedMeridian && getPointsForCurrentView().map((point, idx) => {
                  const { x, y } = transformCoordinates(point, selectedMeridian);
                  return (
                    <button
                      key={point.id || idx}
                      className="absolute bg-red-500 rounded-full border border-white shadow-lg z-10 animate-pulse"
                      style={{
                        width: '8px', height: '8px',
                        left: `${x * dims.width}px`,
                        top: `${y * dims.height}px`,
                        transform: "translate(-50%, -50%)"
                      }}
                      onClick={() => handlePointClick(point)}
                      title={point.name}
                      aria-label={point.name}
                    />
                  );
                })}
              </div>
            );
          })()}
              </div>

              {/* Flashcard */}
              <div className="flex-1 max-w-md">
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

                {/* Card controls */}
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
                let dims = IMAGE_DIMENSIONS[currentView] || IMAGE_DIMENSIONS.side;
                return (
                  <div
                    ref={mapContainerRef}
                    className="relative bg-gray-800 rounded-lg overflow-auto mx-auto touch-pan-x touch-pan-y"
                    style={{
                      width: '100%',
                      maxWidth: dims.width + 'px',
                      maxHeight: '80vh',
                      touchAction: 'none',
                      transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {selectedMeridian && (
                      <img
                        src={getCurrentImagePath()}
                        alt={`${currentView} view`}
                        style={{
                          width: '100%',
                          height: 'auto',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                        draggable={false}
                        srcSet={getCurrentImagePath() + ' 1x, ' + getCurrentImagePath() + ' 2x'}
                      />
                    )}
                    {/* Points Overlay - only show when meridian is selected */}
                    {selectedMeridian && getPointsForCurrentView().map((point, index) => {
                      const { x, y } = transformCoordinates(point, selectedMeridian);
                      return (
                        <button
                          key={index}
                          onClick={() => handlePointClick(point)}
                          className="absolute bg-red-500 rounded-full border-2 border-white hover:bg-red-400 hover:scale-110 transition-all shadow-lg cursor-pointer"
                          style={{
                            width: '8px', height: '8px',
                            left: `calc(${x * 100}% - 4px)`,
                            top: `calc(${y * 100}% - 4px)`,
                            transform: "none",
                            padding: 0,
                            touchAction: 'manipulation',
                          }}
                        >
                          <span style={{
                            position: 'absolute',
                            left: '-12px',
                            top: '-12px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'transparent',
                            zIndex: 1,
                            pointerEvents: 'auto',
                            opacity: 0
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
};

export default BodyMapInteractiveNew;
