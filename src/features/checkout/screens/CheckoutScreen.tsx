"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { getWhatsAppUrlWithMessage, RESTAURANT_NAME } from '@/constants/whatsapp';

const CheckoutScreen = () => {
  const router = useRouter();
  const { items, getSubtotal, getTax, getTotal, clearCart, hasHydrated } = useCartStore();
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '',
    street: '', city: '', state: '',
    bkashTransactionNo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const orderLines = items
      .map(
        (item) => `${item.quantity}x ${item.menuItem.name} - ${formatCurrency(item.menuItem.price * item.quantity)}`
      )
      .join('\n\n');

    const message = [
      `Hi, I want to place an order from ${RESTAURANT_NAME}.`,
      '',
      `Order ID: ${orderNumber}`,
      '',
      'Customer Info:',
      `Name: ${form.firstName} ${form.lastName}`,
      `Phone: ${form.phone}`,
      '',
      'Delivery Address:',
      `${form.street}, ${form.city}, ${form.state}`,
      '',
      'Payment Info:',
      `bKash Transaction No: ${form.bkashTransactionNo}`,
      '',
      'Order Items:',
      orderLines,
      '',
      `Subtotal: ${formatCurrency(getSubtotal())}`,
      `Tax: ${formatCurrency(getTax())}`,
      `Total: ${formatCurrency(getTotal())}`,
    ].join('\n');

    const whatsappUrl = getWhatsAppUrlWithMessage(message);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    clearCart();
    router.push(`/order-confirmation?order=${orderNumber}`);
  };

  useEffect(() => {
    if (hasHydrated && items.length === 0) {
      router.replace('/cart');
    }
  }, [hasHydrated, items.length, router]);

  if (!hasHydrated || items.length === 0) return null;

  return (
    <Layout>
      <div className="container py-10 md:py-16">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">চেকআউট</h1>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold mb-4">গ্রাহকের তথ্য</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="firstName">নামের প্রথম অংশ</Label><Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required /></div>
                <div><Label htmlFor="lastName">নামের শেষ অংশ</Label><Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required /></div>
                <div><Label htmlFor="phone">ফোন</Label><Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required /></div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold mb-4">ডেলিভারির ঠিকানা</h2>
              <div className="grid gap-4">
                <div><Label htmlFor="street">রাস্তার ঠিকানা</Label><Input id="street" name="street" value={form.street} onChange={handleChange} required /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label htmlFor="city">শহর</Label><Input id="city" name="city" value={form.city} onChange={handleChange} required /></div>
                  <div><Label htmlFor="state">এলাকা</Label><Input id="state" name="state" value={form.state} onChange={handleChange} required /></div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold mb-4">পেমেন্ট</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="bkashTransactionNo">bKash Transaction No</Label>
                  <Input
                    id="bkashTransactionNo"
                    name="bkashTransactionNo"
                    placeholder="উদাহরণ: B7K9X2P4Q1"
                    value={form.bkashTransactionNo}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">শুধু bKash Transaction No দিলেই অর্ডার সাবমিট করা যাবে।</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg border border-border bg-card p-6 sticky top-20">
              <h3 className="font-display text-lg font-semibold mb-4">অর্ডার সারসংক্ষেপ</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.menuItem.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.quantity}× {item.menuItem.name}</span>
                    <span className="text-foreground">{formatCurrency(item.menuItem.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-border pt-3 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>সাবটোটাল</span><span>{formatCurrency(getSubtotal())}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>ট্যাক্স</span><span>{formatCurrency(getTax())}</span></div>
                <div className="border-t border-border pt-3 flex justify-between font-display text-lg font-bold text-foreground">
                  <span>মোট</span><span>{formatCurrency(getTotal())}</span>
                </div>
              </div>
              <Button type="submit" className="w-full mt-6" size="lg">অর্ডার নিশ্চিত করুন</Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CheckoutScreen;
