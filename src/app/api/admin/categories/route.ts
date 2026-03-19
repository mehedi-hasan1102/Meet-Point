import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const categorySchema = z.object({
  name: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9-]+$/),
  image: z.string().trim().url().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
});

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) return response;

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ data: categories });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;

  try {
    const category = await prisma.category.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        image: payload.image || null,
        description: payload.description || null,
      },
    });

    return NextResponse.json({ data: category }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Category could not be created" }, { status: 409 });
  }
}
