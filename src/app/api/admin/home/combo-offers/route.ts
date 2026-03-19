import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const comboOfferSchema = z.object({
  name: z.string().trim().min(2),
  details: z.string().trim().min(5),
  price: z.number().positive(),
  image: z.string().trim().url(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) return response;

  const offers = await prisma.comboOffer.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ data: offers });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const body = await request.json();
  const parsed = comboOfferSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const offer = await prisma.comboOffer.create({
    data: {
      name: payload.name,
      details: payload.details,
      price: payload.price,
      image: payload.image,
      sortOrder: payload.sortOrder ?? 0,
      isActive: payload.isActive ?? true,
    },
  });

  return NextResponse.json({ data: offer }, { status: 201 });
}
