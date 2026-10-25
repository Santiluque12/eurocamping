import { Archive, ArchiveRestore } from "lucide-react";
import { AdminForm, ConfirmAction, SubmitButton } from "@/components/admin/form";
import { Checkbox, ListField, NameAndSlug, PriceFields, Section, SelectField, TextArea, TextField } from "@/components/admin/fields";
import { GalleryField, ImageField, type PickedImage } from "@/components/admin/media";
import { saveProduct, setProductStatus } from "./actions";

export type ProductFormData = {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  spec_line: string | null;
  category_id: string | null;
  brand_id: string | null;
  main_image: PickedImage | null;
  main_image_alt: string | null;
  price_mode: string;
  price_amount: number | null;
  currency: string;
  price_unit: string | null;
  availability: string;
  tags: string[];
  external_url: string | null;
  external_label: string | null;
  whatsapp_message: string | null;
  featured: boolean;
  sort_order: number;
  status: "draft" | "published" | "archived";
  gallery: (PickedImage & { itemAlt: string | null })[];
  activity_ids: string[];
};

type Option = { value: string; label: string };

export function ProductForm({
  product,
  categories,
  brands,
  activities,
}: {
  product: ProductFormData | null;
  categories: Option[];
  brands: Option[];
  activities: Option[];
}) {
  const p = product;
  const status = p?.status ?? "draft";
  const action = saveProduct.bind(null, p?.id ?? null);

  return (
    <AdminForm
      action={action}
      editBasePath={p ? undefined : "/admin/productos"}
      footer={
        <>
          {p && status !== "archived" && (
            <ConfirmAction
              action={setProductStatus.bind(null, p.id, "archived")}
              label="Archivar"
              icon={<Archive size={16} />}
              variant="danger"
              title="¿Archivar este producto?"
              description="Deja de verse en el sitio. Podés restaurarlo cuando quieras desde el filtro “Archivados”."
              confirmLabel="Archivar"
              danger
            />
          )}
          {p && status === "archived" && (
            <ConfirmAction
              action={setProductStatus.bind(null, p.id, "draft")}
              label="Restaurar como borrador"
              icon={<ArchiveRestore size={16} />}
              title="¿Restaurar este producto?"
              description="Vuelve como borrador. Para que se vea en el sitio, publicalo."
              confirmLabel="Restaurar"
            />
          )}
          {status === "published" ? (
            <>
              <SubmitButton intent="draft" variant="secondary">Pasar a borrador</SubmitButton>
              <SubmitButton intent="save">Guardar cambios</SubmitButton>
            </>
          ) : (
            <>
              <SubmitButton intent="draft" variant="secondary">Guardar borrador</SubmitButton>
              <SubmitButton intent="publish">Publicar</SubmitButton>
            </>
          )}
        </>
      }
    >
      <Section title="Datos principales">
        <NameAndSlug
          nameLabel="Nombre"
          defaultName={p?.name}
          defaultSlug={p?.slug}
          slugHelp="Identificador único. En equipos de alquiler se usa como enlace dentro del catálogo (/alquilar/catalogo#identificador): si lo cambiás, actualizá los enlaces que lo usen."
        />
        <div className="grid gap-5 md:grid-cols-3">
          <SelectField
            label="Tipo"
            name="type"
            required
            defaultValue={p?.type ?? "rental"}
            options={[
              { value: "rental", label: "Equipo de alquiler" },
              { value: "nuevo", label: "Producto nuevo" },
              { value: "usado", label: "Usado (Revisado ECO)" },
            ]}
          />
          <SelectField
            label="Categoría"
            name="category_id"
            defaultValue={p?.category_id ?? ""}
            placeholder="Sin categoría"
            options={categories}
            help="Los equipos de alquiler con categoría aparecen en el catálogo."
          />
          <SelectField label="Marca" name="brand_id" defaultValue={p?.brand_id ?? ""} placeholder="Sin marca" options={brands} />
        </div>
        <TextArea label="Descripción" name="description" defaultValue={p?.description ?? ""} rows={4} maxLength={2000} />
        <TextField
          label="Detalle corto"
          name="spec_line"
          defaultValue={p?.spec_line ?? ""}
          maxLength={200}
          help="Talles, medidas o peso. Ej: Talles 41–46 · Negro / Marrón"
        />
        <ListField
          label="Etiquetas"
          name="tags"
          itemLabel="Etiqueta"
          defaultValue={p?.tags ?? []}
          max={8}
          help="La primera etiqueta se muestra sobre la foto (por ejemplo “Revisado ECO”)."
        />
      </Section>

      <Section title="Imágenes">
        <ImageField
          label="Imagen principal"
          name="main_image_id"
          altName="main_image_alt"
          defaultImage={p?.main_image}
          defaultAlt={p?.main_image_alt}
        />
        <GalleryField name="gallery" defaultItems={p?.gallery ?? []} />
      </Section>

      <Section title="Precio y disponibilidad" description="Los importes se guardan como números; el sitio los muestra con formato.">
        <PriceFields
          defaults={{
            price_mode: p?.price_mode ?? "consult",
            price_amount: p?.price_amount ?? null,
            currency: p?.currency ?? "ARS",
            price_unit: p?.price_unit ?? null,
          }}
          units={[
            { value: "day", label: "por día" },
            { value: "weekend", label: "por fin de semana" },
            { value: "week", label: "por semana" },
            { value: "unit", label: "por unidad" },
          ]}
        />
        <SelectField
          label="Disponibilidad"
          name="availability"
          defaultValue={p?.availability ?? "consult"}
          options={[
            { value: "available", label: "Disponible" },
            { value: "consult", label: "Consultar disponibilidad" },
            { value: "unavailable", label: "No disponible" },
          ]}
          help="Es informativa: no hay reservas ni control de stock por fechas."
        />
      </Section>

      {activities.length > 0 && (
        <Section title="Actividades relacionadas">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((a) => (
              <Checkbox key={a.value} name="activity_ids" value={a.value} label={a.label} defaultChecked={p?.activity_ids.includes(a.value)} />
            ))}
          </div>
        </Section>
      )}

      <Section title="Consultas y enlaces">
        <TextField
          label="Texto para la consulta por WhatsApp"
          name="whatsapp_message"
          defaultValue={p?.whatsapp_message ?? ""}
          maxLength={200}
          help="Se agrega al mensaje automático. Si lo dejás vacío se usa el nombre del producto."
        />
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            label="Enlace externo"
            name="external_url"
            type="url"
            defaultValue={p?.external_url ?? ""}
            placeholder="https://…"
            help="Por ejemplo, la publicación en Mercado Libre."
          />
          <TextField label="Nombre del canal" name="external_label" defaultValue={p?.external_label ?? ""} placeholder="Mercado Libre" maxLength={40} />
        </div>
      </Section>

      <Section title="Visualización">
        <Checkbox
          name="featured"
          label="Destacado en el inicio"
          help="Aparece en “Elegidos para esta temporada” (hasta 6, en el orden de abajo)."
          defaultChecked={p?.featured}
        />
        <TextField
          label="Orden"
          name="sort_order"
          type="number"
          min={0}
          defaultValue={p?.sort_order ?? 0}
          help="Número menor = aparece primero."
          className="max-w-[160px]"
        />
      </Section>
    </AdminForm>
  );
}
