/**
 * Importación inicial del contenido que estaba hardcodeado en el sitio.
 *
 *   npm run db:import              # importa (sube imágenes locales a Storage)
 *   npm run db:import -- --dry-run # sólo muestra qué haría
 *
 * Es idempotente: cada registro tiene una clave estable (slug / legacy_key) y
 * se inserta con ON CONFLICT DO NOTHING. Si un registro ya existe, NO se toca,
 * así que nunca pisa cambios hechos después desde el administrador. Las
 * relaciones (precios, actividades, galería) sólo se cargan para registros
 * recién creados.
 *
 * Requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (.env.local).
 */
import { config } from "dotenv";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/database.types";
import { slugify } from "../lib/format";
import { externalStorageBase } from "./external-media";
import { settingsSchema, SETTINGS_KEYS } from "../lib/settings/spec";
import * as site from "./legacy/site";
import { catalogCategories } from "./legacy/catalog";
import { indumentariaItems, skiItems, campingSubcats, nauticaItems, type PrecioItem } from "./legacy/tariff";
import { settings, workshopCategories, workshopRates, placeholderBody, rentalSections } from "./legacy/pages";

// ENV_FILE permite apuntar a otro proyecto (p. ej. ENV_FILE=.env.supabase-prod).
config({ path: process.env.ENV_FILE ?? ".env.local" });

const DRY = process.argv.includes("--dry-run");
const ROOT = process.cwd();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const db = createClient<Database>(url, key, { auth: { persistSession: false } });

type Tbl = keyof Database["public"]["Tables"];
const stats: Record<string, { created: number; existing: number }> = {};
const issues: string[] = [];
const note = (s: string) => issues.push(s);

function count(entity: string, created: number, total: number) {
  stats[entity] ??= { created: 0, existing: 0 };
  stats[entity].created += created;
  stats[entity].existing += total - created;
}

function must<T>(res: { data: T; error: unknown }, what: string): NonNullable<T> {
  if (res.error || res.data === null) {
    console.error(`✗ ${what}:`, res.error);
    process.exit(1);
  }
  return res.data as NonNullable<T>;
}

function mayBe<T>(res: { data: T; error: unknown }, what: string): T {
  if (res.error) {
    console.error(`✗ ${what}:`, res.error);
    process.exit(1);
  }
  return res.data;
}

/**
 * Inserta filas ignorando las que ya existen (por `conflict`). Devuelve las
 * filas efectivamente creadas y un mapa clave → id de todas (nuevas y viejas).
 */
async function insertMissing<R extends Record<string, unknown>>(
  table: Tbl,
  conflict: string,
  rows: R[],
  entity: string,
  idCol = "id"
) {
  const keys = rows.map((r) => r[conflict] as string);
  const existing = keys.length
    ? must(await db.from(table).select(idCol === conflict ? conflict : `${idCol}, ${conflict}`).in(conflict, keys), `leer ${table}`) as unknown as Record<string, string>[]
    : [];
  const have = new Set(existing.map((e) => e[conflict]));
  const toCreate = rows.filter((r) => !have.has(r[conflict] as string));
  let created: Record<string, string>[] = [];
  if (toCreate.length && !DRY) {
    created = must(
      await db.from(table).upsert(toCreate as never, { onConflict: conflict, ignoreDuplicates: true }).select(idCol === conflict ? conflict : `${idCol}, ${conflict}`),
      `insertar ${table}`
    ) as unknown as Record<string, string>[];
  }
  count(entity, DRY ? toCreate.length : created.length, rows.length);
  const ids = new Map<string, string>();
  for (const r of [...existing, ...created]) ids.set(r[conflict], r[idCol]);
  return { created: new Set(created.map((c) => c[conflict])), ids, wouldCreate: toCreate };
}

// ─── Precios ────────────────────────────────────────────────────────────────
type ParsedPrice = { price_mode: "fixed" | "from" | "consult"; price_amount: number | null; price_unit: string | null };

function parseAmount(s: string) {
  const n = Number(s.replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(n)) throw new Error(`Importe inválido: ${s}`);
  return n;
}

function parsePrice(raw: string | null | undefined): ParsedPrice {
  if (!raw || /consultar/i.test(raw)) return { price_mode: "consult", price_amount: null, price_unit: null };
  const m = raw.match(/^(Desde\s+)?\$\s?([\d.,]+)\s*(?:\/\s*(día|cm²))?$/i);
  if (!m) throw new Error(`Formato de precio no reconocido: "${raw}"`);
  const unit = m[3] ? (m[3].toLowerCase() === "día" ? "day" : "cm2") : null;
  return { price_mode: m[1] ? "from" : "fixed", price_amount: parseAmount(m[2]), price_unit: unit };
}

// ─── Imágenes ───────────────────────────────────────────────────────────────
const mediaIds = new Map<string, string>();

async function ensureMedia(ref: string, alt: string): Promise<string> {
  if (mediaIds.has(ref)) return mediaIds.get(ref)!;
  const isLocal = ref.startsWith("/");
  let row: Database["public"]["Tables"]["media"]["Insert"];
  if (isLocal) {
    const storagePath = `legacy${ref.replace(/^\/images/, "")}`;
    const filePath = path.join(ROOT, "public", ref);
    const ext = path.extname(ref).slice(1).toLowerCase();
    const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
    const existing = mayBe(await db.from("media").select("id").eq("storage_path", storagePath).maybeSingle(), "leer media");
    if (existing) {
      mediaIds.set(ref, existing.id);
      count("Imágenes", 0, 1);
      return existing.id;
    }
    let bytes: Buffer;
    try {
      bytes = await readFile(filePath);
    } catch {
      note(`Imagen local no encontrada: public${ref} — se dejó como referencia externa.`);
      return ensureMediaExternal(ref, alt);
    }
    if (!DRY) {
      const up = await db.storage.from("media").upload(storagePath, bytes, { contentType: mime, upsert: false });
      if (up.error && !/exists|duplicate/i.test(up.error.message)) {
        console.error(`✗ subir ${ref}:`, up.error.message);
        process.exit(1);
      }
    }
    row = { storage_path: storagePath, mime_type: mime, size_bytes: bytes.length, alt, original_name: path.basename(ref) };
    if (DRY) {
      count("Imágenes", 1, 1);
      return `dry:${ref}`;
    }
    const created = must(await db.from("media").insert(row).select("id").single(), "insertar media");
    mediaIds.set(ref, created.id);
    count("Imágenes", 1, 1);
    return created.id;
  }
  return ensureMediaExternal(ref, alt);
}

async function ensureMediaExternal(ref: string, alt: string) {
  let existing = mayBe(await db.from("media").select("id").eq("external_url", ref).maybeSingle(), "leer media");
  // ¿Ya se copió a Storage con `npm run media:migrate`?
  if (!existing && /^https:\/\//.test(ref)) {
    existing = mayBe(
      await db.from("media").select("id").like("storage_path", `${externalStorageBase(ref)}.%`).limit(1).maybeSingle(),
      "leer media"
    );
  }
  if (existing) {
    mediaIds.set(ref, existing.id);
    count("Imágenes", 0, 1);
    return existing.id;
  }
  if (DRY) {
    count("Imágenes", 1, 1);
    return `dry:${ref}`;
  }
  const created = must(await db.from("media").insert({ external_url: ref, alt }).select("id").single(), "insertar media");
  mediaIds.set(ref, created.id);
  count("Imágenes", 1, 1);
  if (!ref.startsWith("/")) note(`Imagen externa (no está en Storage): ${ref}`);
  return created.id;
}

// ─── Importación ────────────────────────────────────────────────────────────
async function main() {
  console.log(`Importando contenido heredado ${DRY ? "(simulación, no se escribe nada)" : ""}…\n`);

  // Catálogos
  const categories = await insertMissing("categories", "slug",
    catalogCategories.map((c, i) => ({ slug: c.slug, name: c.name, sort_order: i + 1 })), "Categorías");

  const activities = await insertMissing("activities", "slug",
    site.activities.map((a, i) => ({ slug: slugify(a.label), name: a.label, emoji: a.emoji, link_href: a.href, show_in_home: true, sort_order: i + 1 })),
    "Actividades");

  const brands = await insertMissing("brands", "slug",
    site.brands.map((b, i) => ({ slug: slugify(b), name: b, show_on_site: true, sort_order: i + 1 })), "Marcas");

  const brandIn = (title: string) => {
    const hit = site.brands.find((b) => title.toLowerCase().includes(b.toLowerCase()));
    return hit ? brands.ids.get(slugify(hit)) ?? null : null;
  };
  const brandBySlug = (desc: string) => {
    const hit = site.brands.find((b) => desc.toLowerCase().startsWith(b.toLowerCase() + " "));
    return hit ? brands.ids.get(slugify(hit)) ?? null : null;
  };

  // Productos de la home / comprar (lib/data.ts)
  const siteProducts = [];
  for (const [i, p] of site.products.entries()) {
    const price = parsePrice(p.price);
    siteProducts.push({
      legacy_key: `site:${p.id}`,
      slug: slugify(p.title),
      name: p.title,
      type: p.type as "nuevo" | "usado" | "rental",
      description: p.description ?? null,
      ...price,
      currency: "ARS",
      availability: "available" as const,
      tags: "badge" in p && p.badge ? [p.badge] : [],
      external_url: "externalLink" in p ? p.externalLink ?? null : null,
      external_label: "externalLink" in p && p.externalLink ? "Mercado Libre" : null,
      whatsapp_message: p.whatsappContext ?? null,
      featured: i < 3, // la home mostraba los 3 primeros
      sort_order: i + 1,
      status: "published" as const,
      main_image_id: await ensureMedia(p.image, p.title),
      main_image_alt: p.title,
      brand_id: brandIn(p.title),
    });
    if (!p.price) note(`Producto “${p.title}”: sin precio (se muestra “Consultar”).`);
  }
  const sp = await insertMissing("products", "legacy_key", siteProducts, "Productos (home)");
  if (!DRY) {
    const links = site.products.filter((p) => sp.created.has(`site:${p.id}`)).flatMap((p) =>
      p.activities.map((a) => ({ product_id: sp.ids.get(`site:${p.id}`)!, activity_id: activities.ids.get(slugify(a)) })))
      .filter((l) => {
        if (!l.activity_id) note(`Actividad desconocida en producto ${l.product_id}`);
        return !!l.activity_id;
      });
    if (links.length) mayBe(await db.from("product_activities").upsert(links as never, { ignoreDuplicates: true }), "actividades de productos");
  }

  // Catálogo de alquiler (app/alquilar/catalogo)
  const catalogProducts = [];
  let order = 100;
  for (const cat of catalogCategories) {
    for (const item of cat.items) {
      const price = parsePrice(item.price);
      const brandId = brandBySlug(item.description);
      if (!brandId) note(`Equipo “${item.title}”: marca no identificada (completar en el administrador).`);
      if (price.price_mode === "consult") note(`Equipo “${item.title}”: precio “Consultar”.`);
      if (!item.meta) note(`Equipo “${item.title}”: sin línea de detalle (talles/medidas).`);
      catalogProducts.push({
        legacy_key: `catalog:${item.id}`,
        slug: item.id, // se conserva: /alquilar/catalogo#<id>
        name: item.title,
        type: "rental" as const,
        description: item.description,
        spec_line: item.meta || null,
        ...price,
        currency: "ARS",
        availability: "consult" as const,
        category_id: categories.ids.get(cat.slug) ?? null,
        brand_id: brandId,
        whatsapp_message: item.title,
        sort_order: order++,
        status: "published" as const,
        main_image_id: await ensureMedia(item.image, item.title),
        main_image_alt: item.title,
      });
    }
  }
  await insertMissing("products", "legacy_key", catalogProducts, "Equipos de alquiler (catálogo)");
  const productIds = must(await db.from("products").select("id, legacy_key").like("legacy_key", "catalog:%"), "leer productos");
  const productByCatalogId = new Map(productIds.map((p) => [p.legacy_key!.slice("catalog:".length), p.id]));

  // Tarifario (app/alquilar)
  const sections = await insertMissing("rental_sections", "slug",
    rentalSections.map((s, i) => ({
      slug: s.slug, title: s.title, title_accent: s.titleAccent, nav_label: s.navLabel, icon: s.icon,
      description: s.description, periods: [...s.periods], footnote: s.footnote, show_resorts: s.showResorts,
      sort_order: i + 1, is_visible: true,
    })), "Secciones del tarifario");

  const tariffSource: Record<string, { group: string | null; items: PrecioItem[] }[]> = {
    indumentaria: [{ group: null, items: indumentariaItems }],
    "ski-snowboard": [{ group: null, items: skiItems }],
    camping: campingSubcats.map((s) => ({ group: s.name, items: s.items })),
    nautica: [{ group: null, items: nauticaItems }],
  };
  const rateRows: Record<string, unknown>[] = [];
  const ratePrices = new Map<string, { period: string; amount: number }[]>();
  for (const s of rentalSections) {
    let idx = 0;
    for (const g of tariffSource[s.slug]) {
      for (const item of g.items) {
        idx++;
        const key = `tariff:${s.slug}:${idx}`;
        let productId: string | null = null;
        if (item.catalogId) {
          productId = productByCatalogId.get(item.catalogId) ?? null;
          if (!productId && !DRY) note(`Tarifario “${item.name}”: no se encontró el equipo ${item.catalogId}.`);
        }
        rateRows.push({
          legacy_key: key, section_id: sections.ids.get(s.slug) ?? null, group_name: g.group, name: item.name,
          product_id: productId, sort_order: idx, status: "published",
        });
        ratePrices.set(key, item.precios.flatMap((p, i) => p === null ? [] : [{ period: s.periods[i], amount: parseAmount(p.replace("$", "")) }]));
        if (item.precios.length !== s.periods.length) note(`Tarifario “${item.name}”: cantidad de precios distinta a las columnas.`);
      }
    }
  }
  const rates = await insertMissing("rental_rates", "legacy_key", rateRows, "Filas del tarifario");
  if (!DRY) {
    const prices = [...rates.created].flatMap((k) =>
      ratePrices.get(k)!.map((p) => ({ rate_id: rates.ids.get(k)!, period: p.period, amount: p.amount, currency: "ARS" })));
    if (prices.length) mayBe(await db.from("rental_rate_prices").upsert(prices as never, { ignoreDuplicates: true }), "precios del tarifario");
  }

  // Publicaciones
  const postRows = [];
  for (const [i, p] of site.posts.entries()) {
    postRows.push({
      legacy_key: `post:${p.slug}`, slug: p.slug, title: p.title, category: p.category as "ECOtrip" | "ECOtip",
      excerpt: p.excerpt, body_html: placeholderBody(p.title), reading_minutes: 1,
      cover_media_id: await ensureMedia(p.image, p.title), cover_alt: p.title,
      featured: i < 2, // la home mostraba las 2 primeras
      status: "published" as const, published_at: `${p.date}T12:00:00-03:00`,
    });
    note(`Publicación “${p.title}”: el cuerpo es el texto provisional “en preparación”. Completar.`);
  }
  await insertMissing("posts", "legacy_key", postRows, "Publicaciones");

  // Sucursales
  const branchRows = site.sucursales.map((s, i) => {
    const missing = [!("address" in s) && "dirección", !("hours" in s) && "horarios", !("maps" in s) && "mapa", !("whatsapp" in s) && "WhatsApp"].filter(Boolean);
    if (missing.length) note(`Sucursal “${s.name}”: falta ${missing.join(", ")}.`);
    return {
      legacy_key: `branch:${slugify(s.name)}`, name: s.name, city: s.city, region: s.region ?? s.city,
      address: "address" in s ? s.address : null, phones: "phone" in s && s.phone ? [s.phone] : [],
      whatsapp: "whatsapp" in s ? s.whatsapp : null, hours: "hours" in s ? s.hours : null,
      maps_url: "maps" in s ? s.maps : null, offers_rental: "rental" in s ? !!s.rental : false,
      season_label: "seasonal" in s ? s.seasonal : null, notes: "note" in s ? s.note : null,
      sort_order: i + 1, is_visible: true,
    };
  });
  await insertMissing("branches", "legacy_key", branchRows, "Sucursales");

  // Taller
  const workshopRows = [
    ...workshopCategories.map((c, i) => ({
      legacy_key: `workshop:cat:${slugify(c.category)}`, kind: "category", season: null, name: c.category, icon: c.icon,
      items: c.items, price_mode: "consult" as const, price_amount: null, price_unit: null, currency: "ARS",
      sort_order: i + 1, is_visible: true,
    })),
    ...(["invierno", "verano"] as const).flatMap((season) => workshopRates[season].map((r, i) => ({
      legacy_key: `workshop:rate:${season}:${slugify(r.name)}`, kind: "rate", season, name: r.name, icon: null, items: [] as string[],
      ...parsePrice(r.price), currency: "ARS", sort_order: i + 1, is_visible: true,
    }))),
  ];
  await insertMissing("workshop_services", "legacy_key", workshopRows, "Servicios del taller");

  // Configuración y textos de páginas
  const heroImages: Partial<Record<string, string>> = {
    alquilar: await ensureMedia("/images/hero/alquilar.jpg", "Ski en Patagonia"),
    taller: await ensureMedia("/images/hero/taller.jpg", "Taller de equipos outdoor"),
  };
  const settingRows = SETTINGS_KEYS.map((k) => {
    const value = structuredClone(settings[k]) as Record<string, unknown>;
    if (heroImages[k] && !DRY) (value.hero as Record<string, unknown>).image = heroImages[k];
    const parsed = settingsSchema(k).safeParse(value);
    if (!parsed.success) {
      console.error(`✗ Configuración "${k}" inválida:`, parsed.error.issues);
      process.exit(1);
    }
    return { key: k, value: parsed.data as never };
  });
  await insertMissing("site_settings", "key", settingRows, "Configuración / textos", "key");

  // Reporte
  const lines = [
    `# Reporte de importación inicial`,
    ``,
    `Fecha: ${new Date().toISOString()}${DRY ? " (simulación)" : ""}`,
    ``,
    `| Entidad | Creados | Ya existían (no se tocaron) |`,
    `| --- | ---: | ---: |`,
    ...Object.entries(stats).map(([k, v]) => `| ${k} | ${v.created} | ${v.existing} |`),
    ``,
    `## Contenido a revisar (${issues.length})`,
    ``,
    ...[...new Set(issues)].map((i) => `- ${i}`),
  ];
  console.log(lines.join("\n"));
  if (!DRY) {
    const dir = path.join(ROOT, "scripts", "output");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "import-report.md"), lines.join("\n") + "\n");
    console.log(`\nReporte guardado en scripts/output/import-report.md`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
