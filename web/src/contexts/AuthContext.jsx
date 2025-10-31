import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const setAuthFromResponse = (data) => {
    if (!data) return
    if (data.accessToken) setAccessToken(data.accessToken)
    if (data.user) setUser(data.user)
  }

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.post('/api/v1/auth/refresh')
      setAuthFromResponse(res.data)
      setLoading(false)
      return res.data
    } catch {
      setAccessToken(null)
      setUser(null)
      setLoading(false)
      return null
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/api/v1/auth/login', { email, password })
    // server should set HttpOnly refresh cookie; response may include accessToken/user
    setAuthFromResponse(res.data)
    return res.data
  }

  const register = async (firstName, lastName, email, password) => {
    const res = await api.post('/api/v1/auth/register', { firstName, lastName, email, password })
    return res.data
  }

  const logout = async () => {
    try {
      await api.post('/api/v1/auth/logout')
    } catch {
      // ignore
    }
    setAccessToken(null)
    setUser(null)
  }

  useEffect(() => {
    // attempt to refresh on mount to restore session from refresh cookie
    refresh()
  }, [refresh])

  return (
    <AuthContext.Provider value={{ accessToken, user, loading, login, register, logout, refresh, isAuthenticated: !!accessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
