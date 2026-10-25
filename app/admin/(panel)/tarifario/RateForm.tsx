import { Archive, ArchiveRestore } from "lucide-react";
import { AdminForm, ConfirmAction, SubmitButton } from "@/components/admin/form";
import { Section, SelectField, TextField } from "@/components/admin/fields";
import type { RentalPeriod } from "@/lib/format";
import { saveRate, setRateStatus } from "./actions";
import { RatePricing } from "./RatePricing";

export type RateFormData = {
  id: string;
  section_id: string;
  group_name: string | null;
  name: string;
  product_id: string | null;
  sort_order: number;
  status: "draft" | "published" | "archived";
  prices: Partial<Record<RentalPeriod, number>>;
  currency: string;
};

type Option = { value: string; label: string };

export function RateForm({
  rate,
  sections,
  products,
  groups,
  defaultSectionId = "",
}: {
  rate: RateFormData | null;
  sections: (Option & { periods: RentalPeriod[] })[];
  products: Option[];
  groups: string[];
  defaultSectionId?: string;
}) {
  const r = rate;
  const status = r?.status ?? "draft";
  return (
    <AdminForm
      action={saveRate.bind(null, r?.id ?? null)}
      editBasePath={r ? undefined : "/admin/tarifario"}
      footer={
        <>
          {r && status !== "archived" && (
            <ConfirmAction
              action={setRateStatus.bind(null, r.id, "archived")}
              label="Archivar"
              icon={<Archive size={16} />}
              variant="danger"
              title="¿Archivar esta fila?"
              description="Deja de verse en el tarifario. Podés restaurarla desde el filtro “Archivadas”."
              confirmLabel="Archivar"
              danger
            />
          )}
          {r && status === "archived" && (
            <ConfirmAction
              action={setRateStatus.bind(null, r.id, "draft")}
              label="Restaurar como borrador"
              icon={<ArchiveRestore size={16} />}
              title="¿Restaurar esta fila?"
              description="Vuelve como borrador. Para que se vea, publicala."
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
      <Section title="Equipo">
        <TextField label="Nombre en el tarifario" name="name" required defaultValue={r?.name ?? ""} maxLength={160} placeholder="Campera de ski" />
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            label="Subgrupo (opcional)"
            name="group_name"
            defaultValue={r?.group_name ?? ""}
            maxLength={80}
            list="rate-groups"
            help="Agrupa filas dentro de la sección, por ejemplo “Carpas” o “Bolsas de dormir”."
          />
          <datalist id="rate-groups">
            {groups.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
          <SelectField
            label="Equipo del catálogo (opcional)"
            name="product_id"
            defaultValue={r?.product_id ?? ""}
            placeholder="Sin enlace al catálogo"
            options={products}
            help="Si lo elegís, la fila muestra “Ver foto” y lleva al equipo en /alquilar/catalogo."
          />
        </div>
        <TextField
          label="Orden"
          name="sort_order"
          type="number"
          min={0}
          defaultValue={r?.sort_order ?? 0}
          help="Número menor = aparece primero dentro de la sección."
          className="max-w-[160px]"
        />
      </Section>
      <Section title="Precios">
        <RatePricing sections={sections} defaultSectionId={r?.section_id ?? defaultSectionId} defaultPrices={r?.prices ?? {}} defaultCurrency={r?.currency ?? "ARS"} />
      </Section>
    </AdminForm>
  );
}
