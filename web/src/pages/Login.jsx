import React, { useState } from 'react';
import Card from '../components/Card';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { useAuth } from '../contexts/useAuth';
import { useNavigate, useLocation } from 'react-router-dom'
import Toast from '../components/Toast';
import LogoTransition from '../components/LogoTransition'
import { isEmail, isPasswordValid } from '../utils/validators'
import ReactLogo from '../assets/react.svg'

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
      setTimeout(() => setShowLogo(true), 1200)
    } catch (err) {
      console.error('login error', err?.response || err)
      // If server returns 403 for unverified email, send user to check-email screen
      const status = err?.response?.status
      const serverMsg = err?.response?.data?.message
      if (status === 403) {
        setToast({ message: serverMsg || 'Email not verified. Check your inbox.', type: 'error' })
        // navigate to check-email with email so user can resend verification
        setTimeout(() => navigate('/check-email', { state: { email } }), 1600)
      } else {
        setToast({ message: serverMsg || 'Failed to sign in', type: 'error' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left illustration - visible on md+ */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-8">
        <div className="max-w-md text-center">
          <img src={ReactLogo} alt="Illustration" className="w-48 h-48 mx-auto mb-6" />
          <h2 className="text-3xl font-semibold mb-2">Welcome back</h2>
          <p className="text-muted">Sign in to manage medications, reminders and caregivers—all in one place.</p>
        </div>
  </div>

      {/* Right / Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        {showLogo ? (
          <LogoTransition onComplete={() => navigate(from.pathname || '/dashboard', { replace: true })} />
        ) : (
          <Card className="w-full max-w-lg shadow-lg rounded-2xl p-6 md:p-10">
            <div className="mb-6 text-center md:text-left">
              <h1 className="text-h1 font-semibold">Sign in</h1>
              <p className="text-sm text-muted mt-2">Enter your email and password to continue.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <FormField id="email" label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" error={fieldErrors.email} />
              <FormField id="password" label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" error={fieldErrors.password} />

              <div className="flex items-center justify-between mt-2">
                <button type="button" className="text-sm text-[var(--color-primary)] hover:underline" onClick={()=>navigate('/forgot-password')}>Forgot password?</button>
                <button type="button" className="text-sm text-[var(--color-primary)] hover:underline" onClick={()=>navigate('/signup')}>Don’t have an account? Sign up</button>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {toast && !showLogo && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}

