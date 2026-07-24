import Card from '../components/Card.jsx'

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
        <Card label="News" />
        <Card label="Job Posting" />
      </div>
      <Card label="Daily Algo Challenge" />
    </div>
  )
}

/** Mobile layout: single column, shown below md */
function MobileLayout() {
  return (
    <div className="flex md:hidden flex-col gap-5 h-full">
      {['News', 'Job Posting', 'Daily Algo Challenge'].map(label => (
        <Card key={label} label={label} style={{ flex: '1 1 0', minHeight: 160 }} />
      ))}
    </div>
  )
}
