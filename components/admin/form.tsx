"use client";

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, LoaderCircle, X } from "lucide-react";
import type { ActionState } from "@/lib/admin/action";

const initialState: ActionState = { ok: false, message: "" };

// ─── Contextos ──────────────────────────────────────────────────────────────
const ErrorsCtx = createContext<Record<string, string> | undefined>(undefined);
const DirtyCtx = createContext<() => void>(() => {});
const PendingCtx = createContext(false);

export function useFieldError(name: string) {
  return useContext(ErrorsCtx)?.[name];
}
/** Para componentes que cambian valores por código (imágenes, editores). */
export function useMarkDirty() {
  return useContext(DirtyCtx);
}
export function useFormPending() {
  return useContext(PendingCtx);
}

// ─── Mensaje ────────────────────────────────────────────────────────────────
export function Banner({ ok, children, onClose }: { ok: boolean; children: React.ReactNode; onClose?: () => void }) {
  return (
    <div
      role={ok ? "status" : "alert"}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        ok ? "border-green-200 bg-green-50 text-green-900" : "border-red-200 bg-red-50 text-red-900"
      }`}
    >
      {ok ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
      <div className="flex-1">{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Cerrar" className="opacity-60 hover:opacity-100">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

// ─── Confirmación ───────────────────────────────────────────────────────────
export function ConfirmModal({
  open,
  title,
  children,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children?: React.ReactNode;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-lg font-bold text-[#1a1a1a]">
          {title}
        </h2>
        {children && <div className="mt-2 text-sm text-[#4b5563]">{children}</div>}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button type="button" onClick={onCancel} className={btn.secondary}>
            Cancelar
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={danger ? btn.danger : btn.primary}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Aviso de cambios sin guardar ───────────────────────────────────────────
function useUnsavedGuard(dirty: boolean) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
      e.preventDefault();
      e.stopPropagation();
      setPendingHref(url.pathname + url.search + url.hash);
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);

  return (
    <ConfirmModal
      open={pendingHref !== null}
      title="Tenés cambios sin guardar"
      confirmLabel="Salir sin guardar"
      danger
      onCancel={() => setPendingHref(null)}
      onConfirm={() => {
        const href = pendingHref!;
        setPendingHref(null);
        router.push(href);
      }}
    >
      Si salís ahora, se pierden los cambios que hiciste en este formulario.
    </ConfirmModal>
  );
}

// ─── Formulario ─────────────────────────────────────────────────────────────
type Action = (prev: ActionState, fd: FormData) => Promise<ActionState>;

/**
 * Formulario de administración.
 *  - Envía con useActionState sin resetear los campos (si hay errores, no se
 *    pierde lo escrito).
 *  - Muestra el mensaje del servidor y los errores por campo.
 *  - Avisa antes de salir con cambios sin guardar.
 *  - Al crear, redirige al editor del registro nuevo.
 */
export function AdminForm({
  action,
  children,
  footer,
  editBasePath,
  className = "space-y-6",
}: {
  action: Action;
  children: React.ReactNode;
  footer: React.ReactNode;
  editBasePath?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [dirty, setDirty] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const router = useRouter();
  const markDirty = useCallback(() => setDirty(true), []);
  const guard = useUnsavedGuard(dirty && !pending);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.message) return;
    setShowMessage(true);
    if (!state.ok) topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (state.ok) {
      setDirty(false);
      if (state.id && editBasePath) router.replace(`${editBasePath}/${state.id}?creado=1`);
      else router.refresh();
    }
  }, [state, editBasePath, router]);

  return (
    <ErrorsCtx.Provider value={state.ok ? undefined : state.fieldErrors}>
      <DirtyCtx.Provider value={markDirty}>
        <PendingCtx.Provider value={pending}>
          <form
            noValidate
            className={className}
            onInput={markDirty}
            onChange={markDirty}
            onSubmit={(e) => {
              e.preventDefault();
              const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
              const fd = new FormData(e.currentTarget, submitter);
              startTransition(() => formAction(fd));
            }}
          >
            <div ref={topRef} className="scroll-mt-24" />
            {state.message && showMessage && (
              <Banner ok={state.ok} onClose={() => setShowMessage(false)}>
                {state.message}
                {!state.ok && state.fieldErrors && Object.keys(state.fieldErrors).length > 0 && (
                  <span className="block mt-1">Revisá los campos marcados en rojo.</span>
                )}
              </Banner>
            )}
            {children}
            <div className="sticky bottom-0 z-20 -mx-4 sm:mx-0 border-t border-[#e5e7eb] bg-white/95 backdrop-blur px-4 py-3 sm:rounded-xl sm:border flex flex-wrap items-center gap-2 justify-end">
              {dirty && !pending && <span className="mr-auto text-xs text-[#b45309]">Cambios sin guardar</span>}
              {pending && (
                <span className="mr-auto flex items-center gap-2 text-xs text-[#6b7280]">
                  <LoaderCircle size={14} className="animate-spin" /> Guardando…
                </span>
              )}
              {footer}
            </div>
          </form>
          {guard}
        </PendingCtx.Provider>
      </DirtyCtx.Provider>
    </ErrorsCtx.Provider>
  );
}

export function SubmitButton({
  children,
  intent,
  variant = "primary",
}: {
  children: React.ReactNode;
  intent?: string;
  variant?: "primary" | "secondary";
}) {
  const pending = useFormPending();
  return (
    <button
      type="submit"
      name={intent ? "intent" : undefined}
      value={intent}
      disabled={pending}
      className={variant === "primary" ? btn.primary : btn.secondary}
    >
      {children}
    </button>
  );
}

// ─── Acción con confirmación (archivar, borrar, restaurar) ─────────────────
export function ConfirmAction({
  action,
  label,
  title,
  description,
  confirmLabel,
  danger,
  icon,
  variant = "secondary",
  redirectTo,
}: {
  action: () => Promise<ActionState>;
  label: string;
  title: string;
  description?: React.ReactNode;
  confirmLabel: string;
  danger?: boolean;
  icon?: React.ReactNode;
  variant?: "secondary" | "danger" | "link";
  /** A dónde ir si la acción sale bien (p. ej. al listado después de eliminar). */
  redirectTo?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionState | null>(null);
  const router = useRouter();
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={pending}
        className={variant === "danger" ? btn.dangerOutline : variant === "link" ? btn.link : btn.secondary}
      >
        {pending ? <LoaderCircle size={16} className="animate-spin" /> : icon}
        {label}
      </button>
      {result && !result.ok && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:w-96 z-[90]">
          <Banner ok={false} onClose={() => setResult(null)}>
            {result.message}
          </Banner>
        </div>
      )}
      <ConfirmModal
        open={open}
        title={title}
        confirmLabel={confirmLabel}
        danger={danger}
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          setOpen(false);
          setPending(true);
          const r = await action();
          setPending(false);
          setResult(r);
          if (r.ok && redirectTo) router.replace(redirectTo);
          else if (r.ok) router.refresh();
        }}
      >
        {description}
      </ConfirmModal>
    </>
  );
}

// ─── Estilos de botones ─────────────────────────────────────────────────────
export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5A623] px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] hover:bg-[#E08B00] disabled:opacity-60 transition-colors",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[#d1d5db] bg-white px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] hover:bg-[#f9fafb] disabled:opacity-60 transition-colors",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors",
  dangerOutline:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60 transition-colors",
  link: "inline-flex items-center gap-1.5 text-sm font-semibold text-[#6b7280] hover:text-[#1a1a1a] disabled:opacity-60",
};
