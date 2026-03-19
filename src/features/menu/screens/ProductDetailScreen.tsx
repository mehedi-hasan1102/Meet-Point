"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { menuApi } from '@/features/menu/services/menu-api';
import type { MenuItem } from '@/features/menu/types';

const ProductDetailScreen = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0];
  const addItem = useCartStore((s) => s.addItem);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadItem = async () => {
      if (!id) {
        setItem(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await menuApi.getMenuItem(id);
      setItem(data ?? null);
      setLoading(false);
    };

    void loadItem();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 text-center text-muted-foreground">লোড হচ্ছে...</div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold">আইটেমটি পাওয়া যায়নি</h1>
          <Link href="/menu" className="mt-4 inline-block text-primary hover:underline">মেনুতে ফিরে যান</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-16">
        <Link href="/menu" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> মেনুতে ফিরে যান
        </Link>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-lg">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover aspect-square md:aspect-[4/3]" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-3">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground capitalize">{tag}</span>
              ))}
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{item.name}</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">{item.description}</p>
            <p className="mt-6 font-display text-3xl font-bold text-primary">{formatCurrency(item.price)}</p>

            {!item.available ? (
              <div className="mt-6 rounded-md bg-destructive/10 p-4 text-center text-destructive font-medium">
                বর্তমানে পাওয়া যাচ্ছে না
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">পরিমাণ:</span>
                  <div className="flex items-center border border-border rounded-md">
                    <Button variant="secondary" size="icon" className="h-10 w-10" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-medium">{quantity}</span>
                    <Button variant="secondary" size="icon" className="h-10 w-10" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button size="lg" className="w-full md:w-auto" onClick={() => { addItem(item, quantity); setQuantity(1); }}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  কার্টে যোগ করুন - {formatCurrency(item.price * quantity)}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailScreen;
