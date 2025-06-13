import React, { useState, useEffect } from 'react';

const BodyMapInteractive = () => {
  // State management
  const [currentView, setCurrentView] = useState('front'); // front, back, side
  const [currentRegion, setCurrentRegion] = useState('full'); // full, head, trunk, arms, legs, feet
  const [selectedMeridian, setSelectedMeridian] = useState(''); // Lung, LargeIntestine, Stomach, etc.
  const [showPaths, setShowPaths] = useState(false);
  const [points, setPoints] = useState([]);
  const [regionButtons, setRegionButtons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  // Available meridians (will expand as you add more)
  const availableMeridians = [
    'Lung',
    'LargeIntestine', 
    'Stomach',
    // Future: Heart, SmallIntestine, Bladder, Kidney, Pericardium, TripleWarmer, Gallbladder, Liver
  ];  // Load region buttons data based on current view
  useEffect(() => {
    const buttonFileMap = {
      'front': 'region_buttons.json',
      'back': 'button_map_back.json', 
      'side': 'button_map_side.json'
    };
    
    const buttonFile = buttonFileMap[currentView] || 'region_buttons.json';
    
    fetch(`/data/${buttonFile}`)
      .then(res => res.json())
      .then(data => {
        console.log(`Loaded ${currentView} view buttons:`, data);
        // Filter for region buttons only (exclude UI elements)
        const regionButtons = data.filter(button => 
          !['Front, Back, Side', 'logo home button', 'Meridian Selector'].includes(button.label)
        );
        setRegionButtons(regionButtons);
      })
      .catch(err => {
        console.log(`Button mapping not found for ${currentView}:`, err);
        setRegionButtons([]);
      });
  }, [currentView]);

  // Load points data when view, region, or meridian changes
  useEffect(() => {
    if (selectedMeridian) {
      const filename = currentRegion === 'full' 
        ? `${currentView}_${selectedMeridian}.json`
        : `${currentRegion}_${currentView}_${selectedMeridian}.json`;
      
      fetch(`/data/${filename}`)
        .then(res => res.json())
        .then(data => {
          console.log('Loaded points:', data);
          setPoints(data.points || data || []);
        })
        .catch(err => {
          console.log(`Points file not found: ${filename}`, err);
          setPoints([]);
        });
    } else {
      setPoints([]);
    }
  }, [currentView, currentRegion, selectedMeridian]);  // Get current image path
  const getCurrentImagePath = () => {
    if (currentRegion === 'full') {
      // Use standard full body naming convention
      switch (currentView) {
        case 'front':
          return '/regions/front_full.png';
        case 'back':
          return '/regions/back_full.png';
        case 'side':
          return '/regions/side_full.png';
        default:
          return '/regions/side_full.png';
      }
    }
    
    // For zoomed regions, use consistent {region}_{view}.png format
    return `/regions/${currentRegion}_${currentView}.png`;
  };

  // Handle point click
  const handlePointClick = (point) => {
    setSelectedPoint(point);
    setShowModal(true);
  };

  // Handle region click (zoom in)
  const handleRegionClick = (region) => {
    setCurrentRegion(region);
  };

  // Reset to full view
  const resetToFull = () => {
    setCurrentRegion('full');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-center mb-6">Interactive Body Map</h1>
        
        {/* View Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {['front', 'back', 'side'].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                currentView === view
                  ? 'bg-red-700 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)} View
            </button>
          ))}
        </div>

        {/* Back to Full View Button (when zoomed) */}
        {currentRegion !== 'full' && (
          <div className="flex justify-center mb-4">
            <button
              onClick={resetToFull}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              ← Back to Full View
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto flex gap-6">
        
        {/* Body Image Container */}
        <div className="flex-1 flex justify-center">
          <div className="relative inline-block">
            <img
              src={getCurrentImagePath()}
              alt={`${currentView} view - ${currentRegion}`}
              className="max-w-full h-auto"
              style={{ maxHeight: '70vh' }}
              onError={(e) => {
                console.log('Image failed to load:', e.target.src);
                e.target.style.display = 'none';
              }}
            />
              {/* Region Buttons Overlay (only on full view) */}
            {currentRegion === 'full' && regionButtons.length > 0 && (
              <>
                {regionButtons.map((region, index) => {
                  // Convert label to region name format
                  const regionName = region.label.toLowerCase()
                    .replace('&', '')
                    .replace(/\s+/g, '')
                    .replace('headneck', 'head');
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleRegionClick(regionName)}
                      className="absolute bg-blue-500 bg-opacity-20 border-2 border-blue-400 hover:bg-opacity-40 transition-all rounded"
                      style={{
                        left: `${region.x * 100}%`,
                        top: `${region.y * 100}%`,
                        width: `${region.width * 100}%`,
                        height: `${region.height * 100}%`
                      }}
                      title={`Zoom to ${region.label}`}
                    />
                  );
                })}
              </>
            )}

            {/* Pressure Points Overlay */}
            {points.map((point, index) => (
              <button
                key={index}
                onClick={() => handlePointClick(point)}
                className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white hover:bg-red-400 hover:scale-125 transition-all"
                style={{
                  left: `${point.x * 100}%`,
                  top: `${point.y * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={point.name || point.id}
              />
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Controls</h3>
          
          {/* Current View Info */}
          <div className="mb-6">
            <p className="text-sm text-gray-400">Current View:</p>
            <p className="font-semibold">{currentView} - {currentRegion}</p>
          </div>

          {/* Meridian Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Meridian:
            </label>
            <select
              value={selectedMeridian}
              onChange={(e) => setSelectedMeridian(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
            >
              <option value="">-- Select Meridian --</option>
              {availableMeridians.map((meridian) => (
                <option key={meridian} value={meridian}>
                  {meridian}
                </option>
              ))}
            </select>
          </div>

          {/* Path Overlay Toggle */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPaths}
                onChange={(e) => setShowPaths(e.target.checked)}
                className="mr-2"
              />
              Show Meridian Paths
            </label>
          </div>

          {/* Points Count */}
          {points.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-400">
                Showing {points.length} pressure points
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="text-xs text-gray-400">
            <p className="mb-2">• Click view buttons to change perspective</p>
            <p className="mb-2">• Click blue zones to zoom into regions</p>
            <p className="mb-2">• Select a meridian to see pressure points</p>
            <p>• Click red dots to view point details</p>
          </div>
        </div>
      </div>

      {/* Flashcard Modal */}
      {showModal && selectedPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-gray-900">
            <h2 className="text-xl font-bold mb-4">
              {selectedPoint.name || selectedPoint.id}
            </h2>
            
            {selectedPoint.description && (
              <p className="mb-4">{selectedPoint.description}</p>
            )}
            
            {selectedPoint.location && (
              <p className="text-sm text-gray-600 mb-4">
                <strong>Location:</strong> {selectedPoint.location}
            </p>
            )}
            
            {selectedPoint.functions && (
              <div className="mb-4">
                <strong>Functions:</strong>
                <ul className="list-disc list-inside text-sm mt-1">
                  {selectedPoint.functions.map((func, index) => (
                    <li key={index}>{func}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyMapInteractive;
