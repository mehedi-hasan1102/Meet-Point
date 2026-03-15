"use client";

import { CalendarCheck2, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ReserveCtaSection() {
  return (
    <section className="hero-gradient py-16 md:py-20">
      <div className="container text-center">
        <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">আজই আপনার টেবিল বুক করুন</h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/75">
          পারিবারিক আড্ডা, জন্মদিনের আয়োজন বা ক্যাজুয়াল মিটিংয়ের জন্য এখনই আপনার আসন নিশ্চিত করুন। যেকোনো সময় কল করুন বা অনলাইনে অর্ডার দিন।
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" className="gold-gradient border-0 px-7 text-charcoal hover:opacity-90">
            <CalendarCheck2 className="mr-2 h-4 w-4" />
            টেবিল রিজার্ভ করুন
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/40 bg-transparent px-7 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <PhoneCall className="mr-2 h-4 w-4" />
            +880 1712-345678
          </Button>
        </div>
      </div>
    </section>
  );
}

