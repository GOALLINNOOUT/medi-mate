import React from 'react'
import { NavLink } from 'react-router-dom'

import Icon from './Icon'

function Item({ to, label, iconName }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
          isActive ? 'bg-teal-600 text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        }`
      }
    >
      <span className="w-6 h-6 text-lg flex items-center justify-center">
        <Icon name={iconName} className="w-5 h-5" />
      </span>
      <span className="hidden md:inline">{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  return (
  // visible on md+ screens
  // Use md:!flex to ensure responsive `flex` wins if a global `.hidden` rule is present
  <aside className="hidden md:!flex md:flex-col md:w-60 lg:w-72 border-r border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-4">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-teal-500 flex items-center justify-center text-white font-bold">MM</div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-100">MediMate</div>
            <div className="text-xs text-slate-500">Your health companion</div>
          </div>
        </div>
      </div>

    <nav className="flex-1 flex flex-col gap-1">
    <Item to="/dashboard" label="Home" iconName="home" />
    <Item to="/mood" label="Mood" iconName="mood" />
  <Item to="/medications" label="Medication" iconName="med" />
  <Item to="/analytics" label="Analytics" iconName="analytics" />
    <Item to="/profile" label="Profile" iconName="profile" />
  </nav>

      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="text-sm text-slate-600">v1.0</div>
      </div>
    </aside>
  )
}
