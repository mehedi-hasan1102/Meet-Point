import type { CartItem as CartItemType } from '@/features/cart/store/cart-store';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export function CartItemRow({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      <img
        src={item.menuItem.image}
        alt={item.menuItem.name}
        className="h-20 w-20 rounded-md object-cover flex-shrink-0"
      />
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-display font-semibold text-foreground">{item.menuItem.name}</h4>
            <p className="text-sm text-muted-foreground">প্রতি পিস {formatCurrency(item.menuItem.price)}</p>
          </div>
          <span className="font-body font-bold text-foreground whitespace-nowrap">
            {formatCurrency(item.menuItem.price * item.quantity)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => removeItem(item.menuItem.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
