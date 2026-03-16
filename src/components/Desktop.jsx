import { useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import Taskbar from './Taskbar'
import Window from './Window'
import DesktopIcon from './DesktopIcon'
import { useWindowManager } from '../hooks/useWindowManager'
import AboutMe from './apps/AboutMe'
import Projects from './apps/Projects'
import Terminal from './apps/Terminal'
import Settings from './apps/Settings'
import Browser from './apps/Browser'
import Minesweeper from './apps/Minesweeper'

const DESKTOP_ICONS = [
  { id: 'about', emoji: '👤', label: 'About Me' },
  { id: 'projects', emoji: '📂', label: 'Projects' },
  { id: 'terminal', emoji: '💻', label: 'Command Prompt' },
  { id: 'browser', emoji: '🌐', label: 'Internet Explorer' },
  { id: 'minesweeper', emoji: '💣', label: 'Sweeper of Mines' },
  { id: 'settings', emoji: '⚙️', label: 'Control Panel' },
]

const APP_COMPONENTS = {
  about: AboutMe,
  projects: Projects,
  terminal: Terminal,
  settings: Settings,
  browser: Browser,
  minesweeper: Minesweeper,
}

export default function Desktop() {
  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
  } = useWindowManager()

  const constraintsRef = useRef(null)

  return (
    <div style={styles.desktop}>
      {/* Desktop area */}
      <div
        ref={constraintsRef}
        style={styles.workspace}
        data-workspace
        onClick={() => {
          // Deselect icons when clicking desktop
          if (document.activeElement) document.activeElement.blur()
        }}
      >
        {/* Desktop icons — freely draggable */}
        {DESKTOP_ICONS.map((icon, i) => (
          <DesktopIcon
            key={icon.id}
            emoji={icon.emoji}
            label={icon.label}
            onClick={() => openWindow(icon.id)}
            initialX={10 + Math.floor(i / 6) * 80}
            initialY={10 + (i % 6) * 72}
            constraintsRef={constraintsRef}
          />
        ))}

        {/* Windows */}
        <AnimatePresence>
          {windows.map((win) => {
            const AppComponent = APP_COMPONENTS[win.appId]
            if (!AppComponent) return null
            return (
              <Window
                key={win.id}
                windowData={win}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
                onMaximize={maximizeWindow}
                onFocus={focusWindow}
                constraintsRef={constraintsRef}
              >
                <AppComponent openWindow={openWindow} {...(win.props || {})} />
              </Window>
            )
          })}
        </AnimatePresence>
      </div>

      <Taskbar
        windows={windows}
        openWindow={openWindow}
        focusWindow={focusWindow}
        minimizeWindow={minimizeWindow}
      />
    </div>
  )
}

const styles = {
  desktop: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  workspace: {
    position: 'absolute',
    inset: 0,
    bottom: '30px',
    background: '#008080',
    overflow: 'hidden',
  },
}
