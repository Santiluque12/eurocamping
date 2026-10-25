import "server-only";
import type { AdminSession } from "@/lib/admin/auth";

export async function rateFormOptions(db: AdminSession["db"]) {
  const [sections, products, groups] = await Promise.all([
    db.from("rental_sections").select("id, nav_label, periods").order("sort_order"),
    db.from("products").select("id, name, status").eq("type", "rental").neq("status", "archived").order("name"),
    db.from("rental_rates").select("group_name").not("group_name", "is", null),
  ]);
  return {
    sections: (sections.data ?? []).map((s) => ({ value: s.id, label: s.nav_label, periods: s.periods })),
    products: (products.data ?? []).map((p) => ({ value: p.id, label: p.status === "draft" ? `${p.name} (borrador)` : p.name })),
    groups: [...new Set((groups.data ?? []).map((g) => g.group_name!))].sort(),
  };
}
