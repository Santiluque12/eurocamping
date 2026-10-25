import { Trash2 } from "lucide-react";
import { AdminForm, ConfirmAction, SubmitButton } from "@/components/admin/form";
import { Checkbox, IconPicker, Section, TextArea, TextField } from "@/components/admin/fields";
import { EMOJI_ICONS } from "@/lib/settings/icons";
import { PERIOD_LABELS, PERIOD_ORDER, type RentalPeriod } from "@/lib/format";
import { deleteSection, saveSection } from "../actions";

export type SectionFormData = {
  id: string;
  slug: string;
  title: string;
  title_accent: string | null;
  nav_label: string;
  icon: string | null;
  description: string | null;
  periods: RentalPeriod[];
  footnote: string | null;
  show_resorts: boolean;
  sort_order: number;
  is_visible: boolean;
};

export function SectionForm({ section, rateCount = 0 }: { section: SectionFormData | null; rateCount?: number }) {
  const s = section;
  return (
    <AdminForm
      action={saveSection.bind(null, s?.id ?? null)}
      editBasePath={s ? undefined : "/admin/tarifario/secciones"}
      footer={
        <>
          {s && rateCount === 0 && (
            <ConfirmAction
              action={deleteSection.bind(null, s.id)}
              redirectTo="/admin/tarifario"
              label="Eliminar sección"
              icon={<Trash2 size={16} />}
              variant="danger"
              title="¿Eliminar esta sección?"
              description="Se borra definitivamente."
              confirmLabel="Eliminar"
              danger
            />
          )}
          <SubmitButton>{s ? "Guardar cambios" : "Crear sección"}</SubmitButton>
        </>
      }
    >
      <Section title="Títulos">
        <div className="grid gap-5 md:grid-cols-2">
          <TextField label="Título" name="title" required defaultValue={s?.title ?? ""} maxLength={80} placeholder="Camping" />
          <TextField label="Título – parte destacada" name="title_accent" defaultValue={s?.title_accent ?? ""} maxLength={80} placeholder="& Trekking" />
          <TextField label="Nombre en el menú de secciones" name="nav_label" defaultValue={s?.nav_label ?? ""} maxLength={60} help="Vacío = igual al título." />
          <TextField
            label="Identificador (ancla)"
            name="slug"
            defaultValue={s?.slug ?? ""}
            help="Se usa en /alquilar#identificador. Vacío = se genera del título."
          />
        </div>
        <IconPicker label="Ícono" name="icon" icons={EMOJI_ICONS} defaultValue={s?.icon} />
        <TextArea label="Descripción" name="description" defaultValue={s?.description ?? ""} rows={2} maxLength={400} />
      </Section>

      <Section title="Columnas de precios" description="Qué plazos de alquiler se muestran en la tabla de esta sección.">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PERIOD_ORDER.map((p) => (
            <Checkbox key={p} name="periods" value={p} label={PERIOD_LABELS[p]} defaultChecked={s ? s.periods.includes(p) : ["day", "weekend", "week"].includes(p)} />
          ))}
        </div>
      </Section>

      <Section title="Notas y extras">
        <TextArea label="Nota al pie de la tabla" name="footnote" defaultValue={s?.footnote ?? ""} rows={2} maxLength={400} />
        <Checkbox
          name="show_resorts"
          label="Mostrar “Tarifas por centro de ski”"
          help="Muestra el bloque de centros de ski que se edita en Textos › Alquilar."
          defaultChecked={s?.show_resorts}
        />
      </Section>

      <Section title="Visualización">
        <Checkbox name="is_visible" label="Visible en el sitio" defaultChecked={s?.is_visible ?? true} />
        <TextField label="Orden" name="sort_order" type="number" min={0} defaultValue={s?.sort_order ?? 0} help="Número menor = aparece primero." className="max-w-[160px]" />
      </Section>
    </AdminForm>
  );
}
