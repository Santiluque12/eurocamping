// Fuente: app/alquilar/page.tsx (versión hardcodeada previa a la base de datos).
// Sólo la usa el importador inicial.

// headers for each category
export const HDR_STD = ["Día", "Fin de semana", "4 días", "Semana", "Quincena"];
export const HDR_SKI = ["Día", "3 días", "4 días", "Semana"];

export type PrecioItem = {
  name: string;
  precios: (string | null)[];
  catalogId?: string;
};

export type SubCat = {
  name: string;
  items: PrecioItem[];
};

// ─── Indumentaria & Accesorios (HDR_STD — 5 cols) ────────────────────────────
export const indumentariaItems: PrecioItem[] = [
  { name: "Equipo 5 piezas (campera, pantalón, botas après-ski, guantes, antiparras)", precios: ["$50.000", "$150.000", "$200.000", "$240.000", "$350.000"] },
  { name: "Equipo 4 piezas", precios: ["$40.000", "$120.000", "$160.000", "$200.000", "$300.000"] },
  { name: "Botas Après-ski", precios: ["$15.000", "$30.000", "$40.000", "$60.000", "$80.000"], catalogId: "botas-apreski" },
  { name: "Campera de ski", precios: ["$15.000", "$30.000", "$40.000", "$60.000", "$80.000"], catalogId: "campera" },
  { name: "Pantalón de ski", precios: ["$15.000", "$30.000", "$40.000", "$60.000", "$80.000"], catalogId: "pantalon-invierno" },
  { name: "Conjunto entero (mameluco)", precios: ["$15.000", "$30.000", "$40.000", "$60.000", "$80.000"], catalogId: "conjunto-entero" },
  { name: "Guantes", precios: ["$8.000", "$20.000", "$30.000", "$40.000", "$40.000"], catalogId: "guantes" },
  { name: "Antiparras", precios: ["$8.000", "$20.000", "$30.000", "$40.000", "$40.000"], catalogId: "antiparras" },
  { name: "Crampones de hielo (Ice Grip)", precios: ["$1.000", "$3.000", "$4.000", "$5.000", "$7.000"], catalogId: "ice-grip" },
  { name: "Trineo", precios: ["$1.000", "$3.000", "$4.000", "$5.000", "$7.000"], catalogId: "trineo" },
  { name: "Pala de nieve", precios: ["$5.000", "$15.000", "$25.000", "$40.000", "$50.000"], catalogId: "pala-nieve" },
  { name: "Kit rescate de avalancha", precios: ["$30.000", "$60.000", "$80.000", "$150.000", "$200.000"], catalogId: "kit-rescate" },
  { name: "Raquetas de nieve", precios: ["$10.000", "$30.000", "$40.000", "$60.000", "$80.000"], catalogId: "raquetas-nieve" },
  { name: "Polainas", precios: ["$5.000", "$15.000", "$25.000", "$40.000", "$45.000"], catalogId: "polainas" },
  { name: "Botas de trekking", precios: ["$10.000", "$30.000", "$40.000", "$60.000", "$80.000"], catalogId: "botas-trekking" },
  { name: "Pantalón de trekking", precios: ["$10.000", "$30.000", "$40.000", "$60.000", "$80.000"], catalogId: "pantalon-trekking" },
  { name: "Cubre pantalón", precios: ["$10.000", "$30.000", "$40.000", "$60.000", "$80.000"], catalogId: "cubre-pantalon" },
  { name: "Sombrero / Gorro", precios: ["$2.000", "$6.000", "$10.000", "$15.000", "$15.000"], catalogId: "sombrero" },
];

// ─── Ski & Snowboard (HDR_SKI — 4 cols) ──────────────────────────────────────
export const skiItems: PrecioItem[] = [
  { name: "Equipo completo", precios: ["$10.000", "$30.000", "$40.000", "$50.000"] },
  { name: "Esquís + fijaciones", precios: ["$5.000", "$15.000", "$20.000", "$30.000"], catalogId: "esquis" },
  { name: "Snowboard + fijaciones", precios: ["$5.000", "$15.000", "$20.000", "$30.000"], catalogId: "snowboard" },
  { name: "Botas (ski o snowboard)", precios: ["$5.000", "$15.000", "$20.000", "$30.000"], catalogId: "botas-ski" },
  { name: "Casco", precios: ["$5.000", "$15.000", "$20.000", "$30.000"], catalogId: "cascos" },
];

export const resorts = [
  "Cerro Catedral",
  "Cerro Chapelco",
  "Las Leñas",
  "Cerro Bayo",
  "Caviahue",
  "La Hoya",
  "Las Pendientes (Castor)",
];

// ─── Camping (HDR_STD — 5 cols) ──────────────────────────────────────────────
export const campingSubcats: SubCat[] = [
  {
    name: "Carpas",
    items: [
      { name: "Carpa 1-4 PAX", precios: ["$30.000", "$45.000", "$60.000", "$90.000", "$120.000"], catalogId: "carpa-1-4" },
      { name: "Carpa 5-6 PAX", precios: ["$40.000", "$60.000", "$90.000", "$120.000", "$150.000"], catalogId: "carpa-5-6" },
      { name: "Carpa comedor / toldo", precios: ["$40.000", "$60.000", "$90.000", "$120.000", "$150.000"], catalogId: "carpa-comedor" },
    ],
  },
  {
    name: "Abrigo & Descanso",
    items: [
      { name: "Bolsa de dormir 2 estaciones", precios: ["$5.000", "$10.000", "$10.000", "$10.000", "$10.000"], catalogId: "bolsa-2est" },
      { name: "Bolsa de dormir 3 estaciones", precios: ["$15.000", "$20.000", "$30.000", "$40.000", "$50.000"], catalogId: "bolsa-3est" },
      { name: "Bolsa de dormir alta montaña", precios: ["$30.000", "$40.000", "$60.000", "$80.000", "$100.000"], catalogId: "bolsa-alta-montana" },
      { name: "Liner / sábana interior", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$20.000"], catalogId: "bolsa-liner" },
      { name: "Aislante (foam)", precios: ["$5.000", "$5.000", "$5.000", "$5.000", "$5.000"], catalogId: "aislante" },
      { name: "Aislante alta montaña", precios: ["$10.000", "$15.000", "$15.000", "$20.000", "$20.000"], catalogId: "aislante-alta-montana" },
      { name: "Colchoneta autoinflable", precios: ["$15.000", "$20.000", "$25.000", "$30.000", "$40.000"], catalogId: "colchoneta-autoinflable" },
      { name: "Colchón inflable simple", precios: ["$10.000", "$10.000", "$15.000", "$15.000", "$20.000"], catalogId: "colchon-single" },
      { name: "Colchón inflable doble", precios: ["$15.000", "$15.000", "$20.000", "$20.000", "$30.000"], catalogId: "colchon-doble" },
    ],
  },
  {
    name: "Mochilas & Transporte",
    items: [
      { name: "Mochila 10-85L", precios: ["$15.000", "$20.000", "$30.000", "$40.000", "$50.000"], catalogId: "mochila" },
      { name: "Mochila porta bebé", precios: ["$15.000", "$20.000", "$30.000", "$40.000", "$50.000"], catalogId: "mochila-bebe" },
      { name: "Mochila de hidratación", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$30.000"], catalogId: "mochila-hidrante" },
      { name: "Bastones de trekking (par)", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$20.000"], catalogId: "baston" },
    ],
  },
  {
    name: "Accesorios & Equipamiento",
    items: [
      { name: "Silla 3 en 1", precios: ["$10.000", "$15.000", "$15.000", "$20.000", "$30.000"], catalogId: "silla-3en1" },
      { name: "Mesa 4 PAX", precios: ["$15.000", "$20.000", "$30.000", "$40.000", "$50.000"], catalogId: "mesa" },
      { name: "Marmita / set de cocina", precios: ["$10.000", "$15.000", "$20.000", "$25.000", "$30.000"], catalogId: "marmita" },
      { name: "Calentador a gas", precios: ["$10.000", "$15.000", "$20.000", "$25.000", "$30.000"], catalogId: "calentador" },
      { name: "Linterna frontal", precios: ["$10.000", "$15.000", "$20.000", "$25.000", "$30.000"], catalogId: "linterna" },
      { name: "Conservadora 36-48QT", precios: ["$10.000", "$15.000", "$20.000", "$25.000", "$30.000"], catalogId: "conservadora" },
      { name: "Termo 7.6L", precios: ["$10.000", "$15.000", "$20.000", "$25.000", "$30.000"], catalogId: "termo" },
      { name: "Parrilla enrollable", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$20.000"], catalogId: "parrilla" },
      { name: "Binoculares", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$30.000"], catalogId: "binocular" },
      { name: "Telescopio", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$30.000"], catalogId: "telescopio" },
      { name: "Tanque de agua", precios: ["$10.000", "$15.000", "$20.000", "$20.000", "$30.000"], catalogId: "tanque-agua" },
      { name: "Inflador 5000cc", precios: ["$5.000", "$10.000", "$10.000", "$15.000", "$15.000"], catalogId: "inflador-5000" },
      { name: "Inflador eléctrico", precios: ["$10.000", "$15.000", "$20.000", "$25.000", "$30.000"], catalogId: "inflador-electrico" },
    ],
  },
];

// ─── Náutica (HDR_STD — 5 cols) ──────────────────────────────────────────────
export const nauticaItems: PrecioItem[] = [
  { name: "Kayak simple + remo", precios: ["$8.000", "$12.000", "$20.000", "$30.000", "$40.000"], catalogId: "kayak-simple" },
  { name: "Kayak doble + 2 remos", precios: ["$12.000", "$20.000", "$30.000", "$50.000", "$60.000"], catalogId: "kayak-doble" },
  { name: "Kayak inflable simple + remo", precios: ["$20.000", "$30.000", "$60.000", "$90.000", "$150.000"], catalogId: "kayak-inflable-simple" },
  { name: "Kayak inflable doble + 2 remos", precios: ["$30.000", "$45.000", "$90.000", "$120.000", "$200.000"], catalogId: "kayak-inflable-doble" },
  { name: "Stand Up Paddle rígido", precios: ["$12.000", "$20.000", "$30.000", "$50.000", "$60.000"], catalogId: "sup-rigido" },
  { name: "Stand Up Paddle inflable", precios: ["$40.000", "$60.000", "$80.000", "$150.000", "$190.000"], catalogId: "sup-inflable" },
  { name: "Surf Board (softboard)", precios: ["$12.000", "$20.000", "$30.000", "$50.000", "$60.000"], catalogId: "surfboard" },
  { name: "Skimboard", precios: ["$8.000", "$12.000", "$20.000", "$30.000", "$30.000"], catalogId: "skimboard" },
  { name: "Packraft simple + remo", precios: ["$12.000", "$20.000", "$30.000", "$50.000", "$80.000"], catalogId: "packraft" },
  { name: "Packraft doble + 2 remos", precios: ["$16.000", "$30.000", "$40.000", "$70.000", "$100.000"], catalogId: "packraft" },
  { name: "Chaleco salvavidas", precios: ["$10.000", "$10.000", "$10.000", "$15.000", "$20.000"], catalogId: "chaleco" },
  { name: "Porta kayak", precios: ["$10.000", "$10.000", "$10.000", "$15.000", "$20.000"], catalogId: "porta-kayak" },
  { name: "Carrito para kayak", precios: ["$10.000", "$10.000", "$10.000", "$15.000", "$20.000"], catalogId: "carrito" },
  { name: "Remolque", precios: ["$25.000", "$30.000", "$40.000", "$70.000", "$100.000"], catalogId: "remolque" },
  { name: "Traje de neoprene", precios: ["$15.000", "$20.000", "$30.000", "$40.000", "$60.000"], catalogId: "traje-neoprene" },
  { name: "Botas náuticas", precios: ["$10.000", "$10.000", "$15.000", "$20.000", "$30.000"], catalogId: "botas-nauticas" },
  { name: "Funda estanca para teléfono", precios: ["$10.000", "$10.000", "$15.000", "$20.000", "$30.000"], catalogId: "funda-estanca" },
  { name: "Snorkel", precios: ["$5.000", "$10.000", "$10.000", "$10.000", "$15.000"], catalogId: "snorkel" },
  { name: "Patas de rana (aletas)", precios: ["$5.000", "$10.000", "$10.000", "$10.000", "$15.000"], catalogId: "patas-rana" },
  { name: "Inflador 5000cc", precios: ["$5.000", "$10.000", "$10.000", "$10.000", "$15.000"], catalogId: "inflador-5000" },
  { name: "Inflador eléctrico", precios: ["$10.000", "$20.000", "$20.000", "$30.000", "$30.000"], catalogId: "inflador-electrico" },
];

export const ventajas = [
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

