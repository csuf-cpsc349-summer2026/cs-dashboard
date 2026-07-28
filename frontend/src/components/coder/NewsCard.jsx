import { useCachedFetch } from '../../hooks/useCachedFetch.js'
import { getTechNews } from '../../lib/api.js'

export default function NewsCard() {
  const { data, loading } = useCachedFetch('tech-news', getTechNews)
  const news = data ?? []

  if (loading) {
    return <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Loading...</p>
  }

  return (
    <ul className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden mt-2">
      {news.map((item, index) => (
        <li key={item.id}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 -mx-2 px-4 py-2 rounded-lg transition-colors"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--nested-bg)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <span
              className="font-semibold flex-shrink-0"
              style={{ fontSize: 'clamp(0.75rem, 2cqw, 0.9rem)', color: 'var(--text-muted)' }}
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <p
                className="leading-snug"
                style={{ fontSize: 'clamp(0.8rem, 2.2cqw, 1rem)', color: 'var(--text-primary)' }}
              >
                {item.title}
              </p>
              <span
                style={{ fontSize: 'clamp(0.65rem, 1.6cqw, 0.75rem)', color: 'var(--text-muted)' }}
              >
                {item.score} points by {item.by}
              </span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}
