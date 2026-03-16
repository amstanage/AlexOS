const SOCIAL_LINKS = [
  { label: 'GitHub', emoji: '🐙', url: 'https://github.com/amstanage' },
  { label: 'Instagram', emoji: '📸', url: 'https://instagram.com/lts.aiex' },
  { label: 'LinkedIn', emoji: '💼', url: 'https://linkedin.com' },
]

export default function AboutMe({ openWindow }) {
  return (
    <div style={styles.container}>
      {/* Header with icon */}
      <div style={styles.header}>
        <div style={styles.avatar}>
          <span style={styles.avatarEmoji}>👨‍💻</span>
        </div>
        <div>
          <div style={styles.name}>Alex Stanage</div>
          <div style={styles.role}>Developer & Creator</div>
        </div>
      </div>

      {/* Bio group box */}
      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>About</legend>
        <p style={styles.bioText}>
          Welcome to AlexOS 98 — my personal corner of the internet,
          reimagined as an operating system. I build things for the web
          and love crafting experiences that feel alive.
        </p>
      </fieldset>

      {/* Stats */}
      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Stats</legend>
        <div style={styles.stats}>
          {[
            { label: 'Projects', value: '12+' },
            { label: 'Coffees', value: '∞' },
            { label: 'Lines of Code', value: '50k+' },
          ].map((stat, i) => (
            <div key={i} style={styles.stat}>
              <span style={styles.statValue}>{stat.value}</span>
              <span style={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </fieldset>

      {/* Links */}
      <div style={styles.links}>
        {SOCIAL_LINKS.map((link, i) => (
          <button
            key={i}
            style={styles.linkButton}
            onClick={() => openWindow('browser', { initialUrl: link.url })}
          >
            <span>{link.emoji}</span> {link.label}
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    height: '100%',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    background: '#ffffff',
    border: '2px solid',
    borderColor: '#808080 #fff #fff #808080',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: '28px',
  },
  name: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  role: {
    fontSize: '11px',
    color: '#000080',
  },
  fieldset: {
    border: '2px groove #c0c0c0',
    padding: '8px 10px',
    margin: 0,
  },
  legend: {
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '0 4px',
  },
  bioText: {
    fontSize: '11px',
    lineHeight: 1.6,
    margin: 0,
  },
  stats: {
    display: 'flex',
    gap: '8px',
  },
  stat: {
    flex: 1,
    textAlign: 'center',
    padding: '6px',
    background: '#ffffff',
    border: '2px solid',
    borderColor: '#808080 #fff #fff #808080',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#000080',
  },
  statLabel: {
    fontSize: '10px',
    color: '#808080',
  },
  links: {
    display: 'flex',
    gap: '6px',
  },
  linkButton: {
    flex: 1,
    padding: '6px 8px',
    background: '#c0c0c0',
    border: '2px solid',
    borderColor: '#fff #404040 #404040 #fff',
    boxShadow: 'inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf',
    textAlign: 'center',
    fontSize: '11px',
    cursor: 'pointer',
    fontFamily: "'Tahoma', sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
}
