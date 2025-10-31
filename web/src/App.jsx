import { useState, useEffect } from 'react'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [page, setPage] = useState('login')
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
  }, [theme])

  const pages = {
    login: <Login onNavigate={setPage} />,
    signup: <Signup onNavigate={setPage} />,
  }

  return (
    <AuthProvider>
      <div className="app-shell min-h-screen flex flex-col">
        <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />

        <main className="flex-1">{pages[page]}</main>

        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
