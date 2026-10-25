"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-[#1A1A1A] py-24">
      <div className="max-w-xl mx-auto px-4 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-3">Algo salió mal</p>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>
          No pudimos cargar esta sección
        </h1>
        <p className="text-white/70 mb-8">
          Estamos teniendo un problema para mostrar el contenido. Probá de nuevo en unos minutos.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={reset}
            className="bg-[#F5A623] text-[#1A1A1A] font-semibold px-6 py-3 rounded-full hover:bg-[#E08B00] transition-colors"
          >
            Reintentar
          </button>
          <Link href="/" className="border border-white/30 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
            Ir al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
