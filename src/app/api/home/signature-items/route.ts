import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.signatureItem.findMany({
    where: { isActive: true },
    include: {
      menuItem: {
        include: { category: true },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 6,
  });

  return NextResponse.json({
    data: items.map((item) => ({
      id: item.menuItem.id,
      name: item.menuItem.name,
      category: item.menuItem.category.slug,
      price: item.menuItem.price,
      image: item.menuItem.image,
    })),
  });
}
