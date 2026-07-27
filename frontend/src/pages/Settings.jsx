import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import Card from '../components/Card.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { db } from '../lib/firebase.js'
import { resolveAccentColor } from '../lib/theme.js'

const PRESET_LIST = [
  { key: 'indigo', label: 'Indigo' },
  { key: 'teal', label: 'Teal' },
  { key: 'coral', label: 'Coral' },
  { key: 'slate', label: 'Slate' },
]

function SaveButton() {
  return (
    <button
      type="button"
      className="flex-shrink-0 rounded-lg text-sm font-medium text-white px-4 py-2"
      style={{ backgroundColor: 'var(--accent-color)' }}
    >
      Save
    </button>
  )
}

function WeatherLocationCard() {
  const { user, profile } = useAuth()
  const [city, setCity] = useState(profile?.city ?? '')
  const [status, setStatus] = useState('idle') // 'idle' | 'saving' | 'saved'

  async function handleSave() {
    setStatus('saving')
    try {
      await setDoc(doc(db, 'users', user.uid), { city }, { merge: true })
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 1500)
    } catch (error) {
      console.error(error)
      setStatus('idle')
    }
  }

  const label = status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved' : 'Save'

  return (
    <Card label="Weather location">
      <p className="text-sm text-gray-500 mt-2">
        Used to show local weather on your dashboard.
      </p>
      <div className="flex gap-3 mt-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none"
        />
        <button
          type="button"
          disabled={status === 'saving'}
          onClick={handleSave}
          className="flex-shrink-0 rounded-lg text-sm font-medium text-white px-4 py-2 disabled:opacity-60"
          style={{ backgroundColor: 'var(--accent-color)' }}
        >
          {label}
        </button>
      </div>
    </Card>
  )
}

function AppearanceCard() {
  const { user, profile } = useAuth()
  const [preset, setPreset] = useState(profile?.accentPreset ?? 'indigo')
  const [mode, setMode] = useState(profile?.colorMode ?? 'light')
  const isDark = mode === 'dark'

  function applyTheme(nextPreset, nextMode) {
    document.documentElement.classList.toggle('dark', nextMode === 'dark')
    document.documentElement.style.setProperty(
      '--accent-color',
      resolveAccentColor(nextPreset, nextMode),
    )
  }

  function handleSwatchClick(presetKey) {
    setPreset(presetKey)
    applyTheme(presetKey, mode)
    setDoc(doc(db, 'users', user.uid), { accentPreset: presetKey }, { merge: true })
  }

  function handleToggle() {
    const nextMode = isDark ? 'light' : 'dark'
    setMode(nextMode)
    applyTheme(preset, nextMode)
    setDoc(doc(db, 'users', user.uid), { colorMode: nextMode }, { merge: true })
  }

  return (
    <Card label="Appearance">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2 text-center">
        Color
      </p>
      <div className="flex justify-center gap-6 mt-3">
        {PRESET_LIST.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleSwatchClick(key)}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="block rounded-full"
              style={{
                width: 40,
                height: 40,
                backgroundColor: resolveAccentColor(key, mode),
                boxShadow: preset === key
                  ? '0 0 0 2px var(--card-bg), 0 0 0 4px var(--accent-color)'
                  : 'none',
              }}
            />
            <span className="text-xs text-gray-500">{label}</span>
          </button>
        ))}
      </div>

      <div
        className="mt-6 pt-5 flex justify-center"
        style={{ borderTop: '1px solid var(--card-border)' }}
      >
        <ModeToggle isDark={isDark} onToggle={handleToggle} />
      </div>
    </Card>
  )
}

function ModeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex-shrink-0"
      style={{ width: 64, height: 30, borderRadius: 15, backgroundColor: 'var(--card-border)' }}
    >
      <span
        className="absolute top-0 left-0 flex items-center justify-center transition-transform duration-150"
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          backgroundColor: isDark ? '#1E1F24' : '#FFFFFF',
          transform: isDark ? 'translateX(34px)' : 'translateX(0)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
        }}
      >
        {isDark ? <ToggleMoonIcon /> : <ToggleSunIcon />}
      </span>
    </button>
  )
}

/** Same visual style as the SunIcon used on Home's Weather card. */
function ToggleSunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function ToggleMoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#CBD5E1" width="16" height="16" aria-hidden="true">
      <path d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 1 0 20.354 15.354z" />
    </svg>
  )
}

export default function Settings() {
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
        <WeatherLocationCard />

        <Card
          label="Canvas access"
          headerRight={
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
              Token saved
            </span>
          }
        >
          <p className="text-sm text-gray-500 mt-2">
            Paste your Canvas API token, generated from Canvas under Account &rarr; Settings &rarr; New Access Token.
          </p>
          <div className="flex gap-3 mt-4">
            <input
              type="password"
              placeholder="••••••••••••••••"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none"
            />
            <SaveButton />
          </div>
        </Card>

        <AppearanceCard />
      </div>
    </div>
  )
}
