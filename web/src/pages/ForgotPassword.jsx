import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import FormField from '../components/FormField'
import Button from '../components/Button'
import Toast from '../components/Toast'
import api from '../api'
import { isEmail } from '../utils/validators'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (!isEmail(email)) return setToast({ message: 'Enter a valid email', type: 'error' })
    setLoading(true)
    try {
      await api.post('/api/v1/auth/forgot-password', { email })
      setToast({ message: 'If an account exists, password reset instructions have been sent.', type: 'success' })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to request password reset'
      setToast({ message: msg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <h1 className="text-h1 font-semibold mb-2">Forgot password</h1>
        <p className="mb-4">Enter your email and we'll send instructions to reset your password.</p>
        <form onSubmit={submit} className="space-y-4">
          <FormField id="email" label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
          <div className="flex gap-2 justify-center">
            <Button type="button" variant="secondary" onClick={() => navigate('/login')}>Back to sign in</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send reset email'}</Button>
          </div>
        </form>
      </Card>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
