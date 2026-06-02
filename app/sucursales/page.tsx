import type { Metadata } from "next";
import { MessageCircle, MapPin, Phone, Clock, Info } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { sucursales } from "@/lib/data";
import type { Sucursal } from "@/types";

export const metadata: Metadata = {
  title: "Sucursales | Eurocamping",
  description:
    "Encontrá nuestras sucursales en todo el país: Buenos Aires, Córdoba, Mendoza, Neuquén, Río Negro, Salta y Tierra del Fuego.",
};

const regionOrder = [
  "Buenos Aires",
  "Córdoba",
  "Mendoza",
  "Neuquén",
  "Río Negro",
  "Salta",
  "Tierra del Fuego",
];

function SucursalCard({ suc }: { suc: Sucursal }) {
  const waLink = suc.whatsapp
    ? `https://wa.me/${suc.whatsapp}`
    : null;

  return (
    <div className="bg-[#1e1e1e] rounded-2xl border border-[#2a2a2a] p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="font-bold text-lg text-white tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {suc.name}
          </p>
          <p className="text-sm text-[#F5A623] font-medium mt-0.5">{suc.city}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {suc.rental && (
            <span className="text-[10px] font-bold tracking-widest uppercase bg-[#F5A623]/10 text-[#F5A623] px-2 py-1 rounded-full border border-[#F5A623]/20">
              Rental
            </span>
          )}
          {suc.seasonal && (
            <span className="text-[10px] font-bold tracking-widest uppercase bg-white/5 text-white/40 px-2 py-1 rounded-full border border-white/10">
              {suc.seasonal}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2.5">
        {suc.address && (
          <div className="flex items-start gap-2.5 text-sm text-white/60">
            <MapPin size={14} className="mt-0.5 shrink-0 text-[#F5A623]" />
            {suc.address}
          </div>
        )}
        {suc.phone && (
          <div className="flex items-center gap-2.5 text-sm text-white/60">
            <Phone size={14} className="shrink-0 text-[#F5A623]" />
            <a href={`tel:${suc.phone}`} className="hover:text-white transition-colors">
              {suc.phone}
            </a>
          </div>
        )}
        {suc.hours && (
          <div className="flex items-start gap-2.5 text-sm text-white/60">
            <Clock size={14} className="mt-0.5 shrink-0 text-[#F5A623]" />
            {suc.hours}
          </div>
        )}
        {suc.note && (
          <div className="flex items-start gap-2.5 text-sm text-white/50 bg-white/5 rounded-xl px-3 py-2.5">
            <Info size={13} className="mt-0.5 shrink-0 text-[#F5A623]" />
            {suc.note}
          </div>
        )}
      </div>

      {/* Actions */}
      {(suc.maps || waLink) && (
        <div className="flex gap-2 mt-auto pt-2 border-t border-[#2a2a2a]">
          {suc.maps && (
            <a
              href={suc.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2.5 rounded-xl transition-colors"
            >
              <MapPin size={13} />
              Ver en mapa
            </a>
          )}
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#F5A623] hover:text-[#E08B00] bg-[#F5A623]/10 hover:bg-[#F5A623]/20 px-3 py-2.5 rounded-xl transition-colors"
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function SucursalesPage() {
  const byRegion = sucursales.reduce<Record<string, Sucursal[]>>((acc, s) => {
    const key = s.region ?? s.city;
    (acc[key] ??= []).push(s);
    return acc;
  }, {});

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1A1A1A] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-3">
            Dónde encontrarnos
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Sucursales en
            <br />
            <em className="not-italic font-light text-[#F5A623]">todo el país</em>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-xl leading-relaxed">
            Estamos en Buenos Aires, Córdoba, Mendoza, Neuquén, Río Negro, Salta y
            Tierra del Fuego. Siempre cerca de tu próxima aventura.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-[#F5A623]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-6 items-center">
          {[
            { num: "12", label: "puntos de atención" },
            { num: "7", label: "provincias" },
            { num: "60+", label: "años en el mercado" },
          ].map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span
                className="text-2xl font-bold text-[#1A1A1A] tracking-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {s.num}
              </span>
              <span className="text-sm font-medium text-[#1A1A1A]/70">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sucursales por región */}
      <section className="py-16 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {regionOrder.map((region) => {
            const lista = byRegion[region];
            if (!lista) return null;
            return (
              <div key={region}>
                <div className="flex items-center gap-4 mb-6">
                  <h2
                    className="text-2xl font-bold text-white tracking-tight"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {region}
                  </h2>
                  <div className="flex-1 h-px bg-[#2a2a2a]" />
                  <span className="text-xs text-white/30 font-medium">
                    {lista.length} {lista.length === 1 ? "sucursal" : "sucursales"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lista.map((suc) => (
                    <SucursalCard key={suc.name} suc={suc} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#1A1A1A] border-t border-[#2a2a2a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-3xl font-bold text-white tracking-tight mb-3"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            ¿No encontrás la info que buscás?
          </p>
          <p className="text-white/60 mb-6 leading-relaxed">
            Escribinos por WhatsApp y te decimos dónde y cómo atenderte.
          </p>
          <a
            href="https://wa.me/5491162237233"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#F5A623] text-[#1A1A1A] font-bold px-8 py-4 rounded-full hover:bg-[#E08B00] transition-colors"
          >
            <MessageCircle size={18} />
            Consultar por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
