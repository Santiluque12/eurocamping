import Link from "next/link";
import { Building2, Images, Newspaper, Plus, Receipt, Settings, Store, Wrench } from "lucide-react";
import { requireAdminPage } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Inicio" };

const TABLE_LABELS: Record<string, { label: string; href: (id: string) => string | null }> = {
  products: { label: "Producto", href: (id) => `/admin/productos/${id}` },
  posts: { label: "Publicación", href: (id) => `/admin/publicaciones/${id}` },
  branches: { label: "Sucursal", href: (id) => `/admin/sucursales/${id}` },
  workshop_services: { label: "Taller", href: (id) => `/admin/taller/${id}` },
  rental_rates: { label: "Tarifario", href: (id) => `/admin/tarifario/${id}` },
  rental_sections: { label: "Sección del tarifario", href: (id) => `/admin/tarifario/secciones/${id}` },
  brands: { label: "Marca", href: (id) => `/admin/marcas/${id}` },
  categories: { label: "Categoría", href: (id) => `/admin/categorias/${id}` },
  activities: { label: "Actividad", href: (id) => `/admin/actividades/${id}` },
  site_settings: { label: "Textos", href: (id) => `/admin/configuracion/${id}` },
  media: { label: "Imagen", href: () => "/admin/imagenes" },
};

const ACTION_LABELS: Record<string, string> = { INSERT: "Creado", UPDATE: "Modificado", DELETE: "Eliminado" };

const QUICK = [
  { href: "/admin/productos/nuevo", label: "Nuevo producto", icon: Store },
  { href: "/admin/publicaciones/nueva", label: "Nueva publicación", icon: Newspaper },
  { href: "/admin/tarifario", label: "Actualizar precios de alquiler", icon: Receipt },
  { href: "/admin/taller", label: "Precios del taller", icon: Wrench },
  { href: "/admin/sucursales", label: "Sucursales y horarios", icon: Building2 },
  { href: "/admin/imagenes", label: "Subir imágenes", icon: Images },
  { href: "/admin/configuracion/general", label: "WhatsApp y contacto", icon: Settings },
  { href: "/admin/configuracion/home", label: "Textos del inicio", icon: Settings },
];

export default async function Dashboard() {
  const { db, name, email } = await requireAdminPage();
  const head = { count: "exact" as const, head: true };
  const [products, drafts, posts, postDrafts, rates, log, admins] = await Promise.all([
    db.from("products").select("id", head).eq("status", "published"),
    db.from("products").select("id", head).eq("status", "draft"),
    db.from("posts").select("id", head).eq("status", "published"),
    db.from("posts").select("id", head).eq("status", "draft"),
    db.from("rental_rates").select("id", head).eq("status", "published"),
    db.from("audit_log").select("id, table_name, record_id, action, changed_by, changed_at, summary").not("changed_by", "is", null).order("changed_at", { ascending: false }).limit(12),
    db.from("admin_users").select("user_id, full_name, email"),
  ]);
  const who = new Map((admins.data ?? []).map((a) => [a.user_id, a.full_name || a.email]));
  const fmt = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Argentina/Buenos_Aires" });

  const stats = [
    { label: "Productos publicados", value: products.count ?? 0, extra: drafts.count ? `${drafts.count} en borrador` : null, href: "/admin/productos" },
    { label: "Publicaciones", value: posts.count ?? 0, extra: postDrafts.count ? `${postDrafts.count} en borrador` : null, href: "/admin/publicaciones" },
    { label: "Filas del tarifario", value: rates.count ?? 0, extra: null, href: "/admin/tarifario" },
  ];

  return (
    <>
      <PageHeader title={`Hola${name ? `, ${name.split(" ")[0]}` : ""}`} description={`Desde acá administrás el contenido del sitio. Los cambios se ven al instante, sin publicar una nueva versión. (${email})`} />

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#6b7280]">Accesos rápidos</h2>
        <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK.map((q) => (
            <li key={q.href}>
              <Link href={q.href} className="flex h-full items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-4 font-semibold text-sm hover:border-[#F5A623]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF3DC] text-[#b45309]">
                  {q.href.endsWith("/nuevo") || q.href.endsWith("/nueva") ? <Plus size={18} /> : <q.icon size={18} />}
                </span>
                {q.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl border border-[#e5e7eb] bg-white p-4 hover:border-[#F5A623]">
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-[#4b5563]">{s.label}</p>
            {s.extra && <p className="mt-1 text-xs text-[#b45309]">{s.extra}</p>}
          </Link>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#6b7280]">Últimos cambios</h2>
        {log.data && log.data.length > 0 ? (
          <ul className="divide-y divide-[#e5e7eb] rounded-2xl border border-[#e5e7eb] bg-white">
            {log.data.map((e) => {
              const t = TABLE_LABELS[e.table_name];
              const summary = (e.summary ?? {}) as { name?: string };
              const href = e.action !== "DELETE" ? t?.href(e.record_id) : null;
              const text = (
                <>
                  <span className="font-semibold">{t?.label ?? e.table_name}</span>
                  {summary.name && <span>: {summary.name}</span>}
                </>
              );
              return (
                <li key={e.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 px-4 py-3 text-sm">
                  <span className="flex-1 min-w-0 truncate">{href ? <Link href={href} className="hover:text-[#b45309]">{text}</Link> : text}</span>
                  <span className="text-xs text-[#6b7280]">
                    {ACTION_LABELS[e.action]} · {fmt.format(new Date(e.changed_at))} · {who.get(e.changed_by!) ?? "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-[#d1d5db] bg-white px-6 py-8 text-center text-sm text-[#6b7280]">Todavía no hay cambios hechos desde el panel.</p>
        )}
      </section>
    </>
  );
}
