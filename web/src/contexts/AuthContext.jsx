import React, { useState, useEffect, useCallback } from 'react'
import api from '../api'
import AuthContext from './authContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const setAuthFromResponse = (data) => {
    if (!data) return
    // Server now returns `user` and sets httpOnly cookies for both refreshToken and accessToken.
    if (data.user) setUser(data.user)
  }

  const fetchMe = useCallback(async () => {
    try {
      const meRes = await api.get('/api/v1/auth/me')
      setAuthFromResponse(meRes.data)
      return meRes.data
    } catch {
      return null
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      // server route is /refresh-token (match server/routes/auth.js)
      const res = await api.post('/api/v1/auth/refresh-token')
      setAuthFromResponse(res.data)
      // If refresh did not return user or any kind of token, try explicit /me endpoint
      if (!res.data?.user && !res.data?.accessToken && !res.data?.token) {
        await fetchMe()
      }
      setLoading(false)
      return res.data
    } catch {
      setUser(null)
      setLoading(false)
      return null
    }
  }, [fetchMe])

  const login = async (email, password) => {
    const res = await api.post('/api/v1/auth/login', { email, password })
    // server should set HttpOnly refresh cookie; response may include accessToken/user
    setAuthFromResponse(res.data)
    // If the server only set a refresh cookie (no access token returned), call refresh to obtain an access token
    if (!res.data?.accessToken && !res.data?.user) {
      // try refresh which will fall back to /me if needed
      await refresh()
    }
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
    setUser(null)
    try {
      // nothing to delete - we rely on httpOnly cookies for auth
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    // attempt to refresh on mount to restore session from refresh cookie
    refresh()
  }, [refresh])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

// Note: the `useAuth` hook lives in a separate file (`src/contexts/useAuth.js`) to avoid Fast Refresh warnings
