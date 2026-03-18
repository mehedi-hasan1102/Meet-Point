"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const OrderConfirmationScreen = () => {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'ORD-UNKNOWN';

  return (
    <Layout>
      <div className="container py-20 text-center max-w-lg mx-auto">
        <div className="animate-fade-in">
          <CheckCircle className="mx-auto h-20 w-20 text-success" />
          <h1 className="mt-6 font-display text-3xl font-bold text-foreground">অর্ডার নিশ্চিত হয়েছে!</h1>
          <p className="mt-3 text-muted-foreground">
            আপনার অর্ডারের জন্য ধন্যবাদ। আমরা এখন আপনার খাবার প্রস্তুত করছি।
          </p>

          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">অর্ডার নম্বর</p>
            <p className="font-display text-2xl font-bold text-primary mt-1">{orderNumber}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              আনুমানিক ডেলিভারি সময়: ৩০–৪৫ মিনিট
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/menu">আরও অর্ডার করুন</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">হোমে ফিরে যান</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmationScreen;
