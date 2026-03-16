import { useState } from 'react'

const WALLPAPERS = [
  { name: 'Teal (Default)', color: '#008080' },
  { name: 'Forest', color: '#004040' },
  { name: 'Navy', color: '#000080' },
  { name: 'Plum', color: '#800080' },
  { name: 'Slate', color: '#606080' },
  { name: 'Black', color: '#000000' },
]

export default function Settings() {
  const [selectedWall, setSelectedWall] = useState(0)

  const applyWallpaper = (index) => {
    setSelectedWall(index)
    const workspace = document.querySelector('[data-workspace]')
    if (workspace) {
      workspace.style.background = WALLPAPERS[index].color
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.tabs}>
        <div style={styles.tabActive}>Display</div>
        <div style={styles.tab}>System</div>
      </div>

      <div style={styles.body}>
        {/* Wallpaper preview */}
        <fieldset style={styles.fieldset}>
          <legend>Desktop Background</legend>
          <div style={styles.preview}>
            <div style={{
              ...styles.previewScreen,
              background: WALLPAPERS[selectedWall].color,
            }}>
              <div style={styles.previewTaskbar} />
            </div>
          </div>

          <div style={styles.wallpaperList}>
            {WALLPAPERS.map((wp, i) => (
              <div
                key={i}
                style={{
                  ...styles.wallpaperItem,
                  background: selectedWall === i ? '#000080' : 'transparent',
                  color: selectedWall === i ? '#ffffff' : '#000000',
                }}
                onClick={() => applyWallpaper(i)}
              >
                <span style={{
                  width: '12px',
                  height: '12px',
                  background: wp.color,
                  border: '1px solid #808080',
                  display: 'inline-block',
                  marginRight: '6px',
                  verticalAlign: 'middle',
                }} />
                {wp.name}
              </div>
            ))}
          </div>
        </fieldset>

        {/* System info */}
        <fieldset style={styles.fieldset}>
          <legend>System</legend>
          <div style={styles.infoGrid}>
            <span style={styles.infoLabel}>Version:</span>
            <span>AlexOS 98 SE</span>
            <span style={styles.infoLabel}>Engine:</span>
            <span>React + Vite</span>
            <span style={styles.infoLabel}>Animation:</span>
            <span>Framer Motion</span>
            <span style={styles.infoLabel}>Processor:</span>
            <span>Pentium III 450MHz</span>
          </div>
        </fieldset>

        {/* Buttons */}
        <div style={styles.buttons}>
          <button style={styles.btn}>OK</button>
          <button style={styles.btn}>Cancel</button>
          <button style={styles.btn}>Apply</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '4px',
  },
  tabs: {
    display: 'flex',
    gap: '0',
    paddingLeft: '4px',
  },
  tabActive: {
    padding: '3px 12px',
    background: '#c0c0c0',
    border: '2px solid',
    borderColor: '#fff #404040 #c0c0c0 #fff',
    borderBottom: 'none',
    fontSize: '11px',
    fontWeight: 'bold',
    position: 'relative',
    top: '2px',
    zIndex: 1,
    cursor: 'pointer',
  },
  tab: {
    padding: '3px 12px',
    background: '#b0b0b0',
    border: '2px solid',
    borderColor: '#fff #404040 #404040 #fff',
    borderBottom: 'none',
    fontSize: '11px',
    position: 'relative',
    top: '2px',
    cursor: 'pointer',
  },
  body: {
    flex: 1,
    border: '2px solid',
    borderColor: '#fff #404040 #404040 #fff',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflow: 'auto',
  },
  fieldset: {
    border: '2px groove #c0c0c0',
    padding: '8px',
    margin: 0,
    fontSize: '11px',
  },
  preview: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '6px',
  },
  previewScreen: {
    width: '140px',
    height: '90px',
    border: '2px solid #404040',
    position: 'relative',
  },
  previewTaskbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '8px',
    background: '#c0c0c0',
    borderTop: '1px solid #fff',
  },
  wallpaperList: {
    background: '#ffffff',
    border: '2px solid',
    borderColor: '#808080 #fff #fff #808080',
    maxHeight: '70px',
    overflow: 'auto',
  },
  wallpaperItem: {
    padding: '1px 4px',
    cursor: 'pointer',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '2px 10px',
    fontSize: '11px',
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '4px',
    marginTop: 'auto',
  },
  btn: {
    padding: '3px 16px',
    background: '#c0c0c0',
    border: '2px solid',
    borderColor: '#fff #404040 #404040 #fff',
    boxShadow: 'inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf',
    cursor: 'pointer',
    fontSize: '11px',
    fontFamily: "'Tahoma', sans-serif",
    minWidth: '64px',
  },
}
