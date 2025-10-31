import { useState, useEffect } from 'react'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  const [page, setPage] = useState('login')
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
  }, [theme])

  return (
    <div className="app-shell min-h-screen">
      <header className="p-4 flex justify-end">
        <button
          aria-label="Toggle theme"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          className="px-3 py-1 rounded-md border border-border text-[var(--color-text-secondary)]"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>

      {page === 'login' && <Login onNavigate={setPage} />}
      {page === 'signup' && <Signup onNavigate={setPage} />}
    </div>
  )
}

export default App
