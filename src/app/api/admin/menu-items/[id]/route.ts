import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { deleteCloudinaryImageByUrl } from "@/lib/cloudinary";
import { toMenuItemResponse } from "@/lib/menu-item-transform";
import { prisma } from "@/lib/prisma";

const updateMenuItemSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().min(5).optional(),
  price: z.number().positive().optional(),
  image: z.string().trim().min(1).optional(),
  categoryId: z.string().trim().min(1).optional(),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateMenuItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;

  try {
    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.description !== undefined ? { description: payload.description } : {}),
        ...(payload.price !== undefined ? { price: payload.price } : {}),
        ...(payload.image !== undefined ? { image: payload.image } : {}),
        ...(payload.categoryId !== undefined ? { categoryId: payload.categoryId } : {}),
        ...(payload.available !== undefined ? { available: payload.available } : {}),
        ...(payload.featured !== undefined ? { featured: payload.featured } : {}),
        ...(payload.tags !== undefined ? { tags: payload.tags } : {}),
      },
      include: { category: true },
    });

    return NextResponse.json({ data: toMenuItemResponse(item) });
  } catch {
    return NextResponse.json({ message: "Menu item not found or update failed" }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const { id } = await params;

  try {
    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
      select: { image: true },
    });

    await prisma.menuItem.delete({ where: { id } });

    if (existingItem?.image) {
      void deleteCloudinaryImageByUrl(existingItem.image);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            message: "এই food item অর্ডারে ব্যবহার হয়েছে, তাই delete করা যাবে না। Out of stock করে দিন।",
          },
          { status: 409 },
        );
      }

      if (error.code === "P2025") {
        return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
  }
}
