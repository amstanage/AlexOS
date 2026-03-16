import { useState, useEffect } from 'react'

const START_APPS = [
  { id: 'about', label: 'About Me', emoji: '👤' },
  { id: 'projects', label: 'Projects', emoji: '📂' },
  { id: 'terminal', label: 'Command Prompt', emoji: '💻' },
  { id: 'browser', label: 'Internet Explorer', emoji: '🌐' },
  { id: 'minesweeper', label: 'Sweeper of Mines', emoji: '💣' },
  { id: 'settings', label: 'Control Panel', emoji: '⚙️' },
]

export default function Taskbar({ windows, openWindow, focusWindow, minimizeWindow }) {
  const [time, setTime] = useState(new Date())
  const [startOpen, setStartOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (d) => d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const handleTaskClick = (win) => {
    if (win.minimized) {
      focusWindow(win.id)
      // Un-minimize by focusing
      minimizeWindow(win.id) // this toggles, but our minimize only sets true...
      // We need to handle this differently
    }
    focusWindow(win.id)
  }

  return (
    <>
      {/* Start menu */}
      {startOpen && (
        <div style={styles.startMenu}>
          <div style={styles.startSidebar}>
            <span style={styles.sidebarText}>AlexOS 98</span>
          </div>
          <div style={styles.startItems}>
            {START_APPS.map((app) => (
              <div
                key={app.id}
                style={styles.startItem}
                onClick={() => {
                  openWindow(app.id)
                  setStartOpen(false)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#000080'
                  e.currentTarget.style.color = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#000000'
                }}
              >
                <span style={styles.startItemIcon}>{app.emoji}</span>
                <span style={styles.startItemLabel}>{app.label}</span>
              </div>
            ))}
            <div style={styles.startDivider} />
            <div
              style={styles.startItem}
              onClick={() => {
                setStartOpen(false)
                window.location.reload()
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#000080'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#000000'
              }}
            >
              <span style={styles.startItemIcon}>🔌</span>
              <span style={styles.startItemLabel}>Shut Down...</span>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close start menu */}
      {startOpen && (
        <div
          style={styles.overlay}
          onClick={() => setStartOpen(false)}
        />
      )}

      {/* Taskbar */}
      <div style={styles.taskbar}>
        <button
          style={{
            ...styles.startBtn,
            ...(startOpen ? styles.startBtnPressed : {}),
          }}
          onClick={() => setStartOpen(!startOpen)}
        >
          <div style={styles.startFlag}>
            <div style={{ ...styles.flagMini, background: '#FF0000' }} />
            <div style={{ ...styles.flagMini, background: '#00AA00' }} />
            <div style={{ ...styles.flagMini, background: '#0000FF' }} />
            <div style={{ ...styles.flagMini, background: '#FFAA00' }} />
          </div>
          <span style={styles.startLabel}>Start</span>
        </button>

        <div style={styles.divider} />

        {/* Task buttons */}
        <div style={styles.tasks}>
          {windows.filter(w => !w.closed).map((win) => (
            <button
              key={win.id}
              style={{
                ...styles.taskBtn,
                ...(win.minimized ? {} : styles.taskBtnActive),
              }}
              onClick={() => handleTaskClick(win)}
            >
              <span style={{ fontSize: '11px' }}>
                {({ about: '👤', projects: '📂', terminal: '💻', settings: '⚙️', browser: '🌐', minesweeper: '💣' })[win.appId] || '📄'}
              </span>
              <span style={styles.taskLabel}>
                {({ about: 'About Me', projects: 'Projects', terminal: 'Command Prompt', settings: 'Control Panel', browser: 'Internet Explorer', minesweeper: 'Sweeper of Mines' })[win.appId] || win.appId}
              </span>
            </button>
          ))}
        </div>

        {/* System tray */}
        <div style={styles.tray}>
          <span style={styles.trayIcon}>🔊</span>
          <span style={styles.trayTime}>{formatTime(time)}</span>
        </div>
      </div>
    </>
  )
}

const styles = {
  taskbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30px',
    background: '#c0c0c0',
    borderTop: '2px solid #fff',
    display: 'flex',
    alignItems: 'center',
    padding: '2px 2px',
    gap: '2px',
    zIndex: 9000,
  },
  startBtn: {
    height: '24px',
    padding: '0 6px',
    background: '#c0c0c0',
    border: '2px solid',
    borderColor: '#fff #404040 #404040 #fff',
    boxShadow: 'inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    fontFamily: "'Tahoma', sans-serif",
    fontSize: '11px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  startBtnPressed: {
    borderColor: '#404040 #fff #fff #404040',
    boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #dfdfdf',
  },
  startFlag: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1px',
    width: '14px',
    height: '14px',
  },
  flagMini: {
    borderRadius: '0.5px',
  },
  startLabel: {
    letterSpacing: '0.02em',
  },
  divider: {
    width: '1px',
    height: '20px',
    borderLeft: '1px solid #808080',
    borderRight: '1px solid #ffffff',
    margin: '0 1px',
  },
  tasks: {
    flex: 1,
    display: 'flex',
    gap: '2px',
    overflow: 'hidden',
  },
  taskBtn: {
    height: '22px',
    padding: '0 8px',
    background: '#c0c0c0',
    border: '2px solid',
    borderColor: '#fff #404040 #404040 #fff',
    boxShadow: 'inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    fontFamily: "'Tahoma', sans-serif",
    fontSize: '11px',
    maxWidth: '160px',
    overflow: 'hidden',
    flexShrink: 1,
  },
  taskBtnActive: {
    borderColor: '#404040 #fff #fff #404040',
    boxShadow: 'inset 1px 1px 0 #808080',
    background: 'repeating-conic-gradient(#c0c0c0 0% 25%, #ffffff 0% 50%) 50% / 2px 2px',
  },
  taskLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  tray: {
    height: '22px',
    padding: '0 8px',
    border: '1px solid',
    borderColor: '#808080 #fff #fff #808080',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
    marginLeft: 'auto',
  },
  trayIcon: {
    fontSize: '12px',
  },
  trayTime: {
    fontSize: '11px',
    fontVariantNumeric: 'tabular-nums',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 8999,
  },
  startMenu: {
    position: 'fixed',
    bottom: '30px',
    left: '2px',
    background: '#c0c0c0',
    border: '2px solid',
    borderColor: '#dfdfdf #404040 #404040 #dfdfdf',
    boxShadow: '2px 0 0 #000, 0 -2px 0 #000, 2px -2px 0 #000',
    display: 'flex',
    zIndex: 9001,
    minWidth: '200px',
  },
  startSidebar: {
    width: '24px',
    background: 'linear-gradient(to top, #000080, #1084d0)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '6px 0',
  },
  sidebarText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '14px',
    writingMode: 'vertical-lr',
    transform: 'rotate(180deg)',
    letterSpacing: '1px',
  },
  startItems: {
    flex: 1,
    padding: '3px 0',
  },
  startItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 20px 4px 8px',
    cursor: 'pointer',
    fontSize: '11px',
    color: '#000000',
  },
  startItemIcon: {
    fontSize: '20px',
    width: '24px',
    textAlign: 'center',
  },
  startItemLabel: {
    whiteSpace: 'nowrap',
  },
  startDivider: {
    height: '1px',
    margin: '3px 4px',
    borderTop: '1px solid #808080',
    borderBottom: '1px solid #ffffff',
  },
}
