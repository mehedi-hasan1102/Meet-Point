"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { useCartStore } from "@/features/cart/store/cart-store";
import type { MenuItem } from "@/features/menu/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ComboOffer {
  id: string;
  name: string;
  details: string;
  price: number;
  image: string;
}

interface ComboOffersSectionProps {
  offers: ComboOffer[];
}

export function ComboOffersSection({ offers }: ComboOffersSectionProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const handleOrderCombo = (combo: ComboOffer) => {
    const comboItem: MenuItem = {
      id: combo.id,
      name: combo.name,
      description: combo.details,
      price: combo.price,
      image: combo.image,
      category: "combo",
      available: true,
      featured: true,
      tags: ["combo", "offer"],
    };

    addItem(comboItem, 1);
    router.push("/checkout");
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-10 text-center">
          <p className="bn-label text-xs font-semibold text-primary">বিশেষ অফার</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">কম্বো অফার</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {offers.map((combo) => (
            <div key={combo.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-[5/3] overflow-hidden">
                <img src={combo.image} alt={combo.name} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-md bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                  {formatCurrency(combo.price)}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl font-semibold text-foreground">{combo.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{combo.details}</p>
                <Button
                  variant="primary"
                  className="mt-4 w-full justify-center"
                  onClick={() => handleOrderCombo(combo)}
                >
                  এই কম্বো অর্ডার করুন <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

