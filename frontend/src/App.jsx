import { useEffect, useState } from 'react'
import { getWeather, getCanvasTasks, getGitHubActivity } from './lib/api.js'

function ResultBlock({ title, status, data }) {
  return (
    <section>
      <h2>{title}</h2>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'error' && <p>Failed to load.</p>}
      {status === 'ready' && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </section>
  )
}

export default function App() {
  const [weather, setWeather] = useState({ status: 'loading', data: null })
  const [canvas, setCanvas] = useState({ status: 'loading', data: null })
  const [github, setGithub] = useState({ status: 'loading', data: null })

  useEffect(() => {
    getWeather()
      .then((data) => setWeather({ status: 'ready', data }))
      .catch(() => setWeather({ status: 'error', data: null }))

    getCanvasTasks()
      .then((data) => setCanvas({ status: 'ready', data }))
      .catch(() => setCanvas({ status: 'error', data: null }))

    getGitHubActivity()
      .then((data) => setGithub({ status: 'ready', data }))
      .catch(() => setGithub({ status: 'error', data: null }))
  }, [])

  return (
    <main>
      <h1>CS Productivity Dashboard</h1>
      <p>Integration checkpoint: one live source, two mocked sources.</p>

      <ResultBlock title="Open-Meteo (live)" status={weather.status} data={weather.data} />
      <ResultBlock title="Canvas LMS (mocked)" status={canvas.status} data={canvas.data} />
      <ResultBlock title="GitHub Activity (mocked)" status={github.status} data={github.data} />
    </main>
  )
}
