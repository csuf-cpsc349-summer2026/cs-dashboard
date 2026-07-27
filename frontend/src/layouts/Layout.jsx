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
      <nav className="bg-white border-b border-gray-200 px-6 flex items-center justify-between relative flex-shrink-0" style={{ height: NAV_H }}>
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
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Open menu"
          >
            <span className="block w-5 h-0.5 bg-gray-700 rounded-full" />
            <span className="block w-5 h-0.5 bg-gray-700 rounded-full" />
            <span className="block w-5 h-0.5 bg-gray-700 rounded-full" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-20 w-44 bg-white border border-gray-200 rounded-xl shadow-md py-1.5 overflow-hidden">
                {MENU_ITEMS.map(item => (
                  <button
                    key={item.label}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => handleNavigate(item.to)}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors mt-1 pt-2.5 border-t border-gray-100"
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
