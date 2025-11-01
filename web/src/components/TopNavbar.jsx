import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

export default function TopNavbar() {
  return (
    <header className="w-full bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/60 backdrop-blur-md fixed top-0 left-0 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md"
              aria-label="MediMate home"
            >
              {/* use public logo instead of text badge; subtle hover scale and accessible focus ring */}
              <img
                src="/file_000000003a00620a804e236b25a2ffc8.png"
                alt="MediMate logo"
                className="w-9 h-9 rounded-md object-contain bg-transparent transform transition-transform duration-200 ease-out group-hover:scale-105"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-100">MediMate</span>
            </Link>
          </div>

          <nav className="flex items-center gap-3">
            {/* theme toggle in top nav */}
            <ThemeToggle />
            <Link to="/login" className="text-sm px-3 py-1 rounded-md text-slate-700 hover:bg-slate-100">Login</Link>
            <Link to="/signup" className="text-sm px-3 py-1 rounded-md bg-teal-600 text-white hover:bg-teal-700">Sign up</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <label className="inline-flex items-center text-sm">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        aria-label="Theme selector"
        className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-sm text-slate-700 dark:text-slate-100"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  )
}
