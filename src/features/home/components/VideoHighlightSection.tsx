"use client";

export function VideoHighlightSection() {
  return (
    <section className="py-12 text-warm-cream sm:py-16 md:py-24">
      <div className="container">
        <div className="relative w-full overflow-hidden rounded-[24px] border border-black/5 shadow-[0_28px_70px_rgba(0,0,0,0.18)] sm:rounded-[32px]">
          <video
            className="h-[65svh] min-h-[420px] w-full object-cover sm:min-h-0 sm:aspect-[16/9] sm:h-auto"
            src="/hero2.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 via-black/35 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 top-0 flex items-end">
            <div className="max-w-2xl p-4 sm:p-8 md:p-10">
              <p className="bn-label text-xs font-semibold uppercase tracking-[0.2em] text-gold/85">ভিডিও হাইলাইট</p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:mt-4 md:text-5xl">
                Meet Point-এ প্রিয়জন এর সাথে সময় কাটান এক ফ্রেমে
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

