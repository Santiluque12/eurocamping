import "server-only";
import type { AdminSession } from "@/lib/admin/auth";

export async function productFormOptions(db: AdminSession["db"], current?: { category_id: string | null; brand_id: string | null }) {
  const [cats, brands, acts] = await Promise.all([
    db.from("categories").select("id, name, archived_at").order("sort_order"),
    db.from("brands").select("id, name, archived_at").order("name"),
    db.from("activities").select("id, name, archived_at").order("sort_order"),
  ]);
  // Los archivados no se ofrecen, salvo el que ya tiene asignado el producto.
  const keep = <T extends { id: string; archived_at: string | null }>(rows: T[] | null, currentId?: string | null) =>
    (rows ?? []).filter((r) => !r.archived_at || r.id === currentId);
  return {
    categories: keep(cats.data, current?.category_id).map((c) => ({ value: c.id, label: c.archived_at ? `${c.name} (archivada)` : c.name })),
    brands: keep(brands.data, current?.brand_id).map((b) => ({ value: b.id, label: b.archived_at ? `${b.name} (archivada)` : b.name })),
    activities: keep(acts.data).map((a) => ({ value: a.id, label: a.name })),
  };
}
