import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('Checking...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus('Backend not reachable'))
  }, [])

  return (
    <div className="app">
      <header className="hero">
        <h1>Auto-Scaling Online Examination Platform</h1>
        <p className="subtitle">A scalable, modern exam platform</p>
        <div className="status-badge">
          <span className="dot" />
          Backend: {apiStatus}
        </div>
      </header>
    </div>
  )
}

export default App
