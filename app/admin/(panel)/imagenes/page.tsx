import { requireAdminPage } from "@/lib/admin/auth";
import { EmptyState, Filters, PageHeader, Pagination, pageParam, searchTerm } from "@/components/admin/ui";
import { mediaUrl } from "@/lib/supabase/media";
import { MediaCardItem, UploadButton, type MediaCard } from "./MediaManager";

export const metadata = { title: "Imágenes" };

const PER_PAGE = 24;

export default async function MediaPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { db } = await requireAdminPage();
  const sp = await searchParams;
  const page = pageParam(sp.page);

  let query = db
    .from("media")
    .select(
      `id, storage_path, external_url, alt, original_name, size_bytes,
       main:products!products_main_image_id_fkey(count), gallery:product_images(count),
       covers:posts!posts_cover_media_id_fkey(count), logos:brands!brands_logo_media_id_fkey(count),
       workshop:workshop_services!workshop_services_image_media_id_fkey(count)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
  const term = searchTerm(sp.q);
  if (term) query = query.or(`alt.ilike.${term},original_name.ilike.${term}`);
  const { data, count, error } = await query;
  if (error) throw new Error("No se pudo cargar la biblioteca de imágenes.");

  const items: MediaCard[] = data.map((m) => ({
    id: m.id,
    url: mediaUrl(m)!,
    alt: m.alt,
    name: m.original_name,
    size: m.size_bytes,
    external: !!m.external_url,
    inUse: [m.main, m.gallery, m.covers, m.logos, m.workshop].some((rel) => (rel[0]?.count ?? 0) > 0),
  }));

  return (
    <>
      <PageHeader
        title="Imágenes"
        description="Biblioteca de imágenes del sitio. JPG, PNG, WebP, AVIF o GIF de hasta 5 MB. Al reemplazar una imagen, cambia en todos los lugares donde se usa."
        actions={<UploadButton />}
      />
      <Filters q={sp.q} placeholder="Buscar por descripción o nombre de archivo" />
      {items.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <MediaCardItem key={`${m.id}${m.url}`} item={m} />
          ))}
        </ul>
      ) : (
        <EmptyState title="No hay imágenes">Subí la primera con el botón “Subir imágenes”.</EmptyState>
      )}
      <Pagination page={page} total={count ?? 0} perPage={PER_PAGE} params={sp} />
    </>
  );
}
