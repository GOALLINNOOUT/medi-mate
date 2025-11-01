import React from 'react'
import TopNavbar from '../components/TopNavbar'

export default function GuestLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <TopNavbar />

      <main className="pt-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
