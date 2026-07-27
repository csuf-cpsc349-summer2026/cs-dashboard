import { useCachedFetch } from '../../hooks/useCachedFetch.js'
import { getTechNews } from '../../lib/api.js'

export default function NewsCard() {
  const { data, loading } = useCachedFetch('tech-news', getTechNews)
  const news = data ?? []

  if (loading) {
    return <p className="text-xs text-gray-400 mt-2">Loading...</p>
  }

  return (
    <ul className="flex-1 min-h-0 overflow-y-auto mt-2 -mx-2">
      {news.map((item, index) => (
        <li key={item.id}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span
              className="text-gray-300 font-semibold flex-shrink-0"
              style={{ fontSize: 'clamp(0.75rem, 2cqw, 0.9rem)' }}
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <p
                className="text-gray-700 leading-snug"
                style={{ fontSize: 'clamp(0.8rem, 2.2cqw, 1rem)' }}
              >
                {item.title}
              </p>
              <span
                className="text-gray-400"
                style={{ fontSize: 'clamp(0.65rem, 1.6cqw, 0.75rem)' }}
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
