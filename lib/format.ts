import type { Database } from "@/lib/supabase/database.types";

type PriceMode = Database["public"]["Enums"]["price_mode"];
export type RentalPeriod = Database["public"]["Enums"]["rental_period"];

export const PERIOD_LABELS: Record<RentalPeriod, string> = {
  day: "Día",
  weekend: "Fin de semana",
  three_days: "3 días",
  four_days: "4 días",
  week: "Semana",
  fortnight: "Quincena",
};
export const PERIOD_ORDER: RentalPeriod[] = ["day", "weekend", "three_days", "four_days", "week", "fortnight"];

export const PRICE_UNIT_LABELS: Record<string, string> = {
  day: "día",
  weekend: "fin de semana",
  week: "semana",
  unit: "unidad",
  cm2: "cm²",
  hour: "hora",
};

export function formatMoney(amount: number, currency: string = "ARS") {
  const n = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return currency === "USD" ? `US$ ${n}` : `$${n}`;
}

/** Etiqueta de precio para mostrar. Devuelve null cuando es "consultar". */
export function priceLabel(p: {
  price_mode: PriceMode;
  price_amount: number | null;
  currency: string;
  price_unit?: string | null;
}) {
  if (p.price_mode === "consult" || p.price_amount === null) return null;
  const money = formatMoney(Number(p.price_amount), p.currency);
  const unit = p.price_unit ? ` / ${PRICE_UNIT_LABELS[p.price_unit] ?? p.price_unit}` : "";
  // "Desde $500/cm²" se lee mejor sin espacios para unidades de medida.
  const unitText = p.price_unit === "cm2" ? `/${PRICE_UNIT_LABELS.cm2}` : unit;
  return p.price_mode === "from" ? `Desde ${money}${unitText}` : `${money}${unitText}`;
}

export function waLink(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Argentina/Buenos_Aires" }).format(new Date(iso));
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
