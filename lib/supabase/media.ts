export const MEDIA_BUCKET = "media";

export type MediaRow = {
  id: string;
  storage_path: string | null;
  external_url: string | null;
  alt: string;
};

export function mediaUrl(m: Pick<MediaRow, "storage_path" | "external_url"> | null | undefined) {
  if (!m) return null;
  if (m.external_url) return m.external_url;
  if (!m.storage_path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${MEDIA_BUCKET}/${m.storage_path}`;
}
