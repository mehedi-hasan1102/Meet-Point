import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const offers = await prisma.comboOffer.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 6,
  });

  return NextResponse.json({ data: offers });
}
