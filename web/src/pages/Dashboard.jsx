import React from 'react'
import Card from '../components/Card'
import { useAuth } from '../contexts/useAuth'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <h1 className="text-h1 font-semibold">Dashboard</h1>
        <h2 className="text-2xl font-semibold mb-2">Welcome{user?.firstName ? `, ${user.firstName}` : ''}!</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">This is a protected dashboard placeholder.</p>
        <div className="flex gap-3">
          <button onClick={logout} className="px-3 py-2 bg-[var(--color-primary)] text-white rounded">Sign out</button>
        </div>
      </Card>
    </div>
  )
}
