import { Trash2 } from "lucide-react";
import { AdminForm, ConfirmAction, SubmitButton } from "@/components/admin/form";
import { Checkbox, IconPicker, ListField, PriceFields, Section, SelectField, TextArea, TextField } from "@/components/admin/fields";
import { ImageField, type PickedImage } from "@/components/admin/media";
import { EMOJI_ICONS } from "@/lib/settings/icons";
import { deleteWorkshopService, saveWorkshopService } from "./actions";

export type WorkshopFormData = {
  id: string;
  kind: "category" | "rate";
  season: string | null;
  name: string;
  description: string | null;
  icon: string | null;
  image: PickedImage | null;
  items: string[];
  price_mode: string;
  price_amount: number | null;
  currency: string;
  price_unit: string | null;
  whatsapp_message: string | null;
  sort_order: number;
  is_visible: boolean;
};

const UNITS = [
  { value: "unit", label: "por unidad" },
  { value: "cm2", label: "por cm²" },
  { value: "hour", label: "por hora" },
];

export function WorkshopForm({
  service,
  kind,
  defaultSeason = "invierno",
}: {
  service: WorkshopFormData | null;
  kind: "category" | "rate";
  defaultSeason?: "invierno" | "verano";
}) {
  const s = service;
  const isRate = kind === "rate";
  return (
    <AdminForm
      action={saveWorkshopService.bind(null, s?.id ?? null)}
      editBasePath={s ? undefined : "/admin/taller"}
      footer={
        <>
          {s && (
            <ConfirmAction
              action={deleteWorkshopService.bind(null, s.id)}
              redirectTo="/admin/taller"
              label="Eliminar"
              icon={<Trash2 size={16} />}
              variant="danger"
              title="¿Eliminar este servicio?"
              description="Se borra definitivamente. Para ocultarlo sin perderlo, destildá “Visible en el sitio”."
              confirmLabel="Eliminar"
              danger
            />
          )}
          <SubmitButton>{s ? "Guardar cambios" : "Crear"}</SubmitButton>
        </>
      }
    >
      <input type="hidden" name="kind" value={kind} />
      <Section title={isRate ? "Fila del tarifario" : "Tarjeta de servicio"}>
        <TextField
          label="Nombre"
          name="name"
          required
          defaultValue={s?.name ?? ""}
          maxLength={160}
          placeholder={isRate ? "Afilado de cantos + encerado" : "Carpas y Tiendas"}
        />
        {isRate ? (
          <SelectField
            label="Temporada"
            name="season"
            required
            defaultValue={s?.season ?? defaultSeason}
            options={[
              { value: "invierno", label: "Invierno (ski y snowboard)" },
              { value: "verano", label: "Verano (camping y trekking)" },
            ]}
          />
        ) : (
          <>
            <TextArea label="Descripción" name="description" defaultValue={s?.description ?? ""} rows={3} maxLength={600} />
            <ListField
              label="Trabajos que incluye"
              name="items"
              itemLabel="Trabajo"
              defaultValue={s?.items ?? []}
              max={20}
              help="Se muestran como lista dentro de la tarjeta."
            />
            <IconPicker label="Ícono" name="icon" icons={EMOJI_ICONS} defaultValue={s?.icon} />
            <ImageField label="Imagen (opcional)" name="image_media_id" defaultImage={s?.image} help="Si cargás una imagen, reemplaza al ícono." />
          </>
        )}
      </Section>

      <Section title="Precio" description={isRate ? "Si elegís “Consultar”, la fila muestra “Consultar”." : "Opcional. Si lo dejás en “Consultar”, la tarjeta no muestra precio."}>
        <PriceFields
          defaults={{
            price_mode: s?.price_mode ?? (isRate ? "from" : "consult"),
            price_amount: s?.price_amount ?? null,
            currency: s?.currency ?? "ARS",
            price_unit: s?.price_unit ?? null,
          }}
          units={UNITS}
        />
      </Section>

      {!isRate && (
        <Section title="Consulta por WhatsApp">
          <TextField
            label="Mensaje de consulta"
            name="whatsapp_message"
            defaultValue={s?.whatsapp_message ?? ""}
            maxLength={200}
            placeholder="Hola, quiero consultar por la reparación de mi carpa"
            help="Si lo completás, la tarjeta muestra un botón “Consultar” que abre WhatsApp del taller con este texto."
          />
        </Section>
      )}

      <Section title="Visualización">
        <Checkbox name="is_visible" label="Visible en el sitio" defaultChecked={s?.is_visible ?? true} />
        <TextField
          label="Orden"
          name="sort_order"
          type="number"
          min={0}
          defaultValue={s?.sort_order ?? 0}
          help="Número menor = aparece primero."
          className="max-w-[160px]"
        />
      </Section>
    </AdminForm>
  );
}
