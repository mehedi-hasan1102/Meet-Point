"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'হোম', to: '/' },
  { label: 'মেনু', to: '/menu' },
  { label: 'কার্ট', to: '/cart' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !isScrolled && !mobileOpen;
  const itemCount = useCartStore((s) => (s.hasHydrated ? s.getItemCount() : 0));
  const { isAuthenticated, logout, hasHydrated, syncSession } = useAuthStore();

  useEffect(() => {
    const updateTopStripVisibility = () => {
      const currentY = window.scrollY;
      const nextIsScrolled = currentY > 24;

      setIsScrolled(nextIsScrolled);

      lastScrollYRef.current = currentY;
      tickingRef.current = false;
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(updateTopStripVisibility);
    };

    lastScrollYRef.current = window.scrollY;
    updateTopStripVisibility();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHomePage]);

  useEffect(() => {
    if (hasHydrated) {
      void syncSession();
    }
  }, [hasHydrated, syncSession]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        isTransparent
          ? 'border-b border-white/10 bg-black/30 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm supports-[backdrop-filter]:bg-black/20'
          : 'border-b border-border/70 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85'
      }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Meet Point Cafe & Restaurant"
            width={108}
            height={108}
            priority
            className="h-16 w-auto sm:h-[4.5rem]"
          />
          <span className="flex flex-col leading-none">
            <span
              className={`font-display text-2xl font-bold uppercase sm:text-3xl ${
                isTransparent ? 'text-warm-cream' : 'text-primary'
              }`}
            >
              Meet Point
            </span>
            <span
              className={`text-[0.65rem] font-semibold uppercase tracking-[0.28em] ${
                isTransparent ? 'text-warm-cream/72' : 'text-muted-foreground'
              }`}
            >
              Cafe & Restaurant
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`text-[0.95rem] font-semibold tracking-wide transition-colors hover:text-primary ${
                pathname === link.to
                  ? isTransparent
                    ? 'text-gold'
                    : 'text-primary'
                  : isTransparent
                    ? 'text-warm-cream/85 hover:text-warm-cream'
                    : 'text-foreground/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/cart"
            className={`relative p-2.5 transition-colors hover:text-primary ${
              isTransparent ? 'text-warm-cream' : 'text-foreground'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>

          {hasHydrated && isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="secondary" size="sm">
                <Link href="/dashboard">
                  <User className="mr-1 h-4 w-4" /> একাউন্ট
                </Link>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
              >
                লগআউট
              </Button>
            </div>
          ) : null}

          <Button asChild className="hidden lg:inline-flex px-5">
            <Link href="/menu">অর্ডার করুন</Link>
          </Button>

          <button
            className={`p-2 lg:hidden ${isTransparent ? 'text-warm-cream' : 'text-foreground'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 lg:hidden animate-fade-in">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                onClick={() => setMobileOpen(false)}
                className={`py-2 text-sm font-semibold ${
                  pathname === link.to ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {hasHydrated && isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium text-muted-foreground">একাউন্ট</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="py-2 text-left text-sm font-medium text-muted-foreground">লগআউট</button>
              </>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}
