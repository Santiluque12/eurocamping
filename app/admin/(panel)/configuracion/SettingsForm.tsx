"use client";

import { useId, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { AdminForm, SubmitButton, useFieldError, useMarkDirty } from "@/components/admin/form";
import { Field, IconBtn, inputCls, ListEditor } from "@/components/admin/fields";
import { ImageField, type PickedImage } from "@/components/admin/media";
import { EMOJI_ICONS, NEED_ICONS } from "@/lib/settings/icons";
import { emptyValue, SETTINGS_SPEC, type Field as SpecField, type Fields, type SettingsKey } from "@/lib/settings/spec";
import { saveSettings } from "./actions";

type Value = Record<string, unknown>;
type Images = Record<string, PickedImage>;

/**
 * Formulario de textos y configuración. Se arma con SETTINGS_SPEC: los campos
 * son fijos por sección (no es un constructor de páginas). El valor completo
 * viaja como JSON y el servidor lo valida con el mismo esquema.
 */
export function SettingsForm({ settingsKey, value, images }: { settingsKey: SettingsKey; value: Value; images: Images }) {
  const [state, setState] = useState<Value>(() => fill(SETTINGS_SPEC[settingsKey].fields, value));
  return (
    <AdminForm action={saveSettings.bind(null, settingsKey)} footer={<SubmitButton>Guardar cambios</SubmitButton>}>
      <input type="hidden" name="value" value={JSON.stringify(state)} />
      <FieldsEditor fields={SETTINGS_SPEC[settingsKey].fields} value={state} onChange={setState} path="" images={images} top />
    </AdminForm>
  );
}

/** Completa claves que falten (por ejemplo, campos agregados después de la importación). */
function fill(fields: Fields, value: unknown): Value {
  const base = emptyValue(fields);
  const v = value && typeof value === "object" ? (value as Value) : {};
  return Object.fromEntries(
    Object.entries(fields).map(([k, f]) => {
      if (f.kind === "group") return [k, fill(f.fields, v[k])];
      if (f.kind === "repeater") return [k, Array.isArray(v[k]) ? (v[k] as unknown[]).map((item) => fill(f.fields, item)) : []];
      return [k, v[k] ?? base[k]];
    })
  );
}

function FieldsEditor({
  fields,
  value,
  onChange,
  path,
  images,
  top,
}: {
  fields: Fields;
  value: Value;
  onChange: (v: Value) => void;
  path: string;
  images: Images;
  top?: boolean;
}) {
  const entries = Object.entries(fields);
  const set = (k: string, v: unknown) => onChange({ ...value, [k]: v });
  return (
    <>
      {entries.map(([k, f]) => {
        const p = path ? `${path}.${k}` : k;
        const node = <FieldEditor key={k} field={f} value={value[k]} onChange={(v) => set(k, v)} path={p} images={images} />;
        // En el primer nivel, cada grupo o repetidor es una tarjeta propia.
        if (top && (f.kind === "group" || f.kind === "repeater")) return node;
        if (top)
          return (
            <section key={k} className="rounded-2xl border border-[#e5e7eb] bg-white p-4 sm:p-6">
              {node}
            </section>
          );
        return node;
      })}
    </>
  );
}

function FieldEditor({
  field: f,
  value,
  onChange,
  path,
  images,
}: {
  field: SpecField;
  value: unknown;
  onChange: (v: unknown) => void;
  path: string;
  images: Images;
}) {
  const markDirty = useMarkDirty();
  const change = (v: unknown) => {
    onChange(v);
    markDirty();
  };

  switch (f.kind) {
    case "group":
      return (
        <section className="rounded-2xl border border-[#e5e7eb] bg-white p-4 sm:p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-[#1a1a1a]">{f.label}</h2>
            {f.help && <p className="text-sm text-[#6b7280] mt-1">{f.help}</p>}
          </div>
          <div className="grid gap-5 md:grid-cols-2 [&>*:has(textarea)]:md:col-span-2 [&>section]:md:col-span-2">
            <FieldsEditor fields={f.fields} value={(value as Value) ?? {}} onChange={change} path={path} images={images} />
          </div>
        </section>
      );
    case "repeater":
      return <RepeaterEditor field={f} value={(value as Value[]) ?? []} onChange={change} path={path} images={images} />;
    case "list":
      return (
        <div className="md:col-span-2">
          <Field label={f.label} name={path} help={f.help}>
            <ListEditor items={(value as string[]) ?? []} onChange={change} itemLabel={f.itemLabel ?? "Elemento"} multiline={(f.itemLabel ?? "").startsWith("Párrafo")} />
          </Field>
        </div>
      );
    case "image": {
      const id = typeof value === "string" ? value : null;
      return (
        <div className="md:col-span-2">
          <ImageField
            label={f.label}
            name={`__image.${path}`}
            help={f.help}
            defaultImage={id ? images[id] ?? null : null}
            onPicked={(img) => onChange(img?.id ?? null)}
          />
        </div>
      );
    }
    case "icon":
      return <IconEditor field={f} value={(value as string) ?? ""} onChange={change} path={path} />;
    default:
      return <TextEditor field={f} value={(value as string) ?? ""} onChange={change} path={path} />;
  }
}

function TextEditor({ field: f, value, onChange, path }: { field: SpecField; value: string; onChange: (v: string) => void; path: string }) {
  const id = useId();
  const error = useFieldError(path);
  const cls = `${inputCls} ${error ? "border-red-400" : ""}`;
  const max = "max" in f ? f.max : undefined;
  const placeholder = f.kind === "link" ? "/alquilar o https://…" : f.kind === "whatsapp" ? "5491162237233" : undefined;
  return (
    <Field label={f.label} name={path} help={f.help} required={f.required} htmlFor={id}>
      {f.kind === "textarea" ? (
        <textarea id={id} rows={3} className={cls} value={value} maxLength={max} aria-invalid={!!error} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          id={id}
          className={cls}
          value={value}
          maxLength={max}
          placeholder={placeholder}
          inputMode={f.kind === "whatsapp" ? "numeric" : f.kind === "email" ? "email" : undefined}
          aria-invalid={!!error}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}

function IconEditor({ field: f, value, onChange, path }: { field: Extract<SpecField, { kind: "icon" }>; value: string; onChange: (v: string) => void; path: string }) {
  if (f.set === "need") {
    return (
      <Field label={f.label} name={path} required={f.required}>
        <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} aria-label={f.label}>
          {!f.required && <option value="">Ninguno</option>}
          {Object.entries(NEED_ICONS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
      </Field>
    );
  }
  return (
    <Field label={f.label} name={path}>
      <div className="flex flex-wrap gap-1.5">
        {!f.required && (
          <button
            type="button"
            onClick={() => onChange("")}
            className={`h-10 px-3 rounded-lg border text-xs ${value === "" ? "border-[#F5A623] bg-[#FFF3DC]" : "border-[#e5e7eb]"}`}
          >
            Ninguno
          </button>
        )}
        {EMOJI_ICONS.map((icon) => (
          <button
            key={icon}
            type="button"
            aria-label={`Ícono ${icon}`}
            aria-pressed={value === icon}
            onClick={() => onChange(icon)}
            className={`h-10 w-10 rounded-lg border text-xl ${value === icon ? "border-[#F5A623] bg-[#FFF3DC]" : "border-[#e5e7eb] hover:bg-[#f9fafb]"}`}
          >
            {icon}
          </button>
        ))}
      </div>
    </Field>
  );
}

function RepeaterEditor({
  field: f,
  value,
  onChange,
  path,
  images,
}: {
  field: Extract<SpecField, { kind: "repeater" }>;
  value: Value[];
  onChange: (v: Value[]) => void;
  path: string;
  images: Images;
}) {
  const error = useFieldError(path);
  const max = f.max ?? 30;
  const move = (i: number, d: number) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <section className="rounded-2xl border border-[#e5e7eb] bg-white p-4 sm:p-6 space-y-4 md:col-span-2">
      <div>
        <h2 className="text-base font-bold text-[#1a1a1a]">{f.label}</h2>
        {f.help && <p className="text-sm text-[#6b7280] mt-1">{f.help}</p>}
        {error && <p className="text-sm text-red-700 mt-1" role="alert">{error}</p>}
      </div>
      {value.map((item, i) => (
        <div key={i} className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              {f.itemLabel} {i + 1}
            </p>
            <div className="flex">
              <IconBtn label="Subir" disabled={i === 0} onClick={() => move(i, -1)}>
                <ArrowUp size={16} />
              </IconBtn>
              <IconBtn label="Bajar" disabled={i === value.length - 1} onClick={() => move(i, 1)}>
                <ArrowDown size={16} />
              </IconBtn>
              <IconBtn label={`Quitar ${f.itemLabel.toLowerCase()}`} onClick={() => onChange(value.filter((_, j) => j !== i))}>
                <Trash2 size={16} />
              </IconBtn>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 [&>*:has(textarea)]:md:col-span-2">
            <FieldsEditor fields={f.fields} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} path={`${path}.${i}`} images={images} />
          </div>
        </div>
      ))}
      {value.length < max && (
        <button
          type="button"
          onClick={() => onChange([...value, emptyValue(f.fields)])}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#b45309] hover:text-[#1a1a1a]"
        >
          <Plus size={16} /> Agregar {f.itemLabel.toLowerCase()}
        </button>
      )}
    </section>
  );
}
