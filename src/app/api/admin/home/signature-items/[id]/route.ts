import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const updateSignatureItemSchema = z.object({
  menuItemId: z.string().trim().min(1).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSignatureItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const item = await prisma.signatureItem.update({
      where: { id },
      data: parsed.data,
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
    });
  } catch {
    return NextResponse.json({ message: "Signature item update failed" }, { status: 409 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const { id } = await params;

  try {
    await prisma.signatureItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Signature item not found" }, { status: 404 });
  }
}
