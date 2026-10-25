import { AdminForm, SubmitButton } from "@/components/admin/form";
import { Checkbox, NameAndSlug, Section, TextField } from "@/components/admin/fields";
import { ImageField, type PickedImage } from "@/components/admin/media";
import { CatalogArchiveButton } from "@/components/admin/catalog";
import { saveBrand } from "@/lib/admin/catalog-actions";

export type BrandFormData = {
  id: string;
  name: string;
  slug: string;
  website_url: string | null;
  logo: PickedImage | null;
  show_on_site: boolean;
  sort_order: number;
  archived_at: string | null;
};

export function BrandForm({ brand }: { brand: BrandFormData | null }) {
  const b = brand;
  return (
    <AdminForm
      action={saveBrand.bind(null, b?.id ?? null)}
      editBasePath={b ? undefined : "/admin/marcas"}
      footer={
        <>
          {b && <CatalogArchiveButton table="brands" id={b.id} archived={!!b.archived_at} noun="esta marca" />}
          <SubmitButton>{b ? "Guardar cambios" : "Crear marca"}</SubmitButton>
        </>
      }
    >
      <Section title="Marca">
        <NameAndSlug nameLabel="Nombre" defaultName={b?.name} defaultSlug={b?.slug} />
        <TextField label="Sitio web" name="website_url" defaultValue={b?.website_url ?? ""} placeholder="https://…" help="Opcional." />
        <ImageField label="Logo (opcional)" name="logo_media_id" defaultImage={b?.logo} />
      </Section>
      <Section title="Visualización">
        <Checkbox name="show_on_site" label="Mostrar en la lista de marcas del sitio" defaultChecked={b?.show_on_site ?? true} help="Aparece en /nosotros. Destildalo si sólo la usás para clasificar productos." />
        <TextField label="Orden" name="sort_order" type="number" min={0} defaultValue={b?.sort_order ?? 0} help="Número menor = aparece primero." className="max-w-[160px]" />
      </Section>
    </AdminForm>
  );
}
