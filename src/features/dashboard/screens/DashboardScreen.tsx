"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { mockOrders } from '@/mocks/orders';
import { Button } from '@/components/ui/button';
import { Package, User, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

type Tab = 'orders' | 'profile' | 'addresses';

const statusLabelMap: Record<string, string> = {
  pending: 'অপেক্ষমাণ',
  preparing: 'প্রস্তুত হচ্ছে',
  ready: 'প্রস্তুত',
  delivered: 'ডেলিভারড',
  cancelled: 'বাতিল',
};

const DashboardScreen = () => {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || !isAuthenticated) return null;

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'orders', label: 'অর্ডারসমূহ', icon: Package },
    { key: 'profile', label: 'প্রোফাইল', icon: User },
    { key: 'addresses', label: 'ঠিকানা', icon: MapPin },
  ];

  return (
    <Layout>
      <div className="container py-10 md:py-16">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">আমার একাউন্ট</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(({ key, label, icon: Icon }) => (
            <Button key={key} variant={activeTab === key ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab(key)}>
              <Icon className="mr-2 h-4 w-4" /> {label}
            </Button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="font-display font-semibold text-foreground">{order.orderNumber}</span>
                    <span className="ml-3 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    order.status === 'delivered' ? 'bg-success/10 text-success' :
                    order.status === 'preparing' ? 'bg-accent text-accent-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>{statusLabelMap[order.status] ?? order.status}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.items.map((i) => `${i.quantity}× ${i.menuItem.name}`).join(', ')}
                </div>
                <p className="mt-2 font-semibold text-foreground">{formatCurrency(order.total)}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && user && (
          <div className="rounded-lg border border-border bg-card p-6 max-w-lg space-y-3">
            <div><span className="text-sm text-muted-foreground">নাম</span><p className="font-medium text-foreground">{user.name}</p></div>
            <div><span className="text-sm text-muted-foreground">ইমেইল</span><p className="font-medium text-foreground">{user.email}</p></div>
            <div><span className="text-sm text-muted-foreground">ফোন</span><p className="font-medium text-foreground">{user.phone}</p></div>
          </div>
        )}

        {activeTab === 'addresses' && user && (
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
            {user.addresses.map((addr) => (
              <div key={addr.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-semibold text-foreground">{addr.label}</span>
                  {addr.isDefault && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">ডিফল্ট</span>}
                </div>
                <p className="text-sm text-muted-foreground">{addr.street}</p>
                <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardScreen;
