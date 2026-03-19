import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function extractCloudinaryPublicId(imageUrl: string): string | null {
  try {
    const parsed = new URL(imageUrl);

    // Expected path: /<cloud-name>/image/upload/.../<public_id>.<ext>
    const segments = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = segments.findIndex((part) => part === "upload");
    if (uploadIndex === -1 || uploadIndex + 1 >= segments.length) {
      return null;
    }

    const tail = segments.slice(uploadIndex + 1);
    const withoutVersion = tail[0]?.match(/^v\d+$/) ? tail.slice(1) : tail;
    if (withoutVersion.length === 0) {
      return null;
    }

    const lastPart = withoutVersion[withoutVersion.length - 1] || "";
    withoutVersion[withoutVersion.length - 1] = lastPart.replace(/\.[^./]+$/, "");

    const publicId = withoutVersion.join("/");
    return publicId || null;
  } catch {
    return null;
  }
}

export async function deleteCloudinaryImageByUrl(imageUrl: string): Promise<boolean> {
  const publicId = extractCloudinaryPublicId(imageUrl);
  if (!publicId) {
    return false;
  }

  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "meet-point";
  if (!publicId.startsWith(`${folder}/`)) {
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });

    return result.result === "ok" || result.result === "not found";
  } catch {
    return false;
  }
}

export { cloudinary };
