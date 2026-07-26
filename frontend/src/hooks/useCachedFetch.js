import { useEffect, useState } from 'react'
import { getCached, setCached } from '../lib/cache.js'

/** Generic session-cached fetch: instant render on a cache hit, no loading flicker on repeat visits. */
export function useCachedFetch(key, fetchFn) {
  const [data, setData] = useState(() => getCached(key))
  const [loading, setLoading] = useState(() => getCached(key) === undefined)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = getCached(key)
    if (cached !== undefined) {
      setData(cached)
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchFn()
      .then((result) => {
        if (cancelled) return
        setCached(key, result)
        setData(result)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [key])

  return { data, loading, error }
}
