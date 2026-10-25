export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
export const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};
