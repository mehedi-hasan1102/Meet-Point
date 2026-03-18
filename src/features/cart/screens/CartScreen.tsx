"use client";

import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { useCartStore } from '@/features/cart/store/cart-store';
import { CartItemRow } from '@/features/cart/components/CartItemRow';
import { Button } from '@/components/ui/button';
import { ShoppingBag, MessageCircleMore, PhoneCall } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getDirectCallUrl, getWhatsAppOrderUrl } from '@/constants/whatsapp';

const CartScreen = () => {
  const { items, getSubtotal, getTax, getTotal, clearCart, hasHydrated } = useCartStore();

  if (!hasHydrated) return null;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/40" />
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">আপনার কার্ট খালি</h1>
          <p className="mt-2 text-muted-foreground">শুরু করতে কিছু পছন্দের খাবার যোগ করুন</p>
          <Button asChild className="mt-6">
            <Link href="/menu">মেনু দেখুন</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10 md:py-16">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">আপনার কার্ট</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-border bg-card p-4 md:p-6">
              {items.map((item) => (
                <CartItemRow key={item.menuItem.id} item={item} />
              ))}
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={clearCart}>
                  কার্ট খালি করুন
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg border border-border bg-card p-6 sticky top-20">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">অর্ডার সারসংক্ষেপ</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>সাবটোটাল</span>
                  <span>{formatCurrency(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>আনুমানিক ট্যাক্স</span>
                  <span>{formatCurrency(getTax())}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-display text-lg font-bold text-foreground">
                  <span>মোট</span>
                  <span>{formatCurrency(getTotal())}</span>
                </div>
              </div>
              <Button asChild className="mt-6 w-full bg-[#25D366] text-white hover:bg-[#1ebe5d]" size="lg">
                <a href={getWhatsAppOrderUrl()} target="_blank" rel="noreferrer">
                  <MessageCircleMore className="mr-2 h-4 w-4" />
                  হোয়াটসঅ্যাপে অর্ডার করুন
                </a>
              </Button>
              <Button asChild className="mt-2 w-full" size="lg" variant="outline">
                <a href={getDirectCallUrl()}>
                  <PhoneCall className="mr-2 h-4 w-4" />
                  সরাসরি কল করুন
                </a>
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                দ্রুত সেবার জন্য আমরা সরাসরি হোয়াটসঅ্যাপে অর্ডার গ্রহণ করি। আরও অর্ডার যোগ করুন অথবা ফোন কল করুন।
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartScreen;
