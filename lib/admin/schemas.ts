import "server-only";
import { z } from "zod";
import { slugify } from "@/lib/format";
import { EMOJI_ICONS } from "@/lib/settings/icons";

// ─── Lectura de FormData ────────────────────────────────────────────────────
export function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}
export function bool(fd: FormData, key: string) {
  return fd.get(key) === "on" || fd.get(key) === "true";
}
export function json<T = unknown>(fd: FormData, key: string, fallback: T): T {
  const v = str(fd, key);
  if (!v) return fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}
export function all(fd: FormData, key: string) {
  return fd.getAll(key).filter((v): v is string => typeof v === "string" && v !== "");
}
export function intent(fd: FormData): "draft" | "publish" | "save" {
  const v = str(fd, "intent");
  return v === "draft" || v === "publish" ? v : "save";
}

// ─── Piezas reutilizables ───────────────────────────────────────────────────
const UUID = z.uuid("Valor inválido.");
const optUuid = z.union([UUID, z.literal("").transform(() => null), z.null()]).default(null);
const optText = (max: number) =>
  z.string().trim().max(max, `Máximo ${max} caracteres.`).transform((v) => v || null);
const reqText = (max: number) =>
  z.string().trim().min(1, "Este campo es obligatorio.").max(max, `Máximo ${max} caracteres.`);
const sortOrder = z.coerce.number().int("Usá un número entero.").min(0).max(100000).default(0);
const httpsUrl = z
  .string()
  .trim()
  .transform((v) => v || null)
  .refine((v) => v === null || /^https:\/\/[^\s]+$/.test(v), "El enlace debe empezar con https://");
const linkUrl = z
  .string()
  .trim()
  .transform((v) => v || null)
  .refine((v) => v === null || /^(https?:\/\/[^\s]+|\/[^\s]*)$/.test(v), "Usá una ruta que empiece con / o un enlace https://");
const stringList = (max: number, itemMax = 200) =>
  z.array(z.string().trim().min(1).max(itemMax, `Cada elemento admite hasta ${itemMax} caracteres.`)).max(max);

export const slugField = (fallbackFrom: string) =>
  z.string().trim().transform((v) => slugify(v || fallbackFrom)).pipe(
    z.string().min(1, "Necesitamos un identificador para la URL.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Sólo minúsculas, números y guiones.")
  );

const amount = z
  .union([z.literal(""), z.coerce.number()])
  .transform((v) => (v === "" ? null : v))
  .refine((v) => v === null || (Number.isFinite(v) && v >= 0 && v < 1e10), "Ingresá un importe válido (sólo números).");

export function priceSchema(units: string[]) {
  return z
  .object({
    price_mode: z.enum(["fixed", "from", "consult"]),
    price_amount: amount,
    currency: z.enum(["ARS", "USD"]),
    price_unit: z.string().transform((v) => v || null),
  })
  .superRefine((p, ctx) => {
    if (p.price_mode !== "consult" && p.price_amount === null)
      ctx.addIssue({ code: "custom", path: ["price_amount"], message: "Ingresá el importe o elegí “Consultar”." });
  })
    .superRefine((p, ctx) => {
      if (p.price_unit && !units.includes(p.price_unit))
        ctx.addIssue({ code: "custom", path: ["price_unit"], message: "Unidad inválida." });
    })
    .transform((p) => (p.price_mode === "consult" ? { ...p, price_amount: null, price_unit: null } : p));
}

// ─── Productos ──────────────────────────────────────────────────────────────
export function productSchema(name: string) {
  return z
    .object({
      name: reqText(160),
      slug: slugField(name),
      type: z.enum(["nuevo", "usado", "rental"], "Elegí un tipo."),
      description: optText(2000),
      spec_line: optText(200),
      category_id: optUuid,
      brand_id: optUuid,
      main_image_id: optUuid,
      main_image_alt: optText(200),
      availability: z.enum(["available", "unavailable", "consult"]),
      tags: stringList(8, 40),
      external_url: httpsUrl,
      external_label: optText(40),
      whatsapp_message: optText(200),
      featured: z.boolean(),
      sort_order: sortOrder,
    });
}

export const PRODUCT_UNITS = ["day", "weekend", "week", "unit"];
export const WORKSHOP_UNITS = ["unit", "cm2", "hour"];

export const gallerySchema = z
  .array(z.object({ media_id: UUID, alt: z.string().trim().max(200).default("") }))
  .max(20, "Hasta 20 imágenes por galería.");

// ─── Publicaciones ──────────────────────────────────────────────────────────
export function postSchema(title: string) {
  return z.object({
    title: reqText(200),
    slug: slugField(title),
    category: z.enum(["ECOtrip", "ECOtip"], "Elegí una categoría."),
    excerpt: optText(400),
    cover_media_id: optUuid,
    cover_alt: optText(200),
    body_html: z.string().max(200_000, "El texto es demasiado largo."),
    published_at: z
      .string()
      .trim()
      .transform((v) => (v ? new Date(`${v}T12:00:00-03:00`) : null))
      .refine((d) => d === null || !Number.isNaN(d.getTime()), "Fecha inválida.")
      .transform((d) => d?.toISOString() ?? null),
    featured: z.boolean(),
    seo_title: optText(70),
    seo_description: optText(170),
  });
}

// ─── Sucursales ─────────────────────────────────────────────────────────────
export const branchSchema = z.object({
  name: reqText(120),
  city: reqText(120),
  region: reqText(80),
  address: optText(200),
  phones: stringList(5, 40),
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s+\-()]/g, "") || null)
    .refine((v) => v === null || /^[0-9]{8,15}$/.test(v), "Sólo números, con código de país y área (ej. 5491162237233)."),
  hours: optText(200),
  maps_url: httpsUrl,
  offers_rental: z.boolean(),
  services: stringList(12, 60),
  season_label: optText(60),
  notes: optText(500),
  sort_order: sortOrder,
  is_visible: z.boolean(),
});

// ─── Taller ─────────────────────────────────────────────────────────────────
export const workshopSchema = z
  .object({
    kind: z.enum(["category", "rate"]),
    season: z.string().transform((v) => (v === "invierno" || v === "verano" ? v : null)),
    name: reqText(160),
    description: optText(600),
    icon: z
      .string()
      .transform((v) => v || null)
      .refine((v) => v === null || (EMOJI_ICONS as readonly string[]).includes(v), "Elegí un ícono de la lista."),
    image_media_id: optUuid,
    items: stringList(20, 160),
    whatsapp_message: optText(200),
    sort_order: sortOrder,
    is_visible: z.boolean(),
  })
  .superRefine((w, ctx) => {
    if (w.kind === "rate" && !w.season)
      ctx.addIssue({ code: "custom", path: ["season"], message: "Elegí la temporada del tarifario." });
  });

// ─── Tarifario ──────────────────────────────────────────────────────────────
export const PERIODS = ["day", "weekend", "three_days", "four_days", "week", "fortnight"] as const;

export const rateSchema = z.object({
  section_id: UUID,
  group_name: optText(80),
  name: reqText(160),
  product_id: optUuid,
  sort_order: sortOrder,
});

export function sectionSchema(title: string) {
  return z.object({
    slug: slugField(title),
    title: reqText(80),
    title_accent: optText(80),
    nav_label: reqText(60),
    icon: z
      .string()
      .transform((v) => v || null)
      .refine((v) => v === null || (EMOJI_ICONS as readonly string[]).includes(v), "Elegí un ícono de la lista."),
    description: optText(400),
    periods: z.array(z.enum(PERIODS)).min(1, "Elegí al menos una columna de precios.").max(6),
    footnote: optText(400),
    show_resorts: z.boolean(),
    sort_order: sortOrder,
    is_visible: z.boolean(),
  });
}

// ─── Catálogos ──────────────────────────────────────────────────────────────
export function brandSchema(name: string) {
  return z.object({
    name: reqText(80),
    slug: slugField(name),
    website_url: linkUrl,
    logo_media_id: optUuid,
    show_on_site: z.boolean(),
    sort_order: sortOrder,
  });
}

export function categorySchema(name: string) {
  return z.object({
    name: reqText(80),
    slug: slugField(name),
    description: optText(400),
    sort_order: sortOrder,
  });
}

export function activitySchema(name: string) {
  return z.object({
    name: reqText(60),
    slug: slugField(name),
    emoji: optText(8),
    link_href: linkUrl,
    show_in_home: z.boolean(),
    sort_order: sortOrder,
  });
}
