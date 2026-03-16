import { useState, useRef, useCallback, useEffect } from 'react'

const BOOKMARKS = [
  { name: 'Google', url: 'https://www.google.com/webhp?igu=1', emoji: '🔍' },
  { name: 'Wikipedia', url: 'https://en.m.wikipedia.org/wiki/Main_Page', emoji: '📖' },
  { name: 'GitHub', url: 'https://github.com/amstanage', emoji: '🐙' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', emoji: '🗞️' },
]

const BLOCKED_SITES = [
  'twitter.com', 'x.com', 'facebook.com', 'instagram.com',
  'reddit.com', 'linkedin.com', 'tiktok.com', 'twitch.tv', 'discord.com',
  'netflix.com', 'spotify.com', 'amazon.com', 'apple.com',
]

function tryRewriteUrl(url) {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const videoId = u.searchParams.get('v')
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`
      const shortsMatch = u.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]+)/)
      if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1`
      if (u.pathname.startsWith('/embed/')) return url
      return null
    }
    if (host === 'youtu.be') {
      const videoId = u.pathname.slice(1)
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`
      return null
    }
    return url
  } catch { return url }
}

function normalizeUrl(input) {
  let url = input.trim()
  if (!url) return ''
  if (!/^https?:\/\//i.test(url)) {
    if (url.includes('.') && !url.includes(' ')) {
      url = 'https://' + url
    } else {
      url = 'https://www.google.com/search?igu=1&q=' + encodeURIComponent(url)
    }
  }
  return url
}

function isLikelyBlocked(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '')
    return BLOCKED_SITES.some(site => hostname === site || hostname.endsWith('.' + site))
  } catch { return false }
}

function getDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') }
  catch { return url }
}

export default function Browser({ initialUrl }) {
  const [displayUrl, setDisplayUrl] = useState('')
  const [activeUrl, setActiveUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const iframeRef = useRef(null)
  const timeoutRef = useRef(null)
  const didInit = useRef(false)

  const navigateTo = useCallback((url) => {
    const normalized = normalizeUrl(url)
    if (!normalized) return
    setBlocked(false)
    setLoading(true)
    const rewritten = tryRewriteUrl(normalized)
    const finalUrl = rewritten || normalized
    const isBlocked = rewritten === null || isLikelyBlocked(finalUrl)
    if (isBlocked) { setBlocked(true); setLoading(false) }
    setActiveUrl(finalUrl)
    setDisplayUrl(normalized.replace(/^https?:\/\//, ''))
    setHistory(prev => [...prev.slice(0, historyIndex + 1), finalUrl])
    setHistoryIndex(prev => prev + 1)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (!isBlocked) {
      timeoutRef.current = setTimeout(() => {
        setLoading(prev => { if (prev) setBlocked(true); return false })
      }, 8000)
    }
  }, [historyIndex])

  useEffect(() => {
    if (initialUrl && !didInit.current) {
      didInit.current = true
      setTimeout(() => navigateTo(initialUrl), 50)
    }
  }, [initialUrl])

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  const goBack = () => {
    setBlocked(false)
    if (historyIndex <= 0) { setActiveUrl(null); setDisplayUrl(''); setHistoryIndex(-1); return }
    const i = historyIndex - 1
    setHistoryIndex(i); setActiveUrl(history[i]); setDisplayUrl(history[i].replace(/^https?:\/\//, '')); setLoading(true)
  }
  const goForward = () => {
    if (historyIndex >= history.length - 1) return
    setBlocked(false)
    const i = historyIndex + 1
    setHistoryIndex(i); setActiveUrl(history[i]); setDisplayUrl(history[i].replace(/^https?:\/\//, '')); setLoading(true)
  }
  const goHome = () => { setActiveUrl(null); setDisplayUrl(''); setBlocked(false) }
  const openExternal = () => { if (activeUrl) window.open(activeUrl, '_blank', 'noopener,noreferrer') }
  const handleSubmit = (e) => { e.preventDefault(); navigateTo(displayUrl) }

  return (
    <div style={styles.container}>
      {/* IE Toolbar */}
      <div style={styles.toolbar}>
        <button style={styles.navBtn} onClick={goBack}>◀</button>
        <button style={styles.navBtn} onClick={goForward}>▶</button>
        <button style={styles.navBtn} onClick={goHome}>🏠</button>
        {activeUrl && <button style={styles.navBtn} onClick={openExternal}>↗</button>}
      </div>

      {/* Address bar */}
      <div style={styles.addressBar}>
        <span style={styles.addressLabel}>Address</span>
        <form onSubmit={handleSubmit} style={styles.addressForm}>
          <input
            value={displayUrl}
            onChange={(e) => setDisplayUrl(e.target.value)}
            placeholder="http://"
            style={styles.addressInput}
            spellCheck={false}
          />
        </form>
        <button style={styles.goBtn} onClick={() => navigateTo(displayUrl)}>Go</button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {!activeUrl ? (
          <div style={styles.homePage}>
            <div style={styles.homeTitle}>
              <span style={{ fontSize: '24px' }}>🌐</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Internet Explorer</span>
            </div>
            <p style={styles.homeSubtitle}>Welcome to AlexOS 98 Internet Explorer</p>
            <div style={styles.homeLinks}>
              {BOOKMARKS.map((bm) => (
                <div
                  key={bm.name}
                  style={styles.homeLink}
                  onClick={() => navigateTo(bm.url)}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#000080'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span>{bm.emoji}</span>
                  <span style={styles.homeLinkText}>{bm.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {!blocked && (
              <iframe
                ref={iframeRef}
                src={activeUrl}
                style={styles.iframe}
                title="Browser"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                onLoad={() => { setLoading(false); if (timeoutRef.current) clearTimeout(timeoutRef.current) }}
              />
            )}
            {blocked && (
              <div style={styles.blockedPage}>
                <div style={styles.blockedIcon}>⚠️</div>
                <div style={styles.blockedTitle}>This page cannot be displayed</div>
                <p style={styles.blockedText}>
                  The page at <b>{getDomain(activeUrl)}</b> has refused the connection.
                </p>
                <div style={styles.blockedButtons}>
                  <button style={styles.btn} onClick={openExternal}>Open in New Window</button>
                  <button style={styles.btn} onClick={goHome}>Home</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={styles.statusBar}>
        <span>{loading ? '⏳ Loading...' : blocked ? '⚠️ Page blocked' : activeUrl ? '✅ Done' : 'Ready'}</span>
        <span>🌐 Internet</span>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#c0c0c0',
  },
  toolbar: {
    display: 'flex',
    gap: '2px',
    padding: '2px 4px',
    borderBottom: '1px solid #808080',
  },
  navBtn: {
    padding: '2px 8px',
    background: '#c0c0c0',
    border: '2px solid',
    borderColor: '#fff #404040 #404040 #fff',
    boxShadow: 'inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf',
    cursor: 'pointer',
    fontSize: '11px',
    fontFamily: "'Tahoma', sans-serif",
  },
  addressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 4px',
    borderBottom: '1px solid #808080',
  },
  addressLabel: {
    fontSize: '11px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  addressForm: {
    flex: 1,
    display: 'flex',
  },
  addressInput: {
    width: '100%',
    background: '#ffffff',
    border: '2px solid',
    borderColor: '#808080 #fff #fff #808080',
    padding: '1px 4px',
    fontSize: '11px',
    fontFamily: "'Tahoma', sans-serif",
    outline: 'none',
  },
  goBtn: {
    padding: '1px 12px',
    background: '#c0c0c0',
    border: '2px solid',
    borderColor: '#fff #404040 #404040 #fff',
    boxShadow: 'inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf',
    cursor: 'pointer',
    fontSize: '11px',
    fontFamily: "'Tahoma', sans-serif",
    fontWeight: 'bold',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    background: '#ffffff',
    position: 'relative',
  },
  homePage: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  homeTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  homeSubtitle: {
    fontSize: '11px',
    color: '#808080',
    marginBottom: '16px',
  },
  homeLinks: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  homeLink: {
    padding: '8px 12px',
    border: '1px solid #c0c0c0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
  },
  homeLinkText: {
    textDecoration: 'underline',
    color: '#0000FF',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    background: '#ffffff',
  },
  blockedPage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '30px',
    textAlign: 'center',
    gap: '8px',
  },
  blockedIcon: {
    fontSize: '36px',
  },
  blockedTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  blockedText: {
    fontSize: '11px',
    color: '#404040',
    maxWidth: '300px',
    lineHeight: 1.5,
  },
  blockedButtons: {
    display: 'flex',
    gap: '6px',
    marginTop: '10px',
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
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '2px 6px',
    borderTop: '2px solid',
    borderTopColor: '#808080',
    fontSize: '11px',
    background: '#c0c0c0',
  },
}
