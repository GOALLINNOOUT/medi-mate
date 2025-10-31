import React from 'react'

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="w-full bg-[var(--color-surface)] border-b border-[var(--color-border)] p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-xl font-semibold text-[var(--color-primary)]">MediMate</div>
        <div className="text-sm text-[var(--color-text-secondary)]">Medication manager</div>
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
