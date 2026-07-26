const LOFI_EMBED_URL = 'https://www.youtube.com/embed/n61ULEU7CO0'

export default function MusicPanel() {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center mt-2">
      <div className="flex-1 min-h-0 w-full max-w-md mx-auto rounded-lg overflow-hidden bg-black">
        <iframe
          src={LOFI_EMBED_URL}
          title="Lofi study stream"
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>

      <div className="flex items-center gap-2 mt-2.5">
        <span
          className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: '#FBE7DF', color: '#D85A30' }}
        >
          Coming soon
        </span>
        <span className="text-[11px] text-gray-400">Spotify integration</span>
      </div>
    </div>
  )
}
