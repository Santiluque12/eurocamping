import "server-only";
import type { AdminSession } from "@/lib/admin/auth";

export async function branchRegions(db: AdminSession["db"]) {
  const { data } = await db.from("branches").select("region");
  return [...new Set((data ?? []).map((r) => r.region))].sort();
}
