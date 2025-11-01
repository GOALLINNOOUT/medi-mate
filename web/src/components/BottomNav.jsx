import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function IconHome({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 10.5L12 4l9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 21V11.5h14V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconUser({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconPlus({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function BottomNav() {
  const { pathname } = useLocation()

  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: <IconHome /> },
    { to: '/login', label: 'Login', icon: <IconPlus /> },
    { to: '/signup', label: 'Signup', icon: <IconUser /> },
  ]

  return (
    <nav aria-label="Bottom navigation" className="fixed left-1/2 -translate-x-1/2 bottom-5 z-40">
      <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/30 dark:bg-black/30 border border-white/10 dark:border-black/20 backdrop-blur-md shadow-lg">
        {items.map((it) => {
          const active = pathname === it.to
          return (
            <Link
              key={it.to}
              to={it.to}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                active
                  ? 'bg-[var(--color-primary)] text-white shadow'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/60'
              }`}
            >
              <span className="text-[18px]">{it.icon}</span>
              <span className="hidden sm:inline">{it.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

