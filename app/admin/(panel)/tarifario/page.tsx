import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { requireAdminPage } from "@/lib/admin/auth";
import { EmptyState, Filters, ListCard, ListRow, NewButton, PageHeader, searchTerm, StatusBadge } from "@/components/admin/ui";
import { formatMoney, PERIOD_LABELS, PERIOD_ORDER } from "@/lib/format";

export const metadata = { title: "Tarifario de alquiler" };

export default async function TariffPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { db } = await requireAdminPage();
  const sp = await searchParams;

  let rates = db
    .from("rental_rates")
    .select("id, section_id, group_name, name, status, sort_order, product_id, rental_rate_prices(period, amount, currency)")
    .order("sort_order");
  const term = searchTerm(sp.q);
  if (term) rates = rates.or(`name.ilike.${term},group_name.ilike.${term}`);
  rates = sp.estado ? rates.eq("status", sp.estado as "draft") : rates.neq("status", "archived");

  const [{ data: sections, error }, { data: rows, error: rowsError }] = await Promise.all([
    db.from("rental_sections").select("id, title, title_accent, nav_label, icon, periods, is_visible").order("sort_order"),
    rates,
  ]);
  if (error || rowsError) throw new Error("No se pudo cargar el tarifario.");

  return (
    <>
      <PageHeader
        title="Tarifario de alquiler"
        description="Precios de /alquilar. Cada sección tiene sus columnas (día, fin de semana…). Las filas en borrador o archivadas no se ven."
        actions={
          <>
            <Link href="/admin/tarifario/secciones/nueva" className="inline-flex items-center gap-2 rounded-xl border border-[#d1d5db] bg-white px-4 py-2.5 text-sm font-semibold hover:bg-[#f9fafb]">
              <Plus size={18} /> Nueva sección
            </Link>
            <NewButton href="/admin/tarifario/nueva" label="Nueva fila" />
          </>
        }
      />
      <Filters
        q={sp.q}
        placeholder="Buscar equipo"
        selects={[
          {
            name: "estado",
            label: "Estado",
            value: sp.estado,
            options: [
              { value: "published", label: "Publicadas" },
              { value: "draft", label: "Borradores" },
              { value: "archived", label: "Archivadas" },
            ],
          },
        ]}
      />
      <div className="space-y-8">
        {sections.map((s) => {
          const periods = PERIOD_ORDER.filter((p) => s.periods.includes(p));
          const list = rows.filter((r) => r.section_id === s.id);
          return (
            <section key={s.id} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">
                    {s.icon} {s.title} {s.title_accent}
                  </h2>
                  <p className="text-xs text-[#6b7280]">
                    Columnas: {periods.map((p) => PERIOD_LABELS[p]).join(" · ")}
                    {!s.is_visible && " · Sección oculta"}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link href={`/admin/tarifario/secciones/${s.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6b7280] hover:text-[#1a1a1a]">
                    <Pencil size={15} /> Editar sección
                  </Link>
                  <Link href={`/admin/tarifario/nueva?seccion=${s.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#b45309] hover:text-[#1a1a1a]">
                    <Plus size={16} /> Agregar fila
                  </Link>
                </div>
              </div>
              {list.length ? (
                <ListCard>
                  {list.map((r) => {
                    const first = periods.map((p) => r.rental_rate_prices.find((x) => x.period === p)).find(Boolean);
                    return (
                      <ListRow
                        key={r.id}
                        href={`/admin/tarifario/${r.id}`}
                        title={r.name}
                        subtitle={[r.group_name, first ? `${PERIOD_LABELS[first.period]}: ${formatMoney(Number(first.amount), first.currency)}` : "Sin precios", r.product_id ? "Con foto en catálogo" : null]
                          .filter(Boolean)
                          .join(" · ")}
                        meta={<StatusBadge status={r.status} />}
                      />
                    );
                  })}
                </ListCard>
              ) : (
                <EmptyState title={term || sp.estado ? "Sin resultados en esta sección" : "Esta sección no tiene filas"} />
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
