import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const updateComboOfferSchema = z.object({
  name: z.string().trim().min(2).optional(),
  details: z.string().trim().min(5).optional(),
  price: z.number().positive().optional(),
  image: z.string().trim().url().optional(),
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
  const parsed = updateComboOfferSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const offer = await prisma.comboOffer.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ data: offer });
  } catch {
    return NextResponse.json({ message: "Combo offer not found" }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const { id } = await params;

  try {
    await prisma.comboOffer.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Combo offer not found" }, { status: 404 });
  }
}
