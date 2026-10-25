// Textos que estaban embebidos en las páginas y componentes antes de migrar a
// la base de datos. Sólo los usa el importador inicial.
import type { SettingsValue } from "../../lib/settings/spec";
import { WA_NUMBER } from "./site";
import { resorts, ventajas } from "./tariff";

export const settings: { [K in import("../../lib/settings/spec").SettingsKey]: SettingsValue<K> } = {
  // components/Footer.tsx, WhatsAppBanner.tsx, lib/data.ts (WA_LINKS)
  general: {
    whatsapp: { general: WA_NUMBER, rental: WA_NUMBER, taller: WA_NUMBER, usados: WA_NUMBER },
    whatsappMessages: {
      general: "Hola, vi el sitio de Eurocamping y quiero consultar",
      rental: "Hola, quiero consultar disponibilidad de alquiler",
      taller: "Hola, quiero pedir turno en el taller",
      usados: "Hola, quiero consultar por productos usados",
      product: "Hola, vi el sitio y quiero consultar por",
      rentalItem: "Hola, quiero consultar disponibilidad de alquiler:",
    },
    contact: {
      email: "info@eurocampingonline.com.ar",
      hours: "Respondemos en minutos · Lun a Vie 11–18hs · Sáb 10–13hs",
      bannerTitle: "Hablá con nosotros",
      bannerButton: "Escribir por WhatsApp",
    },
    social: {
      instagram: "https://www.instagram.com/eurocamping",
      facebook: "https://www.facebook.com/eurocamping",
      youtube: "https://www.youtube.com/@eurocamping",
    },
    footer: {
      tagline: "Todo el outdoor en un solo lugar.\nDesde 1965.",
      location: "Buenos Aires · Argentina",
    },
  },

  // app/page.tsx
  home: {
    hero: {
      eyebrow: "Eurocamping · Desde 1965",
      title: "Todo el outdoor",
      titleAccent: "en un solo lugar",
      description:
        "Equipamento nuevo y usado, alquiler para tu próxima aventura, y el taller de reparaciones más completo de Argentina.",
      image: null,
      primaryCta: { label: "Reservar alquiler", href: "/alquilar" },
    },
    needs: {
      eyebrow: "¿Qué buscás?",
      title: "Encontrá lo que necesitás",
      titleAccent: "",
      description: "Desde equipos nuevos hasta reparaciones. Somos tu base de operaciones outdoor.",
      // "Comprar nuevo" y "Buscar usado" están ocultas (sección Comprar oculta).
      cards: [
        {
          icon: "Tent",
          title: "Alquilar",
          description: "Desde esquís hasta kayaks y carpas. Equipos actualizados para todos los niveles.",
          href: "/alquilar",
        },
        {
          icon: "Wrench",
          title: "Reparar",
          description: "El taller especializado en outdoor más completo del país. Más de 60 años de experiencia.",
          href: "/taller",
        },
      ],
    },
    products: { eyebrow: "Disponibles ahora", title: "Elegidos para", titleAccent: "esta temporada", description: "" },
    rentalCard: {
      eyebrow: "ECOrental",
      title: "Alquilá sin",
      titleAccent: "complicaciones",
      description:
        "Kayaks, carpas, skis, snowboards, indumentaria y más. Modelos actualizados cada temporada. Entrega en destino disponible.",
      bullets: [
        "20% de descuento pagando con 30 días de anticipación",
        "Cambios ilimitados durante el período de alquiler",
        "Soporte del taller propio incluido",
        "Sistema Fastrack: sin colas, entrega en alojamiento",
      ],
      ctaLabel: "Ver disponibilidad",
    },
    tallerCard: {
      eyebrow: "Taller ECO",
      title: "Más de 60 años",
      titleAccent: "reparando aventuras",
      description:
        "Carpas, bolsas de dormir, mochilas, calzado outdoor, tablas de ski y más. Trabajo especializado con piezas originales.",
      bullets: [
        "Recepción y entrega en sucursal Martínez (La Paz 830)",
        "20% OFF pagando en efectivo (Nov–Abr)",
        "Servicio express disponible",
        "Presupuesto sin costo",
      ],
      ctaLabel: "Pedir turno",
    },
    content: {
      eyebrow: "Contenido ECO",
      title: "Trips, tips y",
      titleAccent: "aventuras reales",
      description: "Historias de personas reales en la naturaleza. Sin filtros ni estudios.",
    },
  },

  // app/alquilar/page.tsx
  alquilar: {
    hero: {
      eyebrow: "ECOrental",
      title: "Alquilá sin",
      titleAccent: "complicaciones",
      description:
        "Kayaks, carpas, skis, snowboards, indumentaria y más. Turno asignado, sin esperas, con asesoramiento personalizado.",
      image: null, // se completa con /images/hero/alquilar.jpg durante la importación
    },
    priceNote:
      "Precios en pesos argentinos. Fin de semana: viernes a domingo. **20% OFF pagando en efectivo con 30 días de anticipación.** Precios sujetos a actualización por temporada. Confirmá disponibilidad por WhatsApp.",
    resorts: {
      title: "Tarifas por centro de ski",
      text: "Contamos con precios específicos pactados para cada centro de ski. Consultá el tarifario para tu destino:",
      items: resorts,
    },
    fastrack: {
      eyebrow: "Sistema Fastrack",
      title: "Sin colas,",
      titleAccent: "sin estrés",
      description:
        "Reservá y pagá tu equipo en Buenos Aires antes de llegar al centro de ski. Te lo entregamos en tu alojamiento. Arrancás a esquiar desde el primer momento.",
      bullets: [
        "Ahorrás tiempo y dinero",
        "Sin colas en el centro de ski",
        "Sin cupones de tarjeta como garantía",
        "Sin paquetes completos obligatorios",
        "Tarifas de leasing para alquileres frecuentes",
        "Entrega y retiro en tu alojamiento",
      ],
      promoTitle: "Promoción 4×5",
      promoText:
        "Alquilás 4 unidades y la 5ta la tenés de regalo para tu próximo alquiler. Válido en indumentaria, ski/snowboard, náutica y camping.",
      promoLocation: "Solo en sucursal Martínez · La Paz 830",
      promoButton: "Reservar Fastrack por WhatsApp",
    },
    policies: [
      { icon: "📅", title: "Coordiná tu turno", description: "Reservá con turno asignado para retirar sin esperas. No atendemos sin cita durante temporada alta." },
      { icon: "💳", title: "Formas de pago", description: "Efectivo o transferencia bancaria. 20% de descuento pagando en efectivo con 30 días de anticipación." },
      { icon: "📦", title: "Equipo nuevo", description: "Disponible a un costo adicional. Consultá disponibilidad de modelos nuevos de temporada." },
      { icon: "🔄", title: "Cambios incluidos", description: "Podés cambiar talla o equipo durante el período de alquiler sin cargo adicional." },
      { icon: "🏦", title: "Depósito de garantía", description: "Se registra como crédito para futuras compras o alquileres en la tienda." },
      { icon: "🚐", title: "Envío a destino", description: "Entregamos kayaks, carpas y equipos de gran tamaño en el destino. Consultá cobertura y costo." },
    ],
    steps: [
      { title: "Consultá", description: "Escribinos por WhatsApp con los equipos que necesitás, fechas y destino." },
      { title: "Reservá con turno", description: "Te asignamos un turno para retirar sin esperas. Pagás en efectivo o transferencia." },
      { title: "Disfrutá", description: "Retirás en sucursal o te llevamos el equipo al destino. Cambios ilimitados incluidos." },
    ],
    advantages: ventajas,
    cta: {
      title: "¿Listo para salir?",
      text: "Consultá disponibilidad y precio final por WhatsApp. Te respondemos en minutos.",
    },
  },

  // app/alquilar/catalogo/page.tsx
  catalogo: {
    hero: {
      eyebrow: "ECOrental",
      title: "Catálogo completo",
      titleAccent: "de alquiler",
      description: "Indumentaria de nieve, ski, snowboard, camping y náutica. Todo listo para tu próxima aventura.",
    },
    cta: {
      eyebrow: "¿No encontrás lo que buscás?",
      title: "Escribinos por WhatsApp",
      text: "Nuestro equipo te ayuda a armar el kit ideal para tu actividad.",
    },
  },

  // app/taller/page.tsx
  taller: {
    hero: {
      eyebrow: "Taller ECO",
      title: "Más de 60 años",
      titleAccent: "reparando aventuras",
      description:
        "El taller especializado en equipos outdoor más completo de Argentina. Carpas, bolsas de dormir, mochilas, calzado, esquís y más.",
      image: null, // se completa con /images/hero/taller.jpg durante la importación
      ctaLabel: "Pedir turno",
    },
    info: [
      { label: "Dirección", value: "La Paz 830, Martínez, Buenos Aires" },
      { label: "Recepción", value: "Lun–Vie 11–18hs · Sáb con turno previo" },
      { label: "Entrega", value: "Consultar tiempo según trabajo" },
    ],
    conditions: [
      { title: "20% OFF", description: "Pagando en efectivo del 1 Nov al 30 Abr. Sé previsor y ahorrá." },
      { title: "Servicio Express", description: "+75% de recargo. Para cuando lo necesitás urgente y pagás en efectivo." },
      { title: "Guardería", description: "Pasados los 15 días del trabajo terminado, se cobra guardado." },
    ],
    services: {
      eyebrow: "Lo que reparamos",
      title: "Servicios del",
      titleAccent: "taller",
      description: "Si tu equipo outdoor tiene vida útil, lo reparamos. Consultanos.",
    },
    rates: {
      eyebrow: "Tarifario orientativo",
      title: "Precios de",
      titleAccent: "referencia",
      description: "Los precios finales dependen del trabajo específico. Pedí tu presupuesto sin cargo.",
      footnote: "* Precios orientativos en pesos argentinos. Confirmá precio final antes de autorizar el trabajo.",
    },
    banner: {
      title: "Pedí tu presupuesto sin cargo",
      text: "Describinos el trabajo y te respondemos con tiempo estimado y precio.",
      button: "Pedir turno en el taller",
    },
  },

  // app/nosotros/page.tsx
  nosotros: {
    hero: {
      eyebrow: "Desde 1965",
      title: "Somos el outdoor",
      titleAccent: "de Argentina",
      description:
        "Eurocamping nació en 1965 como una pequeña tienda de equipamiento outdoor en Buenos Aires. Hoy somos la referencia del outdoor argentino: tienda, rental, taller y comunidad en un solo lugar.",
    },
    history: {
      eyebrow: "Nuestra historia",
      title: "60 años en",
      titleAccent: "la naturaleza",
      description: "",
      paragraphs: [
        "Empezamos en 1965 como una tienda especializada en equipamiento de montaña y camping. Con los años nos convertimos en el punto de referencia para toda la comunidad outdoor argentina.",
        "Hoy combinamos la experiencia de seis décadas con un modelo de negocio integral: venta de productos nuevos y usados, alquiler de equipos para todas las disciplinas, taller de reparaciones especializado y contenido editorial de calidad.",
        "Nuestro equipo está formado por personas apasionadas por el outdoor que practican lo que venden. Cada consejo viene de la experiencia real.",
      ],
    },
    stats: [
      { value: "60+", label: "Años de historia" },
      { value: "748+", label: "Productos en catálogo" },
      { value: "7", label: "Sucursales en Argentina" },
      { value: "100%", label: "Pasión outdoor" },
    ],
    branches: { eyebrow: "Dónde encontrarnos", title: "Sucursales en", titleAccent: "todo el país", description: "" },
    brands: {
      eyebrow: "Marcas representadas",
      title: "Las mejores marcas,",
      titleAccent: "todas acá",
      description: "Trabajamos con las marcas más reconocidas del outdoor mundial.",
    },
  },

  // app/sucursales/page.tsx
  sucursales: {
    hero: {
      eyebrow: "Dónde encontrarnos",
      title: "Sucursales en",
      titleAccent: "todo el país",
      description:
        "Estamos en Buenos Aires, Córdoba, Mendoza, Neuquén, Río Negro, Salta y Tierra del Fuego. Siempre cerca de tu próxima aventura.",
    },
    yearsStat: "60+",
    regionOrder: ["Buenos Aires", "Córdoba", "Mendoza", "Neuquén", "Río Negro", "Salta", "Tierra del Fuego"],
    cta: {
      title: "¿No encontrás la info que buscás?",
      text: "Escribinos por WhatsApp y te decimos dónde y cómo atenderte.",
    },
  },

  // app/contenido/page.tsx
  contenido: {
    hero: {
      eyebrow: "",
      title: "Trips, tips y",
      titleAccent: "aventuras reales",
      description: "Historias de personas reales en la naturaleza. Sin filtros, sin estudios.",
    },
    trips: {
      eyebrow: "ECOtrips",
      title: "Aventuras para",
      titleAccent: "inspirarse",
      description: "Rutas, logística y lo que necesitás saber para tu próxima expedición.",
    },
    tips: {
      eyebrow: "ECOtips",
      title: "Consejos para",
      titleAccent: "equiparte mejor",
      description: "Guías prácticas escritas por personas que usan el equipo en campo real.",
    },
  },

  // app/comprar/usados/page.tsx
  usados: {
    hero: {
      eyebrow: "Revisados ECO",
      title: "La mitad del precio,",
      titleAccent: "el doble de confianza.",
      description:
        "Cada equipo pasa por nuestro taller antes de la venta. Revisamos, reparamos y certificamos que está en perfectas condiciones.",
    },
    steps: [
      { title: "Recepción", description: "Recibimos el equipo y hacemos un diagnóstico inicial." },
      { title: "Revisión y reparación", description: "Nuestro taller revisa cada componente y repara lo necesario." },
      { title: "Certificado ECO", description: 'El equipo recibe el sello "Revisado ECO" y está listo para venta.' },
    ],
    banner: {
      title: "¿Querés vender tu equipo?",
      text: "También compramos equipos usados en buen estado. Consultanos.",
      button: "Consultar por usados",
    },
  },
};

// app/taller/page.tsx — servicios y tarifario orientativo
export const workshopCategories = [
  { category: "Carpas y Tiendas", icon: "🏕", items: ["Reparación de costuras y seams", "Cambio de cremalleras (zippers)", "Impermeabilización de telas", "Reparación de varillas y arcos", "Parches en tela y malla", "Cambio de tirantes y tensores"] },
  { category: "Bolsas de Dormir", icon: "🛏", items: ["Lavado y secado especializado", "Reparación de relleno (plumón/fibra)", "Cambio de cremalleras", "Parches en tela exterior", "Restauración de capucha"] },
  { category: "Mochilas y Bolsos", icon: "🎒", items: ["Cambio de cremalleras y tiradores", "Reparación de sistema de suspensión", "Costura de correas y refuerzos", "Cambio de hebillas y ajustadores", "Impermeabilización"] },
  { category: "Calzado Outdoor", icon: "👟", items: ["Reenmantequillado (re-soling) de botas", "Reparación de puntera y talón", "Cambio de cordones especiales", "Impermeabilización de cuero y tela", "Reparación de cierre de botas de ski"] },
  { category: "Ski & Snowboard", icon: "🎿", items: ["Afilado de cantos (stone grinding)", "Encerado y preparación de base", "Reparación de base (P-tex)", "Ajuste y montaje de fijaciones", "Reparación de botas de ski", "Revisión pre-temporada completa"] },
  { category: "Indumentaria Técnica", icon: "🧥", items: ["Reparación de costuras técnicas", "Cambio de cremalleras impermeables", "Restauración de DWR (impermeabilización)", "Parches en membrana Gore-Tex y similares", "Reparación de velcros y corchetes"] },
];

export const workshopRates = {
  invierno: [
    { name: "Afilado de cantos + encerado", price: "Desde $8.000" },
    { name: "Reparación de base (P-tex por cm²)", price: "Desde $500/cm²" },
    { name: "Montaje de fijaciones", price: "Desde $5.000" },
    { name: "Service completo ski", price: "Desde $15.000" },
    { name: "Reparación bota de ski", price: "Consultar" },
    { name: "Revisión pre-temporada", price: "Desde $12.000" },
  ],
  verano: [
    { name: "Reparación de carpa (por costura)", price: "Desde $3.000" },
    { name: "Cambio de cremallera (carpa/mochila)", price: "Desde $6.000" },
    { name: "Impermeabilización de prenda", price: "Desde $5.000" },
    { name: "Re-soling de bota", price: "Desde $18.000" },
    { name: "Lavado bolsa de dormir", price: "Desde $4.000" },
    { name: "Reparación mochila completa", price: "Desde $8.000" },
  ],
};

// app/contenido/[slug]/page.tsx — texto provisional que se mostraba como cuerpo.
export function placeholderBody(title: string) {
  return (
    `<p>Este artículo está en preparación. Pronto tendremos el contenido completo de ${title}.</p>` +
    `<p>Mientras tanto, podés escribirnos por WhatsApp para más información sobre esta aventura o consultar nuestro equipo de expertos.</p>`
  );
}

// app/alquilar/page.tsx — secciones del tarifario
export const rentalSections = [
  { slug: "indumentaria", navLabel: "Indumentaria & Accesorios", icon: "🧥", title: "Indumentaria", titleAccent: "& Accesorios", description: "Equipos y prendas para nieve, trekking y actividades de montaña.", periods: ["day", "weekend", "four_days", "week", "fortnight"], footnote: null, showResorts: false },
  { slug: "ski-snowboard", navLabel: "Ski & Snowboard", icon: "🎿", title: "Ski", titleAccent: "& Snowboard", description: "Tablas, botas, cascos y equipos completos para todos los niveles.", periods: ["day", "three_days", "four_days", "week"], footnote: null, showResorts: true },
  { slug: "camping", navLabel: "Camping", icon: "🏕", title: "Camping", titleAccent: "& Trekking", description: "Carpas, bolsas de dormir, mochilas y accesorios para salir al campo.", periods: ["day", "weekend", "four_days", "week", "fortnight"], footnote: null, showResorts: false },
  { slug: "nautica", navLabel: "Náutica", icon: "🚣", title: "Náutica", titleAccent: "& Paddle", description: "Kayaks, SUP, surf, packrafts y equipamiento acuático completo.", periods: ["day", "weekend", "four_days", "week", "fortnight"], footnote: "* El traslado de kayaks y carpas de gran tamaño tiene costo adicional. Consultá por envío a destino.", showResorts: false },
] as const;
