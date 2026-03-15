"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { MenuItem } from "@/features/menu/types";

interface ShowcaseRailSectionProps {
  title: string;
  subtitle: string;
  items: MenuItem[];
  categoryLabelMap: Record<string, string>;
}

export function ShowcaseRailSection({ title, subtitle, items, categoryLabelMap }: ShowcaseRailSectionProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const updateScrollButtons = () => {
      const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
      setCanScrollLeft(rail.scrollLeft > 8);
      setCanScrollRight(maxScrollLeft - rail.scrollLeft > 8);
    };

    updateScrollButtons();
    rail.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      rail.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scrollRail = (direction: "left" | "right") => {
    const rail = railRef.current;
    if (!rail) return;
    const step = Math.max(260, Math.floor(rail.clientWidth * 0.52));
    rail.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <section className="border-b border-border bg-[#efe8dc] py-14 md:py-16">
      <div className="container">
        <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="bn-label text-xs font-semibold text-[#b47b31]">{subtitle}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-[#1f1a17] md:text-4xl">{title}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollRail("left")}
              className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#ef2f2f] text-white shadow-[0_12px_24px_rgba(239,47,47,0.22)] transition-all duration-200 hover:bg-[#db2323] ${
                canScrollLeft ? "opacity-100" : "pointer-events-none opacity-40"
              }`}
              aria-label="Scroll showcase left"
              aria-hidden={!canScrollLeft}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollRail("right")}
              className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#ef2f2f] text-white shadow-[0_12px_24px_rgba(239,47,47,0.22)] transition-all duration-200 hover:bg-[#db2323] ${
                canScrollRight ? "opacity-100" : "pointer-events-none opacity-40"
              }`}
              aria-label="Scroll showcase right"
              aria-hidden={!canScrollRight}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/menu/${item.id}`}
              className="group min-w-[170px] shrink-0 snap-start text-center sm:min-w-[185px] lg:min-w-[205px]"
            >
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#eef6ff,transparent_42%),linear-gradient(180deg,#dce8f3_0%,#c6d9e7_100%)] p-3 shadow-[0_18px_32px_rgba(79,63,45,0.12)] transition-transform duration-300 group-hover:-translate-y-1 sm:h-44 sm:w-44 lg:h-48 lg:w-48">
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[6px] border-[#f7fbff] bg-[#d7e6f1] shadow-[inset_0_10px_20px_rgba(255,255,255,0.55),inset_0_-10px_18px_rgba(90,112,129,0.1)]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="mt-5">
                <p className="bn-label text-[0.72rem] font-semibold text-[#9a8671]">
                  {categoryLabelMap[item.category] ?? item.category}
                </p>
                <p className="mx-auto mt-2 max-w-[14rem] text-sm font-semibold leading-6 text-[#1f1a17] sm:text-[15px]">
                  {item.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

