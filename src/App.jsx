import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import BootScreen from './components/BootScreen'
import Desktop from './components/Desktop'
import './App.css'

function App() {
  const [booted, setBooted] = useState(false)

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {!booted && <BootScreen key="boot" onComplete={handleBootComplete} />}
      </AnimatePresence>
      {booted && <Desktop />}
    </div>
  )
}

export default App
