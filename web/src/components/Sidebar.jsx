import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

import Icon from './Icon'

function Item({ to, label, iconName, collapsed }) {
  return (
    <NavLink
      to={to}
      aria-label={label}
      title={label}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
          isActive ? 'bg-teal-600 text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`
      }
    >
      <span className="w-6 h-6 text-lg flex items-center justify-center">
        <Icon name={iconName} className="w-5 h-5" title={label} />
      </span>
      {/* animated label: fades and collapses width smoothly */}
      <span className={`ml-2 text-sm transition-all duration-500 ease-in-out whitespace-nowrap overflow-hidden md:inline-block ${collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[12rem]'}`}>
        {label}
      </span>
    </NavLink>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [hovered, setHovered] = useState(false)

  // When collapsed but hovered we temporarily expand (auto-expand on hover)
  const effectiveCollapsed = collapsed && !hovered

  // conditional width classes for expanded vs collapsed
  const widthClass = effectiveCollapsed ? 'md:w-16 lg:w-20' : 'md:w-60 lg:w-72'

  return (
    // visible on md+ screens
    // Use md:!flex to ensure responsive `flex` wins if a global `.hidden` rule is present
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-expanded={!effectiveCollapsed}
      className={`hidden md:!flex md:flex-col ${widthClass} border-r border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-4 transition-all duration-500 ease-in-out`}
    >
      <div className="mb-6">
        <div className={`relative flex items-center gap-3 ${effectiveCollapsed ? 'justify-center' : ''}`}>
          <div className={`w-10 h-10 rounded-md overflow-hidden flex-shrink-0 transition-all duration-300 ${effectiveCollapsed ? 'mx-auto' : ''}`}>
            <img src="/file_000000003a00620a804e236b25a2ffc8.png" alt="MediMate logo" className="w-full h-full object-contain" draggable="false" />
          </div>
          {/* title block always present but animated (width + opacity) for smooth transition */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${effectiveCollapsed ? 'max-w-0 opacity-0' : 'max-w-[12rem] opacity-100'}`}>
            <div className="font-semibold text-slate-800 dark:text-slate-100">MediMate</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Your health companion</div>
          </div>

          {/* toggle button */}
          <button
            onClick={() => setCollapsed(v => !v)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand' : 'Collapse'}
            className={`p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors ${effectiveCollapsed ? 'absolute right-2 top-1/2 -translate-y-1/2 z-10' : 'ml-auto -mr-2'}`}
          >
            {/* simple chevron icon rotated based on state (rotation follows stored collapsed state) */}
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transform transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <nav className={`flex-1 flex flex-col gap-1 ${effectiveCollapsed ? 'items-center' : ''}`}>
        <Item to="/dashboard" label="Home" iconName="home" collapsed={effectiveCollapsed} />
        <Item to="/mood" label="Mood" iconName="mood" collapsed={effectiveCollapsed} />
        <Item to="/medications" label="Medication" iconName="med" collapsed={effectiveCollapsed} />
        <Item to="/analytics" label="Analytics" iconName="analytics" collapsed={effectiveCollapsed} />
        <Item to="/profile" label="Profile" iconName="profile" collapsed={effectiveCollapsed} />
      </nav>
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className={`text-sm text-slate-600 dark:text-slate-400 transition-all duration-500 ease-in-out ${effectiveCollapsed ? 'text-center opacity-0 max-w-0 overflow-hidden' : 'opacity-100 max-w-full'}`}>v1.0</div>
      </div>
    </aside>
  )
}
