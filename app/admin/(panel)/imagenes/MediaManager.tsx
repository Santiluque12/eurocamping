"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, RefreshCw, Trash2, Upload } from "lucide-react";
import { Banner, btn, ConfirmModal } from "@/components/admin/form";
import { inputCls } from "@/components/admin/fields";
import { uploadImage, uploadToStorage } from "@/components/admin/media";
import { deleteMedia, mediaUsage, replaceMediaFile, updateMediaAlt } from "@/lib/admin/media-actions";
import { ALLOWED_MIME } from "@/lib/admin/media-config";

export type MediaCard = { id: string; url: string; alt: string; name: string | null; size: number | null; external: boolean; inUse: boolean };

type Msg = { ok: boolean; text: string } | null;

export function UploadButton() {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const router = useRouter();
  return (
    <div className="space-y-2">
      <button type="button" className={btn.primary} disabled={busy} onClick={() => ref.current?.click()}>
        {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />} Subir imágenes
      </button>
      <input
        ref={ref}
        type="file"
        multiple
        accept={ALLOWED_MIME.join(",")}
        className="hidden"
        onChange={async (e) => {
          const files = [...(e.target.files ?? [])];
          e.target.value = "";
          if (!files.length) return;
          setBusy(true);
          setMsg(null);
          const errors: string[] = [];
          for (const f of files) {
            try {
              await uploadImage(f);
            } catch (err) {
              errors.push(`${f.name}: ${(err as Error).message}`);
            }
          }
          setBusy(false);
          const ok = files.length - errors.length;
          setMsg(errors.length ? { ok: false, text: `${ok} subida(s). Con problemas: ${errors.join(" · ")}` } : { ok: true, text: `${ok} imagen(es) subida(s).` });
          router.refresh();
        }}
      />
      {msg && <Banner ok={msg.ok} onClose={() => setMsg(null)}>{msg.text}</Banner>}
    </div>
  );
}

export function MediaCardItem({ item }: { item: MediaCard }) {
  const router = useRouter();
  const [alt, setAlt] = useState(item.alt);
  const [busy, setBusy] = useState<"alt" | "replace" | "delete" | null>(null);
  const [msg, setMsg] = useState<Msg>(null);
  const [confirm, setConfirm] = useState<{ uses: { label: string; href: string }[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const run = async (kind: NonNullable<typeof busy>, fn: () => Promise<{ ok: boolean; message: string }>) => {
    setBusy(kind);
    setMsg(null);
    try {
      const r = await fn();
      setMsg({ ok: r.ok, text: r.message });
      if (r.ok) router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message || "Ocurrió un error." });
    } finally {
      setBusy(null);
    }
  };

  return (
    <li className="rounded-2xl border border-[#e5e7eb] bg-white overflow-hidden flex flex-col">
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block bg-[#f3f4f6]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.url} alt={alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
      </a>
      <div className="p-3 space-y-2 flex-1 flex flex-col">
        <p className="truncate text-xs text-[#6b7280]" title={item.name ?? undefined}>
          {item.name ?? (item.external ? "Imagen importada" : "Sin nombre")}
          {item.size ? ` · ${Math.round(item.size / 1024)} KB` : ""}
          {item.inUse ? " · En uso" : ""}
        </p>
        <div className="flex gap-1.5">
          <input
            aria-label="Texto alternativo"
            className={`${inputCls} !py-2 text-sm`}
            placeholder="Texto alternativo"
            value={alt}
            maxLength={200}
            onChange={(e) => setAlt(e.target.value)}
          />
          <button
            type="button"
            className={`${btn.secondary} !px-3 !py-2`}
            disabled={busy !== null || alt === item.alt}
            onClick={() => run("alt", () => updateMediaAlt(item.id, alt))}
          >
            {busy === "alt" ? <LoaderCircle size={14} className="animate-spin" /> : "Guardar"}
          </button>
        </div>
        <div className="mt-auto flex justify-between pt-1">
          <button type="button" className={btn.link} disabled={busy !== null} onClick={() => fileRef.current?.click()}>
            {busy === "replace" ? <LoaderCircle size={14} className="animate-spin" /> : <RefreshCw size={14} />} Reemplazar
          </button>
          <button
            type="button"
            className={`${btn.link} !text-red-700`}
            disabled={busy !== null}
            onClick={async () => {
              setBusy("delete");
              try {
                setConfirm({ uses: await mediaUsage(item.id) });
              } finally {
                setBusy(null);
              }
            }}
          >
            {busy === "delete" ? <LoaderCircle size={14} className="animate-spin" /> : <Trash2 size={14} />} Eliminar
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={ALLOWED_MIME.join(",")}
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            await run("replace", async () => replaceMediaFile(item.id, await uploadToStorage(file)));
          }}
        />
        {msg && <Banner ok={msg.ok} onClose={() => setMsg(null)}>{msg.text}</Banner>}
      </div>
      <ConfirmModal
        open={confirm !== null}
        title={confirm?.uses.length ? "Esta imagen está en uso" : "¿Eliminar esta imagen?"}
        confirmLabel={confirm?.uses.length ? "Entendido" : "Eliminar"}
        danger={!confirm?.uses.length}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          const uses = confirm?.uses ?? [];
          setConfirm(null);
          if (!uses.length) run("delete", () => deleteMedia(item.id));
        }}
      >
        {confirm?.uses.length ? (
          <>
            <p>No se puede eliminar mientras la usen estos contenidos. Cambiá la imagen en cada uno y volvé a intentar:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {confirm.uses.map((u, i) => (
                <li key={i}>
                  <a href={u.href} className="text-[#b45309] hover:underline">{u.label}</a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          "Se borra el archivo definitivamente."
        )}
      </ConfirmModal>
    </li>
  );
}
