import "server-only";
import { cache } from "react";
import { publicDb, TAGS } from "@/lib/supabase/public";
import { mediaUrl } from "@/lib/supabase/media";
import { formatMoney, priceLabel, waLink, PERIOD_ORDER, type RentalPeriod } from "@/lib/format";
import { SETTINGS_SPEC, collectImageIds, type SettingsKey, type SettingsValue } from "@/lib/settings/spec";
import type { ImageRef, Post, PostDetail, Product, Sucursal } from "@/types";

/** Error de lectura de contenido. Lo captura app/(site)/error.tsx. */
export class ContentError extends Error {
  constructor(what: string, cause?: unknown) {
    super(`No se pudo cargar ${what}.`);
    this.name = "ContentError";
    if (cause) console.error(`[content] ${what}:`, cause);
  }
}

type MediaJoin = { id: string; storage_path: string | null; external_url: string | null; alt: string } | null;

function toImage(m: MediaJoin, alt?: string | null): ImageRef | null {
  const url = mediaUrl(m);
  return url ? { url, alt: alt || m?.alt || "" } : null;
}

const MEDIA_COLS = "id, storage_path, external_url, alt";

// ─── Configuración ──────────────────────────────────────────────────────────
const getAllSettings = cache(async () => {
  const { data, error } = await publicDb([TAGS.settings]).from("site_settings").select("key, value");
  if (error) throw new ContentError("la configuración del sitio", error);
  return new Map(data.map((r) => [r.key, r.value]));
});

export async function getSettings<K extends SettingsKey>(key: K): Promise<SettingsValue<K>> {
  const all = await getAllSettings();
  const value = all.get(key);
  if (!value) throw new ContentError(`los textos de “${SETTINGS_SPEC[key].title}”`, `falta site_settings.${key}`);
  return value as unknown as SettingsValue<K>;
}

/** Resuelve los ids de imágenes que guarda una configuración. */
export async function getSettingsImages(key: SettingsKey, value: unknown) {
  const ids = [...collectImageIds(SETTINGS_SPEC[key].fields, value)];
  if (!ids.length) return new Map<string, ImageRef>();
  const { data, error } = await publicDb([TAGS.media, TAGS.settings]).from("media").select(MEDIA_COLS).in("id", ids);
  if (error) throw new ContentError("las imágenes", error);
  return new Map(data.flatMap((m) => {
    const img = toImage(m);
    return img ? [[m.id, img] as const] : [];
  }));
}

export async function getContact() {
  const g = await getSettings("general");
  return {
    settings: g,
    links: {
      general: waLink(g.whatsapp.general, g.whatsappMessages.general),
      rental: waLink(g.whatsapp.rental, g.whatsappMessages.rental),
      taller: waLink(g.whatsapp.taller, g.whatsappMessages.taller),
      usados: waLink(g.whatsapp.usados, g.whatsappMessages.usados),
    },
  };
}

// ─── Productos ──────────────────────────────────────────────────────────────
const PRODUCT_COLS = `id, slug, name, type, description, spec_line, price_mode, price_amount, currency,
  price_unit, availability, tags, external_url, external_label, whatsapp_message, featured,
  sort_order, main_image_alt, category_id,
  main_image:media!products_main_image_id_fkey(${MEDIA_COLS})`;

type ProductRow = {
  id: string; slug: string; name: string; type: Product["type"]; description: string | null;
  spec_line: string | null; price_mode: "fixed" | "from" | "consult"; price_amount: number | null;
  currency: string; price_unit: string | null; availability: Product["availability"]; tags: string[];
  external_url: string | null; external_label: string | null; whatsapp_message: string | null;
  main_image_alt: string | null; category_id: string | null; main_image: MediaJoin;
};

async function toProducts(rows: ProductRow[]): Promise<Product[]> {
  const { settings: g } = await getContact();
  return rows.map((r) => {
    const rental = r.type === "rental";
    const subject = r.whatsapp_message || r.name;
    return {
      id: r.id,
      slug: r.slug,
      title: r.name,
      type: r.type,
      price: priceLabel(r),
      image: toImage(r.main_image, r.main_image_alt || r.name),
      tags: r.tags,
      badge: r.tags[0],
      description: r.description ?? undefined,
      specLine: r.spec_line ?? undefined,
      availability: r.availability,
      externalLink: r.external_url ?? undefined,
      externalLabel: r.external_label ?? undefined,
      waLink: waLink(
        rental ? g.whatsapp.rental : g.whatsapp.general,
        `${rental && r.category_id ? g.whatsappMessages.rentalItem : g.whatsappMessages.product} ${subject}`
      ),
    };
  });
}

export async function getFeaturedProducts(limit = 6) {
  const { data, error } = await publicDb([TAGS.products, TAGS.media])
    .from("products").select(PRODUCT_COLS)
    .eq("featured", true).order("sort_order").limit(limit);
  if (error) throw new ContentError("los productos destacados", error);
  return toProducts(data as unknown as ProductRow[]);
}

export async function getProductsByType(type: Product["type"], limit = 60) {
  const { data, error } = await publicDb([TAGS.products, TAGS.media])
    .from("products").select(PRODUCT_COLS)
    .eq("type", type).order("featured", { ascending: false }).order("sort_order").limit(limit);
  if (error) throw new ContentError("los productos", error);
  return toProducts(data as unknown as ProductRow[]);
}

/** Catálogo de alquiler agrupado por categoría (sólo equipos con categoría). */
export async function getRentalCatalog() {
  const db = publicDb([TAGS.products, TAGS.catalogs, TAGS.media]);
  const [cats, prods] = await Promise.all([
    db.from("categories").select("id, slug, name, sort_order").order("sort_order"),
    db.from("products").select(PRODUCT_COLS).eq("type", "rental").not("category_id", "is", null).order("sort_order"),
  ]);
  if (cats.error) throw new ContentError("las categorías", cats.error);
  if (prods.error) throw new ContentError("el catálogo de alquiler", prods.error);
  const products = await toProducts(prods.data as unknown as ProductRow[]);
  const byCat = new Map<string, Product[]>();
  (prods.data as unknown as ProductRow[]).forEach((row, i) => {
    const list = byCat.get(row.category_id!) ?? [];
    list.push(products[i]);
    byCat.set(row.category_id!, list);
  });
  return cats.data
    .map((c) => ({ id: c.slug, label: c.name, items: byCat.get(c.id) ?? [] }))
    .filter((c) => c.items.length > 0);
}

// ─── Tarifario de alquiler ──────────────────────────────────────────────────
export type TariffRow = { id: string; name: string; group: string | null; catalogSlug: string | null; prices: (string | null)[] };
export type TariffSection = {
  slug: string; title: string; titleAccent: string | null; navLabel: string; icon: string | null;
  description: string | null; footnote: string | null; showResorts: boolean;
  periods: RentalPeriod[]; groups: { name: string | null; rows: TariffRow[] }[];
};

export async function getRentalTariff(): Promise<TariffSection[]> {
  const { data, error } = await publicDb([TAGS.rental, TAGS.products])
    .from("rental_sections")
    .select(`slug, title, title_accent, nav_label, icon, description, footnote, show_resorts, periods, sort_order,
      rental_rates(id, name, group_name, sort_order, product:products(slug),
        rental_rate_prices(period, amount, currency))`)
    .order("sort_order");
  if (error) throw new ContentError("el tarifario de alquiler", error);

  return data.map((s) => {
    const periods = [...s.periods].sort((a, b) => PERIOD_ORDER.indexOf(a) - PERIOD_ORDER.indexOf(b));
    const rates = [...s.rental_rates].sort((a, b) => a.sort_order - b.sort_order);
    const groups: TariffSection["groups"] = [];
    for (const r of rates) {
      const row: TariffRow = {
        id: r.id,
        name: r.name,
        group: r.group_name,
        catalogSlug: r.product?.slug ?? null,
        prices: periods.map((p) => {
          const price = r.rental_rate_prices.find((x) => x.period === p);
          return price ? formatMoney(Number(price.amount), price.currency) : null;
        }),
      };
      const last = groups[groups.length - 1];
      if (last && last.name === r.group_name) last.rows.push(row);
      else groups.push({ name: r.group_name, rows: [row] });
    }
    return {
      slug: s.slug, title: s.title, titleAccent: s.title_accent, navLabel: s.nav_label, icon: s.icon,
      description: s.description, footnote: s.footnote, showResorts: s.show_resorts, periods, groups,
    };
  });
}

// ─── Publicaciones ──────────────────────────────────────────────────────────
const POST_COLS = `slug, title, category, excerpt, reading_minutes, published_at, featured, cover_alt,
  cover:media!posts_cover_media_id_fkey(${MEDIA_COLS})`;

type PostRow = {
  slug: string; title: string; category: Post["category"]; excerpt: string | null; reading_minutes: number;
  published_at: string | null; cover_alt: string | null; cover: MediaJoin;
};

function toPost(r: PostRow): Post {
  return {
    slug: r.slug,
    category: r.category,
    title: r.title,
    excerpt: r.excerpt ?? "",
    image: toImage(r.cover, r.cover_alt || r.title),
    readTime: `${r.reading_minutes} min`,
    date: r.published_at ?? "",
  };
}

const getPostRows = cache(async () => {
  const { data, error } = await publicDb([TAGS.posts, TAGS.media])
    .from("posts").select(POST_COLS).order("published_at", { ascending: false });
  if (error) throw new ContentError("las publicaciones", error);
  return data as unknown as (PostRow & { featured: boolean })[];
});

export async function getPosts() {
  return (await getPostRows()).map(toPost);
}

/** Publicaciones destacadas para el inicio; si no hay, las más recientes. */
export async function getHomePosts(limit = 2) {
  const rows = await getPostRows();
  const featured = rows.filter((r) => r.featured);
  return (featured.length ? featured : rows).slice(0, limit).map(toPost);
}

export const getPost = cache(async (slug: string): Promise<PostDetail | null> => {
  const { data, error } = await publicDb([TAGS.posts, TAGS.media])
    .from("posts").select(`${POST_COLS}, body_html, seo_title, seo_description`)
    .eq("slug", slug).maybeSingle();
  if (error) throw new ContentError("la publicación", error);
  if (!data) return null;
  const r = data as unknown as PostRow & { body_html: string; seo_title: string | null; seo_description: string | null };
  return { ...toPost(r), bodyHtml: r.body_html, seoTitle: r.seo_title, seoDescription: r.seo_description };
});

// ─── Sucursales ─────────────────────────────────────────────────────────────
export async function getBranches(): Promise<Sucursal[]> {
  const { data, error } = await publicDb([TAGS.branches])
    .from("branches")
    .select("id, name, city, region, address, phones, whatsapp, hours, maps_url, offers_rental, services, season_label, notes")
    .order("sort_order");
  if (error) throw new ContentError("las sucursales", error);
  return data.map((b) => ({
    id: b.id,
    name: b.name,
    city: b.city,
    region: b.region,
    address: b.address ?? undefined,
    phones: b.phones,
    whatsapp: b.whatsapp ?? undefined,
    hours: b.hours ?? undefined,
    maps: b.maps_url ?? undefined,
    rental: b.offers_rental,
    services: b.services,
    seasonal: b.season_label ?? undefined,
    note: b.notes ?? undefined,
  }));
}

// ─── Taller ─────────────────────────────────────────────────────────────────
export async function getWorkshop() {
  const { data, error } = await publicDb([TAGS.workshop, TAGS.media])
    .from("workshop_services")
    .select(`id, kind, season, name, description, icon, items, price_mode, price_amount, currency, price_unit,
      whatsapp_message, image:media!workshop_services_image_media_id_fkey(${MEDIA_COLS})`)
    .order("sort_order");
  if (error) throw new ContentError("los servicios del taller", error);
  const { settings: g } = await getContact();
  const services = data.filter((s) => s.kind === "category").map((s) => ({
    id: s.id, name: s.name, description: s.description, icon: s.icon, items: s.items,
    image: toImage(s.image as MediaJoin, s.name),
    price: priceLabel(s),
    waLink: s.whatsapp_message ? waLink(g.whatsapp.taller, s.whatsapp_message) : null,
  }));
  const rates = (season: "invierno" | "verano") =>
    data.filter((s) => s.kind === "rate" && s.season === season)
      .map((s) => ({ id: s.id, name: s.name, price: priceLabel(s) ?? "Consultar" }));
  return { services, winter: rates("invierno"), summer: rates("verano") };
}

// ─── Catálogos ──────────────────────────────────────────────────────────────
export async function getBrands() {
  const { data, error } = await publicDb([TAGS.catalogs])
    .from("brands").select("name, slug, website_url").eq("show_on_site", true).order("sort_order").order("name");
  if (error) throw new ContentError("las marcas", error);
  return data;
}

export async function getHomeActivities() {
  const { data, error } = await publicDb([TAGS.catalogs])
    .from("activities").select("name, emoji, link_href").eq("show_in_home", true).order("sort_order");
  if (error) throw new ContentError("las actividades", error);
  return data.map((a) => ({ label: a.name, emoji: a.emoji ?? "", href: a.link_href ?? "/alquilar" }));
}
