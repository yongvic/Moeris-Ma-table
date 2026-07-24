import { put } from "@vercel/blob";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

export type BlobUploadResult =
  | { ok: true; url: string }
  | { ok: false; code: string; message: string };

/**
 * Upload plat photo to Vercel Blob (AD-10). Soft-fails if token missing.
 */
export async function uploadMenuPhoto(
  file: File,
): Promise<BlobUploadResult> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      ok: false,
      code: "BLOB_UNCONFIGURED",
      message:
        "Upload photo indisponible (BLOB_READ_WRITE_TOKEN manquant).",
    };
  }

  if (!ALLOWED.has(file.type)) {
    return {
      ok: false,
      code: "INVALID_TYPE",
      message: "Formats acceptés : JPEG, PNG ou WebP.",
    };
  }

  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      code: "TOO_LARGE",
      message: "Photo trop lourde (max 4 Mo).",
    };
  }

  try {
    const blob = await put(`menu/${Date.now()}-${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { ok: true, url: blob.url };
  } catch {
    return {
      ok: false,
      code: "UPLOAD_FAILED",
      message: "Échec de l’upload. Réessaie.",
    };
  }
}
