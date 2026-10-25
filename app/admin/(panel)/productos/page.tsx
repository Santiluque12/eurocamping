import { requireAdminPage } from "@/lib/admin/auth";
import { EmptyState, Filters, ListCard, ListRow, NewButton, PageHeader, Pagination, PER_PAGE, pageParam, searchTerm, StatusBadge } from "@/components/admin/ui";
import { mediaUrl } from "@/lib/supabase/media";
import { priceLabel } from "@/lib/format";

export const metadata = { title: "Productos" };

const TYPE_LABEL: Record<string, string> = { nuevo: "Nuevo", usado: "Usado", rental: "Alquiler" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { db } = await requireAdminPage();
  const sp = await searchParams;
  const page = pageParam(sp.page);

  let query = db
    .from("products")
    .select(
      "id, name, slug, type, status, featured, price_mode, price_amount, currency, price_unit, category:categories(name), main_image:media!products_main_image_id_fkey(storage_path, external_url)",
      { count: "exact" }
    )
    .order("updated_at", { ascending: false })
    .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
  const term = searchTerm(sp.q);
  if (term) query = query.or(`name.ilike.${term},slug.ilike.${term}`);
  if (sp.tipo) query = query.eq("type", sp.tipo as "nuevo");
  if (sp.categoria) query = query.eq("category_id", sp.categoria);
  query = sp.estado ? query.eq("status", sp.estado as "draft") : query.neq("status", "archived");

  const [{ data, count, error }, { data: cats }] = await Promise.all([
    query,
    db.from("categories").select("id, name").is("archived_at", null).order("sort_order"),
  ]);
  if (error) throw new Error("No se pudieron cargar los productos.");

  return (
    <>
      <PageHeader
        title="Productos y equipos"
        description="Productos nuevos, usados y equipos del catálogo de alquiler. Los borradores y archivados no se ven en el sitio."
        actions={<NewButton href="/admin/productos/nuevo" label="Nuevo producto" />}
      />
      <Filters
        q={sp.q}
        placeholder="Buscar por nombre"
        selects={[
          { name: "tipo", label: "Tipo", value: sp.tipo, options: Object.entries(TYPE_LABEL).map(([value, label]) => ({ value, label })) },
          { name: "categoria", label: "Categoría", value: sp.categoria, options: (cats ?? []).map((c) => ({ value: c.id, label: c.name })) },
          {
            name: "estado",
            label: "Estado",
            value: sp.estado,
            options: [
              { value: "published", label: "Publicados" },
              { value: "draft", label: "Borradores" },
              { value: "archived", label: "Archivados" },
            ],
          },
        ]}
      />
      {data && data.length > 0 ? (
        <ListCard>
          {data.map((p) => (
            <ListRow
              key={p.id}
              href={`/admin/productos/${p.id}`}
              title={p.name}
              thumb={mediaUrl(p.main_image)}
              subtitle={[TYPE_LABEL[p.type], p.category?.name, priceLabel(p) ?? "Consultar"].filter(Boolean).join(" · ")}
              meta={
                <>
                  {p.featured && <span className="text-xs font-semibold text-[#b45309]">★ Destacado</span>}
                  <StatusBadge status={p.status} />
                </>
              }
            />
          ))}
        </ListCard>
      ) : (
        <EmptyState title="No encontramos productos">Probá con otra búsqueda o creá uno nuevo.</EmptyState>
      )}
      <Pagination page={page} total={count ?? 0} perPage={PER_PAGE} params={sp} />
    </>
  );
}
