'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { api } from '@/lib/api';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showToast('error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await api.sendMagicLink(email);
      setSent(true);
      showToast('success', 'Magic link sent! Check your inbox.');
    } catch (error: any) {
      showToast('error', error.message || 'Failed to send magic link');
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
          {!sent ? (
            <>
              <p className="md:text-xl text-lg font-semibold mb-6 text-center">Enter your email to continue to Axle.</p>
              
              <form onSubmit={handleSendMagicLink} className="space-y-5">
                <Input
                  type="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // label="Email address"
                  disabled={loading}
                  autoFocus
                  className='bg-white/4 placeholder:text-white/35 border-2 border-white/3 text-base'
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full bg-base rounded-full p-3 cursor-pointer text-white"
                  loading={loading}
                  icon={<Mail size={20} />}
                >
                  Send Magic Link
                </Button>
              </form>

              <p className="md:text-sm text-xs text-muted-foreground text-center mt-6">
                We'll email you a magic link for a password-free sign in.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Check Your Inbox</h2>
              <p className="text-muted-foreground text-sm mb-2">
                We've sent a magic link to <strong>{email}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Click the link in the email to sign in. The link expires in 10 minutes.
              </p>
              
              <button
                onClick={() => setSent(false)}
                className="text-[#36B460] hover:underline text-sm mt-6"
              >
                Use a different email
              </button>
            </div>
          )}
        </Card>

        <p className="text-center md:text-sm flex gap-1 flex-wrap justify-center items-center text-xs text-muted-foreground mt-6">
          Don't have an account?{' '} 
          <span className="text-[#36B460] font-medium">
             Enter your email above to create one
          </span>
        </p>
      </div>
    </div>
  );
}
