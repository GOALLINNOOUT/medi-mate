import './App.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CheckEmail from './pages/CheckEmail'
import VerifyEmail from './pages/VerifyEmail'
import { AuthProvider } from './contexts/AuthContext.jsx'
import RequireAuth from './routes/RequireAuth'
import Dashboard from './pages/Dashboard'
import GuestLayout from './layouts/GuestLayout'
import UserLayout from './layouts/UserLayout'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="app-shell min-h-screen flex flex-col">
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* public guest routes use the GuestLayout which contains TopNavbar */}
                <Route path="/login" element={<GuestLayout><Login /></GuestLayout>} />
                <Route path="/signup" element={<GuestLayout><Signup /></GuestLayout>} />
                <Route path="/check-email" element={<GuestLayout><CheckEmail /></GuestLayout>} />
                <Route path="/verify-email" element={<GuestLayout><VerifyEmail /></GuestLayout>} />

                {/* protected app routes use the UserLayout (Sidebar on desktop, BottomNav on mobile) */}
                <Route path="/dashboard" element={<RequireAuth><UserLayout><Dashboard /></UserLayout></RequireAuth>} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
