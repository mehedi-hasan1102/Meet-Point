import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const { session, response } = await requireAdminSession();
  if (response) return response;

  return NextResponse.json({
    data: {
      id: session?.user?.id,
      email: session?.user?.email,
      name: session?.user?.name,
      role: session?.user?.role,
    },
  });
}
