import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import BottomNav from '../components/BottomNav'

export default function UserLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = (e) => setIsMobile(e.matches)
    // set initial
    setIsMobile(mq.matches)
    // listen for changes
    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else mq.addListener(onChange)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange)
      else mq.removeListener(onChange)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-h-screen">
          {/* optional top area for profile/search on desktop */}
          <div className="hidden md:flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="text-sm font-medium text-slate-700">Welcome</div>
            <div className="text-sm text-slate-500">Search / Profile</div>
          </div>

          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>

      {/* bottom navigation for mobile users - only render on small screens to guarantee it's hidden on desktop */}
      {isMobile && <BottomNav />}
    </div>
  )
}
