import React, { useState } from 'react';
import Card from '../components/Card';
import FormField from '../components/FormField';
import Button from '../components/Button';

export default function Signup({ onNavigate }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    // TODO: call /api/v1/auth/register
    console.log('signup', { firstName, lastName, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-h1 font-semibold mb-4">Create account</h1>
        <form onSubmit={submit}>
          <FormField id="firstName" label="First name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
          <FormField id="lastName" label="Last name" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
          <FormField id="email" label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <FormField id="password" label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <div className="flex items-center justify-between mt-4">
            <Button type="submit">Create account</Button>
            <button type="button" className="text-sm text-[var(--color-primary)]" onClick={()=>onNavigate('login')}>Already have an account?</button>
          </div>
        </form>
      </Card>
    </div>
  );
}
