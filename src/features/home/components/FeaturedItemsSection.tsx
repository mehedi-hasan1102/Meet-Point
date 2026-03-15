"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FoodCard } from "@/features/menu/components/FoodCard";
import type { MenuItem } from "@/features/menu/types";

interface FeaturedItemsSectionProps {
  items: MenuItem[];
}

export function FeaturedItemsSection({ items }: FeaturedItemsSectionProps) {
  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <div className="container">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="bn-label text-xs font-semibold text-primary">প্রিয় মেনু</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">নতুন খাবার</h2>
          </div>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href="/menu">সব আইটেম দেখুন</Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

