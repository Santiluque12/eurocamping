import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { Banner } from "@/components/admin/form";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { ProductForm } from "../ProductForm";
import { productFormOptions } from "../data";
import { toPicked } from "@/lib/admin/media-pick";
import { AuditLine } from "@/components/admin/AuditLine";

export const metadata = { title: "Editar producto" };

export default async function EditProductPage({
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
    .from("products")
    .select(`*, main_image:media!products_main_image_id_fkey(id, storage_path, external_url, alt),
      product_images(media_id, alt, sort_order, media(id, storage_path, external_url, alt)),
      product_activities(activity_id)`)
    .eq("id", id)
    .maybeSingle();
  if (!p) notFound();

  const [options, rates] = await Promise.all([
    productFormOptions(db, p),
    db.from("rental_rates").select("id, name, rental_sections(nav_label)").eq("product_id", id),
  ]);

  const gallery = [...p.product_images]
    .sort((a, b) => a.sort_order - b.sort_order)
    .flatMap((g) => {
      const picked = toPicked(g.media);
      return picked ? [{ ...picked, itemAlt: g.alt }] : [];
    });

  return (
    <>
      <PageHeader
        title={p.name}
        back={{ href: "/admin/productos", label: "Productos" }}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge status={p.status} />
            <AuditLine createdAt={p.created_at} updatedAt={p.updated_at} updatedBy={p.updated_by} />
          </span>
        }
      />
      {creado && (
        <div className="mb-4">
          <Banner ok>Producto creado. Podés seguir editándolo.</Banner>
        </div>
      )}
      {rates.data && rates.data.length > 0 && (
        <div className="mb-4 rounded-2xl border border-[#e5e7eb] bg-white p-4 text-sm">
          <p className="font-semibold">Tarifas de alquiler vinculadas</p>
          <ul className="mt-2 space-y-1">
            {rates.data.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/tarifario/${r.id}`} className="text-[#b45309] hover:underline">
                  {r.rental_sections?.nav_label} · {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ProductForm
       
        product={{
          ...p,
          main_image: toPicked(p.main_image),
          price_amount: p.price_amount === null ? null : Number(p.price_amount),
          gallery,
          activity_ids: p.product_activities.map((a) => a.activity_id),
        }}
        {...options}
      />
    </>
  );
}
