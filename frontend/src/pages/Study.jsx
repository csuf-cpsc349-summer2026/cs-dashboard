import Card from '../components/Card.jsx'

const KANBAN_COLUMNS = ['Ice Box', 'Doing', 'Review', 'Done']

export default function Study() {
  return (
    <>
      <DesktopLayout />
      <MobileLayout />
    </>
  )
}

/** Desktop layout: shown at md+. Kanban gets 2/3 height, Pomodoro/Music share the remaining 1/3. */
function DesktopLayout() {
  return (
    <div className="hidden md:grid h-full gap-6" style={{ gridTemplateRows: '2fr 1fr' }}>
      <Card label="Scrum / Kanban" className="flex flex-col">
        <KanbanColumns />
      </Card>

      <div className="grid grid-cols-2 gap-6 min-h-0">
        <Card label="Pomodoro" />
        <Card label="Music" />
      </div>
    </div>
  )
}

/** Mobile layout: single column, Kanban first with room to breathe, then Pomodoro, then Music. */
function MobileLayout() {
  return (
    <div className="flex md:hidden flex-col gap-5 h-full">
      <Card label="Scrum / Kanban" className="flex flex-col" style={{ flex: '2 1 0', minHeight: 260 }}>
        <KanbanColumns />
      </Card>
      <Card label="Pomodoro" style={{ flex: '1 1 0', minHeight: 140 }} />
      <Card label="Music" style={{ flex: '1 1 0', minHeight: 140 }} />
    </div>
  )
}

function KanbanColumns() {
  return (
    <div className="flex-1 min-h-0 flex gap-4 mt-4 overflow-x-auto">
      {KANBAN_COLUMNS.map(name => (
        <div key={name} className="flex-1 min-w-[140px] bg-gray-100 rounded-lg p-3 flex flex-col">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            {name}
          </span>
          <div className="flex-1 min-h-0" />
        </div>
      ))}
    </div>
  )
}
