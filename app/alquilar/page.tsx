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

const duraciones = ["Día", "Fin de semana", "4 días", "Semana"];

type PrecioItem = {
  name: string;
  precios: (string | null)[];
};

type SubCat = {
  name: string;
  items: PrecioItem[];
};

const indumentariaItems: PrecioItem[] = [
  { name: "Equipo 5 piezas (campera, pantalón, botas après-ski, guantes, antiparras)", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Equipo 4 piezas", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Campera de ski", precios: ["$8.000", "Consultar", "Consultar", "Consultar"] },
  { name: "Pantalón de ski", precios: ["$6.000", "Consultar", "Consultar", "Consultar"] },
  { name: "Guantes de ski", precios: ["$2.500", "Consultar", "Consultar", "Consultar"] },
  { name: "Antiparras", precios: ["$3.500", "Consultar", "Consultar", "Consultar"] },
  { name: "Botas après-ski", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Medias de ski", precios: ["$1.500", "Consultar", "Consultar", "Consultar"] },
  { name: "Crampones de hielo", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Trineos", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Raquetas de nieve", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Polainas", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Botas de trekking", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Pantalón de trekking", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Gorro / Pasamontañas", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
];

const skiItems: PrecioItem[] = [
  { name: "Set completo ski (tablas + fijaciones + bastones)", precios: ["$22.000", "Consultar", "Consultar", "Consultar"] },
  { name: "Esquís + fijaciones", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Botas de ski", precios: ["$8.000", "Consultar", "Consultar", "Consultar"] },
  { name: "Set snowboard completo", precios: ["$20.000", "Consultar", "Consultar", "Consultar"] },
  { name: "Snowboard + fijaciones", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Botas de snowboard", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Casco", precios: ["$4.000", "Consultar", "Consultar", "Consultar"] },
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

const campingSubcats: SubCat[] = [
  {
    name: "Carpas",
    items: [
      { name: "Carpa 2 personas", precios: ["$10.000", "Consultar", "Consultar", "Consultar"] },
      { name: "Carpa 4 personas", precios: ["$14.000", "Consultar", "Consultar", "Consultar"] },
      { name: "Carpa 5-6 personas", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Carpa comedor / toldo", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Carpa alta montaña", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
    ],
  },
  {
    name: "Abrigo & Descanso",
    items: [
      { name: "Bolsa de dormir 2 estaciones", precios: ["$5.000", "Consultar", "Consultar", "Consultar"] },
      { name: "Bolsa de dormir 3 estaciones", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Bolsa de dormir alta montaña", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Liner / Sábana interior", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Aislante (foam)", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Colchoneta autoinflable", precios: ["$3.500", "Consultar", "Consultar", "Consultar"] },
      { name: "Colchón de aire simple", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Colchón de aire doble", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
    ],
  },
  {
    name: "Mochilas & Transporte",
    items: [
      { name: "Mochila trekking 60L", precios: ["$6.000", "Consultar", "Consultar", "Consultar"] },
      { name: "Mochila hasta 85L", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Mochila de hidratación", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Portabebés / mochila porta-niño", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Bastones de trekking", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
    ],
  },
  {
    name: "Accesorios & Equipamiento",
    items: [
      { name: "Linterna frontal", precios: ["$1.500", "Consultar", "Consultar", "Consultar"] },
      { name: "Silla de camping", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Mesa de camping", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Utensilios de cocina", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Calentador a gas", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Hielera / heladera portátil", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Termo", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Binoculares / Telescopio", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
      { name: "Tanque de agua", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
    ],
  },
];

const nauticaItems: PrecioItem[] = [
  { name: "Kayak simple", precios: ["$15.000", "Consultar", "Consultar", "Consultar"] },
  { name: "Kayak doble", precios: ["$18.000", "Consultar", "Consultar", "Consultar"] },
  { name: "Kayak de mar simple", precios: ["$20.000", "Consultar", "Consultar", "Consultar"] },
  { name: "Kayak rígido", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Paddle Surf / SUP rígido", precios: ["$12.000", "Consultar", "Consultar", "Consultar"] },
  { name: "Paddle Surf / SUP inflable", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Tabla de surf", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Skimboard", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Packraft", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Chaleco salvavidas", precios: ["Incluido", null, null, null] },
  { name: "Transportín para kayak", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Traje de neoprene", precios: ["$9.000", "Consultar", "Consultar", "Consultar"] },
  { name: "Escarpines / botas de agua", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Snorkel + aletas", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
  { name: "Funda impermeable para celular", precios: ["Consultar", "Consultar", "Consultar", "Consultar"] },
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

// Reusable price table
function PriceTable({ items }: { items: PrecioItem[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#e5e7eb]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#FFF3DC]">
            <th className="text-left py-3 px-5 font-semibold text-[#1A1A1A] min-w-[220px]">
              Equipo
            </th>
            {duraciones.map((d) => (
              <th
                key={d}
                className="text-center py-3 px-4 font-semibold text-[#1A1A1A] whitespace-nowrap"
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f3f4f6]">
          {items.map((item) => (
            <tr key={item.name} className="hover:bg-[#fafafa] transition-colors">
              <td className="py-3 px-5 text-[#1A1A1A]">{item.name}</td>
              {item.precios.map((p, i) => (
                <td
                  key={i}
                  className={`py-3 px-4 text-center whitespace-nowrap ${
                    p === null
                      ? "text-[#d1d5db]"
                      : p === "Consultar"
                      ? "text-[#9ca3af] text-xs"
                      : p === "Incluido"
                      ? "text-green-600 font-semibold"
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

      {/* Tarifario note */}
      <div className="bg-[#FFF8ED] border-y border-[#F5A623]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Info size={16} className="text-[#F5A623] shrink-0" />
          <p className="text-sm text-[#6b7280]">
            Precios orientativos en pesos. Fin de semana: viernes a domingo.{" "}
            <strong className="text-[#1A1A1A]">20% OFF pagando en efectivo con 30 días de anticipación.</strong>{" "}
            Confirmá disponibilidad y precio final por WhatsApp.
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
            <PriceTable items={indumentariaItems} />
          </div>
          <p className="mt-4 text-xs text-[#9ca3af]">
            * Las prendas de neoprene también se listan en la sección Náutica.
          </p>
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
            <PriceTable items={skiItems} />
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
              Contamos con precios específicos pactados con los centros de ski. Consultá el tarifario
              para tu destino:
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
                <PriceTable items={sub.items} />
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
            <PriceTable items={nauticaItems} />
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
