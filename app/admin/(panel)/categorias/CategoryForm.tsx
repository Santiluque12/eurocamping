import { AdminForm, SubmitButton } from "@/components/admin/form";
import { NameAndSlug, Section, TextArea, TextField } from "@/components/admin/fields";
import { CatalogArchiveButton } from "@/components/admin/catalog";
import { saveCategory } from "@/lib/admin/catalog-actions";

export type CategoryFormData = { id: string; name: string; slug: string; description: string | null; sort_order: number; archived_at: string | null };

export function CategoryForm({ category }: { category: CategoryFormData | null }) {
  const c = category;
  return (
    <AdminForm
      action={saveCategory.bind(null, c?.id ?? null)}
      editBasePath={c ? undefined : "/admin/categorias"}
      footer={
        <>
          {c && <CatalogArchiveButton table="categories" id={c.id} archived={!!c.archived_at} noun="esta categoría" />}
          <SubmitButton>{c ? "Guardar cambios" : "Crear categoría"}</SubmitButton>
        </>
      }
    >
      <Section title="Categoría" description="Cada categoría es una sección del catálogo de alquiler (/alquilar/catalogo).">
        <NameAndSlug
          nameLabel="Nombre"
          defaultName={c?.name}
          defaultSlug={c?.slug}
          slugHelp="Se usa como ancla en el catálogo (/alquilar/catalogo#identificador). Si lo cambiás, revisá los enlaces que lo usen."
        />
        <TextArea label="Descripción" name="description" defaultValue={c?.description ?? ""} rows={2} maxLength={400} help="Uso interno. Opcional." />
        <TextField label="Orden" name="sort_order" type="number" min={0} defaultValue={c?.sort_order ?? 0} help="Número menor = aparece primero en el catálogo." className="max-w-[160px]" />
      </Section>
    </AdminForm>
  );
}
