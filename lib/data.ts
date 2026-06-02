import type { Product, Post, Sucursal } from "@/types";

export const WA_NUMBER = "5491162237233";

export function buildWALink(text: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const WA_LINKS = {
  general: buildWALink("Hola, vi el sitio de Eurocamping y quiero consultar"),
  rental: buildWALink("Hola, quiero consultar disponibilidad de alquiler"),
  taller: buildWALink("Hola, quiero pedir turno en el taller"),
  usados: buildWALink("Hola, quiero consultar por productos usados"),
};

export const products: Product[] = [
  {
    id: "1",
    title: "Carpa The North Face Stormbreak 3",
    type: "usado",
    price: null,
    image: "/images/productos/carpa-tnf.jpg",
    activities: ["camping"],
    badge: "Revisado ECO",
    description: "Carpa 3 personas, doble techo, muy buen estado. Incluye bolso y estacas.",
    whatsappContext: "carpa TNF Stormbreak 3 usada",
  },
  {
    id: "2",
    title: "Kayak de mar doble",
    type: "rental",
    price: "Desde $18.000 / día",
    image: "/images/productos/kayak-doble.jpg",
    activities: ["kayak"],
    description: "Kayak doble para aguas abiertas. Incluye remos, chalecos y spray skirt.",
    whatsappContext: "alquiler de kayak doble",
  },
  {
    id: "3",
    title: "Botas Ski Head Nexo 100 · Talle 27",
    type: "nuevo",
    price: null,
    image: "/images/productos/botas-ski-head.jpg",
    activities: ["ski"],
    description: "Botas de ski intermedias-avanzadas, horma estándar, flex 100.",
    externalLink: "https://www.mercadolibre.com.ar/tienda/eurocamping",
    whatsappContext: "botas ski Head Nexo 100 talle 27",
  },
  {
    id: "4",
    title: "Mochila Mammut Trion 50L",
    type: "usado",
    price: null,
    image: "/images/productos/mochila-mammut.jpg",
    activities: ["trekking"],
    badge: "Revisado ECO",
    description: "Mochila de trekking 50 litros, excelente estado, con porta hidratación.",
    whatsappContext: "mochila Mammut Trion 50L usada",
  },
  {
    id: "5",
    title: "Set Esquís Salomon QST 85 · 170cm",
    type: "rental",
    price: "Desde $22.000 / día",
    image: "/images/productos/esquis-salomon.jpg",
    activities: ["ski"],
    description: "Esquís all-mountain para nivel intermedio-avanzado. Incluye fijaciones.",
    whatsappContext: "alquiler de set esquís Salomon QST",
  },
  {
    id: "6",
    title: "Carpa Coleman Sundome 4 · Nueva",
    type: "nuevo",
    price: null,
    image: "/images/productos/carpa-coleman.jpg",
    activities: ["camping"],
    description: "Carpa 4 personas, fácil armado, ventilación E-port. Ideal familia.",
    externalLink: "https://www.mercadolibre.com.ar/tienda/eurocamping",
    whatsappContext: "carpa Coleman Sundome 4 nueva",
  },
];

export const posts: Post[] = [
  {
    slug: "circuito-nahuel-huapi-kayak-5-dias",
    category: "ECOtrip",
    title: "Circuito Nahuel Huapi: kayak + camping en 5 días",
    excerpt:
      "El clásico cruce de los Lagos Espejo, Correntoso y Nahuel Huapi en kayak. Ruta, campings y lo que necesitás llevar.",
    image: "/images/posts/circuito-nahuel-huapi-kayak-5-dias.png",
    readTime: "8 min",
    date: "2024-11-15",
  },
  {
    slug: "como-elegir-mochila-trekking-2025",
    category: "ECOtip",
    title: "Cómo elegir tu primera mochila de trekking en 2025",
    excerpt:
      "Volumen, sistema de suspensión, materiales y precio: todo lo que tenés que saber antes de comprar.",
    image: "/images/posts/como-elegir-mochila-trekking-2025.png",
    readTime: "5 min",
    date: "2024-10-22",
  },
  {
    slug: "ski-patagonia-argentina-chile",
    category: "ECOtrip",
    title: "Ski Patagonia: el cruce Argentina–Chile más épico",
    excerpt:
      "Desde Chapelco hasta Antillanca pasando por el Cruce Lacustre. Logística, alojamiento y equipo necesario.",
    image: "/images/posts/ski-patagonia-argentina-chile.png",
    readTime: "10 min",
    date: "2024-09-05",
  },
  {
    slug: "armado-campamento-base-trekking",
    category: "ECOtip",
    title: "5 claves para armar un campamento base eficiente",
    excerpt:
      "Lugar, orientación de la carpa, cocina y organización del espacio. Trucos del taller ECO.",
    image: "/images/posts/armado-campamento-base-trekking.png",
    readTime: "4 min",
    date: "2024-08-18",
  },
];

export const sucursales: Sucursal[] = [
  // Buenos Aires
  {
    name: "CABA",
    region: "Buenos Aires",
    city: "Buenos Aires",
    address: "Paraná 761, CABA",
    phone: "+54 11 4374-5007",
    whatsapp: "5491162237234",
    hours: "Lun–Vie 11–18hs · Sáb 10–13hs",
    maps: "https://maps.app.goo.gl/bvMSD1tmnrjVSpNM8",
    rental: true,
  },
  {
    name: "Martínez",
    region: "Buenos Aires",
    city: "Martínez, Buenos Aires",
    address: "La Paz 830 (entre Dardo Rocha y Catamarca)",
    whatsapp: "5491162237233",
    hours: "Lun–Vie 11–18hs · Sáb con turno",
    maps: "https://maps.app.goo.gl/V8W4XxVryv2yCK3h6",
    rental: true,
  },
  // Córdoba
  {
    name: "Córdoba",
    region: "Córdoba",
    city: "Córdoba",
    whatsapp: "5491162237233",
    rental: true,
  },
  // Mendoza
  {
    name: "Las Leñas",
    region: "Mendoza",
    city: "Las Leñas, Mendoza",
    whatsapp: "5491162237233",
    rental: true,
    note: "Reservá el equipo en Buenos Aires y retiralo directamente en Las Leñas.",
  },
  // Neuquén
  {
    name: "Villa Traful",
    region: "Neuquén",
    city: "Villa Traful, Neuquén",
    address: "Bartolomé Laffitte s/n",
    phone: "+54 294 447-9128",
    hours: "Lun–Sáb 10–13hs y 16–20hs",
  },
  {
    name: "Spirit Patagonia",
    region: "Neuquén",
    city: "San Martín de los Andes, Neuquén",
    address: "Av. San Martín esq. Elordi",
    whatsapp: "5492944123144",
    hours: "Lun–Sáb 10–13hs y 16–20hs",
    maps: "https://maps.app.goo.gl/skCZ3wvHtBvbhMsH7",
    rental: true,
  },
  {
    name: "Base Cerro Chapelco",
    region: "Neuquén",
    city: "San Martín de los Andes, Neuquén",
    whatsapp: "5491162237233",
    hours: "Lun–Dom 10–17:30hs",
    rental: true,
    seasonal: "Temporada invernal",
  },
  {
    name: "Caviahue",
    region: "Neuquén",
    city: "Caviahue, Neuquén",
    whatsapp: "5491162237233",
    hours: "Lun–Dom 10–12:30hs y 17:30–20:30hs",
    rental: true,
  },
  // Río Negro
  {
    name: "Base Cerro Catedral",
    region: "Río Negro",
    city: "Bariloche, Río Negro",
    whatsapp: "5491162237233",
    hours: "Lun–Dom 10–17:30hs",
    rental: true,
    seasonal: "Temporada invernal",
  },
  {
    name: "La Huella",
    region: "Río Negro",
    city: "El Bolsón, Río Negro",
    whatsapp: "5491162237233",
    hours: "Lun–Sáb 10–12:30hs y 17:30–20:30hs",
    maps: "https://maps.app.goo.gl/8eYzkmRxB7FrrSVF7",
    rental: true,
  },
  // Salta
  {
    name: "Salta",
    region: "Salta",
    city: "Salta",
    whatsapp: "5491162237233",
    rental: true,
  },
  // Tierra del Fuego
  {
    name: "La Brecha Rental",
    region: "Tierra del Fuego",
    city: "Ushuaia, Tierra del Fuego",
    whatsapp: "5491162237233",
    hours: "Lun–Dom 9–19hs",
    rental: true,
    seasonal: "Temporada invernal",
  },
];

export const brands = [
  "The North Face",
  "Salomon",
  "Mammut",
  "Rossignol",
  "Atomic",
  "Burton",
  "Oakley",
  "K2",
  "Dynastar",
  "Doite",
  "Lippi",
  "Mormaii",
  "Trespass",
  "Armada",
  "Bollé",
];

export const activities = [
  { label: "Camping", emoji: "🏕", href: "/comprar?actividad=camping" },
  { label: "Kayak", emoji: "🚣", href: "/alquilar" },
  { label: "Ski", emoji: "🎿", href: "/comprar?actividad=ski" },
  { label: "Trekking", emoji: "🧗", href: "/comprar?actividad=trekking" },
  { label: "Surf", emoji: "🏄", href: "/comprar?actividad=surf" },
  { label: "Yachting", emoji: "⛵", href: "/alquilar" },
];
