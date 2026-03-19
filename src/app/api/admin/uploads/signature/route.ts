import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-auth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST() {
  const { response } = await requireAdminSession();
  if (response) return response;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;

  if (!cloudName || !apiKey) {
    return NextResponse.json({ message: "Cloudinary is not configured" }, { status: 500 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "meet-point";

  const signature = cloudinary.utils.api_sign_request(
    {
      folder,
      timestamp,
    },
    process.env.CLOUDINARY_API_SECRET || "",
  );

  return NextResponse.json({
    timestamp,
    folder,
    signature,
    cloudName,
    apiKey,
  });
}
