import { AdminForm, SubmitButton } from "@/components/admin/form";
import { Checkbox, IconPicker, NameAndSlug, Section, TextField } from "@/components/admin/fields";
import { CatalogArchiveButton } from "@/components/admin/catalog";
import { saveActivity } from "@/lib/admin/catalog-actions";
import { EMOJI_ICONS } from "@/lib/settings/icons";

export type ActivityFormData = {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  link_href: string | null;
  show_in_home: boolean;
  sort_order: number;
  archived_at: string | null;
};

export function ActivityForm({ activity }: { activity: ActivityFormData | null }) {
  const a = activity;
  return (
    <AdminForm
      action={saveActivity.bind(null, a?.id ?? null)}
      editBasePath={a ? undefined : "/admin/actividades"}
      footer={
        <>
          {a && <CatalogArchiveButton table="activities" id={a.id} archived={!!a.archived_at} noun="esta actividad" />}
          <SubmitButton>{a ? "Guardar cambios" : "Crear actividad"}</SubmitButton>
        </>
      }
    >
      <Section title="Actividad">
        <NameAndSlug nameLabel="Nombre" defaultName={a?.name} defaultSlug={a?.slug} />
        <IconPicker label="Ícono" name="emoji" icons={EMOJI_ICONS} defaultValue={a?.emoji} />
        <TextField
          label="Destino al hacer clic"
          name="link_href"
          defaultValue={a?.link_href ?? ""}
          placeholder="/alquilar"
          help="Ruta interna (ej. /alquilar#ski) o enlace https://. Vacío = /alquilar."
        />
      </Section>
      <Section title="Visualización">
        <Checkbox name="show_in_home" label="Mostrar en el inicio" defaultChecked={a?.show_in_home ?? true} help="Aparece en la fila de actividades de la portada." />
        <TextField label="Orden" name="sort_order" type="number" min={0} defaultValue={a?.sort_order ?? 0} help="Número menor = aparece primero." className="max-w-[160px]" />
      </Section>
    </AdminForm>
  );
}
