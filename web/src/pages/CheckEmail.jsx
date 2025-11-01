import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Toast from '../components/Toast'
import api from '../api'

export default function CheckEmail() {
  const loc = useLocation()
  const navigate = useNavigate()
  const email = loc.state?.email || ''
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const resend = async () => {
    if (!email) return setToast({ message: 'No email available to resend', type: 'error' })
    setLoading(true)
    try {
      await api.post('/api/v1/auth/resend-verification', { email })
      setToast({ message: 'Verification email resent. Check your inbox.', type: 'success' })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to resend verification email'
      setToast({ message: msg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <h1 className="text-h1 font-semibold mb-2">Check your email</h1>
        <p className="mb-4">We've sent a verification link to <strong>{email || 'your email'}</strong>. Click the link to verify your account.</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => navigate('/login')} variant="secondary">Back to sign in</Button>
          <Button onClick={resend} disabled={loading}>{loading ? 'Resending…' : 'Resend verification'}</Button>
        </div>
      </Card>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
