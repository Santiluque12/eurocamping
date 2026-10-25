/**
 * Copia a Supabase Storage las imágenes que todavía se muestran desde otro
 * dominio (por ejemplo el sitio viejo www.eurocampingonline.com.ar).
 *
 *   npm run media:migrate -- --dry-run   # sólo lista qué copiaría
 *   npm run media:migrate                # copia
 *   ENV_FILE=.env.supabase-prod npm run media:migrate   # contra producción
 *
 * Por cada fila de `media` con external_url https://…:
 *  1. descarga el archivo y valida tipo (JPG/PNG/WebP/AVIF/GIF) y tamaño (≤ 5 MB),
 *  2. lo sube al bucket en legacy/externas/<nombre-del-archivo>,
 *  3. actualiza la misma fila (mismo id): storage_path = …, external_url = null.
 * Como el id no cambia, productos, publicaciones y textos que la usan pasan a
 * mostrar la copia sin tocar nada más. Se puede repetir: sólo procesa las que
 * siguen siendo externas. Si una descarga falla, la deja como estaba.
 *
 * Requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.
 */
import { config } from "dotenv";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/database.types";
import { ALLOWED_MIME, MAX_UPLOAD_BYTES } from "../lib/admin/media-config";
import { externalStorageBase } from "./external-media";

// ENV_FILE permite apuntar a otro proyecto (p. ej. ENV_FILE=.env.supabase-prod).
config({ path: process.env.ENV_FILE ?? ".env.local", quiet: true });

const DRY = process.argv.includes("--dry-run");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const db = createClient<Database>(url, key, { auth: { persistSession: false } });

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "image/gif": "gif" };

async function main() {
  const { data: rows, error } = await db
    .from("media")
    .select("id, external_url, original_name")
    .like("external_url", "https://%")
    .order("created_at");
  if (error) throw error;

  console.log(`${rows.length} imagen(es) externa(s)${DRY ? " — simulación, no se escribe nada" : ""}\n`);
  const used = new Set<string>();
  let copied = 0;
  const failed: string[] = [];

  for (const row of rows) {
    const src = row.external_url!;
    try {
      const res = await fetch(src, { redirect: "follow", signal: AbortSignal.timeout(30_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const mime = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
      if (!ALLOWED_MIME.includes(mime)) throw new Error(`tipo no permitido (${mime || "desconocido"})`);
      const bytes = Buffer.from(await res.arrayBuffer());
      if (bytes.length === 0 || bytes.length > MAX_UPLOAD_BYTES) throw new Error(`tamaño inválido (${Math.round(bytes.length / 1024)} KB)`);

      // Nombres repetidos en distintas carpetas del sitio viejo: se agrega el id.
      let storagePath = `${externalStorageBase(src)}.${EXT[mime]}`;
      if (used.has(storagePath)) storagePath = storagePath.replace(/(\.[a-z]+)$/, `-${row.id.slice(0, 8)}$1`);
      used.add(storagePath);

      if (!DRY) {
        const up = await db.storage.from("media").upload(storagePath, bytes, { contentType: mime, upsert: true });
        if (up.error) throw new Error(`no se pudo subir: ${up.error.message}`);
        const { error: updError } = await db
          .from("media")
          .update({
            storage_path: storagePath,
            external_url: null,
            mime_type: mime,
            size_bytes: bytes.length,
            original_name: row.original_name ?? path.basename(new URL(src).pathname),
          })
          .eq("id", row.id)
          .like("external_url", "https://%");
        if (updError) throw new Error(`no se pudo actualizar la fila: ${updError.message}`);
      }
      copied++;
      console.log(`✓ ${src}\n    → ${storagePath} (${Math.round(bytes.length / 1024)} KB)`);
    } catch (e) {
      failed.push(`${src}: ${(e as Error).message}`);
      console.log(`✗ ${src}\n    ${(e as Error).message} — queda como estaba`);
    }
  }

  console.log(`\n${DRY ? "Se copiarían" : "Copiadas"}: ${copied} · Con problemas: ${failed.length}`);
  if (failed.length) console.log(failed.map((f) => `  - ${f}`).join("\n"));
  if (!DRY && copied)
    console.log("\nEl sitio público toma las imágenes nuevas cuando se renueva su caché (hasta 1 hora). Mientras tanto sigue mostrando las originales.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
