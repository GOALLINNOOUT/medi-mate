import React from 'react'
import { Link } from 'react-router-dom'

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 flex items-center justify-between z-20">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="text-lg font-semibold text-[var(--color-primary)]">MediMate</Link>
        <div className="text-xs text-[var(--color-text-secondary)]">Medication manager</div>
      </div>

      <div>
        <button
          aria-label="Toggle theme"
          onClick={onToggleTheme}
          className="px-3 py-1 rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)]"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </header>
  )
}
