import { Archive, ArchiveRestore } from "lucide-react";
import { AdminForm, ConfirmAction, SubmitButton } from "@/components/admin/form";
import { Checkbox, NameAndSlug, Section, SelectField, TextArea, TextField } from "@/components/admin/fields";
import { ImageField, type PickedImage } from "@/components/admin/media";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { savePost, setPostStatus } from "./actions";

export type PostFormData = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  cover: PickedImage | null;
  cover_alt: string | null;
  body_html: string;
  published_at: string | null;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published" | "archived";
};

/** Fecha AAAA-MM-DD en horario de Argentina (para el input type="date"). */
function dateInput(iso: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(new Date(iso));
}

export function PostForm({ post }: { post: PostFormData | null }) {
  const p = post;
  const status = p?.status ?? "draft";
  const action = savePost.bind(null, p?.id ?? null);

  return (
    <AdminForm
      action={action}
      editBasePath={p ? undefined : "/admin/publicaciones"}
      footer={
        <>
          {p && status !== "archived" && (
            <ConfirmAction
              action={setPostStatus.bind(null, p.id, "archived")}
              label="Archivar"
              icon={<Archive size={16} />}
              variant="danger"
              title="¿Archivar esta publicación?"
              description="Deja de verse en el sitio y su dirección deja de funcionar. Podés restaurarla desde el filtro “Archivadas”."
              confirmLabel="Archivar"
              danger
            />
          )}
          {p && status === "archived" && (
            <ConfirmAction
              action={setPostStatus.bind(null, p.id, "draft")}
              label="Restaurar como borrador"
              icon={<ArchiveRestore size={16} />}
              title="¿Restaurar esta publicación?"
              description="Vuelve como borrador. Para que se vea en el sitio, publicala."
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
        <NameAndSlug nameLabel="Título" defaultName={p?.title} defaultSlug={p?.slug} urlPrefix="/contenido/" />
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            label="Categoría"
            name="category"
            required
            defaultValue={p?.category ?? "ECOtrip"}
            options={[
              { value: "ECOtrip", label: "ECOtrip (destinos y salidas)" },
              { value: "ECOtip", label: "ECOtip (consejos y guías)" },
            ]}
          />
          <TextField
            label="Fecha de publicación"
            name="published_at"
            type="date"
            defaultValue={dateInput(p?.published_at ?? null)}
            help="Si la dejás vacía, se usa la fecha en que la publicás. Con una fecha futura, aparece recién ese día."
          />
        </div>
        <TextArea
          label="Resumen"
          name="excerpt"
          defaultValue={p?.excerpt ?? ""}
          rows={3}
          maxLength={400}
          help="Se muestra en las tarjetas del listado y del inicio."
        />
      </Section>

      <Section title="Imagen de portada">
        <ImageField label="Portada" name="cover_media_id" altName="cover_alt" defaultImage={p?.cover} defaultAlt={p?.cover_alt} />
      </Section>

      <Section title="Texto" description="El tiempo de lectura se calcula solo a partir del texto.">
        <RichTextEditor name="body_html" label="Cuerpo de la publicación" defaultValue={p?.body_html ?? ""} />
      </Section>

      <Section title="Buscadores (SEO)" description="Opcional. Si lo dejás vacío se usan el título y el resumen.">
        <TextField label="Título para buscadores" name="seo_title" defaultValue={p?.seo_title ?? ""} maxLength={70} help="Hasta 70 caracteres." />
        <TextArea
          label="Descripción para buscadores"
          name="seo_description"
          defaultValue={p?.seo_description ?? ""}
          rows={2}
          maxLength={170}
          help="Hasta 170 caracteres."
        />
      </Section>

      <Section title="Visualización">
        <Checkbox
          name="featured"
          label="Destacada en el inicio"
          help="El inicio muestra las 2 destacadas más recientes; si no hay ninguna, las 2 últimas."
          defaultChecked={p?.featured}
        />
      </Section>
    </AdminForm>
  );
}
