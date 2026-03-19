import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const updateCategorySchema = z.object({
  name: z.string().trim().min(2).optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  image: z.string().trim().url().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateCategorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(payload.name ? { name: payload.name } : {}),
        ...(payload.slug ? { slug: payload.slug } : {}),
        ...(payload.image !== undefined ? { image: payload.image || null } : {}),
        ...(payload.description !== undefined ? { description: payload.description || null } : {}),
      },
    });

    return NextResponse.json({ data: category });
  } catch {
    return NextResponse.json({ message: "Category not found or update failed" }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const { id } = await params;

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Category not found or in use" }, { status: 409 });
  }
}
