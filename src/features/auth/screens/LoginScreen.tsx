"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginScreen = () => {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
      return;
    }

    setError('লগইন ব্যর্থ হয়েছে। শুধুমাত্র অনুমোদিত অ্যাডমিন ইমেইল ব্যবহার করুন।');
  };

  return (
    <Layout>
      <div className="container flex items-center justify-center py-16 md:py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">আবারও স্বাগতম</h1>
            <p className="mt-2 text-muted-foreground">আপনার একাউন্টে সাইন ইন করুন</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div><Label htmlFor="email">ইমেইল</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div><Label htmlFor="password">পাসওয়ার্ড</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <div className="text-right"><Link href="/forgot-password" className="text-sm text-primary hover:underline">পাসওয়ার্ড ভুলে গেছেন?</Link></div>
            <Button type="submit" className="w-full" size="lg">সাইন ইন</Button>
            <p className="text-center text-sm text-muted-foreground">
              একাউন্ট নেই? <Link href="/register" className="text-primary hover:underline font-medium">রেজিস্টার করুন</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LoginScreen;
