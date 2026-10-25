import path from "node:path";
import { slugify } from "../lib/format";

/**
 * Ruta (sin extensión) donde se guarda en Storage la copia de una imagen
 * externa. La usan media:migrate (al copiar) y el importador (para reconocer
 * una imagen ya copiada y no volver a crearla).
 */
export function externalStorageBase(externalUrl: string) {
  const base = path.basename(new URL(externalUrl).pathname).replace(/\.[a-z0-9]+$/i, "");
  return `legacy/externas/${slugify(base) || "imagen"}`;
}
