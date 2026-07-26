import { useCachedFetch } from '../../hooks/useCachedFetch.js'
import { getTechNews } from '../../lib/api.js'

export default function NewsCard() {
  const { data, loading } = useCachedFetch('tech-news', getTechNews)
  const news = data ?? []

  if (loading) {
    return <p className="text-xs text-gray-400 mt-2">Loading...</p>
  }

  return (
    <ul className="flex-1 min-h-0 overflow-y-auto mt-2 space-y-2">
      {news.map((item) => (
        <li key={item.id}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 leading-snug block"
            style={{ fontSize: 'clamp(0.8rem, 2.2cqw, 1rem)' }}
          >
            {item.title}
          </a>
          <span className="text-gray-400" style={{ fontSize: 'clamp(0.65rem, 1.6cqw, 0.75rem)' }}>
            {item.score} points by {item.by}
          </span>
        </li>
      ))}
    </ul>
  )
}
