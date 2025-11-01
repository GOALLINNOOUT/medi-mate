import React from 'react'
import { Link } from 'react-router-dom'

export default function TopNavbar() {
  return (
    <header className="w-full bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/60 backdrop-blur-md fixed top-0 left-0 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-teal-500 flex items-center justify-center text-white font-bold">MM</div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">MediMate</span>
            </Link>
          </div>

          <nav className="flex items-center gap-3">
            <Link to="/login" className="text-sm px-3 py-1 rounded-md text-slate-700 hover:bg-slate-100">Login</Link>
            <Link to="/signup" className="text-sm px-3 py-1 rounded-md bg-teal-600 text-white hover:bg-teal-700">Sign up</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
