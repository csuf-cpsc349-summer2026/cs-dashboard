import Card from '../components/Card.jsx'

function DevCard({ name, role, blurb }) {
  return (
    <div className="flex flex-col gap-1 mt-2">
      <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</p>
      <p className="text-xs font-medium" style={{ color: 'var(--accent-color)' }}>{role}</p>
      <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{blurb}</p>
    </div>
  )
}

function RoadmapItem({ title, description }) {
  return (
    <li>
      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
      <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </li>
  )
}

export default function About() {
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card label="Dev 1" style={{ minHeight: 120 }}>
          <DevCard
            name="Jordan Querubin"
            role="App Foundation, Auth & Home Page"
            blurb="Set up routing and page layouts, GitHub OAuth and Firestore-backed auth, the onboarding flow, the original Study page and Kanban board, and the Home page's live Weather, Parking, GitHub, and Canvas cards."
          />
        </Card>
        <Card label="Dev 2" style={{ minHeight: 120 }}>
          <DevCard
            name="Alex Hwang"
            role="Study & Coder Page Features"
            blurb="Extended the Kanban board with task persistence and redesigned the Pomodoro timer and music player, then built out the Coder page's news feed, daily algo challenge, and in-browser code runner."
          />
        </Card>
        <Card label="Goals & Intentions" style={{ minHeight: 320 }}>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            cs-dashboard brings the tools a CS student checks every day — weather, campus parking,
            coursework, and coding practice — into a single personalized view, cutting down on the
            app-switching that a normal school day involves.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            It's also our applied introduction to full-stack development for CPSC 349: real third-party
            API integration, Firebase authentication, and per-user data persistence, built as a product
            we'd genuinely use ourselves, not just a class assignment.
          </p>
        </Card>
        <Card label="Roadmap" style={{ minHeight: 320 }}>
          <ul className="mt-2 space-y-3">
            <RoadmapItem
              title="Spotify integration"
              description="Replace the Study page's music placeholder with a real, authenticated Spotify player."
            />
            <RoadmapItem
              title="AI integration"
              description="Smart task prioritization on Study, and code feedback on the Coder page's Run Code results."
            />
            <RoadmapItem
              title="Customizable card layouts"
              description="Resizable, rearrangeable cards so each user can tailor their own dashboard."
            />
            <RoadmapItem
              title="Job postings"
              description="Real listings on the Coder page, replacing today's placeholder."
            />
            <RoadmapItem
              title="Deadline reminders"
              description="Notifications for Canvas-imported tasks as their due dates approach."
            />
          </ul>
        </Card>
      </div>
    </div>
  )
}
