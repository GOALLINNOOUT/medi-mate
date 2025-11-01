import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon'

export default function BottomNav() {
  const { pathname } = useLocation()

  const items = [
    { to: '/dashboard', label: 'Home', icon: 'home' },
    { to: '/mood', label: 'Mood', icon: 'mood' },
  { to: '/medications', label: 'Medication', icon: 'med' },
  { to: '/analytics', label: 'Analytics', icon: 'analytics' },
    { to: '/profile', label: 'Profile', icon: 'profile' },
  ]

  return (
    // show only on small screens; for desktop the Sidebar will be used
    <nav aria-label="Bottom navigation" className="md:hidden fixed inset-x-0 bottom-5 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between gap-2 px-3 py-2 max-w-md w-[min(94%,480px)] rounded-2xl bg-white/12 dark:bg-slate-900/28 border border-white/6 dark:border-slate-700/40 backdrop-blur-xl shadow-lg/40 hover:shadow-2xl transform transition duration-200 hover:-translate-y-1">
        {items.map((it) => {
          const active = pathname === it.to
          return (
            <Link
              key={it.to}
              to={it.to}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 px-2 py-1 text-[10px] transition-all duration-200 transform rounded-lg ${
                active
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/8 dark:hover:bg-white/5'
              }`}
            >
                <span className={`p-1 rounded-full transition-transform duration-200 ${active ? 'bg-teal-600 text-white scale-110' : 'bg-transparent'}`}>
                <Icon name={it.icon} className="w-4 h-4" />
              </span>
              <span className="text-[10px] tracking-wide">{it.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

