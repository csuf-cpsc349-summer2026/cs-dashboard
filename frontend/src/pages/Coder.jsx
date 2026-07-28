import Card from '../components/Card.jsx'
import NewsCard from '../components/coder/NewsCard.jsx'
import AlgoChallengeCard from '../components/coder/AlgoChallengeCard.jsx'

function JobPostingComingSoon() {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center gap-3">
      <span
        className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full"
        style={{ backgroundColor: '#D85A30', color: 'white' }}
      >
        Coming soon
      </span>
      <p className="text-sm max-w-xs" style={{ color: 'var(--text-secondary)' }}>
        Job postings integration is on the way — we're working on surfacing openings relevant to CS students right here.
      </p>
    </div>
  )
}

export default function Coder() {
  return (
    <>
      <DesktopLayout />
      <MobileLayout />
    </>
  )
}

/** Desktop layout: shown at md+. Left column stacks News/Job Posting; right column is one tall card. */
function DesktopLayout() {
  return (
    <div className="hidden md:grid grid-cols-2 gap-6 h-full">
      <div className="grid grid-rows-2 gap-6 min-h-0">
        <Card label="News" className="flex flex-col">
          <NewsCard />
        </Card>
        <Card label="Job Posting" className="flex flex-col">
          <JobPostingComingSoon />
        </Card>
      </div>
      <Card label="Daily Algo Challenge" className="flex flex-col" >
        <AlgoChallengeCard />
      </Card>
    </div>
  )
}

/** Mobile layout: single column, shown below md */
function MobileLayout() {
  return (
    <div className="flex md:hidden flex-col gap-5 h-full">
      <Card label="News" className="flex flex-col" style={{ flex: '1 1 0', minHeight: 160 }}>
        <NewsCard />
      </Card>
      <Card label="Job Posting" className="flex flex-col" style={{ flex: '1 1 0', minHeight: 160 }}>
        <JobPostingComingSoon />
      </Card>
      <Card label="Daily Algo Challenge" className="flex flex-col" style={{ flex: '1 1 0', minHeight: 160 }} >
        <AlgoChallengeCard />
      </Card>
    </div>
  )
}
