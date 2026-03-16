import { motion, useMotionValue } from 'framer-motion'
import { useState, useRef } from 'react'

export default function DesktopIcon({ emoji, label, onClick, initialX, initialY, constraintsRef }) {
  const [selected, setSelected] = useState(false)
  const x = useMotionValue(initialX || 0)
  const y = useMotionValue(initialY || 0)
  const wasDragged = useRef(false)

  return (
    <motion.div
      style={{
        ...styles.wrapper,
        position: 'absolute',
        left: 0,
        top: 0,
        x,
        y,
        background: selected ? 'rgba(0,0,128,0.4)' : 'transparent',
        zIndex: selected ? 10 : 1,
      }}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={constraintsRef}
      onDragStart={() => { wasDragged.current = true }}
      onDragEnd={() => { setTimeout(() => { wasDragged.current = false }, 0) }}
      whileDrag={{ zIndex: 20, cursor: 'grabbing' }}
      onClick={(e) => {
        e.stopPropagation()
        setSelected(true)
      }}
      onDoubleClick={() => {
        if (!wasDragged.current) onClick()
      }}
      onBlur={() => setSelected(false)}
      tabIndex={0}
    >
      <div style={styles.iconBox}>
        <span style={styles.emoji}>{emoji}</span>
      </div>
      <span style={{
        ...styles.label,
        background: selected ? '#000080' : 'transparent',
        color: '#ffffff',
      }}>
        {label}
      </span>
    </motion.div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    cursor: 'pointer',
    width: '72px',
    padding: '4px',
    outline: 'none',
  },
  iconBox: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: '28px',
    lineHeight: 1,
  },
  label: {
    fontSize: '11px',
    textAlign: 'center',
    lineHeight: 1.2,
    padding: '1px 2px',
    maxWidth: '68px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textShadow: '1px 1px 1px rgba(0,0,0,0.7)',
  },
}
