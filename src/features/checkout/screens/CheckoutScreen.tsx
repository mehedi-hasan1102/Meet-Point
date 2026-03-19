"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneCall } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getDirectCallUrl, getWhatsAppUrlWithMessage, RESTAURANT_NAME } from '@/constants/whatsapp';
import { apiClient } from '@/services/api-client';

const BKASH_PAYMENT_NUMBER = '+8801747874773';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    try {
      const response = await apiClient.post<{ data?: { orderNumber?: string } }>('/orders', {
        customerName: `${form.firstName} ${form.lastName}`.trim(),
        customerPhone: form.phone,
        deliveryAddress: `${form.street}, ${form.city}, ${form.state}`,
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
        })),
      });

      if (response.data?.data?.orderNumber) {
        orderNumber = response.data.data.orderNumber;
      }
    } catch {
      // Continue with WhatsApp flow even if order persistence fails.
    }

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
              <h2 className="font-display text-xl font-semibold mb-4">অর্ডার করার নিয়ম</h2>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="rounded-md border border-border bg-muted/30 p-4">
                  <p className="font-medium text-foreground">bKash Payment Number: {BKASH_PAYMENT_NUMBER}</p>
                  <p className="mt-1">পেমেন্ট করার সময় সঠিক নম্বর ও এমাউন্ট নিশ্চিত করুন।</p>
                </div>

                <div>
                  <p className="font-medium text-foreground">Step by Step:</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5">
                    <li>উপরের bKash নম্বরে আপনার অর্ডারের মোট টাকা `Send Money` করুন।</li>
                    <li>bKash থেকে পাওয়া `Transaction ID` নিচের পেমেন্ট ফিল্ডে লিখুন।</li>
                    <li>আপনার নাম, ফোন নম্বর ও সম্পূর্ণ ঠিকানা সঠিকভাবে পূরণ করুন।</li>
                    <li>`অর্ডার নিশ্চিত করুন` বাটনে ক্লিক করলে WhatsApp খুলবে এবং অর্ডার তথ্য চলে যাবে।</li>
                    <li>WhatsApp এ অর্ডার মেসেজটি `Send` করে অর্ডার সম্পন্ন করুন।</li>
                  </ol>
                  <p className="mt-3">
                    WhatsApp ব্যবহার করতে না চাইলে নিচের `সরাসরি কল করুন` বাটনে ক্লিক করে ফোন কলের মাধ্যমেও অর্ডার করতে পারবেন।
                  </p>
                </div>

                <div>
                  <p className="font-medium text-foreground">প্রয়োজনীয় তথ্য:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>গ্রাহকের নাম</li>
                    <li>ফোন নম্বর</li>
                    <li>ডেলিভারি ঠিকানা (রাস্তা, শহর, এলাকা)</li>
                    <li>bKash Transaction No</li>
                  </ul>
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
              <Button asChild className="mt-2 w-full" size="lg" variant="secondary">
                <a href={getDirectCallUrl()}>
                  <PhoneCall className="mr-2 h-4 w-4" />
                  সরাসরি কল করুন
                </a>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CheckoutScreen;
