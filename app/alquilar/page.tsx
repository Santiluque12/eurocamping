import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle, Check, Info, MapPin } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { WA_LINKS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Alquiler de Equipos Outdoor | ECOrental",
  description:
    "Alquilá kayaks, carpas, skis, snowboards, mochilas e indumentaria con el servicio Fastrack de Eurocamping. El precio más bajo garantizado.",
};

// headers for each category
const HDR_STD = ["Día", "Fin de semana", "4 días", "Semana", "Quincena"];
const HDR_SKI = ["Día", "3 días", "4 días", "Semana"];

type PrecioItem = {
  name: string;
  precios: (string | null)[];
};

type SubCat = {
  name: string;
  items: PrecioItem[];
};

// ─── Indumentaria & Accesorios (HDR_STD — 5 cols) ────────────────────────────
const indumentariaItems: PrecioItem[] = [
  { name: "Equipo 5 piezas (campera, pantalón, botas après-ski, guantes, antiparras)", precios: ["$50.000", "$150.000", "$200.000", "$240.000", "$350.000"] },
  { name: "Equipo 4 piezas", precios: ["$40.000", "$120.000", "$160.000", "$200.000", "$300.000"] },
  { name: "Botas Après-ski", precios: ["$15.000", "$30.000", "$40.000", "$60.000", "$80.000"] },
  { name: "Campera de ski", precios: ["$15.000", "$30.000", "$40.000", "$60.000", "$80.000"] },
  { name: "Pantalón de ski", precios: ["$15.000", "$30.000", "$40.000", "$60.000", "$80.000"] },
  { name: "Conjunto entero (mameluco)", precios: ["$15.000", "$30.000", "$40.000", "$60.000", "$80.000"] },
  { name: "Guantes", precios: ["$8.000", "$20.000", "$30.000", "$40.000", "$40.000"] },
  { name: "Antiparras", precios: ["$8.000", "$20.000", "$30.000", "$40.000", "$40.000"] },
  { name: "Crampones de hielo (Ice Grip)", precios: ["$1.000", "$3.000", "$4.000", "$5.000", "$7.000"] },
  { name: "Trineo", precios: ["$1.000", "$3.000", "$4.000", "$5.000", "$7.000"] },
  { name: "Pala de nieve", precios: ["$5.000", "$15.000", "$25.000", "$40.000", "$50.000"] },
  { name: "Kit rescate de avalancha", precios: ["$30.000", "$60.000", "$80.000", "$150.000", "$200.000"] },
  { name: "Raquetas de nieve", precios: ["$10.000", "$30.000", "$40.000", "$60.000", "$80.000"] },
  { name: "Polainas", precios: ["$5.000", "$15.000", "$25.000", "$40.000", "$45.000"] },
  { name: "Botas de trekking", precios: ["$10.000", "$30.000", "$40.000", "$60.000", "$80.000"] },
  { name: "Pantalón de trekking", precios: ["$10.000", "$30.000", "$40.000", "$60.000", "$80.000"] },
  { name: "Cubre pantalón", precios: ["$10.000", "$30.000", "$40.000", "$60.000", "$80.000"] },
  { name: "Sombrero / Gorro", precios: ["$2.000", "$6.000", "$10.000", "$15.000", "$15.000"] },
];

// ─── Ski & Snowboard (HDR_SKI — 4 cols) ──────────────────────────────────────
const skiItems: PrecioItem[] = [
  { name: "Equipo completo", precios: ["$10.000", "$30.000", "$40.000", "$50.000"] },
  { name: "Esquís + fijaciones", precios: ["$5.000", "$15.000", "$20.000", "$30.000"] },
  { name: "Snowboard + fijaciones", precios: ["$5.000", "$15.000", "$20.000", "$30.000"] },
  { name: "Botas (ski o snowboard)", precios: ["$5.000", "$15.000", "$20.000", "$30.000"] },
  { name: "Casco", precios: ["$5.000", "$15.000", "$20.000", "$30.000"] },
];

const resorts = [
  "Cerro Catedral",
  "Cerro Chapelco",
  "Las Leñas",
  "Cerro Bayo",
  "Caviahue",
  "La Hoya",
  "Las Pendientes (Castor)",
];

// ─── Camping (HDR_STD — 5 cols) ──────────────────────────────────────────────
const campingSubcats: SubCat[] = [
  {
    name: "Carpas",
    items: [
      { name: "Carpa 1-4 PAX", precios: ["$30.000", "$45.000", "$60.000", "$90.000", "$120.000"] },
      { name: "Carpa 5-6 PAX", precios: ["$40.000", "$60.000", "$90.000", "$120.000", "$150.000"] },
      { name: "Carpa comedor / toldo", precios: ["$40.000", "$60.000", "$90.000", "$120.000", "$150.000"] },
    ],
  },
  {
    name: "Abrigo & Descanso",
    items: [
      { name: "Bolsa de dormir 2 estaciones", precios: ["$5.000", "$10.000", "$10.000", "$10.000", "$10.000"] },
      { name: "Bolsa de dormir 3 estaciones", precios: ["$15.000", "$20.000", "$30.000", "$40.000", "$50.000"] },
      { name: "Bolsa de dormir alta montaña", precios: ["$30.000", "$40.000", "$60.000", "$80.000", "$100.000"] },
      { name: "Liner / sábana interior", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$20.000"] },
      { name: "Aislante (foam)", precios: ["$5.000", "$5.000", "$5.000", "$5.000", "$5.000"] },
      { name: "Aislante alta montaña", precios: ["$10.000", "$15.000", "$15.000", "$20.000", "$20.000"] },
      { name: "Colchoneta autoinflable", precios: ["$15.000", "$20.000", "$25.000", "$30.000", "$40.000"] },
      { name: "Colchón inflable simple", precios: ["$10.000", "$10.000", "$15.000", "$15.000", "$20.000"] },
      { name: "Colchón inflable doble", precios: ["$15.000", "$15.000", "$20.000", "$20.000", "$30.000"] },
    ],
  },
  {
    name: "Mochilas & Transporte",
    items: [
      { name: "Mochila 10-85L", precios: ["$15.000", "$20.000", "$30.000", "$40.000", "$50.000"] },
      { name: "Mochila porta bebé", precios: ["$15.000", "$20.000", "$30.000", "$40.000", "$50.000"] },
      { name: "Mochila de hidratación", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$30.000"] },
      { name: "Bastones de trekking (par)", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$20.000"] },
    ],
  },
  {
    name: "Accesorios & Equipamiento",
    items: [
      { name: "Silla 3 en 1", precios: ["$10.000", "$15.000", "$15.000", "$20.000", "$30.000"] },
      { name: "Mesa 4 PAX", precios: ["$15.000", "$20.000", "$30.000", "$40.000", "$50.000"] },
      { name: "Marmita / set de cocina", precios: ["$10.000", "$15.000", "$20.000", "$25.000", "$30.000"] },
      { name: "Calentador a gas", precios: ["$10.000", "$15.000", "$20.000", "$25.000", "$30.000"] },
      { name: "Linterna frontal", precios: ["$10.000", "$15.000", "$20.000", "$25.000", "$30.000"] },
      { name: "Conservadora 36-48QT", precios: ["$10.000", "$15.000", "$20.000", "$25.000", "$30.000"] },
      { name: "Termo 7.6L", precios: ["$10.000", "$15.000", "$20.000", "$25.000", "$30.000"] },
      { name: "Parrilla enrollable", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$20.000"] },
      { name: "Binoculares", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$30.000"] },
      { name: "Telescopio", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$30.000"] },
      { name: "Tanque de agua", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$30.000"] },
      { name: "Inflador 5000cc", precios: ["$5.000", "$10.000", "$10.000", "$15.000", "$15.000"] },
      { name: "Inflador eléctrico", precios: ["$10.000", "$15.000", "$20.000", "$25.000", "$30.000"] },
    ],
  },
];

// ─── Náutica (HDR_STD — 5 cols) ──────────────────────────────────────────────
const nauticaItems: PrecioItem[] = [
  { name: "Kayak simple + remo", precios: ["$8.000", "$12.000", "$20.000", "$30.000", "$40.000"] },
  { name: "Kayak doble + 2 remos", precios: ["$12.000", "$20.000", "$30.000", "$50.000", "$60.000"] },
  { name: "Kayak inflable simple + remo", precios: ["$20.000", "$30.000", "$60.000", "$90.000", "$150.000"] },
  { name: "Kayak inflable doble + 2 remos", precios: ["$30.000", "$45.000", "$90.000", "$120.000", "$200.000"] },
  { name: "Stand Up Paddle rígido", precios: ["$12.000", "$20.000", "$30.000", "$50.000", "$60.000"] },
  { name: "Stand Up Paddle inflable", precios: ["$40.000", "$60.000", "$80.000", "$150.000", "$190.000"] },
  { name: "Surf Board (softboard)", precios: ["$12.000", "$20.000", "$30.000", "$50.000", "$60.000"] },
  { name: "Skimboard", precios: ["$8.000", "$12.000", "$20.000", "$30.000", "$30.000"] },
  { name: "Packraft simple + remo", precios: ["$12.000", "$20.000", "$30.000", "$50.000", "$80.000"] },
  { name: "Packraft doble + 2 remos", precios: ["$16.000", "$30.000", "$40.000", "$70.000", "$100.000"] },
  { name: "Chaleco salvavidas", precios: ["$10.000", "$10.000", "$10.000", "$15.000", "$20.000"] },
  { name: "Porta kayak", precios: ["$10.000", "$10.000", "$10.000", "$15.000", "$20.000"] },
  { name: "Carrito para kayak", precios: ["$10.000", "$10.000", "$10.000", "$15.000", "$20.000"] },
  { name: "Remolque", precios: ["$25.000", "$30.000", "$40.000", "$70.000", "$100.000"] },
  { name: "Traje de neoprene", precios: ["$15.000", "$20.000", "$30.000", "$40.000", "$60.000"] },
  { name: "Botas náuticas", precios: ["$10.000", "$10.000", "$15.000", "$20.000", "$30.000"] },
  { name: "Funda estanca para teléfono", precios: ["$10.000", "$10.000", "$15.000", "$20.000", "$30.000"] },
  { name: "Snorkel", precios: ["$5.000", "$10.000", "$10.000", "$10.000", "$15.000"] },
  { name: "Patas de rana (aletas)", precios: ["$5.000", "$10.000", "$10.000", "$10.000", "$15.000"] },
  { name: "Inflador 5000cc", precios: ["$5.000", "$10.000", "$10.000", "$10.000", "$15.000"] },
  { name: "Inflador eléctrico", precios: ["$10.000", "$20.000", "$20.000", "$30.000", "$30.000"] },
];

const ventajas = [
  "Actualización permanente de modelos nuevos cada temporada",
  "El precio más bajo garantizado — encontrás más barato, lo igualamos",
  "Equipamiento para todos los niveles y edades",
  "Cambios ilimitados durante el período de alquiler",
  "Personal especializado para asesorarte y calibrar tu equipo",
  "Soporte del taller propio ante cualquier inconveniente",
  "Sistema Fastrack: sin colas, entrega en tu alojamiento en centros de ski",
  "20% OFF pagando en efectivo con 30 días de anticipación",
  "Leasing de equipos para alquileres frecuentes",
  "Créditos para futuras compras o alquileres",
];

// ─── Components ───────────────────────────────────────────────────────────────

function PriceTable({ items, headers }: { items: PrecioItem[]; headers: string[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#333] bg-[#1A1A1A]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#242424] border-b border-[#333]">
            <th className="text-left py-3 px-5 font-semibold text-white/60 min-w-[220px]">
              Equipo
            </th>
            {headers.map((h) => (
              <th
                key={h}
                className="text-center py-3 px-4 font-semibold text-[#F5A623] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a]">
          {items.map((item) => (
            <tr key={item.name} className="hover:bg-[#222] transition-colors">
              <td className="py-3 px-5 text-white/80">{item.name}</td>
              {item.precios.map((p, i) => (
                <td
                  key={i}
                  className={`py-3 px-4 text-center whitespace-nowrap ${
                    p === null
                      ? "text-white/20"
                      : "text-[#F5A623] font-semibold"
                  }`}
                >
                  {p === null ? "—" : p}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const categoryNav = [
  { id: "indumentaria", label: "Indumentaria & Accesorios", icon: "🧥" },
  { id: "ski-snowboard", label: "Ski & Snowboard", icon: "🎿" },
  { id: "camping", label: "Camping", icon: "🏕" },
  { id: "nautica", label: "Náutica", icon: "🚣" },
];

export default function AlquilarPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1A1A1A] py-20 overflow-hidden">
        <Image
          src="/images/hero/alquilar.jpg"
          alt="Ski en Patagonia"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-3">
            ECOrental
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Alquilá sin
            <br />
            <em className="not-italic font-light text-[#F5A623]">complicaciones</em>
          </h1>
          <p className="mt-4 text-lg text-white/75 max-w-xl leading-relaxed">
            Kayaks, carpas, skis, snowboards, indumentaria y más. Turno asignado,
            sin esperas, con asesoramiento personalizado.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={WA_LINKS.rental}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#F5A623] text-[#1A1A1A] font-bold px-6 py-3.5 rounded-full hover:bg-[#E08B00] transition-colors"
            >
              <MessageCircle size={18} />
              Consultar disponibilidad
            </a>
          </div>
        </div>
      </section>

      {/* Category quick nav */}
      <nav className="sticky top-16 z-30 bg-white border-b border-[#e5e7eb] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto py-1 scrollbar-none">
          {categoryNav.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#374151] hover:bg-[#FFF3DC] hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0"
            >
              <span>{c.icon}</span>
              {c.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Tarifario note */}
      <div className="bg-[#FFF8ED] border-y border-[#F5A623]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Info size={16} className="text-[#F5A623] shrink-0" />
          <p className="text-sm text-[#6b7280]">
            Precios en pesos argentinos. Fin de semana: viernes a domingo.{" "}
            <strong className="text-[#1A1A1A]">20% OFF pagando en efectivo con 30 días de anticipación.</strong>{" "}
            Precios sujetos a actualización por temporada. Confirmá disponibilidad por WhatsApp.
          </p>
        </div>
      </div>

      {/* ─── Indumentaria & Accesorios ─── */}
      <section id="indumentaria" className="py-16 bg-white scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tarifario"
            title="Indumentaria"
            titleItalic="& Accesorios"
            description="Equipos y prendas para nieve, trekking y actividades de montaña."
          />
          <div className="mt-10">
            <PriceTable items={indumentariaItems} headers={HDR_STD} />
          </div>
        </div>
      </section>

      {/* ─── Ski & Snowboard ─── */}
      <section id="ski-snowboard" className="py-16 bg-[#f9fafb] scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tarifario"
            title="Ski"
            titleItalic="& Snowboard"
            description="Tablas, botas, cascos y equipos completos para todos los niveles."
          />
          <div className="mt-10">
            <PriceTable items={skiItems} headers={HDR_SKI} />
          </div>

          {/* Resort pricing note */}
          <div className="mt-8 rounded-2xl border border-[#e5e7eb] bg-white p-6">
            <p
              className="text-base font-bold text-[#1A1A1A] mb-1 tracking-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Tarifas por centro de ski
            </p>
            <p className="text-sm text-[#6b7280] mb-4">
              Contamos con precios específicos pactados para cada centro de ski. Consultá el
              tarifario para tu destino:
            </p>
            <div className="flex flex-wrap gap-2">
              {resorts.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#FFF3DC] text-[#1A1A1A] px-3 py-1.5 rounded-full border border-[#F5A623]/30"
                >
                  🎿 {r}
                </span>
              ))}
            </div>
            <a
              href={WA_LINKS.rental}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#F5A623] hover:text-[#E08B00] transition-colors"
            >
              <MessageCircle size={14} />
              Consultar tarifario de mi destino
            </a>
          </div>
        </div>
      </section>

      {/* ─── Camping ─── */}
      <section id="camping" className="py-16 bg-white scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tarifario"
            title="Camping"
            titleItalic="& Trekking"
            description="Carpas, bolsas de dormir, mochilas y accesorios para salir al campo."
          />
          <div className="mt-10 space-y-8">
            {campingSubcats.map((sub) => (
              <div key={sub.name}>
                <h3
                  className="text-base font-bold text-[#1A1A1A] mb-3 tracking-tight"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {sub.name}
                </h3>
                <PriceTable items={sub.items} headers={HDR_STD} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Náutica ─── */}
      <section id="nautica" className="py-16 bg-[#f9fafb] scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tarifario"
            title="Náutica"
            titleItalic="& Paddle"
            description="Kayaks, SUP, surf, packrafts y equipamiento acuático completo."
          />
          <div className="mt-10">
            <PriceTable items={nauticaItems} headers={HDR_STD} />
          </div>
          <p className="mt-4 text-xs text-[#9ca3af]">
            * El traslado de kayaks y carpas de gran tamaño tiene costo adicional. Consultá por envío a destino.
          </p>
        </div>
      </section>

      {/* Fastrack */}
      <section className="py-16 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-3">
                Sistema Fastrack
              </p>
              <h2
                className="text-4xl font-bold text-white leading-tight mb-4 tracking-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Sin colas,
                <br />
                <em className="not-italic font-light text-[#F5A623]">sin estrés</em>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Reservá y pagá tu equipo en Buenos Aires antes de llegar al
                centro de ski. Te lo entregamos en tu alojamiento.
                Arrancás a esquiar desde el primer momento.
              </p>
              <ul className="space-y-2 text-sm text-white/80">
                {[
                  "Ahorrás tiempo y dinero",
                  "Sin colas en el centro de ski",
                  "Sin cupones de tarjeta como garantía",
                  "Sin paquetes completos obligatorios",
                  "Tarifas de leasing para alquileres frecuentes",
                  "Entrega y retiro en tu alojamiento",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-[#F5A623]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 rounded-3xl p-8 text-center">
              <p
                className="text-2xl font-bold text-white mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Promoción 4×5
              </p>
              <p className="text-white/70 text-sm mb-4">
                Alquilás 4 unidades y la 5ta la tenés de regalo para tu próximo
                alquiler. Válido en indumentaria, ski/snowboard, náutica y camping.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-[#F5A623] font-semibold mb-6">
                <MapPin size={14} />
                Solo en sucursal Martínez · La Paz 830
              </div>
              <a
                href={WA_LINKS.rental}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1ea855] transition-colors"
              >
                <MessageCircle size={16} />
                Reservar Fastrack por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Información importante */}
      <section className="py-16 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Políticas de alquiler"
            title="Información"
            titleItalic="importante"
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {[
              {
                icon: "📅",
                title: "Coordiná tu turno",
                desc: "Reservá con turno asignado para retirar sin esperas. No atendemos sin cita durante temporada alta.",
              },
              {
                icon: "💳",
                title: "Formas de pago",
                desc: "Efectivo o transferencia bancaria. 20% de descuento pagando en efectivo con 30 días de anticipación.",
              },
              {
                icon: "📦",
                title: "Equipo nuevo",
                desc: "Disponible a un costo adicional. Consultá disponibilidad de modelos nuevos de temporada.",
              },
              {
                icon: "🔄",
                title: "Cambios incluidos",
                desc: "Podés cambiar talla o equipo durante el período de alquiler sin cargo adicional.",
              },
              {
                icon: "🏦",
                title: "Depósito de garantía",
                desc: "Se registra como crédito para futuras compras o alquileres en la tienda.",
              },
              {
                icon: "🚐",
                title: "Envío a destino",
                desc: "Entregamos kayaks, carpas y equipos de gran tamaño en el destino. Consultá cobertura y costo.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl p-6 border border-[#e5e7eb] flex flex-col gap-3"
              >
                <span className="text-3xl">{card.icon}</span>
                <h3
                  className="font-bold text-[#1A1A1A] tracking-tight"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {card.title}
                </h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="El proceso"
            title="Cómo funciona"
            titleItalic="el alquiler"
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            {[
              {
                num: "01",
                title: "Consultá",
                desc: "Escribinos por WhatsApp con los equipos que necesitás, fechas y destino.",
              },
              {
                num: "02",
                title: "Reservá con turno",
                desc: "Te asignamos un turno para retirar sin esperas. Pagás en efectivo o transferencia.",
              },
              {
                num: "03",
                title: "Disfrutá",
                desc: "Retirás en sucursal o te llevamos el equipo al destino. Cambios ilimitados incluidos.",
              },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center gap-4">
                <span
                  className="text-5xl font-bold text-[#F5A623]/20 tracking-tight"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {step.num}
                </span>
                <h3
                  className="text-xl font-bold text-[#1a1a1a] tracking-tight"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ventajas */}
      <section className="py-16 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Por qué elegir ECOrental"
            title="Todo incluido,"
            titleItalic="nada complicado"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
            {ventajas.map((v) => (
              <div
                key={v}
                className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#e5e7eb]"
              >
                <Check size={18} className="text-[#F5A623] shrink-0 mt-0.5" />
                <span className="text-sm text-[#1a1a1a]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final inline */}
      <section className="py-14 bg-[#FFF3DC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            ¿Listo para salir?
          </p>
          <p className="text-[#6b7280] mb-6 leading-relaxed">
            Consultá disponibilidad y precio final por WhatsApp. Te respondemos en minutos.
          </p>
          <a
            href={WA_LINKS.rental}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white font-bold px-8 py-4 rounded-full hover:bg-[#F5A623] hover:text-[#1A1A1A] transition-colors"
          >
            <MessageCircle size={18} />
            Consultar alquiler por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
