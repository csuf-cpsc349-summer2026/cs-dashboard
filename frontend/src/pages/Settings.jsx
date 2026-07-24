import Card from '../components/Card.jsx'

const SWATCHES = [
  { name: 'Indigo', color: 'var(--accent-color)', selected: true },
  { name: 'Teal', color: '#0F6E56' },
  { name: 'Coral', color: '#D85A30' },
  { name: 'Slate', color: '#24292F' },
]

function SaveButton() {
  return (
    <button
      type="button"
      className="flex-shrink-0 rounded-lg text-sm font-medium text-white px-4 py-2"
      style={{ backgroundColor: 'var(--accent-color)' }}
    >
      Save
    </button>
  )
}

export default function Settings() {
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
        <Card label="Weather location">
          <p className="text-sm text-gray-500 mt-2">
            Used to show local weather on your dashboard.
          </p>
          <div className="flex gap-3 mt-4">
            <input
              type="text"
              defaultValue="Fullerton, CA"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none"
            />
            <SaveButton />
          </div>
        </Card>

        <Card
          label="Canvas access"
          headerRight={
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
              Token saved
            </span>
          }
        >
          <p className="text-sm text-gray-500 mt-2">
            Paste your Canvas API token, generated from Canvas under Account &rarr; Settings &rarr; New Access Token.
          </p>
          <div className="flex gap-3 mt-4">
            <input
              type="password"
              placeholder="••••••••••••••••"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none"
            />
            <SaveButton />
          </div>
        </Card>

        <Card label="Appearance">
          <p className="text-sm text-gray-500 mt-2">
            Choose a color theme for your dashboard.
          </p>
          <div className="flex justify-center gap-6 mt-5">
            {SWATCHES.map(swatch => (
              <div key={swatch.name} className="flex flex-col items-center gap-2">
                <span
                  className="block rounded-full"
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: swatch.color,
                    boxShadow: swatch.selected
                      ? '0 0 0 2px white, 0 0 0 4px var(--accent-color)'
                      : 'none',
                  }}
                />
                <span className="text-xs text-gray-500">{swatch.name}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-5">
            <SaveButton />
          </div>
        </Card>
      </div>
    </div>
  )
}
