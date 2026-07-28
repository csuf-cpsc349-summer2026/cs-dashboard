import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase.js'

const NAV_H = 56 // h-14

const MENU_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Study', to: '/study' },
  { label: 'Code', to: '/coder' },
  { label: 'Settings', to: '/settings' },
  { label: 'About', to: '/about' },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleNavigate(to) {
    setMenuOpen(false)
    navigate(to)
  }

  async function handleLogout() {
    setMenuOpen(false)
    await signOut(auth)
    navigate('/login')
  }

  return (
    <div className="flex flex-col" style={{ height: '100dvh', backgroundColor: 'var(--bg-page)', fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav
        className="border-b px-6 flex items-center justify-between relative flex-shrink-0"
        style={{ height: NAV_H, backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0"
          style={{ borderColor: 'var(--accent-color)' }}
        >
          <span className="text-xs font-bold" style={{ color: 'var(--accent-color)' }}>BB</span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg transition-colors focus:outline-none"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--nested-bg)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            aria-label="Open menu"
          >
            <span className="block w-5 h-0.5 rounded-full" style={{ backgroundColor: 'var(--text-primary)' }} />
            <span className="block w-5 h-0.5 rounded-full" style={{ backgroundColor: 'var(--text-primary)' }} />
            <span className="block w-5 h-0.5 rounded-full" style={{ backgroundColor: 'var(--text-primary)' }} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-11 z-20 w-44 border rounded-xl shadow-md py-1.5 overflow-hidden"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
              >
                {MENU_ITEMS.map(item => (
                  <button
                    key={item.label}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--nested-bg)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    onClick={() => handleNavigate(item.to)}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm transition-colors mt-1 pt-2.5 border-t"
                  style={{ color: 'var(--text-secondary)', borderColor: 'var(--card-border)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--nested-bg)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Routed page content — fills remaining height */}
      <div className="flex-1 min-h-0 p-6">
        <Outlet />
      </div>
    </div>
  )
}
