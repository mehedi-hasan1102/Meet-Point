"use client";

import { MessageCircleMore, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getDirectCallUrl, getWhatsAppOrderUrl } from "@/constants/whatsapp";

export function ReserveCtaSection() {
  return (
    <section className="hero-gradient py-16 md:py-20">
      <div className="container text-center">
        <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">আজই আপনার টেবিল বুক করুন</h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/75">
          পারিবারিক আড্ডা, জন্মদিনের আয়োজন বা ক্যাজুয়াল মিটিংয়ের জন্য এখনই আপনার আসন নিশ্চিত করুন। যেকোনো সময় কল করুন বা অনলাইনে অর্ডার দিন।
        </p>
        <div className="mx-auto mt-8 flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <Button
            asChild
            size="lg"
            className="w-full justify-center border-0 bg-[#25D366] px-7 text-white shadow-[0_10px_24px_rgba(37,211,102,0.28)] hover:bg-[#20bd5a] hover:shadow-[0_12px_28px_rgba(37,211,102,0.34)] focus-visible:ring-[#25D366]/55 sm:w-[190px]"
          >
            <a href={getWhatsAppOrderUrl()} target="_blank" rel="noreferrer">
              <MessageCircleMore className="mr-2 h-4 w-4" />
              হোয়াটসঅ্যাপ
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary" className="w-full justify-center px-7 sm:w-[190px]">
            <a href={getDirectCallUrl()}>
              <PhoneCall className="mr-2 h-4 w-4" />
              কল করুন
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

