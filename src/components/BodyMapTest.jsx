import React, { useState } from 'react'

const BodyMapTest = ({ navigateTo }) => {
  const [viewSide, setViewSide] = useState('front')
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Body Map Test - {viewSide}</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="mb-4 flex space-x-4">
            <button
              onClick={() => setViewSide('front')}
              className={`px-4 py-2 rounded ${viewSide === 'front' ? 'bg-blue-600' : 'bg-gray-600'}`}
            >
              Front View
            </button>
            <button
              onClick={() => setViewSide('back')}
              className={`px-4 py-2 rounded ${viewSide === 'back' ? 'bg-blue-600' : 'bg-gray-600'}`}
            >
              Back View
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="px-4 py-2 bg-gray-600 rounded"
            >
              Back to Home
            </button>
          </div>
          
          <div className="bg-gray-700 p-4 rounded min-h-96">
            <svg width="300" height="600" viewBox="0 0 300 600" className="mx-auto">
              <rect width="300" height="600" fill="#374151"/>
              
              {/* Simple Human Figure */}
              <circle cx="150" cy="80" r="30" fill="#DDBF94"/>
              <rect x="135" y="110" width="30" height="15" fill="#DDBF94"/>
              <ellipse cx="150" cy="180" rx="45" ry="60" fill="#DDBF94"/>
              <ellipse cx="110" cy="160" rx="12" ry="40" fill="#DDBF94"/>
              <ellipse cx="190" cy="160" rx="12" ry="40" fill="#DDBF94"/>
              <ellipse cx="130" cy="320" rx="18" ry="60" fill="#DDBF94"/>
              <ellipse cx="170" cy="320" rx="18" ry="60" fill="#DDBF94"/>
              <ellipse cx="125" cy="420" rx="15" ry="50" fill="#DDBF94"/>
              <ellipse cx="175" y="420" rx="15" ry="50" fill="#DDBF94"/>
              
              {/* Clickable Regions */}
              <rect x="100" y="50" width="100" height="80" 
                    fill="none" stroke="#FFA500" strokeWidth="2" 
                    className="cursor-pointer hover:stroke-4"
                    onClick={() => alert('Head & Neck clicked!')}/>
              <text x="150" y="95" textAnchor="middle" fill="#FFA500" fontSize="12">HEAD & NECK</text>
              
              <rect x="80" y="130" width="50" height="100" 
                    fill="none" stroke="#FFA500" strokeWidth="2" 
                    className="cursor-pointer hover:stroke-4"/>
              <rect x="170" y="130" width="50" height="100" 
                    fill="none" stroke="#FFA500" strokeWidth="2" 
                    className="cursor-pointer hover:stroke-4"/>
              <text x="60" y="180" textAnchor="middle" fill="#FFA500" fontSize="10" transform="rotate(-90 60 180)">ARMS</text>
              
              <rect x="110" y="130" width="80" height="120" 
                    fill="none" stroke="#00AA00" strokeWidth="2" 
                    className="cursor-pointer hover:stroke-4"/>
              <text x="150" y="190" textAnchor="middle" fill="#00AA00" fontSize="12">TRUNK</text>
              
              <rect x="110" y="250" width="80" height="150" 
                    fill="none" stroke="#CC0000" strokeWidth="2" 
                    className="cursor-pointer hover:stroke-4"/>
              <text x="150" y="325" textAnchor="middle" fill="#CC0000" fontSize="12">LEGS</text>
              
              <rect x="100" y="400" width="100" height="80" 
                    fill="none" stroke="#0066CC" strokeWidth="2" 
                    className="cursor-pointer hover:stroke-4"/>
              <text x="150" y="445" textAnchor="middle" fill="#0066CC" fontSize="12">FEET</text>
            </svg>
          </div>
          
          <div className="mt-4 text-center text-gray-300">
            This is a test version of the Body Map component
          </div>
        </div>
      </div>
    </div>
  )
}

export default BodyMapTest
