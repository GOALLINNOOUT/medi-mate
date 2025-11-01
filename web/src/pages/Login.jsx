import React, { useState } from 'react';
import Card from '../components/Card';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';
import { isEmail, isPasswordValid } from '../utils/validators'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({})
  const [toast, setToast] = useState(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
  e.preventDefault()
    // client-side validation
    const fe = {}
    if (!isEmail(email)) fe.email = 'Enter a valid email'
    if (!isPasswordValid(password, 8)) fe.password = 'Password must be at least 8 characters'
    if (Object.keys(fe).length > 0) {
      const first = fe[Object.keys(fe)[0]]
      setFieldErrors(fe)
      setToast({ message: first, type: 'error' })
      return
    }
    setFieldErrors({})
    setLoading(true)
    try {
      const data = await login(email, password)
    console.log('login success', data)
        setToast({ message: 'Signed in successfully', type: 'success' })
        setEmail('')
        setPassword('')
    } catch (err) {
      console.error('login error', err?.response || err)
      setToast({ message: err?.response?.data?.message || 'Failed to sign in', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-h1 font-semibold mb-4">Sign in</h1>
        <form onSubmit={submit}>
          <FormField id="email" label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" error={fieldErrors.email} />
          <FormField id="password" label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" error={fieldErrors.password} />
          <div className="flex items-center justify-between mt-4">
            <Button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
            <button type="button" className="text-sm text-[var(--color-primary)]" onClick={()=>navigate('/signup')}>Create account</button>
          </div>
        </form>
      </Card>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => {
              setToast(null)
              if (toast.type === 'success') navigate('/')
            }}
          />
        )}
    </div>
  );
}
