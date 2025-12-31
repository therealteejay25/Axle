'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { api } from '@/lib/api';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showToast('error', 'Please enter your email');
      return;
    }

    if (!password) {
      showToast('error', 'Please enter your password');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await api.register(email, password, name || undefined);
        showToast('success', 'Account created. Welcome!');
      } else {
        await api.login(email, password);
        showToast('success', 'Welcome back!');
      }

      router.replace('/dashboard');
    } catch (error: any) {
      showToast('error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.svg" alt="Axle" className="w-12 h-12" />
            {/* <h1 className="text-3xl font-bold">
              Axle
            </h1> */}
          </div>
          {/* <p className="text-muted-foreground">
            Sign in to your account
          </p> */}
        </div>

        <Card variant="glass" className="md:p-10 p-6 border-2 border-white/4 rounded-3xl">
          <>
            <div className="flex items-center justify-center gap-2 mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`text-sm font-medium px-4 py-2 rounded-full border-2 border-white/5 ${
                  mode === 'login' ? 'bg-white/8 text-white' : 'text-white/50 hover:text-white'
                }`}
                disabled={loading}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`text-sm font-medium px-4 py-2 rounded-full border-2 border-white/5 ${
                  mode === 'signup' ? 'bg-white/8 text-white' : 'text-white/50 hover:text-white'
                }`}
                disabled={loading}
              >
                Sign up
              </button>
            </div>

            <p className="md:text-xl text-lg font-semibold mb-6 text-center">
              {mode === 'signup'
                ? 'Create your Axle account.'
                : 'Sign in to continue to Axle.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' ? (
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="bg-white/4 placeholder:text-white/35 border-2 border-white/3 text-base"
                />
              ) : null}

              <Input
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoFocus
                className="bg-white/4 placeholder:text-white/35 border-2 border-white/3 text-base"
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-white/4 placeholder:text-white/35 border-2 border-white/3 text-base"
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full bg-base rounded-full p-3 cursor-pointer text-white"
                loading={loading}
              >
                {mode === 'signup' ? 'Create account' : 'Log in'}
              </Button>
            </form>
          </>
        </Card>

        <p className="text-center md:text-sm flex gap-1 flex-wrap justify-center items-center text-xs text-muted-foreground mt-6">
          {mode === 'signup' ? (
            <>Already have an account? <button type="button" onClick={() => setMode('login')} className="text-[#36B460] font-medium hover:underline" disabled={loading}>Log in</button></>
          ) : (
            <>New here? <button type="button" onClick={() => setMode('signup')} className="text-[#36B460] font-medium hover:underline" disabled={loading}>Create an account</button></>
          )}
        </p>
      </div>
    </div>
  );
}
