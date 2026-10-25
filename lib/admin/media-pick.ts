import { mediaUrl, type MediaRow } from "@/lib/supabase/media";

/** Fila de media → imagen elegida para los campos de imagen del panel. */
export function toPicked(m: MediaRow | null) {
  const url = mediaUrl(m);
  return m && url ? { id: m.id, url, alt: m.alt } : null;
}
