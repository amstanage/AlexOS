import { useState, useCallback, useEffect, useRef } from 'react'

const ROWS = 9
const COLS = 9
const MINES = 10
const CELL_SIZE = 24

const NUM_COLORS = {
  1: '#0000FF',
  2: '#008000',
  3: '#FF0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
}

function createEmptyGrid() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  )
}

function placeMines(grid, excludeR, excludeC) {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })))
  let placed = 0
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (!newGrid[r][c].mine && !(r === excludeR && c === excludeC)) {
      // Also exclude neighbors of first click
      const dr = Math.abs(r - excludeR)
      const dc = Math.abs(c - excludeC)
      if (dr <= 1 && dc <= 1) continue
      newGrid[r][c].mine = true
      placed++
    }
  }
  // Calculate adjacents
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (newGrid[r][c].mine) continue
      let count = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc].mine) {
            count++
          }
        }
      }
      newGrid[r][c].adjacent = count
    }
  }
  return newGrid
}

function revealCell(grid, r, c) {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })))
  const stack = [[r, c]]
  while (stack.length > 0) {
    const [cr, cc] = stack.pop()
    if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS) continue
    if (newGrid[cr][cc].revealed || newGrid[cr][cc].flagged) continue
    newGrid[cr][cc].revealed = true
    if (newGrid[cr][cc].adjacent === 0 && !newGrid[cr][cc].mine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          stack.push([cr + dr, cc + dc])
        }
      }
    }
  }
  return newGrid
}

function checkWin(grid) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!grid[r][c].mine && !grid[r][c].revealed) return false
    }
  }
  return true
}

export default function Minesweeper() {
  const [grid, setGrid] = useState(createEmptyGrid)
  const [gameState, setGameState] = useState('ready') // ready, playing, won, lost
  const [flagCount, setFlagCount] = useState(0)
  const [time, setTime] = useState(0)
  const [pressing, setPressing] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTime(t => Math.min(t + 1, 999))
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameState])

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setGrid(createEmptyGrid())
    setGameState('ready')
    setFlagCount(0)
    setTime(0)
  }, [])

  const handleClick = (r, c) => {
    if (gameState === 'won' || gameState === 'lost') return
    if (grid[r][c].flagged || grid[r][c].revealed) return

    let currentGrid = grid
    if (gameState === 'ready') {
      currentGrid = placeMines(grid, r, c)
      setGameState('playing')
    }

    if (currentGrid[r][c].mine) {
      // Game over — reveal all mines
      const lostGrid = currentGrid.map(row => row.map(cell => ({
        ...cell,
        revealed: cell.mine ? true : cell.revealed,
      })))
      lostGrid[r][c].exploded = true
      setGrid(lostGrid)
      setGameState('lost')
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    const newGrid = revealCell(currentGrid, r, c)
    setGrid(newGrid)
    if (checkWin(newGrid)) {
      setGameState('won')
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const handleRightClick = (e, r, c) => {
    e.preventDefault()
    if (gameState === 'won' || gameState === 'lost') return
    if (grid[r][c].revealed) return

    const newGrid = grid.map(row => row.map(cell => ({ ...cell })))
    newGrid[r][c].flagged = !newGrid[r][c].flagged
    setGrid(newGrid)
    setFlagCount(prev => newGrid[r][c].flagged ? prev + 1 : prev - 1)
  }

  const minesLeft = MINES - flagCount
  const face = gameState === 'lost' ? '😵' : gameState === 'won' ? '😎' : pressing ? '😮' : '🙂'

  const formatNum = (n) => String(Math.max(0, n)).padStart(3, '0')

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.counter}>{formatNum(minesLeft)}</div>
        <button style={styles.faceBtn} onClick={reset}>
          <span style={styles.face}>{face}</span>
        </button>
        <div style={styles.counter}>{formatNum(time)}</div>
      </div>

      {/* Grid */}
      <div
        style={styles.grid}
        onMouseDown={() => setPressing(true)}
        onMouseUp={() => setPressing(false)}
        onMouseLeave={() => setPressing(false)}
      >
        {grid.map((row, r) => (
          <div key={r} style={styles.row}>
            {row.map((cell, c) => {
              let content = ''
              let color = '#000'
              let bg = '#c0c0c0'
              let borderStyle = styles.cellRaised

              if (cell.revealed) {
                borderStyle = styles.cellFlat
                if (cell.mine) {
                  content = '💣'
                  if (cell.exploded) bg = '#ff0000'
                } else if (cell.adjacent > 0) {
                  content = cell.adjacent
                  color = NUM_COLORS[cell.adjacent] || '#000'
                }
              } else if (cell.flagged) {
                content = '🚩'
              }

              // Show wrong flags on game over
              if (gameState === 'lost' && cell.flagged && !cell.mine) {
                content = '❌'
                borderStyle = styles.cellFlat
              }

              return (
                <div
                  key={c}
                  style={{
                    ...styles.cell,
                    ...borderStyle,
                    background: bg,
                    color,
                    fontWeight: typeof content === 'number' ? 'bold' : 'normal',
                  }}
                  onClick={() => handleClick(r, c)}
                  onContextMenu={(e) => handleRightClick(e, r, c)}
                >
                  {content}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    background: '#c0c0c0',
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 6px',
    border: '2px solid',
    borderColor: '#808080 #fff #fff #808080',
    background: '#c0c0c0',
  },
  counter: {
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#ff0000',
    background: '#000000',
    padding: '2px 4px',
    minWidth: '52px',
    textAlign: 'center',
    letterSpacing: '2px',
    border: '1px solid',
    borderColor: '#808080 #fff #fff #808080',
  },
  faceBtn: {
    width: '30px',
    height: '30px',
    background: '#c0c0c0',
    border: '2px solid',
    borderColor: '#fff #404040 #404040 #fff',
    boxShadow: 'inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  face: {
    fontSize: '18px',
    lineHeight: 1,
  },
  grid: {
    border: '3px solid',
    borderColor: '#808080 #fff #fff #808080',
    display: 'inline-flex',
    flexDirection: 'column',
    alignSelf: 'center',
  },
  row: {
    display: 'flex',
  },
  cell: {
    width: `${CELL_SIZE}px`,
    height: `${CELL_SIZE}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: "'Tahoma', sans-serif",
    lineHeight: 1,
  },
  cellRaised: {
    border: '2px solid',
    borderColor: '#fff #808080 #808080 #fff',
  },
  cellFlat: {
    border: '1px solid #808080',
  },
}
