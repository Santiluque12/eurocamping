import { requireAdminPage } from "@/lib/admin/auth";
import { EmptyState, Filters, ListCard, ListRow, NewButton, PageHeader, searchTerm, StatusBadge } from "@/components/admin/ui";
import { usageCount } from "@/components/admin/catalog";
import { mediaUrl } from "@/lib/supabase/media";

export const metadata = { title: "Marcas" };

export default async function BrandsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { db } = await requireAdminPage();
  const sp = await searchParams;
  let query = db
    .from("brands")
    .select("id, name, show_on_site, archived_at, logo:media!brands_logo_media_id_fkey(storage_path, external_url), products(count)")
    .order("sort_order")
    .order("name");
  const term = searchTerm(sp.q);
  if (term) query = query.ilike("name", term);
  query = sp.estado === "archived" ? query.not("archived_at", "is", null) : query.is("archived_at", null);
  const { data, error } = await query;
  if (error) throw new Error("No se pudieron cargar las marcas.");

  return (
    <>
      <PageHeader title="Marcas" description="Marcas que trabaja Eurocamping. Se asignan a los productos y se listan en /nosotros." actions={<NewButton href="/admin/marcas/nueva" label="Nueva marca" />} />
      <Filters q={sp.q} placeholder="Buscar marca" selects={[{ name: "estado", label: "Estado", value: sp.estado, options: [{ value: "archived", label: "Archivadas" }] }]} />
      {data.length ? (
        <ListCard>
          {data.map((b) => (
            <ListRow
              key={b.id}
              href={`/admin/marcas/${b.id}`}
              title={b.name}
              thumb={mediaUrl(b.logo)}
              subtitle={usageCount(b.products[0]?.count ?? 0, "producto", "productos")}
              meta={<StatusBadge status={b.archived_at ? "archived" : b.show_on_site ? "visible" : "hidden"} />}
            />
          ))}
        </ListCard>
      ) : (
        <EmptyState title="No encontramos marcas" />
      )}
    </>
  );
}
