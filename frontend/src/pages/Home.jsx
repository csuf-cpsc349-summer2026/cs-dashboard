import Card from '../components/Card.jsx'

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
      <Card label="Weather" style={{ gridColumn: '1', gridRow: '1' }} />
      <Card label="Parking" style={{ gridColumn: '2', gridRow: '1' }} />
      <Card label="GitHub Repo" style={{ gridColumn: '1 / 3', gridRow: '2' }} />
      <Card label="Canvas" style={{ gridColumn: '3', gridRow: '1 / 3' }} />
    </div>
  )
}

/** Mobile layout: single column, shown below md */
function MobileStack() {
  return (
    <div className="flex md:hidden flex-col gap-5 h-full">
      {['Weather', 'Parking', 'GitHub Repo', 'Canvas'].map(label => (
        <Card key={label} label={label} style={{ flex: '1 1 0', minHeight: 160 }} />
      ))}
    </div>
  )
}
