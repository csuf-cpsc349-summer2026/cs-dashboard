import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'

const STEP_COUNT = 4
const PRIMARY_LABELS = ['Get started', 'Next', 'Next', 'Finish']

export default function Onboarding() {
  const { user, profile, profileLoading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [city, setCity] = useState('')
  const [canvasField, setCanvasField] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!profileLoading && profile?.onboardingComplete) {
      navigate('/', { replace: true });
    }
  }, [profileLoading, profile, navigate]);

  if (profileLoading || profile?.onboardingComplete) {
    return <LoadingScreen />
  }

  async function handleFinish() {
    setSaving(true)
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          city: city.trim(),
          canvasMockUser: canvasField.trim(),
          onboardingComplete: true,
        },
        { merge: true },
      )
      navigate('/')
    } catch (error) {
      console.error(error)
      setSaving(false)
    }
  }

  function handlePrimary() {
    if (step < STEP_COUNT - 1) {
      setStep((s) => s + 1)
    } else {
      handleFinish()
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#F7F8FA' }}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm"
        style={{ padding: '48px 40px' }}
      >
        <ProgressDots step={step} />

        {step === 0 && <StepWelcome />}
        {step === 1 && <StepLocation city={city} setCity={setCity} />}
        {step === 2 && <StepCanvas canvasField={canvasField} setCanvasField={setCanvasField} />}
        {step === 3 && <StepMusic />}

        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className={`text-sm text-gray-500 hover:text-gray-700 transition-colors ${step === 0 ? 'invisible' : ''}`}
          >
            Back
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handlePrimary}
            className="rounded-lg text-sm font-medium text-white px-5 py-2.5 disabled:opacity-60"
            style={{ backgroundColor: 'var(--accent-color)' }}
          >
            {step === STEP_COUNT - 1 && saving ? 'Saving...' : PRIMARY_LABELS[step]}
          </button>
        </div>
      </div>
    </div>
  )
}

function ProgressDots({ step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: STEP_COUNT }).map((_, i) => (
        <span
          key={i}
          className="block w-2 h-2 rounded-full"
          style={{ backgroundColor: i === step ? 'var(--accent-color)' : '#E5E7EB' }}
        />
      ))}
    </div>
  )
}

function StepWelcome() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
        {'{'}
        <span style={{ color: 'var(--accent-color)' }}>Welcome</span>
        {'}'}
      </h1>
      <p className="text-sm text-gray-500">
        Let's set up ByteBoard for you.
      </p>
      <p className="text-sm text-gray-500">
        We'll ask for a few quick things to personalize your dashboard.
      </p>
    </div>
  )
}

function StepLocation({ city, setCity }) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Where's your campus?</h2>
      <p className="text-sm text-gray-500 mb-4">
        Whether you're living in a dorm or commuting in, we'll show campus weather so you know how to prepare.
      </p>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none"
      />
    </div>
  )
}

function StepCanvas({ canvasField, setCanvasField }) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Canvas</h2>
      <p className="text-sm text-gray-500 mb-4">
        Generate a token from Canvas under Account &rarr; Settings &rarr; New Access Token, then paste it below.
      </p>
      <input
        type="text"
        value={canvasField}
        onChange={(e) => setCanvasField(e.target.value)}
        placeholder="e.g. 7~AbCd1234..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none"
      />
      <p className="text-xs text-gray-400 mt-2">
        Testing the app? Type <code className="px-1 py-0.5 rounded bg-gray-100 text-gray-600">test</code>,{' '}
        <code className="px-1 py-0.5 rounded bg-gray-100 text-gray-600">jordan</code>, or{' '}
        <code className="px-1 py-0.5 rounded bg-gray-100 text-gray-600">alex</code> to load sample data.
      </p>
    </div>
  )
}

function StepMusic() {
  return (
    <div className="text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: '#E4F5F1' }}
      >
        <i className="ti ti-brand-spotify" style={{ fontSize: '50px', color: '#0F6E56' }} aria-hidden="true"></i>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Music, coming soon</h2>
      <p className="text-sm text-gray-500 mb-4">
        Spotify integration is on the way. For now, you'll get a lofi stream to vibe with on the Study page.
      </p>
      <span
        className="inline-block text-xs font-medium px-2.5 py-1 rounded-full"
        style={{ backgroundColor: '#FBE7DF', color: '#D85A30' }}
      >
        Coming soon
      </span>
    </div>
  )
}