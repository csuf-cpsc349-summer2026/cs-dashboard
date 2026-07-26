import { useState, useEffect } from 'react'
import { getDailyAlgoChallenge } from '../../lib/api.js'

const DIFFICULTY_COLORS = {
  Easy: { bg: '#E4F5F1', text: '#0F6E56' },
  Medium: { bg: '#FBE7DF', text: '#D85A30' },
  Hard: { bg: '#FDE8E8', text: '#C0392B' },
}

export default function AlgoChallengeCard() {
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDailyAlgoChallenge()
      .then(setChallenge)
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-xs text-gray-400 mt-2">Loading...</p>
  }

  if (!challenge) {
    return <p className="text-xs text-gray-400 mt-2">Couldn't load today's challenge.</p>
  }

  const colors = DIFFICULTY_COLORS[challenge.difficulty] ?? DIFFICULTY_COLORS.Medium

  return (
    <div className="flex-1 min-h-0 flex flex-col mt-2 overflow-y-auto">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {challenge.difficulty}
        </span>
        {challenge.source === 'mock' && (
          <span className="text-[11px] text-gray-400">Sample challenge</span>
        )}
      </div>

      <a
        href={challenge.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-gray-800 hover:text-gray-900 leading-snug"
      >
        {challenge.title}
      </a>

      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{challenge.description}</p>
    </div>
  )
}
