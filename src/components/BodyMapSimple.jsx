import React, { useState } from 'react'

const BodyMapSimple = ({ navigateTo }) => {
  const [viewSide, setViewSide] = useState('front')
  
  console.log('BodyMapSimple rendering...')
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigateTo('home')}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-yellow-400">Body Map</h1>
          <div className="w-20"></div> {/* Spacer */}
        </div>
        
        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setViewSide('front')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                viewSide === 'front'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Front View
            </button>
            <button
              onClick={() => setViewSide('back')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                viewSide === 'back'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Back View
            </button>
          </div>
        </div>
        
        {/* Simple Body Display */}
        <div className="flex justify-center">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">
              {viewSide === 'front' ? '🧍' : '🚶'}
            </div>
            <p className="text-xl">
              {viewSide === 'front' ? 'Front View' : 'Back View'}
            </p>
            <p className="text-gray-400 mt-2">
              Simplified BodyMap - SVG loading will be added next
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BodyMapSimple
