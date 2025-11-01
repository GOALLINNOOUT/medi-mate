import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthProvider } from './contexts/AuthContext.jsx'
import RequireAuth from './routes/RequireAuth'
import Dashboard from './pages/Dashboard'
import GuestLayout from './layouts/GuestLayout'
import UserLayout from './layouts/UserLayout'

function App() {
  const [theme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // ignore
    }
  }, [theme])

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell min-h-screen flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* public guest routes use the GuestLayout which contains TopNavbar */}
              <Route path="/login" element={<GuestLayout><Login /></GuestLayout>} />
              <Route path="/signup" element={<GuestLayout><Signup /></GuestLayout>} />

              {/* protected app routes use the UserLayout (Sidebar on desktop, BottomNav on mobile) */}
              <Route path="/dashboard" element={<RequireAuth><UserLayout><Dashboard /></UserLayout></RequireAuth>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
