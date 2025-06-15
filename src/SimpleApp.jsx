import React, { useState } from 'react'

function SimpleApp() {
  console.log('SimpleApp is rendering...')
  
  const [currentPage, setCurrentPage] = useState('home')
  
  const navigateTo = (page) => {
    console.log('Navigating to:', page)
    setCurrentPage(page)
  }
  
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Meridian Mastery</h1>
        <div className="max-w-md mx-auto space-y-4">
          <button 
            onClick={() => navigateTo('bodymap')}
            className="w-full bg-yellow-500 text-black py-4 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            🗺️ Body Map
          </button>
          <button 
            onClick={() => navigateTo('flashcards')}
            className="w-full bg-green-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-400 transition-colors"
          >
            🌿 Flashcards
          </button>
        </div>
      </div>
    )
  }
  
  if (currentPage === 'bodymap') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <button 
          onClick={() => navigateTo('home')}
          className="mb-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500"
        >
          ← Back to Home
        </button>
        <h1 className="text-3xl font-bold mb-8">Body Map</h1>
        <div className="text-center">
          <p className="text-xl">Body Map component would go here</p>
          <p className="text-gray-400 mt-4">This is a simplified version to test basic functionality</p>
        </div>
      </div>
    )
  }
  
  if (currentPage === 'flashcards') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <button 
          onClick={() => navigateTo('home')}
          className="mb-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500"
        >
          ← Back to Home
        </button>
        <h1 className="text-3xl font-bold mb-8">Flashcards</h1>
        <div className="text-center">
          <p className="text-xl">Flashcards component would go here</p>
          <p className="text-gray-400 mt-4">This is a simplified version to test basic functionality</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-red-900 text-white p-8">
      <h1>Unknown page: {currentPage}</h1>
      <button onClick={() => navigateTo('home')}>Go Home</button>
    </div>
  )
}

export default SimpleApp
