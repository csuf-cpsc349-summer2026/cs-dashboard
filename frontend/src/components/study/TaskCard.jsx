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
    <div
      className="border rounded-lg p-2.5 mb-2 last:mb-0"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
    >
      <p className="text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>{task.title}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          {task.source === 'canvas' && (
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'var(--nested-bg)', color: 'var(--text-muted)' }}
            >
              Canvas
            </span>
          )}
          {dueLabel && (
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Due {dueLabel}</span>
          )}
        </div>

        <select
          value={task.status}
          onChange={(e) => onMove(task.id, e.target.value)}
          className="text-[11px] border rounded px-1 py-0.5 focus:outline-none"
          style={{ backgroundColor: 'var(--nested-bg)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}
          aria-label={`Move "${task.title}"`}
        >
          {Object.entries(COLUMN_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="text-[11px] hover:text-red-500"
          style={{ color: 'var(--text-muted)' }}
          aria-label={`Delete "${task.title}"`}
          >
            ✕
          </button>
      </div>
    </div>
  )
}
