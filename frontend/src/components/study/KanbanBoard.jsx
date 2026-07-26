import TaskCard from './TaskCard.jsx'

const COLUMNS = [
  { key: 'icebox', label: 'Ice Box' },
  { key: 'doing', label: 'Doing' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
]

export default function KanbanBoard({ tasks, onMove }) {
  return (
    <div className="flex-1 min-h-0 flex gap-4 mt-4 overflow-x-auto">
      {COLUMNS.map(({ key, label }) => (
        <div key={key} className="flex-1 min-w-[140px] bg-gray-100 rounded-lg p-3 flex flex-col overflow-y-auto">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            {label}
          </span>
          <div className="flex-1 min-h-0">
            {tasks
              .filter((task) => task.status === key)
              .map((task) => (
                <TaskCard key={task.id} task={task} onMove={onMove} />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
