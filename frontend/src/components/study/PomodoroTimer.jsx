import { useState, useEffect, useRef } from 'react'

const DURATIONS = { work: 25 * 60, short: 5 * 60, long: 15 * 60 }
const MODE_LABELS = { work: 'Work', short: 'Short Break', long: 'Long Break' }

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState('work')
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.work)
  const [isRunning, setIsRunning] = useState(false)
  const workSessionsRef = useRef(0)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    if (secondsLeft !== 0 || !isRunning) return

    setIsRunning(false)

    if (mode === 'work') {
      workSessionsRef.current += 1
      const nextMode = workSessionsRef.current % 4 === 0 ? 'long' : 'short'
      setMode(nextMode)
      setSecondsLeft(DURATIONS[nextMode])
    } else {
      setMode('work')
      setSecondsLeft(DURATIONS.work)
    }
  }, [secondsLeft, isRunning, mode])

  function switchMode(newMode) {
    setIsRunning(false)
    setMode(newMode)
    setSecondsLeft(DURATIONS[newMode])
  }

  function reset() {
    setIsRunning(false)
    setSecondsLeft(DURATIONS[mode])
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center">
      <div className="flex gap-1.5 mb-4">
        {Object.entries(MODE_LABELS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => switchMode(key)}
            className="text-[11px] font-medium px-2 py-1 rounded-full transition-colors"
            style={
              mode === key
                ? { backgroundColor: 'var(--accent-color)', color: 'white' }
                : { backgroundColor: '#F3F4F6', color: '#6B7280' }
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className="text-4xl font-semibold text-gray-800 tabular-nums mb-4">
        {formatTime(secondsLeft)}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsRunning((r) => !r)}
          className="text-xs font-medium text-white rounded-lg px-4 py-1.5"
          style={{ backgroundColor: 'var(--accent-color)' }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
