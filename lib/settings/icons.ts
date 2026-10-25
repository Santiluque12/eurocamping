/** Íconos permitidos (lista cerrada). Las claves son nombres de lucide-react. */
export const NEED_ICONS = {
  Tent: "Carpa",
  Wrench: "Herramienta",
  ShoppingBag: "Bolsa de compras",
  Package: "Paquete",
  Backpack: "Mochila",
  Mountain: "Montaña",
  Snowflake: "Nieve",
  Waves: "Agua",
  Sailboat: "Velero",
  Compass: "Brújula",
  MapPin: "Ubicación",
  MessageCircle: "Mensaje",
} as const;

export type NeedIcon = keyof typeof NEED_ICONS;

/** Emojis permitidos para tarjetas de servicios, políticas y tarifario. */
export const EMOJI_ICONS = [
  "🏕", "🛏", "🎒", "👟", "🎿", "🏂", "🧥", "❄️", "☀️", "🚣", "🏄", "⛵", "🧗",
  "🥾", "🔧", "🛠", "📅", "💳", "📦", "🔄", "🏦", "🚐", "📍", "⏱", "✅", "⭐",
] as const;
