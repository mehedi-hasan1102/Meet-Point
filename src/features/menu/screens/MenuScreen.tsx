"use client";

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { FoodCard } from '@/features/menu/components/FoodCard';
import { menuItems, categories } from '@/mocks/menu';
import { Button } from '@/components/ui/button';
import { WhatsAppOrderButton } from '@/components/layout/WhatsAppOrderButton';

const MenuScreen = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return menuItems;
    return menuItems.filter((i) => i.category === activeCategory);
  }, [activeCategory]);

  const handleCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (slug === 'all') params.delete('category');
    else params.set('category', slug);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <Layout>
      <section className="container py-10 pb-28 md:py-16 md:pb-16">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">আমাদের মেনু</h1>
          <p className="mt-2 text-muted-foreground">আমাদের সব জনপ্রিয় ও যত্নে প্রস্তুত করা খাবার একসাথে দেখুন</p>
          <WhatsAppOrderButton className="mt-5 max-w-sm" />
        </div>

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategory('all')}
          >
            সব
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategory(cat.slug)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">এই ক্যাটাগরিতে কোনো আইটেম পাওয়া যায়নি।</p>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default MenuScreen;
