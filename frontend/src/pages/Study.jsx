import { useState, useEffect } from 'react'
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import Card from '../components/Card.jsx'
import KanbanBoard from '../components/study/KanbanBoard.jsx'
import AddTaskForm from '../components/study/AddTaskForm.jsx'
import PomodoroTimer from '../components/study/PomodoroTimer.jsx'
import MusicPanel from '../components/study/MusicPanel.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getCanvasTasks } from '../lib/api.js'
import { db } from '../lib/firebase.js'

export default function Study() {
  const { user, profile } = useAuth()
  const [tasks, setTasks] = useState([])
  const [importing, setImporting] = useState(false)

  // Live-syncs with users/{uid}/tasks so the board persists across sessions
  // and stays in sync if edited elsewhere (mirrors AuthContext's profile sync).
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users', user.uid, 'tasks'), (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })

    return unsubscribe
  }, [user.uid])

  function moveTask(id, status) {
    updateDoc(doc(db, 'users', user.uid, 'tasks', id), { status })
  }

  function addTask({ title, dueAt }) {
    const id = crypto.randomUUID()
    setDoc(doc(db, 'users', user.uid, 'tasks', id), {
      title,
      dueAt,
      status: 'icebox',
      source: 'manual',
    })
  }

  async function importFromCanvas() {
    setImporting(true)
    try {
      const canvasTasks = await getCanvasTasks(profile?.canvasMockUser)
      const existingIds = new Set(tasks.map((t) => t.id))
      const newOnes = canvasTasks.filter((t) => !existingIds.has(t.id))

      await Promise.all(
        newOnes.map((t) =>
          setDoc(doc(db, 'users', user.uid, 'tasks', t.id), { ...t, status: 'icebox' }),
        ),
      )
    } catch (error) {
      console.error(error)
    } finally {
      setImporting(false)
    }
  }

  const kanbanHeader = (
    <div className="flex items-center gap-2">
      <AddTaskForm onAdd={addTask} />
      <button
        type="button"
        disabled={importing}
        onClick={importFromCanvas}
        className="text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        {importing ? 'Importing...' : 'Import from Canvas'}
      </button>
    </div>
  )

  return (
    <>
      <DesktopLayout tasks={tasks} onMove={moveTask} kanbanHeader={kanbanHeader} />
      <MobileLayout tasks={tasks} onMove={moveTask} kanbanHeader={kanbanHeader} />
    </>
  )
}

/** Desktop layout: shown at md+. Kanban gets top row; Pomodoro (narrow) and Music (wide) share the bottom row. */
function DesktopLayout({ tasks, onMove, kanbanHeader }) {
  return (
    <div className="hidden md:grid h-full gap-6" style={{ gridTemplateRows: '3fr 2fr' }}>
      <Card label="Scrum / Kanban" headerRight={kanbanHeader} className="flex flex-col">
        <KanbanBoard tasks={tasks} onMove={onMove} />
      </Card>

      <div className="grid grid-cols-2 gap-6 min-h-0 max-w-3xl w-full mx-auto">
        <Card label="Pomodoro" className="flex flex-col">
          <PomodoroTimer />
        </Card>
        <Card label="Music" className="flex flex-col">
          <MusicPanel />
        </Card>
      </div>
    </div>
  )
}

/** Mobile layout: single column, Kanban first with room to breathe, then Pomodoro, then Music. */
function MobileLayout({ tasks, onMove, kanbanHeader }) {
  return (
    <div className="flex md:hidden flex-col gap-5 h-full">
      <Card label="Scrum / Kanban" className="flex flex-col" style={{ flex: '2 1 0', minHeight: 260 }}>
        <div className="mb-2">{kanbanHeader}</div>
        <KanbanBoard tasks={tasks} onMove={onMove} />
      </Card>
      <Card label="Pomodoro" className="flex flex-col" style={{ flex: '1 1 0', minHeight: 140 }}>
        <PomodoroTimer />
      </Card>
      <Card label="Music" className="flex flex-col" style={{ flex: '1.4 1 0', minHeight: 200 }}>
        <MusicPanel />
      </Card>
    </div>
  )
}
