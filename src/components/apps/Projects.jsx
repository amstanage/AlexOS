import { useState, useEffect } from 'react'

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  Swift: '#F05138',
  HTML: '#e34c26',
  Python: '#3572A5',
  C: '#555555',
}

export default function Projects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch('https://api.github.com/users/amstanage/repos?sort=updated&per_page=100')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(data => {
        setRepos(data.filter(r => !r.fork))
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div style={styles.container}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <span style={{ fontWeight: 'bold' }}>📂 My Projects</span>
        <span style={{ color: '#808080' }}>
          {loading ? 'Loading...' : `${repos.length} object(s)`}
        </span>
      </div>

      {/* Address bar */}
      <div style={styles.addressBar}>
        <span style={{ fontSize: '11px' }}>Address:</span>
        <div style={styles.addressField}>
          C:\Users\Alex\Projects\
        </div>
      </div>

      {/* File list */}
      <div style={styles.listContainer}>
        {/* Header */}
        <div style={styles.listHeader}>
          <span style={{ ...styles.listCol, flex: 2 }}>Name</span>
          <span style={styles.listCol}>Language</span>
          <span style={styles.listCol}>Description</span>
        </div>

        {error && (
          <div style={{ padding: '12px', color: '#ff0000' }}>
            Error: {error}
          </div>
        )}

        {loading && (
          <div style={{ padding: '12px' }}>Loading files...</div>
        )}

        <div style={styles.listBody}>
          {repos.map((repo) => (
            <div
              key={repo.id}
              style={{
                ...styles.listRow,
                background: selected === repo.id ? '#000080' : 'transparent',
                color: selected === repo.id ? '#ffffff' : '#000000',
              }}
              onClick={() => setSelected(repo.id)}
              onDoubleClick={() => window.open(repo.html_url, '_blank')}
            >
              <span style={{ ...styles.listCol, flex: 2, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '14px' }}>📁</span>
                {repo.name}
              </span>
              <span style={styles.listCol}>
                {repo.language && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: LANG_COLORS[repo.language] || '#808080',
                      display: 'inline-block',
                    }} />
                    {repo.language}
                  </span>
                )}
              </span>
              <span style={{ ...styles.listCol, color: selected === repo.id ? '#c0c0c0' : '#808080' }}>
                {repo.description || '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div style={styles.statusBar}>
        <span>{selected ? '1 object(s) selected' : `${repos.length} object(s)`}</span>
        <span>github.com/amstanage</span>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2px 6px',
    borderBottom: '1px solid #808080',
    fontSize: '11px',
  },
  addressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '2px 6px',
    borderBottom: '1px solid #808080',
  },
  addressField: {
    flex: 1,
    background: '#ffffff',
    border: '2px solid',
    borderColor: '#808080 #fff #fff #808080',
    padding: '1px 4px',
    fontSize: '11px',
    fontFamily: "'Tahoma', sans-serif",
  },
  listContainer: {
    flex: 1,
    background: '#ffffff',
    border: '2px solid',
    borderColor: '#808080 #fff #fff #808080',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  listHeader: {
    display: 'flex',
    padding: '2px 4px',
    background: '#c0c0c0',
    borderBottom: '2px solid',
    borderBottomColor: '#808080',
    fontSize: '11px',
    fontWeight: 'bold',
    gap: '2px',
  },
  listCol: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '0 4px',
    fontSize: '11px',
  },
  listBody: {
    flex: 1,
    overflow: 'auto',
  },
  listRow: {
    display: 'flex',
    padding: '1px 4px',
    cursor: 'pointer',
    gap: '2px',
    fontSize: '11px',
    alignItems: 'center',
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '2px 6px',
    borderTop: '2px solid',
    borderTopColor: '#808080',
    fontSize: '11px',
    color: '#000',
    background: '#c0c0c0',
  },
}
