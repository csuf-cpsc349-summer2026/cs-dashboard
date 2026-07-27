const COLUMN_LABELS = {
  icebox: 'Ice Box',
  doing: 'Doing',
  review: 'Review',
  done: 'Done',
}

function formatDueDate(dueAt) {
  if (!dueAt) return null
  return new Date(dueAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function TaskCard({ task, onMove, onDelete }) {
  const dueLabel = formatDueDate(task.dueAt)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2.5 mb-2 last:mb-0">
      <p className="text-sm text-gray-800 leading-snug">{task.title}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          {task.source === 'canvas' && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
              Canvas
            </span>
          )}
          {dueLabel && (
            <span className="text-[11px] text-gray-400">Due {dueLabel}</span>
          )}
        </div>

        <select
          value={task.status}
          onChange={(e) => onMove(task.id, e.target.value)}
          className="text-[11px] border border-gray-200 rounded px-1 py-0.5 text-gray-500 focus:outline-none"
          aria-label={`Move "${task.title}"`}
        >
          {Object.entries(COLUMN_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="text-[11px] text-gray-400 hover:text-red-500"
          aria-label={`Delete "${task.title}"`}
          >
            ✕
          </button>
      </div>
    </div>
  )
}
