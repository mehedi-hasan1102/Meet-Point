"use client";

import Link from 'next/link';
import type { MenuItem } from '@/features/menu/types';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface FoodCardProps {
  item: MenuItem;
}

export function FoodCard({ item }: FoodCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group card-hover overflow-hidden rounded-lg border border-border bg-card">
      <Link href={`/menu/${item.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {!item.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
              <span className="rounded-full bg-background px-4 py-1.5 text-sm font-semibold text-foreground">
                স্টক শেষ
              </span>
            </div>
          )}
          {item.tags.includes('popular') && item.available && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              জনপ্রিয়
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/menu/${item.id}`}>
            <h3 className="font-display text-lg font-semibold text-foreground hover:text-primary transition-colors">
              {item.name}
            </h3>
          </Link>
          <span className="font-body text-lg font-bold text-primary whitespace-nowrap">
            {formatCurrency(item.price)}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        <div className="mt-4">
          <Button
            className="w-full"
            size="sm"
            disabled={!item.available}
            onClick={() => addItem(item)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            কার্টে যোগ করুন
          </Button>
        </div>
      </div>
    </div>
  );
}
