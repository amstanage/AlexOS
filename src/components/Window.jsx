import { motion, useMotionValue, animate, useDragControls } from 'framer-motion'
import { useEffect } from 'react'

const APP_SIZES = {
  about: { width: 460, height: 380 },
  projects: { width: 600, height: 450 },
  terminal: { width: 560, height: 380 },
  settings: { width: 380, height: 320 },
  browser: { width: 700, height: 480 },
  minesweeper: { width: 282, height: 386 },
}

const APP_TITLES = {
  about: 'About Me',
  projects: 'Projects',
  terminal: 'Command Prompt',
  settings: 'Control Panel',
  browser: 'Internet Explorer',
  minesweeper: 'Sweeper of Mines',
}

const APP_ICONS = {
  about: '👤',
  projects: '📂',
  terminal: '💻',
  settings: '⚙️',
  browser: '🌐',
  minesweeper: '💣',
}

export default function Window({
  windowData,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  constraintsRef,
}) {
  const { id, appId, zIndex, minimized, maximized, closed } = windowData
  const size = APP_SIZES[appId] || { width: 500, height: 400 }
  const title = APP_TITLES[appId] || appId
  const icon = APP_ICONS[appId] || '📄'

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const dragControls = useDragControls()

  useEffect(() => {
    if (maximized) {
      animate(x, 0, { duration: 0 })
      animate(y, 0, { duration: 0 })
    }
  }, [maximized, x, y])

  if (minimized) return null

  return (
    <motion.div
      style={{
        ...styles.window,
        ...(maximized ? {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: 'calc(100vh - 30px)',
        } : {
          position: 'absolute',
          width: size.width,
          height: size.height,
        }),
        zIndex,
        x,
        y,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={closed
        ? { opacity: 0, scale: 0.95 }
        : { opacity: 1, scale: 1 }
      }
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.08 }}
      drag={!maximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={constraintsRef}
      dragElastic={0}
      onPointerDown={() => onFocus(id)}
    >
      {/* Title bar — this is the drag handle */}
      <div
        style={styles.titleBar}
        onPointerDown={(e) => {
          if (!maximized) dragControls.start(e)
        }}
      >
        <div style={styles.titleLeft}>
          <span style={styles.titleIcon}>{icon}</span>
          <span style={styles.titleText}>{title}</span>
        </div>
        <div style={styles.titleButtons}>
          <button
            style={styles.titleBtn}
            onClick={(e) => { e.stopPropagation(); onMinimize(id) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div style={styles.minimizeIcon} />
          </button>
          <button
            style={styles.titleBtn}
            onClick={(e) => { e.stopPropagation(); onMaximize(id) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {maximized ? (
              <div style={styles.restoreIcon}>
                <div style={styles.restoreBack} />
                <div style={styles.restoreFront} />
              </div>
            ) : (
              <div style={styles.maximizeIcon} />
            )}
          </button>
          <button
            style={{ ...styles.titleBtn, marginLeft: '2px' }}
            onClick={(e) => { e.stopPropagation(); onClose(id) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <span style={styles.closeIcon}>✕</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {children}
      </div>
    </motion.div>
  )
}

const styles = {
  window: {
    background: '#c0c0c0',
    border: '2px solid',
    borderColor: '#dfdfdf #404040 #404040 #dfdfdf',
    boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080, 2px 2px 8px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'default',
    overflow: 'hidden',
  },
  titleBar: {
    height: '22px',
    minHeight: '22px',
    background: 'linear-gradient(90deg, #000080, #1084d0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 3px',
    cursor: 'grab',
    touchAction: 'none',
  },
  titleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    overflow: 'hidden',
    flex: 1,
    pointerEvents: 'none',
  },
  titleIcon: {
    fontSize: '12px',
    lineHeight: 1,
  },
  titleText: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleButtons: {
    display: 'flex',
    gap: '1px',
    flexShrink: 0,
  },
  titleBtn: {
    width: '16px',
    height: '14px',
    background: '#c0c0c0',
    border: '1px solid',
    borderColor: '#fff #404040 #404040 #fff',
    boxShadow: 'inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    position: 'relative',
  },
  minimizeIcon: {
    width: '8px',
    height: '2px',
    background: '#000',
    position: 'absolute',
    bottom: '2px',
    left: '3px',
  },
  maximizeIcon: {
    width: '9px',
    height: '9px',
    border: '1px solid #000',
    borderTop: '2px solid #000',
  },
  restoreIcon: {
    position: 'relative',
    width: '10px',
    height: '10px',
  },
  restoreBack: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '7px',
    height: '7px',
    border: '1px solid #000',
    borderTop: '2px solid #000',
    background: '#c0c0c0',
  },
  restoreFront: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '7px',
    height: '7px',
    border: '1px solid #000',
    borderTop: '2px solid #000',
    background: '#c0c0c0',
  },
  closeIcon: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 1,
  },
  content: {
    flex: 1,
    overflow: 'auto',
    position: 'relative',
    background: '#c0c0c0',
  },
}
