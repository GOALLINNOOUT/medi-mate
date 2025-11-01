import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // theme can be 'light' | 'dark' | 'system'
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('theme')
      if (stored) return stored
    } catch {
      // ignore
    }
    // default to following system preference
    return 'system'
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      // fallback
      try {
        const effective = theme === 'dark' ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', effective)
        localStorage.setItem('theme', theme)
      } catch {
        // ignore
      }
      return
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const apply = (t) => {
      const effective = t === 'system' ? (mq.matches ? 'dark' : 'light') : t
      document.documentElement.setAttribute('data-theme', effective === 'dark' ? 'dark' : 'light')
    }

    // apply initially
    apply(theme)

    // persist chosen theme (including 'system')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // ignore
    }

    // if following system, listen for changes
    const listener = () => {
      if (theme === 'system') apply('system')
    }
    if (mq.addEventListener) mq.addEventListener('change', listener)
    else mq.addListener(listener)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', listener)
      else mq.removeListener(listener)
    }
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

export default ThemeContext
