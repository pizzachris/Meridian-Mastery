import React, { useState } from 'react'
import flashcardsData from '../data/flashcards.json'

const BodyMapNew = ({ navigateTo }) => {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [selectedMeridian, setSelectedMeridian] = useState(null)
  const [viewSide, setViewSide] = useState('front')

  // Define body regions
  const bodyRegions = {
    'HEAD & NECK': ['head', 'neck', 'face', 'temple', 'forehead', 'chin', 'throat', 'occiput', 'nape'],
    'ARMS': ['arm', 'elbow', 'wrist', 'hand', 'finger', 'shoulder'],
    'TRUNK': ['chest', 'back', 'spine', 'intercostal', 'clavicle', 'scapula', 'thoracic', 'lumbar'],
    'LEGS': ['leg', 'knee', 'thigh', 'calf', 'posterior thigh', 'posterior leg'],
    'FEET': ['foot', 'toe', 'ankle', 'heel']
  }

  // Get meridian colors
  const getMeridianColor = (meridian) => {
    const colors = {
      'Lung': '#e5e7eb',
      'Large Intestine': '#e5e7eb',
      'Stomach': '#fbbf24',
      'Spleen': '#fbbf24',
      'Heart': '#ef4444',
      'Small Intestine': '#ef4444',
      'Urinary Bladder': '#3b82f6',
      'Kidney': '#3b82f6',
      'Pericardium': '#ef4444',
      'Triple Burner': '#ef4444',
      'Gall Bladder': '#10b981',
      'Liver': '#10b981',
      'Governing Vessel': '#8b5cf6',
      'Conception Vessel': '#8b5cf6'
    }
    return colors[meridian] || '#6b7280'
  }

  // Get anatomical position for each point
  const getAnatomicalPosition = (point) => {
    const pointNumber = point.number
    const meridian = point.meridian
    
    // Comprehensive anatomical mapping
    const positions = {
      // Lung Meridian (LU) - 11 points
      'LU1': { x: 62, y: 40 },   // Zhongfu
      'LU2': { x: 60, y: 38 },   // Yunmen
      'LU3': { x: 50, y: 50 },   // Tianfu
      'LU4': { x: 48, y: 55 },   // Xiabai
      'LU5': { x: 45, y: 62 },   // Chize
      'LU6': { x: 43, y: 68 },   // Kongzui
      'LU7': { x: 41, y: 74 },   // Lieque
      'LU8': { x: 40, y: 76 },   // Jingqu
      'LU9': { x: 39, y: 78 },   // Taiyuan
      'LU10': { x: 38, y: 82 },  // Yuji
      'LU11': { x: 37, y: 85 },  // Shaoshang
      
      // Large Intestine Meridian (LI) - 20 points
      'LI1': { x: 39, y: 86 },   // Shangyang
      'LI2': { x: 40, y: 84 },   // Erjian
      'LI3': { x: 41, y: 82 },   // Sanjian
      'LI4': { x: 42, y: 80 },   // Hegu
      'LI5': { x: 43, y: 76 },   // Yangxi
      'LI6': { x: 44, y: 72 },   // Pianli
      'LI7': { x: 45, y: 68 },   // Wenliu
      'LI8': { x: 46, y: 64 },   // Xialian
      'LI9': { x: 47, y: 60 },   // Shanglian
      'LI10': { x: 48, y: 58 },  // Shousanli
      'LI11': { x: 49, y: 56 },  // Quchi
      'LI12': { x: 50, y: 52 },  // Zhouliao
      'LI13': { x: 51, y: 48 },  // Wuli
      'LI14': { x: 52, y: 44 },  // Binao
      'LI15': { x: 53, y: 40 },  // Jianyu
      'LI16': { x: 58, y: 36 },  // Jugu
      'LI17': { x: 62, y: 32 },  // Tianding
      'LI18': { x: 65, y: 28 },  // Futu
      'LI19': { x: 68, y: 18 },  // Kouheliao
      'LI20': { x: 69, y: 16 },  // Yingxiang
      
      // Stomach Meridian (ST) - 45 points
      'ST1': { x: 68, y: 12 },   // Chengqi
      'ST2': { x: 68, y: 14 },   // Sibai
      'ST3': { x: 68, y: 16 },   // Juliao
      'ST4': { x: 67, y: 18 },   // Dicang
      'ST5': { x: 65, y: 20 },   // Daying
      'ST6': { x: 63, y: 18 },   // Jiache
      'ST7': { x: 61, y: 16 },   // Xiaguan
      'ST8': { x: 66, y: 10 },   // Touwei
      'ST9': { x: 66, y: 24 },   // Renying
      'ST10': { x: 66, y: 26 },  // Shuitu
      'ST11': { x: 66, y: 28 },  // Qishe
      'ST12': { x: 64, y: 30 },  // Quepen
      'ST13': { x: 62, y: 32 },  // Qihu
      'ST14': { x: 62, y: 34 },  // Kufang
      'ST15': { x: 62, y: 36 },  // Wuyi
      'ST16': { x: 62, y: 38 },  // Yingchuang
      'ST17': { x: 62, y: 40 },  // Ruzhong
      'ST18': { x: 62, y: 42 },  // Rugen
      'ST19': { x: 64, y: 44 },  // Burong
      'ST20': { x: 64, y: 46 },  // Chengman
      'ST21': { x: 64, y: 48 },  // Liangmen
      'ST22': { x: 64, y: 50 },  // Guanmen
      'ST23': { x: 64, y: 52 },  // Taiyi
      'ST24': { x: 64, y: 54 },  // Huaroumen
      'ST25': { x: 64, y: 56 },  // Tianshu
      'ST26': { x: 64, y: 58 },  // Wailing
      'ST27': { x: 64, y: 60 },  // Daju
      'ST28': { x: 64, y: 62 },  // Shuidao
      'ST29': { x: 64, y: 64 },  // Guilai
      'ST30': { x: 64, y: 68 },  // Qichong
      'ST31': { x: 62, y: 72 },  // Biguan
      'ST32': { x: 60, y: 78 },  // Femur-Futu
      'ST33': { x: 60, y: 84 },  // Yinshi
      'ST34': { x: 60, y: 90 },  // Liangqiu
      'ST35': { x: 60, y: 96 },  // Dubi
      'ST36': { x: 58, y: 102 }, // Zusanli
      'ST37': { x: 58, y: 108 }, // Shangjuxu
      'ST38': { x: 58, y: 110 }, // Tiaokou
      'ST39': { x: 58, y: 112 }, // Xiajuxu
      'ST40': { x: 56, y: 114 }, // Fenglong
      'ST41': { x: 58, y: 120 }, // Jiexi
      'ST42': { x: 58, y: 122 }, // Chongyang
      'ST43': { x: 58, y: 124 }, // Xiangu
      'ST44': { x: 58, y: 126 }, // Neiting
      'ST45': { x: 58, y: 128 }  // Lidui
    }
    
    return positions[pointNumber] || null
  }

  // Get points for a specific meridian
  const getPointsForMeridian = (meridianName) => {
    return flashcardsData.flashcards.filter(point => point.meridian === meridianName)
  }

  // Get points for a region
  const getPointsForRegion = (regionName) => {
    const regionKeywords = bodyRegions[regionName] || []
    return flashcardsData.flashcards.filter(card => {
      const location = card.location.toLowerCase()
      return regionKeywords.some(keyword => location.includes(keyword))
    })
  }

  // Get unique meridians in a region
  const getMeridiansInRegion = (regionName) => {
    const regionPoints = getPointsForRegion(regionName)
    const meridians = [...new Set(regionPoints.map(point => point.meridian))]
    return meridians.sort()
  }

  const handlePointSelect = (point) => {
    setSelectedPoint(selectedPoint?.id === point.id ? null : point)
  }

  const handleViewPoint = () => {
    if (selectedPoint) {
      navigateTo('Flashcard', { pointId: selectedPoint.id })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">
            EXPLORE BODY MAP
          </h1>
          <p className="text-gray-300">
            Interactive meridian system with 362 acupressure points
          </p>
        </div>

        {!selectedRegion ? (
          // Main body map view
          <div className="space-y-6">
            
            {/* Body Diagram */}
            <div className="bg-gray-900 rounded-lg p-6 border border-orange-600">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-800 rounded-lg p-1 flex">
                  <button
                    onClick={() => setViewSide('front')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      viewSide === 'front' 
                        ? 'bg-orange-600 text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    FRONT VIEW
                  </button>
                  <button
                    onClick={() => setViewSide('back')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      viewSide === 'back' 
                        ? 'bg-orange-600 text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    BACK VIEW
                  </button>
                </div>
              </div>

              {/* SVG Body Model */}
              <svg viewBox="0 0 140 130" className="w-full max-h-[70vh] mx-auto">
                {/* Body outline */}
                <g>
                  {/* Head */}
                  <ellipse cx="70" cy="12" rx="9" ry="11" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  {/* Neck */}
                  <rect x="66" y="20" width="8" height="8" rx="2" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  {/* Torso */}
                  <ellipse cx="70" cy="50" rx="18" ry="22" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  {/* Arms */}
                  <ellipse cx="45" cy="35" rx="8" ry="3" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  <ellipse cx="95" cy="35" rx="8" ry="3" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  <ellipse cx="40" cy="50" rx="4" ry="12" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  <ellipse cx="100" cy="50" rx="4" ry="12" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  <ellipse cx="38" cy="75" rx="3.5" ry="10" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  <ellipse cx="102" cy="75" rx="3.5" ry="10" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  <ellipse cx="36" cy="88" rx="3" ry="5" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  <ellipse cx="104" cy="88" rx="3" ry="5" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  {/* Legs */}
                  <ellipse cx="62" cy="90" rx="6" ry="15" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  <ellipse cx="78" cy="90" rx="6" ry="15" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  <ellipse cx="61" cy="118" rx="4" ry="10" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                  <ellipse cx="79" cy="118" rx="4" ry="10" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                </g>

                {/* Show all points for selected meridian */}
                {selectedMeridian && getPointsForMeridian(selectedMeridian).map((point, index) => {
                  const position = getAnatomicalPosition(point)
                  if (!position) return null
                  const isSelected = selectedPoint?.id === point.id
                  
                  return (
                    <circle
                      key={point.id}
                      cx={position.x}
                      cy={position.y}
                      r={isSelected ? "3" : "2"}
                      fill={getMeridianColor(point.meridian)}
                      stroke={isSelected ? "#FFA500" : "#FFFFFF"}
                      strokeWidth={isSelected ? "2" : "1"}
                      className="cursor-pointer hover:r-3 transition-all duration-200"
                      onClick={() => handlePointSelect(point)}
                    />
                  )
                })}
              </svg>
            </div>

            {/* Body Regions */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.keys(bodyRegions).map(region => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-orange-700 hover:to-orange-600 
                           text-white font-bold py-4 px-4 rounded-lg border border-orange-600 
                           transition-all duration-300 text-sm"
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Meridian Selector */}
            <div className="bg-gray-900 rounded-lg p-6 border border-orange-600">
              <h3 className="text-xl font-bold text-orange-400 mb-4 text-center">SELECT MERIDIAN</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Lung', 'Large Intestine', 'Stomach', 'Spleen', 'Heart', 'Small Intestine', 
                  'Urinary Bladder', 'Kidney', 'Pericardium', 'Triple Burner', 'Gall Bladder', 
                  'Liver', 'Governing Vessel', 'Conception Vessel'].map(meridian => (
                  <button
                    key={meridian}
                    onClick={() => setSelectedMeridian(selectedMeridian === meridian ? null : meridian)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                      selectedMeridian === meridian
                        ? 'bg-orange-600 text-black'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    <span className="truncate">{meridian}</span>
                    <div 
                      className="w-3 h-3 rounded-full ml-2 flex-shrink-0"
                      style={{ backgroundColor: getMeridianColor(meridian) }}
                    />
                  </button>
                ))}
              </div>
              
              {selectedMeridian && (
                <div className="mt-4 text-center text-orange-400">
                  Showing {getPointsForMeridian(selectedMeridian).length} points for {selectedMeridian} meridian
                </div>
              )}
            </div>

            {/* Selected Point Info */}
            {selectedPoint && (
              <div className="bg-gradient-to-r from-orange-900/30 to-orange-800/30 border border-orange-600 rounded-lg p-4">
                <h4 className="font-bold text-orange-400 text-lg mb-2">
                  {selectedPoint.number} - {selectedPoint.nameEnglish}
                </h4>
                <p className="text-gray-300 mb-1">{selectedPoint.nameRomanized}</p>
                <p className="text-gray-400 text-sm mb-4">{selectedPoint.location}</p>
                <button
                  onClick={handleViewPoint}
                  className="w-full bg-gradient-to-r from-orange-700 to-orange-800 hover:from-orange-600 hover:to-orange-700 
                           text-white font-bold py-3 px-4 rounded-lg border border-orange-600 transition-all"
                >
                  VIEW POINT DETAILS
                </button>
              </div>
            )}
          </div>
        ) : (
          // Region detail view
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={() => setSelectedRegion(null)}
                className="text-orange-400 hover:text-orange-300 mb-4"
              >
                ← Back to Body Map
              </button>
              <h2 className="text-2xl font-bold text-orange-400">{selectedRegion}</h2>
            </div>

            {/* Meridians in this region */}
            <div className="bg-gray-900 rounded-lg p-6 border border-orange-600">
              <h3 className="text-xl font-bold text-orange-400 mb-4">SELECT MERIDIAN</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {getMeridiansInRegion(selectedRegion).map(meridian => (
                  <button
                    key={meridian}
                    onClick={() => setSelectedMeridian(selectedMeridian === meridian ? null : meridian)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      selectedMeridian === meridian
                        ? 'bg-orange-600 text-black'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {meridian}
                    <div className="text-xs mt-1">
                      {getPointsForMeridian(meridian).filter(p => {
                        const location = p.location.toLowerCase()
                        return bodyRegions[selectedRegion].some(keyword => location.includes(keyword))
                      }).length} points
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BodyMapNew
