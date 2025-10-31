import React, { useState } from 'react';
import Card from '../components/Card';
import FormField from '../components/FormField';
import Button from '../components/Button';

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    // TODO: call /api/v1/auth/login
    console.log('login', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-h1 font-semibold mb-4">Sign in</h1>
        <form onSubmit={submit}>
          <FormField id="email" label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
          <FormField id="password" label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
          <div className="flex items-center justify-between mt-4">
            <Button type="submit">Sign in</Button>
            <button type="button" className="text-sm text-[var(--color-primary)]" onClick={()=>onNavigate('signup')}>Create account</button>
          </div>
        </form>
      </Card>
    </div>
  );
}
