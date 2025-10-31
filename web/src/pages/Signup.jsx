import React, { useState } from 'react';
import Card from '../components/Card';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';
import { isEmail, isPasswordValid, isNameValid } from '../utils/validators'

export default function Signup({ onNavigate }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({})
  const [toast, setToast] = useState(null)

  const { register } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    // client-side validation
    const fieldErrors = {}
    if (!isNameValid(firstName)) fieldErrors.firstName = 'Enter a valid first name'
    if (!isNameValid(lastName)) fieldErrors.lastName = 'Enter a valid last name'
    if (!isEmail(email)) fieldErrors.email = 'Enter a valid email address'
    if (!isPasswordValid(password, 8)) fieldErrors.password = 'Password must be at least 8 characters'
    if (Object.keys(fieldErrors).length > 0) {
      // show first error as toast and set inline errors
      const first = fieldErrors[Object.keys(fieldErrors)[0]]
      setToast({ message: first, type: 'error' })
      setLoading(false)
      setFieldErrors(fieldErrors)
      return
    }
    setLoading(true)
    try {
      const data = await register(firstName, lastName, email, password)
    console.log('signup success', data)
  setToast({ message: 'Account created — you can sign in now', type: 'success' })
  setTimeout(() => onNavigate('login'), 800)
    } catch (err) {
      console.error('signup error', err?.response || err)
  const msg = err?.response?.data?.message || 'Failed to create account'
  setError(msg)
  setToast({ message: msg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-h1 font-semibold mb-4">Create account</h1>
  {error && <div className="mb-3 text-sm text-red-500">{error}</div>}
        <form onSubmit={submit}>
          <FormField id="firstName" label="First name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} error={fieldErrors.firstName} />
          <FormField id="lastName" label="Last name" value={lastName} onChange={(e)=>setLastName(e.target.value)} error={fieldErrors.lastName} />
          <FormField id="email" label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} error={fieldErrors.email} />
          <FormField id="password" label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} error={fieldErrors.password} />
          <div className="flex items-center justify-between mt-4">
            <Button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</Button>
            <button type="button" className="text-sm text-[var(--color-primary)]" onClick={()=>onNavigate('login')}>Already have an account?</button>
          </div>
        </form>
      </Card>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
