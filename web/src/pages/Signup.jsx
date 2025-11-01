import React, { useState } from 'react';
import Card from '../components/Card';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { useAuth } from '../contexts/useAuth';
import Toast from '../components/Toast';
import { isEmail, isPasswordValid, isNameValid } from '../utils/validators'
import { useNavigate } from 'react-router-dom'
import ReactLogo from '../assets/react.svg'

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false);
  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setFieldErrors({})
    // client-side validation
    const fe = {}
    if (!isNameValid(firstName)) fe.firstName = 'Enter a valid first name'
    if (!isNameValid(lastName)) fe.lastName = 'Enter a valid last name'
    if (!isEmail(email)) fe.email = 'Enter a valid email address'
    if (!isPasswordValid(password, 8)) fe.password = 'Password must be at least 8 characters'
    if (password !== confirmPassword) fe.confirmPassword = 'Passwords do not match'
    if (Object.keys(fe).length > 0) {
      const first = fe[Object.keys(fe)[0]]
      setToast({ message: first, type: 'error' })
      setLoading(false)
      setFieldErrors(fe)
      return
    }
    setLoading(true)
    try {
      const data = await register(firstName, lastName, email, password)
      console.log('signup success', data)
      // Show success toast and wait a few seconds before redirecting so user can read message
      setToast({ message: 'Account created, check your email to verify your account', type: 'success' })
      setTimeout(() => navigate('/check-email', { state: { email } }), 3000)
    } catch (err) {
      console.error('signup error', err?.response || err)
      const msg = err?.response?.data?.message || 'Failed to create account'
      setToast({ message: msg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left illustration - show on md+ */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-b from-rose-50 to-white p-8">
        <div className="max-w-md text-center">
          <img src={ReactLogo} alt="Illustration" className="w-48 h-48 mx-auto mb-6" />
          <h2 className="text-3xl font-semibold mb-2">Create your account</h2>
          <p className="text-muted">Join MediMate to manage medications, reminders and caregiver access.</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-lg shadow-lg rounded-2xl p-6 md:p-10">
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-h1 font-semibold">Create account</h1>
            <p className="text-sm text-muted mt-2">Start a secure account to track medication schedules.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField id="firstName" label="First name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} error={fieldErrors.firstName} />
              <FormField id="lastName" label="Last name" value={lastName} onChange={(e)=>setLastName(e.target.value)} error={fieldErrors.lastName} />
            </div>

            <FormField id="email" label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} error={fieldErrors.email} />
            <FormField id="password" label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} error={fieldErrors.password} />
            <FormField id="confirmPassword" label="Confirm password" type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} error={fieldErrors.confirmPassword} />

            <div className="flex items-center justify-between mt-2">
              <button type="button" className="text-sm text-[var(--color-primary)] hover:underline" onClick={()=>navigate('/login')}>Already have an account? Login</button>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full">{loading ? 'Creating…' : 'Sign up'}</Button>
            </div>
          </form>
        </Card>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => {
              setToast(null)
              if (toast.type === 'success') navigate('/login')
            }}
          />
        )}
      </div>
    </div>
  );
}
