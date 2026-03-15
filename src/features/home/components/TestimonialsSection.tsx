"use client";

import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  comment: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="bg-muted/40 py-16">
      <div className="container">
        <div className="mb-8 text-center">
          <p className="bn-label text-xs font-semibold text-primary">গ্রাহকের মতামত</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground">অতিথিরা যা বলছেন</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={`${item.name}-${idx}`} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.comment}</p>
              <p className="mt-4 font-semibold text-foreground">{item.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

