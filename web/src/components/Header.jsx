import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header({ theme, onToggleTheme }) {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="w-full bg-[var(--color-surface)] border-b border-[var(--color-border)] p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xl font-semibold text-[var(--color-primary)]">MediMate</Link>
        <div className="text-sm text-[var(--color-text-secondary)]">Medication manager</div>
      </div>
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-[var(--color-text-secondary)]">{user?.firstName || 'User'}</span>
            <button onClick={logout} className="text-sm text-[var(--color-primary)]">Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-[var(--color-primary)]">Sign in</Link>
            <Link to="/signup" className="text-sm text-[var(--color-primary)]">Sign up</Link>
          </>
        )}
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
