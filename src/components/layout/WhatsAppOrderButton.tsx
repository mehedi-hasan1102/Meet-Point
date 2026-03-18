import { MessageCircleMore, PhoneCall } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { getDirectCallUrl, getWhatsAppOrderUrl } from '@/constants/whatsapp';

interface WhatsAppOrderButtonProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
  desktopInline?: boolean;
}

export function WhatsAppOrderButton({
  className,
  size = 'lg',
  fullWidth = false,
  desktopInline = false,
}: WhatsAppOrderButtonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className={cn('flex flex-col gap-2', desktopInline && 'md:flex-row')}>
        <Button
          asChild
          size={size}
          className={cn('bg-[#25D366] text-white hover:bg-[#1ebe5d]', fullWidth && 'w-full', desktopInline && 'md:flex-1')}
        >
          <a href={getWhatsAppOrderUrl()} target="_blank" rel="noreferrer" aria-label="হোয়াটসঅ্যাপে অর্ডার করুন">
            <MessageCircleMore className="mr-2 h-4 w-4" />
            হোয়াটসঅ্যাপে অর্ডার করুন
          </a>
        </Button>
        <Button asChild size={size} variant="outline" className={cn(fullWidth && 'w-full', desktopInline && 'md:flex-1')}>
          <a href={getDirectCallUrl()} aria-label="সরাসরি কল করুন">
            <PhoneCall className="mr-2 h-4 w-4" />
            সরাসরি কল করুন
          </a>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        দ্রুত সেবার জন্য আমরা সরাসরি হোয়াটসঅ্যাপে অর্ডার গ্রহণ করি। আরও অর্ডার যোগ করুন অথবা ফোন কল করুন।
      </p>
    </div>
  );
}
