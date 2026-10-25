import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-[#f9fafb] py-24">
      <div className="max-w-xl mx-auto px-4 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-3">Error 404</p>
        <h1 className="text-4xl font-bold text-[#1a1a1a] tracking-tight mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>
          No encontramos esta página
        </h1>
        <p className="text-[#6b7280] mb-8">Puede que el contenido ya no esté disponible.</p>
        <Link href="/" className="bg-[#F5A623] text-[#1A1A1A] font-semibold px-6 py-3 rounded-full hover:bg-[#E08B00] transition-colors">
          Ir al inicio
        </Link>
      </div>
    </section>
  );
}
