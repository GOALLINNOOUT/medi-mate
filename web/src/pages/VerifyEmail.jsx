import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Toast from '../components/Toast'
import api from '../api'
import { useAuth } from '../contexts/useAuth'

export default function VerifyEmail() {
  const loc = useLocation()
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    const params = new URLSearchParams(loc.search)
    const token = params.get('token') || ''
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided.')
      return
    }

    (async () => {
      try {
        await api.post('/api/v1/auth/verify-email', { token })
        // The backend sets cookies and returns user. Refresh client auth state.
        await refresh()
        setStatus('success')
        setMessage('Email verified! Redirecting to your dashboard...')
        setTimeout(() => navigate('/dashboard'), 1200)
      } catch (err) {
        const msg = err?.response?.data?.message || 'Verification failed'
        setStatus('error')
        setMessage(msg)
      }
    })()
  }, [loc.search, navigate, refresh])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <h1 className="text-h1 font-semibold mb-2">Email verification</h1>
        <p className="mb-4">{message}</p>
        {status === 'error' && (
          <div className="flex gap-2 justify-center">
            <Button onClick={() => navigate('/signup')} variant="secondary">Back to signup</Button>
            <Button onClick={() => navigate('/check-email')}>Resend verification</Button>
          </div>
        )}
      </Card>
      {status !== 'verifying' && <Toast message={message} type={status === 'success' ? 'success' : 'error'} onClose={() => setMessage('')} />}
    </div>
  )
}
