"use client";

import { useActionState, startTransition } from "react";
import { LoaderCircle } from "lucide-react";
import type { ActionState } from "@/lib/admin/action";
import { Banner, btn } from "./form";

const initial: ActionState = { ok: false, message: "" };

export function AuthForm({
  action,
  fields,
  submitLabel,
  hidden,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  fields: { name: string; label: string; type: string; autoComplete: string; help?: string }[];
  submitLabel: string;
  hidden?: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const done = state.ok;
  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
    >
      {state.message && <Banner ok={state.ok}>{state.message}</Banner>}
      {hidden && Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      {!done &&
        fields.map((f) => {
          const error = state.fieldErrors?.[f.name];
          return (
            <label key={f.name} className="block space-y-1.5">
              <span className="block text-sm font-semibold text-[#1a1a1a]">{f.label}</span>
              <input
                name={f.name}
                type={f.type}
                autoComplete={f.autoComplete}
                required
                aria-invalid={!!error}
                className={`w-full rounded-xl border px-3.5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623] ${error ? "border-red-400" : "border-[#d1d5db]"}`}
              />
              {error ? (
                <span className="block text-sm text-red-700">{error}</span>
              ) : (
                f.help && <span className="block text-xs text-[#6b7280]">{f.help}</span>
              )}
            </label>
          );
        })}
      {!done && (
        <button type="submit" disabled={pending} className={`${btn.primary} w-full py-3 text-base`}>
          {pending && <LoaderCircle size={18} className="animate-spin" />}
          {submitLabel}
        </button>
      )}
    </form>
  );
}

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f3f4f6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-eco-black.png" alt="Eurocamping" className="h-10 w-auto" />
        </div>
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-[#e5e7eb]">
          <h1 className="text-xl font-bold text-[#1a1a1a]">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-[#6b7280]">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
