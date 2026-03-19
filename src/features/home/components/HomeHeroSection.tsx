"use client";

import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getDirectCallUrl } from "@/constants/whatsapp";
import { formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/features/menu/types";

interface HomeHeroSectionProps {
  signaturePicks: Array<Pick<MenuItem, "id" | "name" | "image" | "category" | "price">>;
  categoryLabelMap: Record<string, string>;
}

export function HomeHeroSection({ signaturePicks, categoryLabelMap }: HomeHeroSectionProps) {
  return (
    <section className="alk-hero relative -mt-20 overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="container relative grid min-h-screen gap-12 pb-16 pt-28 md:pb-24 md:pt-32 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="animate-fade-in text-center lg:text-left">
          <span className="bn-label mb-6 inline-block rounded-full border border-gold/35 bg-black/20 px-4 py-1.5 text-xs font-semibold text-gold">
            মিট পয়েন্টে স্বাগতম
          </span>
          <h1 className="mx-auto max-w-2xl font-display text-4xl font-bold leading-tight text-warm-cream sm:text-5xl md:text-6xl lg:mx-0">
            আসল স্বাদ,
            <br />
            যত্নে পরিবেশন
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-warm-cream/80 md:text-lg lg:mx-0">
            এক জায়গায় পেয়ে যান রেস্টুরেন্ট-স্টাইলের খাবার, স্পেশাল কম্বো অফার এবং হোম ডেলিভারি। প্রতিটি পদে তাজা উপকরণ ও ঘরোয়া সমৃদ্ধ স্বাদ।
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Button asChild size="lg" className="px-7">
              <Link href="/menu">
                মেনু দেখুন <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="px-7">
              <a href={getDirectCallUrl()}>
                <PhoneCall className="mr-2 h-4 w-4" />
                কল করুন
              </a>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-warm-cream backdrop-blur-sm">
          <h2 className="font-display text-2xl font-semibold">আজকের সিগনেচার আইটেম</h2>
          <p className="mt-1 text-sm text-warm-cream/70">শেফের বিশেষ পছন্দের পদ</p>
          <div className="mt-6 space-y-4">
            {signaturePicks.map((item) => (
              <Link
                key={item.id}
                href={`/menu/${item.id}`}
                className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
                aria-label={`${item.name} দেখুন এবং অর্ডার করুন`}
              >
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" loading="lazy" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="text-xs text-warm-cream/65">{categoryLabelMap[item.category] ?? item.category}</p>
                </div>
                <span className="text-sm font-bold text-gold">{formatCurrency(item.price)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
