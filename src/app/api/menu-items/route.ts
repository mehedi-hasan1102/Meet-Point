import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { toMenuItemResponse } from "@/lib/menu-item-transform";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const available = searchParams.get("available");
  const q = searchParams.get("q");
  const limit = Number(searchParams.get("limit") || "0");

  const where = {
    ...(category
      ? {
          category: {
            slug: category,
          },
        }
      : {}),
    ...(featured !== null ? { featured: featured === "true" } : {}),
    ...(available !== null ? { available: available === "true" } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const items = await prisma.menuItem.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
    ...(Number.isFinite(limit) && limit > 0 ? { take: limit } : {}),
  });

  return NextResponse.json({ data: items.map(toMenuItemResponse) });
}
