"use server";

import { z } from "zod";
import { adminAction, done, fail, refresh, type ActionState } from "./action";
import { requireAdminAction } from "./auth";
import { mediaUrl, MEDIA_BUCKET } from "@/lib/supabase/media";
import { ALLOWED_MIME, MAX_UPLOAD_BYTES } from "./media-config";
import { TAGS } from "@/lib/supabase/public";
import { SETTINGS_SPEC, collectImageIds, isSettingsKey } from "@/lib/settings/spec";

export type MediaItem = { id: string; url: string; alt: string; width: number | null; height: number | null; createdAt: string };

// Rutas que genera el navegador: uploads/AAAA/MM/<uuid>.<ext>
const PATH_RE = /^uploads\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.(jpg|jpeg|png|webp|avif|gif)$/;

// Toda imagen usada por contenido público hace que estas etiquetas se refresquen.
const MEDIA_TAGS = [TAGS.media, TAGS.products, TAGS.posts, TAGS.workshop, TAGS.settings, TAGS.catalogs] as const;

export async function listMedia(input: { q?: string; page?: number }): Promise<{ items: MediaItem[]; hasMore: boolean }> {
  const { db } = await requireAdminAction();
  const page = Math.max(1, input.page ?? 1);
  const perPage = 24;
  let query = db
    .from("media")
    .select("id, storage_path, external_url, alt, width, height, created_at, original_name")
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage);
  const q = input.q?.trim();
  if (q) query = query.or(`alt.ilike.%${q.replace(/[%,()]/g, "")}%,original_name.ilike.%${q.replace(/[%,()]/g, "")}%`);
  const { data, error } = await query;
  if (error) throw new Error("No se pudo cargar la biblioteca de imágenes.");
  return {
    items: data.slice(0, perPage).map((m) => ({
      id: m.id,
      url: mediaUrl(m)!,
      alt: m.alt,
      width: m.width,
      height: m.height,
      createdAt: m.created_at,
    })),
    hasMore: data.length > perPage,
  };
}

const registerSchema = z.object({
  path: z.string().regex(PATH_RE, "Ruta de archivo inválida."),
  alt: z.string().trim().max(200).default(""),
  originalName: z.string().trim().max(200).default(""),
  width: z.number().int().positive().max(20000).nullable().default(null),
  height: z.number().int().positive().max(20000).nullable().default(null),
});

/**
 * Registra una imagen que el navegador ya subió a Storage. Verifica en el
 * servidor que el archivo exista y respete tipo y tamaño (si no, lo borra).
 */
export async function registerMedia(input: z.input<typeof registerSchema>): Promise<ActionState & { item?: MediaItem }> {
  return adminAction(async ({ db }) => {
    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) return fail("Archivo inválido.");
    const { path, alt, originalName, width, height } = parsed.data;

    const folder = path.slice(0, path.lastIndexOf("/"));
    const file = path.slice(path.lastIndexOf("/") + 1);
    const { data: objects, error } = await db.storage.from(MEDIA_BUCKET).list(folder, { search: file, limit: 1 });
    const obj = objects?.find((o) => o.name === file);
    if (error || !obj) return fail("No encontramos el archivo subido. Probá de nuevo.");
    const size = Number(obj.metadata?.size ?? 0);
    const mime = String(obj.metadata?.mimetype ?? "");
    if (!ALLOWED_MIME.includes(mime) || size <= 0 || size > MAX_UPLOAD_BYTES) {
      await db.storage.from(MEDIA_BUCKET).remove([path]);
      return fail("El archivo debe ser JPG, PNG, WebP, AVIF o GIF de hasta 5 MB.");
    }

    const { data, error: insertError } = await db
      .from("media")
      .insert({ storage_path: path, mime_type: mime, size_bytes: size, alt, original_name: originalName || null, width, height })
      .select("id, storage_path, external_url, alt, width, height, created_at")
      .single();
    if (insertError) {
      await db.storage.from(MEDIA_BUCKET).remove([path]);
      return fail("No pudimos registrar la imagen.");
    }
    return {
      ...done("Imagen subida."),
      item: { id: data.id, url: mediaUrl(data)!, alt: data.alt, width: data.width, height: data.height, createdAt: data.created_at },
    };
  })();
}

export const updateMediaAlt = adminAction(async ({ db }, id: string, alt: string) => {
  const parsed = z.object({ id: z.uuid(), alt: z.string().trim().max(200) }).safeParse({ id, alt });
  if (!parsed.success) return fail("Texto alternativo inválido (hasta 200 caracteres).");
  const { error } = await db.from("media").update({ alt: parsed.data.alt }).eq("id", parsed.data.id);
  if (error) return fail("No pudimos guardar el texto alternativo.");
  refresh(...MEDIA_TAGS);
  return done("Texto alternativo guardado.");
});

/** Dónde se usa una imagen (para no borrar imágenes en uso). */
export async function mediaUsage(id: string) {
  const { db } = await requireAdminAction();
  const [products, gallery, posts, brands, workshop, settings] = await Promise.all([
    db.from("products").select("id, name").eq("main_image_id", id),
    db.from("product_images").select("product_id, products(id, name)").eq("media_id", id),
    db.from("posts").select("id, title").eq("cover_media_id", id),
    db.from("brands").select("id, name").eq("logo_media_id", id),
    db.from("workshop_services").select("id, name").eq("image_media_id", id),
    db.from("site_settings").select("key, value"),
  ]);
  const uses: { label: string; href: string }[] = [];
  products.data?.forEach((p) => uses.push({ label: `Producto: ${p.name}`, href: `/admin/productos/${p.id}` }));
  gallery.data?.forEach((g) => g.products && uses.push({ label: `Galería de: ${g.products.name}`, href: `/admin/productos/${g.products.id}` }));
  posts.data?.forEach((p) => uses.push({ label: `Publicación: ${p.title}`, href: `/admin/publicaciones/${p.id}` }));
  brands.data?.forEach((b) => uses.push({ label: `Marca: ${b.name}`, href: `/admin/marcas/${b.id}` }));
  workshop.data?.forEach((w) => uses.push({ label: `Taller: ${w.name}`, href: `/admin/taller/${w.id}` }));
  settings.data?.forEach((s) => {
    if (isSettingsKey(s.key) && collectImageIds(SETTINGS_SPEC[s.key].fields, s.value).has(id))
      uses.push({ label: `Textos: ${SETTINGS_SPEC[s.key].title}`, href: `/admin/configuracion/${s.key}` });
  });
  // Imágenes insertadas dentro del cuerpo de publicaciones.
  const { data: media } = await db.from("media").select("storage_path, external_url").eq("id", id).maybeSingle();
  const url = mediaUrl(media);
  if (url) {
    const { data: inBody } = await db.from("posts").select("id, title").ilike("body_html", `%${url}%`);
    inBody?.forEach((p) => uses.push({ label: `Dentro del texto de: ${p.title}`, href: `/admin/publicaciones/${p.id}` }));
  }
  return uses;
}

export const deleteMedia = adminAction(async ({ db }, id: string) => {
  if (!z.uuid().safeParse(id).success) return fail("Imagen inválida.");
  const uses = await mediaUsage(id);
  if (uses.length) {
    return fail(`No se puede eliminar: la imagen se usa en ${uses.length} lugar(es): ${uses.map((u) => u.label).join("; ")}.`);
  }
  const { data: media } = await db.from("media").select("storage_path").eq("id", id).maybeSingle();
  if (!media) return fail("La imagen ya no existe.");
  const { error } = await db.from("media").delete().eq("id", id);
  if (error) return fail(error.code === "23503" ? "La imagen está en uso y no se puede eliminar." : "No pudimos eliminar la imagen.");
  if (media.storage_path) await db.storage.from(MEDIA_BUCKET).remove([media.storage_path]);
  refresh(TAGS.media);
  return done("Imagen eliminada.");
});

/**
 * Reemplaza el archivo de una imagen existente por otro ya subido: todos los
 * contenidos que la usan pasan a mostrar el archivo nuevo.
 */
export const replaceMediaFile = adminAction(async ({ db }, id: string, newPath: string) => {
  if (!z.uuid().safeParse(id).success || !PATH_RE.test(newPath)) return fail("Datos inválidos.");
  const reg = await registerMedia({ path: newPath });
  if (!reg.ok || !reg.item) return reg;
  // registerMedia creó una fila temporal: se toma su archivo y se descarta la fila.
  const { data: fresh } = await db.from("media").select("storage_path, mime_type, size_bytes").eq("id", reg.item.id).single();
  const { data: old } = await db.from("media").select("storage_path").eq("id", id).maybeSingle();
  if (!fresh || !old) return fail("La imagen ya no existe.");
  await db.from("media").delete().eq("id", reg.item.id);
  const { error } = await db
    .from("media")
    .update({ storage_path: fresh.storage_path, external_url: null, mime_type: fresh.mime_type, size_bytes: fresh.size_bytes })
    .eq("id", id);
  if (error) return fail("No pudimos reemplazar la imagen.");
  if (old.storage_path) await db.storage.from(MEDIA_BUCKET).remove([old.storage_path]);
  refresh(...MEDIA_TAGS);
  return done("Imagen reemplazada en todo el sitio.");
});
