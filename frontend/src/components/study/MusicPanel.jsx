import { useRef, useState } from 'react'

const LOFI_EMBED_URL = 'https://www.youtube.com/embed/n61ULEU7CO0?modestbranding=1&rel=0&enablejsapi=1'

export default function MusicPanel() {
  const iframeRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  function togglePlay() {
    const command = isPlaying ? 'pauseVideo' : 'playVideo'
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: command, args: [] }),
      'https://www.youtube.com',
    )
    setIsPlaying((p) => !p)
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      <div className="flex-1 min-h-0 flex items-center gap-3 bg-gray-900 rounded-xl p-3">
        <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-black">
          <iframe
            ref={iframeRef}
            src={LOFI_EMBED_URL}
            title="Lofi study stream"
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">Lofi Study Radio</p>
          <p className="text-xs text-gray-400">Live stream &middot; 24/7</p>
        </div>
        <button
          type="button"
          onClick={togglePlay}
          className="text-xs font-semibold text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--accent-color)' }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
      </div>

      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ backgroundColor: '#FBE7DF' }}
      >
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ backgroundColor: '#D85A30', color: 'white' }}
        >
          Coming soon
        </span>
        <span className="text-sm font-medium" style={{ color: '#D85A30' }}>
          Spotify integration
        </span>
      </div>
    </div>
  )
}
