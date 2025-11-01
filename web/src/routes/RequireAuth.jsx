import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

export default function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return null // or a spinner

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

