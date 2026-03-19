import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { toOrderResponse } from "@/lib/order-transform";

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) return response;

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
    take: 50,
  });

  return NextResponse.json({ data: orders.map(toOrderResponse) });
}
