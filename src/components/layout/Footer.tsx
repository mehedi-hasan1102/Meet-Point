import Image from 'next/image';
import Link from 'next/link';

import { siteContact } from '@/constants/site-contact';
import { getWhatsAppOrderUrl } from '@/constants/whatsapp';

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-charcoal text-warm-cream">
      <div className="container py-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <Image
                src="/logo.png"
                alt={siteContact.restaurant.name}
                width={160}
                height={160}
                className="h-24 w-auto sm:h-28"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-3xl font-bold uppercase text-gold">{siteContact.restaurant.shortName}</span>
                <span className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-warm-cream/70">
                  Cafe & Restaurant
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-warm-cream/70">
              ডাইন-ইন, টেকঅ্যাওয়ে এবং হোম ডেলিভারির জন্য একটি প্রিমিয়াম খাবারের ঠিকানা।
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold">দ্রুত লিংক</h4>
            <div className="flex flex-col gap-2">
              {[['হোম', '/'], ['মেনু', '/menu'], ['কার্ট', '/cart'], ['লগইন', '/login']].map(([label, to]) => (
                <Link key={to} href={to} className="text-sm text-warm-cream/70 transition-colors hover:text-gold">{label}</Link>
              ))}
              <a href={getWhatsAppOrderUrl()} target="_blank" rel="noreferrer" className="text-sm text-warm-cream/70 transition-colors hover:text-gold">
                হোয়াটসঅ্যাপে অর্ডার করুন
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold">খোলার সময়</h4>
            <div className="space-y-1 text-sm text-warm-cream/70">
              <p>{siteContact.openingHours.weekday}</p>
              <p>{siteContact.openingHours.friday}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold">যোগাযোগ</h4>
            <div className="space-y-1 text-sm text-warm-cream/70">
              <p>{siteContact.location.address}</p>
              <p>{siteContact.contact.phoneDisplay}</p>
              <p>{siteContact.contact.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-warm-cream/10 pt-6 text-center text-xs text-warm-cream/45">
          © {new Date().getFullYear()} Meet POINT. সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
}
