"use client";

import { useRef } from "react";
import { useCountUp } from "react-countup";

const stats = [
  { end: 10000, suffix: "+", label: "সন্তুষ্ট গ্রাহক" },
  { end: 200, suffix: "+", label: "মেনু আইটেম" },
  { end: 95, suffix: "%", label: "স্বাস্থ্যকর রিপোর্ট" },
];

function StatItem({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const countUpRef = useRef<HTMLSpanElement>(null);
  useCountUp({ ref: countUpRef, end, suffix, duration: 2.5, separator: ",", enableScrollSpy: true, scrollSpyOnce: true });

  return (
    <div className="flex flex-col items-center gap-1 px-4 text-center">
      <span ref={countUpRef} className="font-display text-3xl font-bold text-[#ef2f2f] md:text-4xl" />
      <span className="text-sm font-medium text-muted-foreground md:text-base">{label}</span>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="border-b border-border bg-background py-10">
      <div className="container">
        <div className="grid grid-cols-3 divide-x divide-border">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
