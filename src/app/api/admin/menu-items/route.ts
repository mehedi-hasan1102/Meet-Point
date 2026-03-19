import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { toMenuItemResponse } from "@/lib/menu-item-transform";
import { prisma } from "@/lib/prisma";

const createMenuItemSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(5),
  price: z.number().positive(),
  image: z.string().trim().min(1),
  categoryId: z.string().trim().min(1),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) return response;

  const items = await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: items.map(toMenuItemResponse) });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const body = await request.json();
  const parsed = createMenuItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;

  try {
    const item = await prisma.menuItem.create({
      data: {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        image: payload.image,
        categoryId: payload.categoryId,
        available: payload.available ?? true,
        featured: payload.featured ?? false,
        tags: payload.tags ?? [],
      },
      include: { category: true },
    });

    return NextResponse.json({ data: toMenuItemResponse(item) }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Menu item could not be created" }, { status: 409 });
  }
}
