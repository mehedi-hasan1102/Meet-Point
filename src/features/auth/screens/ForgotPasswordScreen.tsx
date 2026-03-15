"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <Layout>
      <div className="container flex items-center justify-center py-16 md:py-24">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">পাসওয়ার্ড রিসেট করুন</h1>
          <p className="mt-2 text-muted-foreground">আপনার ইমেইল দিন, আমরা একটি রিসেট লিংক পাঠিয়ে দেব</p>

          {sent ? (
            <div className="mt-8 rounded-lg border border-border bg-card p-6">
              <p className="text-success font-medium">রিসেট লিংক পাঠানো হয়েছে!</p>
              <p className="mt-2 text-sm text-muted-foreground">নির্দেশনা দেখতে আপনার ইনবক্স চেক করুন।</p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/login">লগইনে ফিরে যান</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 rounded-lg border border-border bg-card p-6 space-y-4 text-left">
              <div><Label htmlFor="email">ইমেইল</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <Button type="submit" className="w-full" size="lg">রিসেট লিংক পাঠান</Button>
              <p className="text-center text-sm text-muted-foreground">
                <Link href="/login" className="text-primary hover:underline">লগইনে ফিরে যান</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordScreen;
