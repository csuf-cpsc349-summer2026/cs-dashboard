import Card from '../components/Card.jsx'
import NewsCard from '../components/coder/NewsCard.jsx'
import AlgoChallengeCard from '../components/coder/AlgoChallengeCard.jsx'

function JobPostingComingSoon() {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span
        className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: '#FBE7DF', color: '#D85A30' }}
      >
        Coming soon
      </span>
      <span className="text-[11px] text-gray-400">Job postings integration</span>
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
        <Card label="Job Posting">
          <JobPostingComingSoon />
        </Card>
      </div>
      <Card label="Daily Algo Challenge" className="flex flex-col" scrollable={false}>
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
      <Card label="Job Posting" style={{ flex: '1 1 0', minHeight: 160 }}>
        <JobPostingComingSoon />
      </Card>
      <Card label="Daily Algo Challenge" className="flex flex-col" style={{ flex: '1 1 0', minHeight: 160 }} scrollable={false}>
        <AlgoChallengeCard />
      </Card>
    </div>
  )
}
