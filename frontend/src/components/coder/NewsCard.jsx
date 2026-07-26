import { useState, useEffect } from 'react'
import { getTechNews } from '../../lib/api.js'

export default function NewsCard() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTechNews()
      .then(setNews)
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }, [])

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
            className="text-sm text-gray-700 hover:text-gray-900 leading-snug block"
          >
            {item.title}
          </a>
          <span className="text-[11px] text-gray-400">
            {item.score} points by {item.by}
          </span>
        </li>
      ))}
    </ul>
  )
}
