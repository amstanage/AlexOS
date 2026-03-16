import { useState, useCallback, useRef } from 'react'

let windowIdCounter = 0
let zIndexCounter = 100

export function useWindowManager() {
  const [windows, setWindows] = useState([])
  const constraintsRef = useRef(null)

  // Apps that allow multiple instances
  const MULTI_INSTANCE = ['browser']

  const openWindow = useCallback((appId, props) => {
    setWindows(prev => {
      // For single-instance apps, reuse existing window
      if (!MULTI_INSTANCE.includes(appId)) {
        const existing = prev.find(w => w.appId === appId && !w.closed)
        if (existing) {
          zIndexCounter++
          return prev.map(w =>
            w.id === existing.id
              ? { ...w, minimized: false, zIndex: zIndexCounter, props: props || w.props }
              : w
          )
        }
      }

      windowIdCounter++
      zIndexCounter++
      const offset = (prev.filter(w => !w.closed).length % 6) * 30
      return [...prev, {
        id: windowIdCounter,
        appId,
        x: 120 + offset,
        y: 60 + offset,
        zIndex: zIndexCounter,
        minimized: false,
        maximized: false,
        closed: false,
        props: props || null,
      }]
    })
  }, [])

  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, closed: true } : w
    ))
    setTimeout(() => {
      setWindows(prev => prev.filter(w => w.id !== id))
    }, 300)
  }, [])

  const minimizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, minimized: true } : w
    ))
  }, [])

  const maximizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, maximized: !w.maximized } : w
    ))
  }, [])

  const focusWindow = useCallback((id) => {
    zIndexCounter++
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, zIndex: zIndexCounter } : w
    ))
  }, [])

  const activeWindows = windows.filter(w => !w.closed)

  return {
    windows: activeWindows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    constraintsRef,
  }
}
