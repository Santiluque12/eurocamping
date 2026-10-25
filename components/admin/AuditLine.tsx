import { getAdminSession } from "@/lib/admin/auth";

const fmt = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Argentina/Buenos_Aires" });

/** “Creado … · Modificado … por …” */
export async function AuditLine({ createdAt, updatedAt, updatedBy }: { createdAt: string; updatedAt: string; updatedBy: string | null }) {
  const session = await getAdminSession();
  let who: string | null = null;
  if (updatedBy && session) {
    const { data } = await session.db.from("admin_users").select("full_name, email").eq("user_id", updatedBy).maybeSingle();
    who = data?.full_name || data?.email || null;
  }
  return (
    <span className="text-xs text-[#6b7280]">
      Creado {fmt.format(new Date(createdAt))} · Última modificación {fmt.format(new Date(updatedAt))}
      {who ? ` por ${who}` : updatedBy ? "" : " (importación)"}
    </span>
  );
}
