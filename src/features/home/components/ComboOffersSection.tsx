"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { formatCurrency } from "@/lib/utils";

interface ComboOffer {
  name: string;
  details: string;
  price: number;
  image: string;
}

interface ComboOffersSectionProps {
  offers: ComboOffer[];
}

export function ComboOffersSection({ offers }: ComboOffersSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-10 text-center">
          <p className="bn-label text-xs font-semibold text-primary">বিশেষ অফার</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">কম্বো অফার</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {offers.map((combo) => (
            <div key={combo.name} className="overflow-hidden rounded-2xl border border-border bg-card">
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
                <Link href="/menu" className="mt-4 inline-flex text-sm font-semibold text-primary">
                  এই কম্বো অর্ডার করুন <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

