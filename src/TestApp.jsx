import React from 'react'

function TestApp() {
  console.log('TestApp is rendering...')
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'red', color: 'white', fontSize: '24px' }}>
      <h1>TEST APP - If you see this, React is working!</h1>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  )
}

export default TestApp
