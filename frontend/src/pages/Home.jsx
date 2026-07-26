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
                <p className="text-sm font-semibold text-gray-900 transition-colors duration-150 group-hover:text-white">
                  {repo.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 transition-colors duration-150 group-hover:text-white/85">
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

  return (
    <Card label="Weather" style={style}>
      {loading && <p className="text-sm text-gray-400 mt-3">Loading...</p>}
      {error && <p className="text-sm text-gray-400 mt-3">Couldn't load weather right now.</p>}
      {!loading && !error && data && (
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{data.location}</p>

          <div className="flex items-center gap-3">
            <WeatherIcon code={data.weatherCode} className="w-9 h-9" />
            <span className="text-4xl font-bold text-gray-900">{Math.round(data.temperature)}°</span>
          </div>

          <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
            <div className="text-center">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">High</p>
              <p className="text-sm font-medium text-gray-700">{Math.round(data.high)}°</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Low</p>
              <p className="text-sm font-medium text-gray-700">{Math.round(data.low)}°</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

function WeatherIcon({ code, className }) {
  const bucket = weatherIconBucket(code)
  if (bucket === 'sunny') return <SunIcon className={className} />
  if (bucket === 'rain') return <RainIcon className={className} />
  return <CloudIcon className={className} />
}

/** WMO weather codes bucketed into the three icons this design supports; unmapped codes fall back to cloudy. */
function weatherIconBucket(code) {
  if (code === 0 || code === 1) return 'sunny'
  if ([2, 3, 45, 48].includes(code)) return 'cloudy'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  return 'cloudy'
}

function SunIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
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

function CloudIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  )
}

function RainIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
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
    <Card label="Parking" style={style}>
      {loading && <p className="text-sm text-gray-400 mt-3">Loading...</p>}
      {error && <p className="text-sm text-gray-400 mt-3">Couldn't load parking data right now.</p>}
      {!loading && !error && lots.length === 0 && (
        <p className="text-sm text-gray-400 mt-3">Parking data unavailable.</p>
      )}
      {!loading && !error && lots.length > 0 && (
        <div className="h-full grid grid-cols-2 gap-x-6 gap-y-4 content-evenly justify-items-center mt-3">
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

  return (
    <div
      className="group relative rounded-full flex-shrink-0"
      style={{ width: 72, height: 72, background: ringBackground }}
    >
      <div className="absolute rounded-full bg-white" style={{ inset: 8 }}>
        <span
          className="absolute inset-0 flex items-center justify-center text-center text-xs font-medium leading-tight px-2 transition-opacity duration-150 opacity-100 group-hover:opacity-0"
          style={{ color: labelColor }}
        >
          {displayName}
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center text-center text-xs font-medium leading-tight px-2 transition-opacity duration-150 opacity-0 group-hover:opacity-100"
          style={{ color: detailColor }}
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
      <p className="text-sm font-semibold text-gray-900 transition-colors duration-150 group-hover:text-white">
        {assignment.name}
      </p>
      <p className="text-xs text-gray-400 mt-0.5 transition-colors duration-150 group-hover:text-white/85">
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
