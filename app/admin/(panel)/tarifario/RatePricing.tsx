"use client";

import { useState } from "react";
import { SelectField, TextField } from "@/components/admin/fields";
import { PERIOD_LABELS, type RentalPeriod } from "@/lib/format";

type SectionOption = { value: string; label: string; periods: RentalPeriod[] };

/** Sección + importes: las columnas de precio dependen de la sección elegida. */
export function RatePricing({
  sections,
  defaultSectionId,
  defaultPrices,
  defaultCurrency,
}: {
  sections: SectionOption[];
  defaultSectionId: string;
  defaultPrices: Partial<Record<RentalPeriod, number>>;
  defaultCurrency: string;
}) {
  const [sectionId, setSectionId] = useState(defaultSectionId);
  const section = sections.find((s) => s.value === sectionId);
  return (
    <>
      <SelectField
        label="Sección del tarifario"
        name="section_id"
        required
        value={sectionId}
        onChange={(e) => setSectionId(e.target.value)}
        placeholder="Elegí una sección"
        options={sections}
      />
      {section && (
        <div className="space-y-3">
          <p className="text-sm text-[#6b7280]">
            Importes por período. Dejá vacío lo que no se alquila por ese plazo (se muestra “—”).
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.periods.map((p) => (
              <TextField
                key={`${sectionId}-${p}`}
                label={PERIOD_LABELS[p]}
                name={`price_${p}`}
                inputMode="decimal"
                defaultValue={defaultPrices[p] ?? ""}
                placeholder="Ej: 15000"
              />
            ))}
          </div>
          <SelectField
            label="Moneda"
            name="currency"
            defaultValue={defaultCurrency}
            options={[
              { value: "ARS", label: "Pesos (ARS)" },
              { value: "USD", label: "Dólares (USD)" },
            ]}
            className="max-w-xs"
          />
        </div>
      )}
    </>
  );
}
