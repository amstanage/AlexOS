import { useState, useRef, useEffect } from 'react'

const COMMANDS = {
  help: () => [
    'Available commands:',
    '  help        Show this help message',
    '  about       About AlexOS',
    '  whoami      Who are you?',
    '  ls          List files',
    '  dir         List files (alias)',
    '  date        Current date and time',
    '  echo <msg>  Echo a message',
    '  ver         System version',
    '  cls         Clear screen',
    '',
  ],
  about: () => ['', 'AlexOS 98 [Version 4.0.1998]', 'A personal operating system experience.', 'Built with React + Vite.', ''],
  whoami: () => ['', 'C:\\Users\\Alex', ''],
  ls: () => ['', ' Volume in drive C has no label.', ' Directory of C:\\Users\\Alex', '', '  <DIR>  Desktop', '  <DIR>  Documents', '  <DIR>  Projects', '  <DIR>  Music', '  <DIR>  .config', '      5 Dir(s)  2,048,000 bytes free', ''],
  dir: () => COMMANDS.ls(),
  date: () => ['', 'Current date is ' + new Date().toLocaleDateString(), 'Current time is ' + new Date().toLocaleTimeString(), ''],
  ver: () => ['', 'AlexOS 98 [Version 4.0.1998]', ''],
}

export default function Terminal() {
  const [history, setHistory] = useState([
    { type: 'output', lines: ['AlexOS 98 [Version 4.0.1998]', '(C) Copyright AlexOS Corp 1981-1998.', ''] },
  ])
  const [input, setInput] = useState('')
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [history])

  const handleSubmit = (e) => {
    e.preventDefault()
    const cmd = input.trim().toLowerCase()
    const newHistory = [...history, { type: 'input', text: input }]

    if (cmd === 'cls' || cmd === 'clear') {
      setHistory([])
      setInput('')
      return
    }

    if (cmd.startsWith('echo ')) {
      newHistory.push({ type: 'output', lines: ['', input.slice(5), ''] })
    } else if (COMMANDS[cmd]) {
      newHistory.push({ type: 'output', lines: COMMANDS[cmd]() })
    } else if (cmd) {
      newHistory.push({ type: 'output', lines: [`'${cmd}' is not recognized as an internal or external command,`, 'operable program or batch file.', ''] })
    }

    setHistory(newHistory)
    setInput('')
  }

  return (
    <div
      style={styles.container}
      onClick={() => inputRef.current?.focus()}
    >
      <div style={styles.output}>
        {history.map((entry, i) => (
          <div key={i}>
            {entry.type === 'input' ? (
              <div style={styles.inputLine}>
                <span>C:\Users\Alex&gt;</span>
                <span>{entry.text}</span>
              </div>
            ) : (
              entry.lines.map((line, j) => (
                <div key={j} style={styles.line}>{line || '\u00A0'}</div>
              ))
            )}
          </div>
        ))}
        <form onSubmit={handleSubmit} style={styles.inputLine}>
          <span>C:\Users\Alex&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>
        <div ref={endRef} />
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100%',
    background: '#000000',
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    fontSize: '13px',
    lineHeight: 1.4,
    color: '#c0c0c0',
    cursor: 'text',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  output: {
    flex: 1,
    overflow: 'auto',
    padding: '4px 6px',
  },
  line: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  inputLine: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'pre',
  },
  input: {
    background: 'none',
    border: 'none',
    color: '#c0c0c0',
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    fontSize: '13px',
    outline: 'none',
    flex: 1,
    caretColor: '#c0c0c0',
    padding: 0,
  },
}
