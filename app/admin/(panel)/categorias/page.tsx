import { requireAdminPage } from "@/lib/admin/auth";
import { EmptyState, Filters, ListCard, ListRow, NewButton, PageHeader, searchTerm, StatusBadge } from "@/components/admin/ui";
import { usageCount } from "@/components/admin/catalog";

export const metadata = { title: "Categorías" };

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { db } = await requireAdminPage();
  const sp = await searchParams;
  let query = db.from("categories").select("id, name, slug, archived_at, products(count)").order("sort_order");
  const term = searchTerm(sp.q);
  if (term) query = query.ilike("name", term);
  query = sp.estado === "archived" ? query.not("archived_at", "is", null) : query.is("archived_at", null);
  const { data, error } = await query;
  if (error) throw new Error("No se pudieron cargar las categorías.");

  return (
    <>
      <PageHeader title="Categorías" description="Agrupan los productos. En el catálogo de alquiler, cada categoría es una sección." actions={<NewButton href="/admin/categorias/nueva" label="Nueva categoría" />} />
      <Filters q={sp.q} placeholder="Buscar categoría" selects={[{ name: "estado", label: "Estado", value: sp.estado, options: [{ value: "archived", label: "Archivadas" }] }]} />
      {data.length ? (
        <ListCard>
          {data.map((c) => (
            <ListRow
              key={c.id}
              href={`/admin/categorias/${c.id}`}
              title={c.name}
              subtitle={`#${c.slug} · ${usageCount(c.products[0]?.count ?? 0, "producto", "productos")}`}
              meta={c.archived_at ? <StatusBadge status="archived" /> : undefined}
            />
          ))}
        </ListCard>
      ) : (
        <EmptyState title="No encontramos categorías" />
      )}
    </>
  );
}
