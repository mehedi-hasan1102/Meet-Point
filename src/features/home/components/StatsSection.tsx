const stats = [
  { value: "১০,০০০+", label: "সন্তুষ্ট গ্রাহক" },
  { value: "২০০+", label: "মেনু আইটেম" },
  { value: "৯৫%", label: "স্বাস্থ্যকর রিপোর্ট" },
];

export function StatsSection() {
  return (
    <section className="border-b border-border bg-background py-10">
      <div className="container">
        <div className="grid grid-cols-3 divide-x divide-border">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 px-4 text-center">
              <span className="font-display text-3xl font-bold text-[#ef2f2f] md:text-4xl">{value}</span>
              <span className="text-sm font-medium text-muted-foreground md:text-base">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
