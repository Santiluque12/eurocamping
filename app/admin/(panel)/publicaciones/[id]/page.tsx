import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { Banner } from "@/components/admin/form";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { AuditLine } from "@/components/admin/AuditLine";
import { toPicked } from "@/lib/admin/media-pick";
import { PostForm } from "../PostForm";

export const metadata = { title: "Editar publicación" };

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creado?: string }>;
}) {
  const { db } = await requireAdminPage();
  const { id } = await params;
  const { creado } = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const { data: p } = await db
    .from("posts")
    .select("*, cover:media!posts_cover_media_id_fkey(id, storage_path, external_url, alt)")
    .eq("id", id)
    .maybeSingle();
  if (!p) notFound();

  return (
    <>
      <PageHeader
        title={p.title}
        back={{ href: "/admin/publicaciones", label: "ECOtrips y ECOtips" }}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge status={p.status} />
            {p.status === "published" && (
              <a href={`/contenido/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#b45309] hover:underline">
                Ver en el sitio ↗
              </a>
            )}
            <AuditLine createdAt={p.created_at} updatedAt={p.updated_at} updatedBy={p.updated_by} />
          </span>
        }
      />
      {creado && (
        <div className="mb-4">
          <Banner ok>Publicación creada. Podés seguir editándola.</Banner>
        </div>
      )}
      <PostForm post={{ ...p, cover: toPicked(p.cover) }} />
    </>
  );
}
