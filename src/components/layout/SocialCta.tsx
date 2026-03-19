"use client";

import { useState } from 'react';
import { Facebook, Instagram, MessageCircleMore, X } from 'lucide-react';
import { siteContact } from '@/constants/site-contact';
import { getWhatsAppOrderUrl } from '@/constants/whatsapp';

const socialActions = [
  {
    label: 'হোয়াটসঅ্যাপ',
    href: getWhatsAppOrderUrl(),
    icon: MessageCircleMore,
    className: 'bg-[#25D366] hover:bg-[#1ebe5d]',
  },
  {
    label: 'মেসেঞ্জার',
    href: siteContact.social.messengerUrl,
    icon: Facebook,
    className: 'bg-[#1877F2] hover:bg-[#0f67d8]',
  },
  {
    label: 'ইনস্টাগ্রাম',
    href: siteContact.social.instagramUrl,
    icon: Instagram,
    className: 'bg-[#E4405F] hover:bg-[#cf3352]',
  },
];

export function SocialCta() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-200 ${
          isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
        aria-hidden={!isOpen}
      >
        {socialActions.map((action) => {
          const Icon = action.icon;

          return (
            <a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.2)] transition-colors ${action.className}`}
            >
              <Icon className="h-4 w-4" />
              {action.label}
            </a>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-14 items-center gap-3 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_16px_36px_rgba(180,48,38,0.32)] transition-transform duration-200 hover:scale-[1.02]"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'সোশ্যাল কন্টাক্ট মেনু বন্ধ করুন' : 'সোশ্যাল কন্টাক্ট মেনু খুলুন'}
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircleMore className="h-5 w-5" />}
        যোগাযোগ করুন
      </button>
    </div>
  );
}
