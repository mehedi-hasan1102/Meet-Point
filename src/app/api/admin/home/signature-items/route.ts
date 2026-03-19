import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const signatureItemSchema = z.object({
  menuItemId: z.string().trim().min(1),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) return response;

  const items = await prisma.signatureItem.findMany({
    include: {
      menuItem: {
        include: { category: true },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({
    data: items.map((item) => ({
      id: item.id,
      menuItemId: item.menuItemId,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
      menuItem: {
        id: item.menuItem.id,
        name: item.menuItem.name,
        category: item.menuItem.category.slug,
        categoryName: item.menuItem.category.name,
        price: item.menuItem.price,
        image: item.menuItem.image,
      },
    })),
  });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const body = await request.json();
  const parsed = signatureItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const item = await prisma.signatureItem.create({
      data: {
        menuItemId: parsed.data.menuItemId,
        sortOrder: parsed.data.sortOrder ?? 0,
        isActive: parsed.data.isActive ?? true,
      },
      include: {
        menuItem: {
          include: { category: true },
        },
      },
    });

    return NextResponse.json({
      data: {
        id: item.id,
        menuItemId: item.menuItemId,
        sortOrder: item.sortOrder,
        isActive: item.isActive,
        menuItem: {
          id: item.menuItem.id,
          name: item.menuItem.name,
          category: item.menuItem.category.slug,
          categoryName: item.menuItem.category.name,
          price: item.menuItem.price,
          image: item.menuItem.image,
        },
      },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Menu item already used in signature list" }, { status: 409 });
  }
}
