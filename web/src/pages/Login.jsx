import React, { useState } from 'react';
import Card from '../components/Card';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { useAuth } from '../contexts/useAuth';
import { useNavigate, useLocation } from 'react-router-dom'
import Toast from '../components/Toast';
import LogoTransition from '../components/LogoTransition'
import { isEmail, isPasswordValid } from '../utils/validators'


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [showLogo, setShowLogo] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state && location.state.from) || { pathname: '/dashboard' }

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
          // wait a short moment so the success toast is readable, then show logo transition
          setTimeout(() => setShowLogo(true), 3000)
    } catch (err) {
      console.error('login error', err?.response || err)
      // If server returns 403 for unverified email, send user to check-email screen
      const status = err?.response?.status
      const serverMsg = err?.response?.data?.message
      if (status === 403) {
        // navigate to check-email with email so user can resend verification
       setTimeout(() => navigate('/check-email', { state: { email } }), 3000)
        setToast({ message: serverMsg || 'Email not verified. Check your inbox.', type: 'error' })
      } else {
        setToast({ message: serverMsg || 'Failed to sign in', type: 'error' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {showLogo ? (
        <LogoTransition onComplete={() => navigate(from.pathname || '/dashboard', { replace: true })} />
      ) : (
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
      )}
      
  {toast && !showLogo && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

