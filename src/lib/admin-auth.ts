import { NextResponse } from "next/server";

import { auth } from "@/auth";

export async function requireAdminSession() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return {
      session: null,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  return { session, response: null };
}
