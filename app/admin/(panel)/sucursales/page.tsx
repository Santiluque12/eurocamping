import { requireAdminPage } from "@/lib/admin/auth";
import { branchRegions } from "./data";
import { EmptyState, Filters, ListCard, ListRow, NewButton, PageHeader, searchTerm, StatusBadge } from "@/components/admin/ui";

export const metadata = { title: "Sucursales" };

export default async function BranchesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { db } = await requireAdminPage();
  const sp = await searchParams;

  let query = db.from("branches").select("id, name, city, region, is_visible, offers_rental, season_label").order("region").order("sort_order");
  const term = searchTerm(sp.q);
  if (term) query = query.or(`name.ilike.${term},city.ilike.${term},region.ilike.${term}`);
  if (sp.region) query = query.eq("region", sp.region);
  if (sp.estado) query = query.eq("is_visible", sp.estado === "visible");

  const [{ data, error }, regions] = await Promise.all([query, branchRegions(db)]);
  if (error) throw new Error("No se pudieron cargar las sucursales.");

  return (
    <>
      <PageHeader
        title="Sucursales"
        description="Locales que se muestran en /sucursales. Los textos de la página se editan en “Textos y configuración”."
        actions={<NewButton href="/admin/sucursales/nueva" label="Nueva sucursal" />}
      />
      <Filters
        q={sp.q}
        placeholder="Buscar por nombre o ciudad"
        selects={[
          { name: "region", label: "Región", value: sp.region, options: regions.map((r) => ({ value: r, label: r })) },
          { name: "estado", label: "Estado", value: sp.estado, options: [{ value: "visible", label: "Visibles" }, { value: "hidden", label: "Ocultas" }] },
        ]}
      />
      {data && data.length > 0 ? (
        <ListCard>
          {data.map((b) => (
            <ListRow
              key={b.id}
              href={`/admin/sucursales/${b.id}`}
              title={b.name}
              subtitle={[b.city, b.region, b.offers_rental ? "Rental" : null, b.season_label].filter(Boolean).join(" · ")}
              meta={<StatusBadge status={b.is_visible ? "visible" : "hidden"} />}
            />
          ))}
        </ListCard>
      ) : (
        <EmptyState title="No encontramos sucursales">Probá con otra búsqueda o creá una nueva.</EmptyState>
      )}
      <p className="mt-4 text-xs text-[#6b7280]">{data?.length ?? 0} sucursal(es)</p>
    </>
  );
}
