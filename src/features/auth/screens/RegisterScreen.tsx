"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RegisterScreen = () => {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return;
    const success = await register(form.name, form.email, form.password);
    if (success) {
      router.push('/dashboard');
      return;
    }

    setError('নতুন রেজিস্ট্রেশন বন্ধ আছে। অ্যাডমিন থেকে একাউন্ট যোগ করতে হবে।');
  };

  return (
    <Layout>
      <div className="container flex items-center justify-center py-16 md:py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">একাউন্ট তৈরি করুন</h1>
            <p className="mt-2 text-muted-foreground">আজই Meet POINT এর সাথে যুক্ত হোন</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div><Label htmlFor="name">পূর্ণ নাম</Label><Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required /></div>
            <div><Label htmlFor="email">ইমেইল</Label><Input id="email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required /></div>
            <div><Label htmlFor="password">পাসওয়ার্ড</Label><Input id="password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required /></div>
            <div><Label htmlFor="confirm">পাসওয়ার্ড নিশ্চিত করুন</Label><Input id="confirm" type="password" value={form.confirm} onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))} required /></div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" size="lg">একাউন্ট তৈরি করুন</Button>
            <p className="text-center text-sm text-muted-foreground">
              আগে থেকেই একাউন্ট আছে? <Link href="/login" className="text-primary hover:underline font-medium">সাইন ইন</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterScreen;
