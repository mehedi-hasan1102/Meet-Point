import type { Category, MenuItem as PrismaMenuItem, Order as PrismaOrder, OrderItem as PrismaOrderItem } from "@prisma/client";

type OrderWithItems = PrismaOrder & {
  items: Array<
    PrismaOrderItem & {
      menuItem: PrismaMenuItem & {
        category: Category;
      };
    }
  >;
};

export function toOrderResponse(order: OrderWithItems) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    createdAt: order.createdAt,
    customerName: order.customerName,
    deliveryAddress: order.deliveryAddress,
    items: order.items.map((item) => ({
      quantity: item.quantity,
      menuItem: {
        id: item.menuItem.id,
        name: item.menuItem.name,
        description: item.menuItem.description,
        price: item.unitPrice,
        image: item.menuItem.image,
        available: item.menuItem.available,
        featured: item.menuItem.featured,
        tags: item.menuItem.tags,
        category: item.menuItem.category.slug,
      },
    })),
  };
}
