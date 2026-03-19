import { NextRequest, NextResponse } from "next/server";

import { toMenuItemResponse } from "@/lib/menu-item-transform";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const item = await prisma.menuItem.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!item) {
    return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
  }

  return NextResponse.json({ data: toMenuItemResponse(item) });
}
