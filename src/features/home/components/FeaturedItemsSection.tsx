"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FoodCard } from "@/features/menu/components/FoodCard";
import type { MenuItem } from "@/features/menu/types";

interface FeaturedItemsSectionProps {
  items: MenuItem[];
}

export function FeaturedItemsSection({ items }: FeaturedItemsSectionProps) {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:items-end sm:text-left">
          <div>
            <p className="bn-label text-xs font-semibold text-primary">প্রিয় মেনু</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">নতুন খাবার</h2>
          </div>
          <Button asChild variant="secondary" className="w-full self-center sm:w-auto sm:self-auto">
            <Link href="/menu">
              সব আইটেম দেখুন <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

