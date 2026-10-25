import { requireAdminPage } from "@/lib/admin/auth";
import { EmptyState, Filters, ListCard, ListRow, NewButton, PageHeader, searchTerm, StatusBadge } from "@/components/admin/ui";
import { usageCount } from "@/components/admin/catalog";

export const metadata = { title: "Actividades" };

export default async function ActivitiesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { db } = await requireAdminPage();
  const sp = await searchParams;
  let query = db.from("activities").select("id, name, emoji, show_in_home, archived_at, product_activities(count)").order("sort_order");
  const term = searchTerm(sp.q);
  if (term) query = query.ilike("name", term);
  query = sp.estado === "archived" ? query.not("archived_at", "is", null) : query.is("archived_at", null);
  const { data, error } = await query;
  if (error) throw new Error("No se pudieron cargar las actividades.");

  return (
    <>
      <PageHeader title="Actividades" description="Camping, ski, kayak… Se relacionan con productos y se muestran en el inicio." actions={<NewButton href="/admin/actividades/nueva" label="Nueva actividad" />} />
      <Filters q={sp.q} placeholder="Buscar actividad" selects={[{ name: "estado", label: "Estado", value: sp.estado, options: [{ value: "archived", label: "Archivadas" }] }]} />
      {data.length ? (
        <ListCard>
          {data.map((a) => (
            <ListRow
              key={a.id}
              href={`/admin/actividades/${a.id}`}
              title={a.emoji ? `${a.emoji}  ${a.name}` : a.name}
              subtitle={usageCount(a.product_activities[0]?.count ?? 0, "producto", "productos")}
              meta={<StatusBadge status={a.archived_at ? "archived" : a.show_in_home ? "visible" : "hidden"} />}
            />
          ))}
        </ListCard>
      ) : (
        <EmptyState title="No encontramos actividades" />
      )}
    </>
  );
}
