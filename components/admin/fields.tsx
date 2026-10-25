"use client";

import { useId, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useFieldError, useMarkDirty } from "./form";
import { slugify } from "@/lib/format";

export const inputCls =
  "w-full rounded-xl border border-[#d1d5db] bg-white px-3.5 py-2.5 text-[15px] text-[#1a1a1a] placeholder:text-[#9ca3af] focus:border-[#F5A623] focus:outline-none focus:ring-2 focus:ring-[#F5A623]/30 disabled:bg-[#f3f4f6]";
const errorInputCls = "border-red-400 focus:border-red-500 focus:ring-red-200";

export function Field({
  label,
  name,
  help,
  required,
  children,
  htmlFor,
}: {
  label: string;
  name?: string;
  help?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  const error = useFieldError(name ?? "");
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-[#1a1a1a]">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : (
        help && <p className="text-xs text-[#6b7280] leading-relaxed">{help}</p>
      )}
    </div>
  );
}

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> & {
  label: string;
  name: string;
  help?: React.ReactNode;
};

export function TextField({ label, name, help, required, ...rest }: InputProps) {
  const id = useId();
  const error = useFieldError(name);
  return (
    <Field label={label} name={name} help={help} required={required} htmlFor={id}>
      <input
        id={id}
        name={name}
        aria-invalid={!!error}
        className={`${inputCls} ${error ? errorInputCls : ""}`}
        {...rest}
      />
    </Field>
  );
}

export function TextArea({
  label,
  name,
  help,
  required,
  rows = 4,
  ...rest
}: Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> & { label: string; name: string; help?: React.ReactNode }) {
  const id = useId();
  const error = useFieldError(name);
  return (
    <Field label={label} name={name} help={help} required={required} htmlFor={id}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        aria-invalid={!!error}
        className={`${inputCls} ${error ? errorInputCls : ""}`}
        {...rest}
      />
    </Field>
  );
}

export function SelectField({
  label,
  name,
  help,
  required,
  options,
  placeholder,
  ...rest
}: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name"> & {
  label: string;
  name: string;
  help?: React.ReactNode;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const id = useId();
  const error = useFieldError(name);
  return (
    <Field label={label} name={name} help={help} required={required} htmlFor={id}>
      <select id={id} name={name} aria-invalid={!!error} className={`${inputCls} ${error ? errorInputCls : ""}`} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Checkbox({
  label,
  name,
  help,
  defaultChecked,
  value,
}: {
  label: string;
  name: string;
  help?: string;
  defaultChecked?: boolean;
  value?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-[#e5e7eb] bg-white px-3.5 py-3 cursor-pointer hover:bg-[#f9fafb]">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-5 w-5 rounded accent-[#F5A623] shrink-0"
      />
      <span>
        <span className="block text-sm font-semibold text-[#1a1a1a]">{label}</span>
        {help && <span className="block text-xs text-[#6b7280] mt-0.5">{help}</span>}
      </span>
    </label>
  );
}

/** Nombre + identificador para la URL (se completa solo a partir del nombre). */
export function NameAndSlug({
  nameLabel,
  defaultName = "",
  defaultSlug = "",
  slugHelp,
  urlPrefix,
}: {
  nameLabel: string;
  defaultName?: string;
  defaultSlug?: string;
  slugHelp?: string;
  urlPrefix?: string;
}) {
  const [name, setName] = useState(defaultName);
  const [slug, setSlug] = useState(defaultSlug);
  const [touched, setTouched] = useState(!!defaultSlug);
  const shown = touched ? slug : slugify(name);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <TextField
        label={nameLabel}
        name="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={200}
      />
      <TextField
        label="Identificador para la URL"
        name="slug"
        value={shown}
        onChange={(e) => {
          setTouched(true);
          setSlug(e.target.value);
        }}
        help={
          slugHelp ??
          (urlPrefix ? `Se usa en la dirección: ${urlPrefix}${shown || "…"}. Sólo minúsculas, números y guiones.` : "Sólo minúsculas, números y guiones.")
        }
      />
    </div>
  );
}

/** Precio: modalidad + importe numérico + moneda + unidad. */
export function PriceFields({
  defaults,
  units,
  prefix = "",
}: {
  defaults: { price_mode: string; price_amount: number | null; currency: string; price_unit: string | null };
  units: { value: string; label: string }[];
  prefix?: string;
}) {
  const [mode, setMode] = useState(defaults.price_mode);
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <SelectField
        label="Precio"
        name={`${prefix}price_mode`}
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        options={[
          { value: "consult", label: "Consultar (sin precio)" },
          { value: "from", label: "Desde…" },
          { value: "fixed", label: "Precio fijo" },
        ]}
      />
      {mode !== "consult" && (
        <>
          <TextField
            label="Importe"
            name={`${prefix}price_amount`}
            inputMode="decimal"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={defaults.price_amount ?? ""}
            help="Sólo el número, sin $ ni puntos. Ej: 18000"
          />
          <SelectField
            label="Moneda"
            name={`${prefix}currency`}
            defaultValue={defaults.currency}
            options={[
              { value: "ARS", label: "Pesos (ARS)" },
              { value: "USD", label: "Dólares (USD)" },
            ]}
          />
          <SelectField
            label="Unidad"
            name={`${prefix}price_unit`}
            defaultValue={defaults.price_unit ?? ""}
            placeholder="Sin unidad"
            options={units}
          />
        </>
      )}
      {mode === "consult" && <input type="hidden" name={`${prefix}currency`} value={defaults.currency} />}
    </div>
  );
}

/** Lista de textos editable (agregar, quitar, ordenar). Se envía como JSON. */
export function ListField({
  label,
  name,
  defaultValue = [],
  itemLabel = "Elemento",
  help,
  multiline,
  max = 30,
}: {
  label: string;
  name: string;
  defaultValue?: string[];
  itemLabel?: string;
  help?: string;
  multiline?: boolean;
  max?: number;
}) {
  const [items, setItems] = useState(defaultValue.length ? defaultValue : []);
  const markDirty = useMarkDirty();
  const update = (next: string[]) => {
    setItems(next);
    markDirty();
  };
  return (
    <Field label={label} name={name} help={help}>
      <input type="hidden" name={name} value={JSON.stringify(items.map((i) => i.trim()).filter(Boolean))} />
      <ListEditor items={items} onChange={update} itemLabel={itemLabel} multiline={multiline} max={max} />
    </Field>
  );
}

export function ListEditor({
  items,
  onChange,
  itemLabel,
  multiline,
  max = 30,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  itemLabel: string;
  multiline?: boolean;
  max?: number;
}) {
  const move = (i: number, d: number) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          {multiline ? (
            <textarea
              aria-label={`${itemLabel} ${i + 1}`}
              className={inputCls}
              rows={3}
              value={item}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            />
          ) : (
            <input
              aria-label={`${itemLabel} ${i + 1}`}
              className={inputCls}
              value={item}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            />
          )}
          <div className="flex shrink-0">
            <IconBtn label="Subir" disabled={i === 0} onClick={() => move(i, -1)}>
              <ArrowUp size={16} />
            </IconBtn>
            <IconBtn label="Bajar" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
              <ArrowDown size={16} />
            </IconBtn>
            <IconBtn label="Quitar" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <Trash2 size={16} />
            </IconBtn>
          </div>
        </div>
      ))}
      {items.length < max && (
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#b45309] hover:text-[#1a1a1a]"
        >
          <Plus size={16} /> Agregar {itemLabel.toLowerCase()}
        </button>
      )}
    </div>
  );
}

export function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="p-2.5 rounded-lg text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#1a1a1a] disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

/** Selector de ícono de una lista cerrada. */
export function IconPicker({
  label,
  name,
  icons,
  defaultValue,
  allowEmpty = true,
}: {
  label: string;
  name: string;
  icons: readonly string[];
  defaultValue?: string | null;
  allowEmpty?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const markDirty = useMarkDirty();
  return (
    <Field label={label} name={name}>
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap gap-1.5">
        {allowEmpty && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              markDirty();
            }}
            className={`h-10 px-3 rounded-lg border text-xs ${value === "" ? "border-[#F5A623] bg-[#FFF3DC]" : "border-[#e5e7eb]"}`}
          >
            Ninguno
          </button>
        )}
        {icons.map((icon) => (
          <button
            key={icon}
            type="button"
            aria-label={`Ícono ${icon}`}
            aria-pressed={value === icon}
            onClick={() => {
              setValue(icon);
              markDirty();
            }}
            className={`h-10 w-10 rounded-lg border text-xl ${value === icon ? "border-[#F5A623] bg-[#FFF3DC]" : "border-[#e5e7eb] hover:bg-[#f9fafb]"}`}
          >
            {icon}
          </button>
        ))}
      </div>
    </Field>
  );
}

export function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#e5e7eb] bg-white p-4 sm:p-6 space-y-5">
      <div>
        <h2 className="text-base font-bold text-[#1a1a1a]">{title}</h2>
        {description && <p className="text-sm text-[#6b7280] mt-1">{description}</p>}
      </div>
      {children}
    </section>
  );
}
