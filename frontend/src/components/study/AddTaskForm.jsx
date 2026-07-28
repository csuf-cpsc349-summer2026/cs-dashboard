import { useState } from 'react'

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [dueAt, setDueAt] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    onAdd({ title: title.trim(), dueAt: dueAt || null })
    setTitle('')
    setDueAt('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task title"
        className="text-sm border rounded-lg px-2.5 py-1.5 focus:outline-none w-40"
        style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)', backgroundColor: 'var(--card-bg)' }}
      />
      <input
        type="date"
        value={dueAt}
        onChange={(e) => setDueAt(e.target.value)}
        className="text-sm border rounded-lg px-2.5 py-1.5 focus:outline-none"
        style={{ borderColor: 'var(--card-border)', color: 'var(--text-secondary)', backgroundColor: 'var(--card-bg)' }}
      />
      <button
        type="submit"
        className="text-xs font-medium text-white rounded-lg px-3 py-1.5"
        style={{ backgroundColor: 'var(--accent-color)' }}
      >
        Add
      </button>
    </form>
  )
}
