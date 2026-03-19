import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { toOrderResponse } from "@/lib/order-transform";

const TAX_RATE = 0.08;

const createOrderSchema = z.object({
  customerName: z.string().trim().min(2),
  customerPhone: z.string().trim().min(6),
  deliveryAddress: z.string().trim().min(8),
  items: z
    .array(
      z.object({
        menuItemId: z.string().trim().min(1),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
});

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          menuItem: {
            include: { category: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ data: orders.map(toOrderResponse) });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const menuItemIds = payload.items.map((item) => item.menuItemId);

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
  });

  if (menuItems.length !== menuItemIds.length) {
    return NextResponse.json({ message: "One or more menu items are invalid" }, { status: 400 });
  }

  const menuMap = new Map(menuItems.map((item) => [item.id, item]));

  const subtotal = payload.items.reduce((sum, orderItem) => {
    const menuItem = menuMap.get(orderItem.menuItemId);
    return sum + (menuItem?.price || 0) * orderItem.quantity;
  }, 0);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      status: "pending",
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      deliveryAddress: payload.deliveryAddress,
      subtotal,
      tax,
      total,
      items: {
        create: payload.items.map((orderItem) => {
          const menuItem = menuMap.get(orderItem.menuItemId);
          return {
            menuItemId: orderItem.menuItemId,
            quantity: orderItem.quantity,
            unitPrice: menuItem?.price || 0,
          };
        }),
      },
    },
    include: {
      items: {
        include: {
          menuItem: {
            include: { category: true },
          },
        },
      },
    },
  });

  return NextResponse.json({ data: toOrderResponse(order) }, { status: 201 });
}
