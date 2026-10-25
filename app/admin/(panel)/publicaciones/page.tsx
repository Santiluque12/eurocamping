import { requireAdminPage } from "@/lib/admin/auth";
import { EmptyState, Filters, ListCard, ListRow, NewButton, PageHeader, Pagination, PER_PAGE, pageParam, searchTerm, StatusBadge } from "@/components/admin/ui";
import { mediaUrl } from "@/lib/supabase/media";
import { formatDate } from "@/lib/format";

export const metadata = { title: "ECOtrips y ECOtips" };

export default async function PostsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { db } = await requireAdminPage();
  const sp = await searchParams;
  const page = pageParam(sp.page);

  let query = db
    .from("posts")
    .select("id, title, category, status, featured, published_at, cover:media!posts_cover_media_id_fkey(storage_path, external_url)", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
  const term = searchTerm(sp.q);
  if (term) query = query.or(`title.ilike.${term},slug.ilike.${term}`);
  if (sp.categoria) query = query.eq("category", sp.categoria as "ECOtrip");
  query = sp.estado ? query.eq("status", sp.estado as "draft") : query.neq("status", "archived");

  const { data, count, error } = await query;
  if (error) throw new Error("No se pudieron cargar las publicaciones.");
  const now = Date.now();

  return (
    <>
      <PageHeader
        title="ECOtrips y ECOtips"
        description="Notas de destinos y consejos. Los borradores y archivadas no se ven en el sitio."
        actions={<NewButton href="/admin/publicaciones/nueva" label="Nueva publicación" />}
      />
      <Filters
        q={sp.q}
        placeholder="Buscar por título"
        selects={[
          { name: "categoria", label: "Categoría", value: sp.categoria, options: [{ value: "ECOtrip", label: "ECOtrips" }, { value: "ECOtip", label: "ECOtips" }] },
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
      {data && data.length > 0 ? (
        <ListCard>
          {data.map((p) => {
            const scheduled = p.status === "published" && p.published_at && new Date(p.published_at).getTime() > now;
            return (
              <ListRow
                key={p.id}
                href={`/admin/publicaciones/${p.id}`}
                title={p.title}
                thumb={mediaUrl(p.cover)}
                subtitle={[p.category, p.published_at ? formatDate(p.published_at) : "Sin fecha"].join(" · ")}
                meta={
                  <>
                    {p.featured && <span className="text-xs font-semibold text-[#b45309]">★ Destacada</span>}
                    {scheduled ? <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">Programada</span> : <StatusBadge status={p.status} />}
                  </>
                }
              />
            );
          })}
        </ListCard>
      ) : (
        <EmptyState title="No encontramos publicaciones">Probá con otra búsqueda o creá una nueva.</EmptyState>
      )}
      <Pagination page={page} total={count ?? 0} perPage={PER_PAGE} params={sp} />
    </>
  );
}
