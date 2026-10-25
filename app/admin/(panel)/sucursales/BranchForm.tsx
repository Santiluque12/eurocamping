import { Trash2 } from "lucide-react";
import { AdminForm, ConfirmAction, SubmitButton } from "@/components/admin/form";
import { Checkbox, ListField, Section, TextArea, TextField } from "@/components/admin/fields";
import { deleteBranch, saveBranch } from "./actions";

export type BranchFormData = {
  id: string;
  name: string;
  city: string;
  region: string;
  address: string | null;
  phones: string[];
  whatsapp: string | null;
  hours: string | null;
  maps_url: string | null;
  offers_rental: boolean;
  services: string[];
  season_label: string | null;
  notes: string | null;
  sort_order: number;
  is_visible: boolean;
};

export function BranchForm({ branch, regions }: { branch: BranchFormData | null; regions: string[] }) {
  const b = branch;
  return (
    <AdminForm
      action={saveBranch.bind(null, b?.id ?? null)}
      editBasePath={b ? undefined : "/admin/sucursales"}
      footer={
        <>
          {b && (
            <ConfirmAction
              action={deleteBranch.bind(null, b.id)}
              redirectTo="/admin/sucursales"
              label="Eliminar"
              icon={<Trash2 size={16} />}
              variant="danger"
              title="¿Eliminar esta sucursal?"
              description="Se borra definitivamente. Si sólo querés que deje de verse por un tiempo, destildá “Visible en el sitio”."
              confirmLabel="Eliminar"
              danger
            />
          )}
          <SubmitButton>{b ? "Guardar cambios" : "Crear sucursal"}</SubmitButton>
        </>
      }
    >
      <Section title="Ubicación">
        <TextField label="Nombre" name="name" required defaultValue={b?.name ?? ""} maxLength={120} placeholder="Eurocamping Martínez" />
        <div className="grid gap-5 md:grid-cols-2">
          <TextField label="Ciudad o localidad" name="city" required defaultValue={b?.city ?? ""} maxLength={120} />
          <TextField
            label="Provincia o región"
            name="region"
            required
            defaultValue={b?.region ?? ""}
            maxLength={80}
            list="regions"
            help="Las sucursales se agrupan por este dato. Escribilo igual que en las otras."
          />
          <datalist id="regions">
            {regions.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </div>
        <TextField label="Dirección" name="address" defaultValue={b?.address ?? ""} maxLength={200} />
        <TextField
          label="Enlace a Google Maps"
          name="maps_url"
          type="url"
          defaultValue={b?.maps_url ?? ""}
          placeholder="https://maps.google.com/…"
          help="Si lo dejás vacío no se muestra el botón “Cómo llegar”."
        />
      </Section>

      <Section title="Contacto y horarios">
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            label="WhatsApp"
            name="whatsapp"
            inputMode="numeric"
            defaultValue={b?.whatsapp ?? ""}
            placeholder="5491162237233"
            help="Con código de país y área, sin + ni espacios."
          />
          <TextField label="Horarios" name="hours" defaultValue={b?.hours ?? ""} maxLength={200} placeholder="Lun a Vie 10 a 19 h" />
        </div>
        <ListField label="Teléfonos" name="phones" itemLabel="Teléfono" defaultValue={b?.phones ?? []} max={5} />
      </Section>

      <Section title="Servicios y temporada">
        <Checkbox name="offers_rental" label="Tiene alquiler de equipos" defaultChecked={b?.offers_rental} help="Muestra la etiqueta “Rental” en la tarjeta." />
        <ListField label="Otros servicios" name="services" itemLabel="Servicio" defaultValue={b?.services ?? []} max={12} help="Por ejemplo: Taller, Venta, Usados." />
        <TextField
          label="Temporada"
          name="season_label"
          defaultValue={b?.season_label ?? ""}
          maxLength={60}
          placeholder="Sólo invierno"
          help="Si la sucursal abre sólo en una época del año. Vacío = todo el año."
        />
        <TextArea label="Notas" name="notes" defaultValue={b?.notes ?? ""} rows={2} maxLength={500} help="Se muestran en la tarjeta, en letra chica." />
      </Section>

      <Section title="Visualización">
        <Checkbox name="is_visible" label="Visible en el sitio" defaultChecked={b?.is_visible ?? true} />
        <TextField
          label="Orden"
          name="sort_order"
          type="number"
          min={0}
          defaultValue={b?.sort_order ?? 0}
          help="Número menor = aparece primero dentro de su región."
          className="max-w-[160px]"
        />
      </Section>
    </AdminForm>
  );
}
