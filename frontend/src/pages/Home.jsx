import Card from '../components/Card.jsx'
import { useCachedFetch } from '../hooks/useCachedFetch.js'
import { getGitHubRepos, getCanvasCourses, getParkingStatus, getWeather } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  return (
    <>
      <DesktopGrid />
      <MobileStack />
    </>
  )
}

/** Desktop layout: shown at md+ */
function DesktopGrid() {
  return (
    <div
      className="hidden md:grid h-full gap-6"
      style={{
        gridTemplateColumns: '1fr 1fr 2fr',
        gridTemplateRows: '1fr 1fr',
      }}
    >
      <WeatherCard style={{ gridColumn: '1', gridRow: '1' }} />
      <ParkingCard style={{ gridColumn: '2', gridRow: '1' }} />
      <GitHubRepoCard style={{ gridColumn: '1 / 3', gridRow: '2' }} />
      <CanvasCard style={{ gridColumn: '3', gridRow: '1 / 3' }} />
    </div>
  )
}

/** Mobile layout: single column, shown below md */
function MobileStack() {
  return (
    <div className="flex md:hidden flex-col gap-5 h-full">
      <WeatherCard style={{ flex: '1 1 0', minHeight: 160 }} />
      <ParkingCard style={{ flex: '1 1 0', minHeight: 160 }} />
      <GitHubRepoCard style={{ flex: '1 1 0', minHeight: 160 }} />
      <CanvasCard style={{ flex: '1 1 0', minHeight: 160 }} />
    </div>
  )
}

function GitHubRepoCard({ style }) {
  const { data: repos, loading, error } = useCachedFetch('github-repos', getGitHubRepos)

  return (
    <Card label="GitHub Repo" style={style}>
      {loading && <p className="text-sm text-gray-400 mt-3">Loading...</p>}
      {error && <p className="text-sm text-gray-400 mt-3">Couldn't load repos right now.</p>}
      {!loading && !error && repos?.length === 0 && (
        <p className="text-sm text-gray-400 mt-3">No repositories yet.</p>
      )}
      {!loading && !error && repos?.length > 0 && (
        <ul className="mt-3 flex flex-col gap-3">
          {repos.slice(0, 5).map(repo => (
            <li key={repo.id}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg no-underline bg-[#FAFAFA] border border-[#EFEFEF] py-3 px-3.5 transition-colors duration-150 hover:bg-[var(--accent-color)] hover:border-[var(--accent-color)]"
              >
                <p
                  className="font-semibold text-gray-900 transition-colors duration-150 group-hover:text-white"
                  style={{ fontSize: 'clamp(0.8rem, 2.2cqw, 1rem)' }}
                >
                  {repo.name}
                </p>
                <p
                  className="text-gray-400 mt-0.5 transition-colors duration-150 group-hover:text-white/85"
                  style={{ fontSize: 'clamp(0.65rem, 1.6cqw, 0.75rem)' }}
                >
                  {repo.language ? `${repo.language} · ` : ''}updated {timeAgo(repo.updated_at)}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function WeatherCard({ style }) {
  const { profile } = useAuth()
  const city = profile?.city
  const { data, loading, error } = useCachedFetch('weather-' + city, () => getWeather(city))

  // NOTE: clamp() bounds below are starting values — tune after visual review.
  const iconSize = 'clamp(32px, min(16cqw, 16cqh), 96px)'

  return (
    <Card label="Weather" style={style} scrollable={false}>
      {loading && <p className="text-sm text-gray-400 mt-3">Loading...</p>}
      {error && <p className="text-sm text-gray-400 mt-3">Couldn't load weather right now.</p>}
      {!loading && !error && data && (
        <div className="h-full flex flex-col items-center justify-center" style={{ gap: 'clamp(0.5rem, 3cqh, 1rem)' }}>
          <p className="text-xl font-semibold text-gray-400 uppercase tracking-wide">{data.location}</p>

          <div className="flex items-center" style={{ gap: 'clamp(0.5rem, 4cqw, 1rem)' }}>
            <WeatherIcon code={data.weatherCode} style={{ width: iconSize, height: iconSize }} />
            <span className="font-bold text-gray-900" style={{ fontSize: 'clamp(2rem, 14cqh, 5rem)' }}>
              {Math.round(data.temperature)}°
            </span>
          </div>

          <div
            className="flex items-center border-t border-gray-100"
            style={{ gap: 'clamp(1rem, 6cqw, 1.5rem)', paddingTop: 'clamp(0.5rem, 2cqh, 0.75rem)' }}
          >
            <div className="text-center">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">High</p>
              <p className="font-medium text-gray-700" style={{ fontSize: 'clamp(0.875rem, 4cqh, 1.25rem)' }}>
                {Math.round(data.high)}°
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Low</p>
              <p className="font-medium text-gray-700" style={{ fontSize: 'clamp(0.875rem, 4cqh, 1.25rem)' }}>
                {Math.round(data.low)}°
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

function WeatherIcon({ code, style }) {
  const bucket = weatherIconBucket(code)
  if (bucket === 'sunny') return <SunIcon style={style} />
  if (bucket === 'rain') return <RainIcon style={style} />
  return <CloudIcon style={style} />
}

/** WMO weather codes bucketed into the three icons this design supports; unmapped codes fall back to cloudy. */
function weatherIconBucket(code) {
  if (code === 0 || code === 1) return 'sunny'
  if ([2, 3, 45, 48].includes(code)) return 'cloudy'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  return 'cloudy'
}

function SunIcon({ style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function CloudIcon({ style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  )
}

function RainIcon({ style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
      <path d="M8 13v8" />
      <path d="M12 15v8" />
      <path d="M16 13v8" />
    </svg>
  )
}

const LOT_DISPLAY_NAMES = {
  'Nutwood Structure': 'Nutwood',
  'State College Structure': 'St. College',
  'Eastside North': 'Eastside N.',
  'Eastside South': 'Eastside S.',
  'S8 and S10': 'S8 & S10',
  'Fullerton Free Church': 'Free Church',
}

function ParkingCard({ style }) {
  const { data, loading, error } = useCachedFetch('parking-status', getParkingStatus)
  const lots = data?.lots ?? []

  return (
    <Card label="Parking" style={style} scrollable={false}>
      {loading && <p className="text-sm text-gray-400 mt-3">Loading...</p>}
      {error && <p className="text-sm text-gray-400 mt-3">Couldn't load parking data right now.</p>}
      {!loading && !error && lots.length === 0 && (
        <p className="text-sm text-gray-400 mt-3">Parking data unavailable.</p>
      )}
      {!loading && !error && lots.length > 0 && (
        <div
          className="h-full grid grid-cols-2 content-evenly justify-items-center mt-3"
          style={{ columnGap: 'clamp(1rem, 6cqw, 1.5rem)', rowGap: 'clamp(0.5rem, 3cqh, 1rem)' }}
        >
          {lots.map(lot => (
            <ParkingRing key={lot.name} lot={lot} />
          ))}
        </div>
      )}
    </Card>
  )
}

/** Conic-gradient donut ring with a two-state (name / detail) crossfade on hover. */
function ParkingRing({ lot }) {
  const displayName = LOT_DISPLAY_NAMES[lot.name] ?? lot.name
  const closed = lot.status === 'Closed'
  const percent = closed ? 0 : (lot.total - lot.available) / lot.total
  const percentValue = Math.round(percent * 100)

  const ringBackground = closed
    ? '#F3F4F6'
    : `conic-gradient(${percentColor(percent)} ${percentValue}%, #E5E7EB ${percentValue}% 100%)`

  const labelColor = closed ? '#D1D5DB' : '#111827'
  const detailColor = closed ? '#D1D5DB' : '#374151'

  // NOTE: clamp() bounds below are starting values — tune after visual review.
  // Inner circle inset uses a percentage (not px) so it scales proportionally with the ring.
  const ringSize = 'clamp(48px, min(20cqw, 26cqh), 110px)'
  const textStyle = { fontSize: 'clamp(9px, 3cqh, 13px)' }

  return (
    <div
      className="group relative rounded-full flex-shrink-0"
      style={{ width: ringSize, height: ringSize, background: ringBackground }}
    >
      <div className="absolute rounded-full bg-white" style={{ inset: '11%' }}>
        <span
          className="absolute inset-0 flex items-center justify-center text-center font-medium leading-tight px-2 transition-opacity duration-150 opacity-100 group-hover:opacity-0"
          style={{ color: labelColor, ...textStyle }}
        >
          {displayName}
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center text-center font-medium leading-tight px-2 transition-opacity duration-150 opacity-0 group-hover:opacity-100"
          style={{ color: detailColor, ...textStyle }}
        >
          {closed ? 'Closed' : `${percentValue}%`}
        </span>
      </div>
    </div>
  )
}

function percentColor(percent) {
  if (percent < 0.5) return '#16A34A'
  if (percent < 0.75) return '#EAB308'
  return '#EA580C'
}

function CanvasCard({ style }) {
  const { profile } = useAuth()
  const canvasUserId = profile?.canvasMockUser
  const { data, loading, error } = useCachedFetch(
    'canvas-courses-' + canvasUserId,
    () => getCanvasCourses(canvasUserId),
  )

  const assignments = flattenAssignments(data).sort(
    (a, b) => new Date(a.due_at) - new Date(b.due_at),
  )
  const dueSoon = assignments.filter(a => !/project|test|exam/i.test(a.name)).slice(0, 5)
  const projectsTests = assignments.filter(a => /project|test|exam/i.test(a.name)).slice(0, 5)

  return (
    <Card label="Canvas" style={style}>
      {loading && <p className="text-sm text-gray-400 mt-3">Loading...</p>}
      {error && <p className="text-sm text-gray-400 mt-3">Couldn't load Canvas data right now.</p>}
      {!loading && !error && assignments.length === 0 && (
        <p className="text-sm text-gray-400 mt-3">No assignments due.</p>
      )}
      {!loading && !error && assignments.length > 0 && (
        <div className="mt-3 flex flex-col gap-5">
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Due Soon</h3>
            <ul className="flex flex-col gap-3">
              {dueSoon.map(assignment => (
                <li key={assignment.id}>
                  <AssignmentRow assignment={assignment} />
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Projects | Tests</h3>
            {projectsTests.length === 0 ? (
              <p className="text-sm text-gray-400">None right now.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {projectsTests.map(assignment => (
                  <li key={assignment.id}>
                    <AssignmentRow assignment={assignment} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </Card>
  )
}

/** Same sub-card visual/hover treatment as GitHub's rows, but a div — these aren't links yet. */
function AssignmentRow({ assignment }) {
  return (
    <div className="group block rounded-lg bg-[#FAFAFA] border border-[#EFEFEF] py-3 px-3.5 transition-colors duration-150 hover:bg-[var(--accent-color)] hover:border-[var(--accent-color)]">
      <p
        className="font-semibold text-gray-900 transition-colors duration-150 group-hover:text-white"
        style={{ fontSize: 'clamp(0.8rem, 2.2cqw, 1rem)' }}
      >
        {assignment.name}
      </p>
      <p
        className="text-gray-400 mt-0.5 transition-colors duration-150 group-hover:text-white/85"
        style={{ fontSize: 'clamp(0.65rem, 1.6cqw, 0.75rem)' }}
      >
        {assignment.courseName} · due {formatDueDate(assignment.due_at)}
      </p>
    </div>
  )
}

function flattenAssignments(data) {
  if (!data?.courses) return []
  return data.courses.flatMap(course =>
    course.assignments.map(assignment => ({ ...assignment, courseName: course.name })),
  )
}

function formatDueDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)

  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]

  for (const [name, secondsPerUnit] of units) {
    const value = Math.floor(seconds / secondsPerUnit)
    if (value >= 1) {
      return `${value} ${name}${value === 1 ? '' : 's'} ago`
    }
  }

  return 'just now'
}
