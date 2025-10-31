import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 text-center text-sm text-[var(--color-text-secondary)]">
      <div>© {new Date().getFullYear()} MediMate — Built with care.</div>
    </footer>
  )
}
