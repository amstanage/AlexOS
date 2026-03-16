import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function BootScreen({ onComplete }) {
  const [phase, setPhase] = useState('bios')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('logo'), 1200)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    if (phase !== 'logo') return
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => setPhase('fade'), 300)
          return 100
        }
        return p + 3 + Math.random() * 5
      })
    }, 80)
    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase === 'fade') {
      const t = setTimeout(onComplete, 500)
      return () => clearTimeout(t)
    }
  }, [phase, onComplete])

  return (
    <AnimatePresence>
      {phase !== 'fade' && (
        <motion.div
          style={styles.container}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {phase === 'bios' && (
            <div style={styles.bios}>
              <div style={styles.biosText}>
                AlexOS BIOS v4.0{'\n'}
                Copyright (C) 2024 AlexOS Foundation{'\n'}
                {'\n'}
                Pentium III 450MHz Processor{'\n'}
                Memory Test: 262144K OK{'\n'}
                {'\n'}
                Detecting Primary Master... Hard Disk{'\n'}
                Detecting Primary Slave... CD-ROM{'\n'}
                {'\n'}
                Starting AlexOS 98...
              </div>
            </div>
          )}

          {phase === 'logo' && (
            <div style={styles.logoScreen}>
              <div style={styles.flag}>
                <div style={{ ...styles.flagBlock, background: '#FF0000' }} />
                <div style={{ ...styles.flagBlock, background: '#00AA00' }} />
                <div style={{ ...styles.flagBlock, background: '#0000FF' }} />
                <div style={{ ...styles.flagBlock, background: '#FFAA00' }} />
              </div>
              <div style={styles.logoTitle}>
                <span style={styles.logoAlex}>Alex</span>
                <span style={styles.logoOS}>OS 98</span>
              </div>
              <div style={styles.progressContainer}>
                <div style={{ ...styles.progressFill, width: `${Math.min(progress, 100)}%` }} />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const styles = {
  container: {
    position: 'fixed',
    inset: 0,
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  bios: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '20px',
  },
  biosText: {
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    fontSize: '14px',
    color: '#aaaaaa',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
  },
  logoScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    background: '#000080',
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
  },
  flag: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4px',
    width: '60px',
    height: '60px',
    transform: 'rotate(-10deg) skewX(-5deg)',
  },
  flagBlock: {
    borderRadius: '2px',
  },
  logoTitle: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  logoAlex: {
    fontFamily: "'Tahoma', sans-serif",
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  logoOS: {
    fontFamily: "'Tahoma', sans-serif",
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  progressContainer: {
    width: '200px',
    height: '20px',
    background: '#000080',
    border: '2px solid',
    borderColor: '#404040 #ffffff #ffffff #404040',
    padding: '2px',
    position: 'absolute',
    bottom: '60px',
  },
  progressFill: {
    height: '100%',
    background: 'repeating-linear-gradient(90deg, #c0c0c0 0px, #c0c0c0 8px, transparent 8px, transparent 10px)',
    transition: 'width 0.08s linear',
  },
}
