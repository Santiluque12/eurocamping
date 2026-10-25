"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, ImagePlus, LoaderCircle, Search, Trash2, Upload, X } from "lucide-react";
import { browserDb } from "@/lib/supabase/browser";
import { MEDIA_BUCKET } from "@/lib/supabase/media";
import { ALLOWED_MIME, MAX_UPLOAD_BYTES, MIME_EXT } from "@/lib/admin/media-config";
import { listMedia, registerMedia, type MediaItem } from "@/lib/admin/media-actions";
import { Field, inputCls, IconBtn } from "./fields";
import { btn, useMarkDirty } from "./form";

export type PickedImage = { id: string; url: string; alt: string };

// ─── Subida ─────────────────────────────────────────────────────────────────
function readDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth || null, height: img.naturalHeight || null });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: null, height: null });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export function validateImageFile(file: File) {
  if (!ALLOWED_MIME.includes(file.type)) return "Formato no permitido. Usá JPG, PNG, WebP, AVIF o GIF.";
  if (file.size > MAX_UPLOAD_BYTES) return `La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo es 5 MB.`;
  return null;
}

/** Sube el archivo al bucket con un nombre único y devuelve la ruta. */
export async function uploadToStorage(file: File) {
  const problem = validateImageFile(file);
  if (problem) throw new Error(problem);
  const now = new Date();
  const path = `uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.${MIME_EXT[file.type]}`;
  const { error } = await browserDb().storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error("No se pudo subir la imagen. Revisá tu conexión y probá de nuevo.");
  return path;
}

export async function uploadImage(file: File, alt = ""): Promise<MediaItem> {
  const path = await uploadToStorage(file);
  const dims = await readDimensions(file);
  const res = await registerMedia({ path, alt, originalName: file.name.slice(0, 200), ...dims });
  if (!res.ok || !res.item) throw new Error(res.message || "No se pudo registrar la imagen.");
  return res.item;
}

// ─── Biblioteca ─────────────────────────────────────────────────────────────
export function MediaLibrary({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async (p: number, query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listMedia({ q: query, page: p });
      setItems(res.items);
      setHasMore(res.hasMore);
      setPage(p);
    } catch {
      setError("No se pudo cargar la biblioteca.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) load(1, "");
  }, [open, load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // Portal: el modal no queda anidado dentro del <form> que lo abre.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center bg-black/40 sm:p-6"
      onClick={onClose}
      onInput={(e) => e.stopPropagation()}
      onChange={(e) => e.stopPropagation()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Biblioteca de imágenes"
        className="flex w-full max-w-4xl flex-col bg-white sm:rounded-2xl shadow-xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#e5e7eb] p-4">
          <h2 className="text-lg font-bold flex-1">Elegir imagen</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="p-2 rounded-lg hover:bg-[#f3f4f6]">
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 p-4 border-b border-[#e5e7eb]">
          <div className="flex-1 flex gap-2">
            <input
              className={inputCls}
              placeholder="Buscar por descripción o nombre de archivo"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  load(1, q);
                }
              }}
            />
            <button type="button" className={btn.secondary} aria-label="Buscar" onClick={() => load(1, q)}>
              <Search size={16} />
            </button>
          </div>
          <button type="button" className={btn.primary} disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />}
            Subir nueva
          </button>
          <input
            ref={fileRef}
            type="file"
            accept={ALLOWED_MIME.join(",")}
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setUploading(true);
              setError(null);
              try {
                const item = await uploadImage(file);
                onSelect(item);
              } catch (err) {
                setError((err as Error).message);
              } finally {
                setUploading(false);
              }
            }}
          />
        </div>
        {error && <p className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-16 text-[#6b7280]">
              <LoaderCircle className="animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <p className="py-16 text-center text-sm text-[#6b7280]">No hay imágenes. Subí la primera.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelect(m)}
                  className="group text-left rounded-xl border border-[#e5e7eb] overflow-hidden hover:border-[#F5A623] focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={m.alt} className="aspect-[4/3] w-full object-cover bg-[#f3f4f6]" loading="lazy" />
                  <span className="block truncate px-2 py-1.5 text-xs text-[#4b5563]">{m.alt || "Sin descripción"}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-[#e5e7eb] p-3">
          <button type="button" className={btn.link} disabled={page === 1 || loading} onClick={() => load(page - 1, q)}>
            <ArrowLeft size={16} /> Anterior
          </button>
          <span className="text-xs text-[#6b7280]">Página {page}</span>
          <button type="button" className={btn.link} disabled={!hasMore || loading} onClick={() => load(page + 1, q)}>
            Siguiente <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Imagen única ───────────────────────────────────────────────────────────
export function ImageField({
  label,
  name,
  altName,
  defaultImage,
  defaultAlt,
  help,
  onPicked,
}: {
  label: string;
  name: string;
  altName?: string;
  defaultImage?: PickedImage | null;
  defaultAlt?: string | null;
  help?: string;
  onPicked?: (img: PickedImage | null) => void;
}) {
  const [image, setImage] = useState<PickedImage | null>(defaultImage ?? null);
  const [alt, setAlt] = useState(defaultAlt ?? "");
  const [open, setOpen] = useState(false);
  const markDirty = useMarkDirty();

  const pick = (img: PickedImage | null) => {
    setImage(img);
    if (img && !alt) setAlt(img.alt);
    setOpen(false);
    markDirty();
    onPicked?.(img);
  };

  return (
    <Field label={label} name={name} help={help}>
      <input type="hidden" name={name} value={image?.id ?? ""} />
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-full sm:w-56 aspect-[4/3] rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] overflow-hidden flex items-center justify-center shrink-0">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.url} alt={alt || image.alt} className="h-full w-full object-cover" />
          ) : (
            <button type="button" onClick={() => setOpen(true)} className="flex flex-col items-center gap-2 text-sm text-[#6b7280] p-6">
              <ImagePlus size={28} />
              Agregar imagen
            </button>
          )}
        </div>
        <div className="flex-1 w-full space-y-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btn.secondary} onClick={() => setOpen(true)}>
              <ImagePlus size={16} /> {image ? "Cambiar imagen" : "Elegir o subir"}
            </button>
            {image && (
              <button type="button" className={btn.dangerOutline} onClick={() => pick(null)}>
                <Trash2 size={16} /> Quitar
              </button>
            )}
          </div>
          {altName && image && (
            <label className="block">
              <span className="block text-xs font-semibold text-[#374151] mb-1">Texto alternativo (describe la imagen)</span>
              <input
                name={altName}
                className={inputCls}
                value={alt}
                maxLength={200}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Ej: Carpa naranja armada en la montaña"
              />
            </label>
          )}
        </div>
      </div>
      <MediaLibrary open={open} onClose={() => setOpen(false)} onSelect={(m) => pick({ id: m.id, url: m.url, alt: m.alt })} />
    </Field>
  );
}

// ─── Galería ────────────────────────────────────────────────────────────────
export function GalleryField({
  name,
  defaultItems,
}: {
  name: string;
  defaultItems: (PickedImage & { itemAlt?: string | null })[];
}) {
  const [items, setItems] = useState(defaultItems.map((i) => ({ ...i, itemAlt: i.itemAlt ?? i.alt })));
  const [open, setOpen] = useState(false);
  const markDirty = useMarkDirty();
  const update = (next: typeof items) => {
    setItems(next);
    markDirty();
  };
  const move = (i: number, d: number) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    update(next);
  };

  return (
    <Field label="Galería" name={name} help="Imágenes adicionales. Usá las flechas para cambiar el orden.">
      <input type="hidden" name={name} value={JSON.stringify(items.map((i) => ({ media_id: i.id, alt: i.itemAlt })))} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-xl border border-[#e5e7eb] overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.itemAlt} className="aspect-[4/3] w-full object-cover bg-[#f3f4f6]" />
            <div className="p-2 space-y-2">
              <input
                aria-label={`Texto alternativo de la imagen ${i + 1}`}
                className={inputCls}
                placeholder="Texto alternativo"
                value={item.itemAlt}
                maxLength={200}
                onChange={(e) => update(items.map((x, j) => (j === i ? { ...x, itemAlt: e.target.value } : x)))}
              />
              <div className="flex justify-between">
                <div className="flex">
                  <IconBtn label="Mover antes" disabled={i === 0} onClick={() => move(i, -1)}>
                    <ArrowLeft size={16} />
                  </IconBtn>
                  <IconBtn label="Mover después" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                    <ArrowRight size={16} />
                  </IconBtn>
                </div>
                <IconBtn label="Quitar de la galería" onClick={() => update(items.filter((_, j) => j !== i))}>
                  <Trash2 size={16} />
                </IconBtn>
              </div>
            </div>
          </div>
        ))}
        {items.length < 20 && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="aspect-[4/3] rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] flex flex-col items-center justify-center gap-2 text-sm text-[#6b7280] hover:border-[#F5A623]"
          >
            <ImagePlus size={28} />
            Agregar a la galería
          </button>
        )}
      </div>
      <MediaLibrary
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(m) => {
          setOpen(false);
          if (items.some((x) => x.id === m.id)) return;
          update([...items, { id: m.id, url: m.url, alt: m.alt, itemAlt: m.alt }]);
        }}
      />
    </Field>
  );
}
