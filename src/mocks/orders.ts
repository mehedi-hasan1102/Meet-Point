import type { Order } from "@/features/orders/types";
import { menuItems } from "@/mocks/menu";

export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    items: [
      { menuItem: menuItems[6], quantity: 2 },
      { menuItem: menuItems[14], quantity: 2 },
    ],
    subtotal: 43.96,
    tax: 3.52,
    total: 47.48,
    status: "delivered",
    createdAt: "2024-12-15T18:30:00Z",
    customerName: "মেহেদী হাসান",
    deliveryAddress: "বাড়ি ২২, ধানমন্ডি, ঢাকা ১২০৯",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    items: [
      { menuItem: menuItems[3], quantity: 1 },
      { menuItem: menuItems[11], quantity: 1 },
    ],
    subtotal: 45.98,
    tax: 3.68,
    total: 49.66,
    status: "preparing",
    createdAt: "2024-12-20T19:15:00Z",
    customerName: "নাবিলা ইসলাম",
    deliveryAddress: "রোড ৭, ধানমন্ডি, ঢাকা ১২০৫",
  },
];

