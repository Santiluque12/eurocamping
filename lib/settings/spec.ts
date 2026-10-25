/**
 * Definición de los campos editables de cada página / configuración general.
 *
 * Una única definición sirve para:
 *  - validar en el servidor (settingsSchema → zod),
 *  - dibujar el formulario del administrador (SettingsForm),
 *  - tipar los datos que leen las páginas públicas (SettingsValue<K>).
 *
 * No es un constructor de páginas: cada clave corresponde a una sección que
 * ya existe en el sitio y sus campos son fijos.
 */
import { z } from "zod";
import { EMOJI_ICONS, NEED_ICONS } from "./icons";

type Base = { label: string; help?: string; required?: boolean };

export type Field =
  | (Base & { kind: "text"; max?: number })
  | (Base & { kind: "textarea"; max?: number })
  | (Base & { kind: "link" })
  | (Base & { kind: "whatsapp" })
  | (Base & { kind: "email" })
  | (Base & { kind: "image" })
  | (Base & { kind: "list"; itemLabel?: string })
  | (Base & { kind: "icon"; set: "need" | "emoji" })
  | (Base & { kind: "group"; fields: Fields })
  | (Base & { kind: "repeater"; itemLabel: string; fields: Fields; max?: number });

export type Fields = { readonly [key: string]: Field };

type InferField<F> = F extends { kind: "group"; fields: infer G }
  ? InferFields<G>
  : F extends { kind: "repeater"; fields: infer G }
    ? InferFields<G>[]
    : F extends { kind: "list" }
      ? string[]
      : F extends { kind: "image" }
        ? string | null
        : string;

export type InferFields<G> = { -readonly [K in keyof G]: InferField<G[K]> };

// ─── Bloques reutilizables ──────────────────────────────────────────────────
const heroText = {
  eyebrow: { kind: "text", label: "Texto superior (pequeño)", max: 80 },
  title: { kind: "text", label: "Título", required: true, max: 120 },
  titleAccent: { kind: "text", label: "Título – parte destacada en naranja", max: 120 },
  description: { kind: "textarea", label: "Bajada", max: 400 },
} as const satisfies Fields;

const sectionHeader = {
  eyebrow: { kind: "text", label: "Texto superior (pequeño)", max: 80 },
  title: { kind: "text", label: "Título", required: true, max: 120 },
  titleAccent: { kind: "text", label: "Título – parte destacada", max: 120 },
  description: { kind: "textarea", label: "Descripción", max: 400 },
} as const satisfies Fields;

const ctaBlock = {
  title: { kind: "text", label: "Título", required: true, max: 120 },
  text: { kind: "textarea", label: "Texto", max: 300 },
} as const satisfies Fields;

const button = {
  label: { kind: "text", label: "Texto del botón", required: true, max: 40 },
  href: { kind: "link", label: "Destino del botón", required: true, help: "Ruta interna (ej. /alquilar) o enlace https://" },
} as const satisfies Fields;

// ─── Secciones ──────────────────────────────────────────────────────────────
export const SETTINGS_SPEC = {
  general: {
    title: "Contacto, WhatsApp y pie de página",
    description: "Datos que se usan en todo el sitio.",
    fields: {
      whatsapp: {
        kind: "group",
        label: "Números de WhatsApp por sección",
        help: "Sólo números, con código de país y área, sin + ni espacios. Ej: 5491162237233",
        fields: {
          general: { kind: "whatsapp", label: "General (menú, botón flotante, banners)", required: true },
          rental: { kind: "whatsapp", label: "Alquileres", required: true },
          taller: { kind: "whatsapp", label: "Taller", required: true },
          usados: { kind: "whatsapp", label: "Usados", required: true },
        },
      },
      whatsappMessages: {
        kind: "group",
        label: "Mensajes predeterminados de WhatsApp",
        help: "Texto con el que se abre la conversación.",
        fields: {
          general: { kind: "text", label: "General", required: true, max: 200 },
          rental: { kind: "text", label: "Alquileres", required: true, max: 200 },
          taller: { kind: "text", label: "Taller", required: true, max: 200 },
          usados: { kind: "text", label: "Usados", required: true, max: 200 },
          product: { kind: "text", label: "Consulta por un producto", required: true, max: 200, help: "Se agrega el nombre del producto al final." },
          rentalItem: { kind: "text", label: "Consulta por un equipo de alquiler", required: true, max: 200, help: "Se agrega el nombre del equipo al final." },
        },
      },
      contact: {
        kind: "group",
        label: "Contacto",
        fields: {
          email: { kind: "email", label: "Email de contacto" },
          hours: { kind: "text", label: "Horario de respuesta (banner de WhatsApp)", max: 120 },
          bannerTitle: { kind: "text", label: "Título del banner de WhatsApp", max: 80 },
          bannerButton: { kind: "text", label: "Texto del botón del banner", max: 40 },
        },
      },
      social: {
        kind: "group",
        label: "Redes sociales",
        help: "Dejá vacío para ocultar el ícono.",
        fields: {
          instagram: { kind: "link", label: "Instagram" },
          facebook: { kind: "link", label: "Facebook" },
          youtube: { kind: "link", label: "YouTube" },
        },
      },
      footer: {
        kind: "group",
        label: "Pie de página",
        fields: {
          tagline: { kind: "textarea", label: "Frase institucional", max: 200 },
          location: { kind: "text", label: "Ubicación (abajo a la derecha)", max: 80 },
        },
      },
    },
  },

  home: {
    title: "Inicio",
    description: "Textos, imagen y botones de la página principal.",
    fields: {
      hero: {
        kind: "group",
        label: "Portada",
        fields: {
          ...heroText,
          image: { kind: "image", label: "Imagen de fondo", help: "Opcional. Se muestra oscurecida detrás del texto." },
          primaryCta: { kind: "group", label: "Botón principal", fields: button },
        },
      },
      needs: {
        kind: "group",
        label: "Bloque “¿Qué buscás?”",
        fields: {
          ...sectionHeader,
          cards: {
            kind: "repeater",
            label: "Tarjetas",
            itemLabel: "Tarjeta",
            max: 4,
            fields: {
              icon: { kind: "icon", set: "need", label: "Ícono", required: true },
              title: { kind: "text", label: "Título", required: true, max: 60 },
              description: { kind: "textarea", label: "Descripción", max: 200 },
              href: { kind: "link", label: "Destino", required: true },
            },
          },
        },
      },
      products: {
        kind: "group",
        label: "Bloque de productos destacados",
        help: "Los productos se eligen marcando “Destacado” en cada producto.",
        fields: sectionHeader,
      },
      rentalCard: {
        kind: "group",
        label: "Tarjeta ECOrental",
        fields: {
          ...sectionHeader,
          bullets: { kind: "list", label: "Beneficios", itemLabel: "Beneficio" },
          ctaLabel: { kind: "text", label: "Texto del botón", required: true, max: 40 },
        },
      },
      tallerCard: {
        kind: "group",
        label: "Tarjeta Taller",
        fields: {
          ...sectionHeader,
          bullets: { kind: "list", label: "Beneficios", itemLabel: "Beneficio" },
          ctaLabel: { kind: "text", label: "Texto del botón", required: true, max: 40 },
        },
      },
      content: {
        kind: "group",
        label: "Bloque de ECOtrips y ECOtips",
        help: "Las publicaciones se eligen marcando “Destacada” en cada publicación.",
        fields: sectionHeader,
      },
    },
  },

  alquilar: {
    title: "Alquilar (tarifario)",
    description: "Textos de la página /alquilar. Los precios se editan en “Tarifario”.",
    fields: {
      hero: {
        kind: "group",
        label: "Portada",
        fields: { ...heroText, image: { kind: "image", label: "Imagen de fondo" } },
      },
      priceNote: { kind: "textarea", label: "Aviso sobre precios (debajo del menú)", max: 400, help: "Escribí **entre dobles asteriscos** lo que quieras resaltar en negrita." },
      resorts: {
        kind: "group",
        label: "Tarifas por centro de ski",
        fields: {
          title: { kind: "text", label: "Título", max: 80 },
          text: { kind: "textarea", label: "Texto", max: 300 },
          items: { kind: "list", label: "Centros de ski", itemLabel: "Centro" },
        },
      },
      fastrack: {
        kind: "group",
        label: "Sistema Fastrack",
        fields: {
          ...sectionHeader,
          bullets: { kind: "list", label: "Beneficios", itemLabel: "Beneficio" },
          promoTitle: { kind: "text", label: "Promoción – título", max: 80 },
          promoText: { kind: "textarea", label: "Promoción – texto", max: 300 },
          promoLocation: { kind: "text", label: "Promoción – dónde aplica", max: 120 },
          promoButton: { kind: "text", label: "Promoción – texto del botón", max: 60 },
        },
      },
      policies: {
        kind: "repeater",
        label: "Información importante",
        itemLabel: "Tarjeta",
        max: 9,
        fields: {
          icon: { kind: "icon", set: "emoji", label: "Ícono" },
          title: { kind: "text", label: "Título", required: true, max: 60 },
          description: { kind: "textarea", label: "Descripción", max: 300 },
        },
      },
      steps: {
        kind: "repeater",
        label: "Cómo funciona el alquiler",
        itemLabel: "Paso",
        max: 4,
        fields: {
          title: { kind: "text", label: "Título", required: true, max: 60 },
          description: { kind: "textarea", label: "Descripción", max: 300 },
        },
      },
      advantages: { kind: "list", label: "Ventajas de ECOrental", itemLabel: "Ventaja" },
      cta: { kind: "group", label: "Llamado final", fields: ctaBlock },
    },
  },

  catalogo: {
    title: "Catálogo de alquiler",
    description: "Textos de /alquilar/catalogo. Los equipos se editan en “Productos”.",
    fields: {
      hero: { kind: "group", label: "Portada", fields: heroText },
      cta: {
        kind: "group",
        label: "Llamado final",
        fields: { eyebrow: { kind: "text", label: "Texto superior", max: 80 }, ...ctaBlock },
      },
    },
  },

  taller: {
    title: "Taller",
    description: "Textos de /taller. Los servicios y precios se editan en “Taller”.",
    fields: {
      hero: {
        kind: "group",
        label: "Portada",
        fields: { ...heroText, image: { kind: "image", label: "Imagen de fondo" }, ctaLabel: { kind: "text", label: "Texto del botón", max: 40 } },
      },
      info: {
        kind: "repeater",
        label: "Datos del taller (debajo del título)",
        itemLabel: "Dato",
        max: 4,
        fields: {
          label: { kind: "text", label: "Etiqueta", required: true, max: 40 },
          value: { kind: "text", label: "Valor", required: true, max: 120 },
        },
      },
      conditions: {
        kind: "repeater",
        label: "Descuentos y condiciones",
        itemLabel: "Condición",
        max: 6,
        fields: {
          title: { kind: "text", label: "Título", required: true, max: 60 },
          description: { kind: "textarea", label: "Descripción", max: 300 },
        },
      },
      services: { kind: "group", label: "Encabezado de servicios", fields: sectionHeader },
      rates: {
        kind: "group",
        label: "Encabezado del tarifario",
        fields: { ...sectionHeader, footnote: { kind: "textarea", label: "Nota al pie", max: 300 } },
      },
      banner: { kind: "group", label: "Banner final de WhatsApp", fields: { ...ctaBlock, button: { kind: "text", label: "Texto del botón", max: 40 } } },
    },
  },

  nosotros: {
    title: "Nosotros",
    description: "Historia, cifras y textos institucionales.",
    fields: {
      hero: { kind: "group", label: "Portada", fields: heroText },
      history: {
        kind: "group",
        label: "Nuestra historia",
        fields: {
          ...sectionHeader,
          paragraphs: { kind: "list", label: "Párrafos", itemLabel: "Párrafo" },
        },
      },
      stats: {
        kind: "repeater",
        label: "Cifras",
        itemLabel: "Cifra",
        max: 4,
        fields: {
          value: { kind: "text", label: "Número", required: true, max: 12 },
          label: { kind: "text", label: "Descripción", required: true, max: 40 },
        },
      },
      branches: { kind: "group", label: "Encabezado de sucursales", fields: sectionHeader },
      brands: { kind: "group", label: "Encabezado de marcas", fields: sectionHeader },
    },
  },

  sucursales: {
    title: "Sucursales",
    description: "Textos de /sucursales. Las sucursales se editan en “Sucursales”.",
    fields: {
      hero: { kind: "group", label: "Portada", fields: heroText },
      yearsStat: { kind: "text", label: "Cifra de años en el mercado", max: 12, help: "La cantidad de sucursales y provincias se calcula sola." },
      regionOrder: { kind: "list", label: "Orden de provincias/regiones", itemLabel: "Región", help: "Las regiones que no estén en la lista se muestran al final." },
      cta: { kind: "group", label: "Llamado final", fields: ctaBlock },
    },
  },

  contenido: {
    title: "ECOtrips y ECOtips",
    description: "Textos de la página /contenido.",
    fields: {
      hero: { kind: "group", label: "Portada", fields: heroText },
      trips: { kind: "group", label: "Encabezado ECOtrips", fields: sectionHeader },
      tips: { kind: "group", label: "Encabezado ECOtips", fields: sectionHeader },
    },
  },

  usados: {
    title: "Usados (sección Comprar)",
    description: "Textos de /comprar/usados. La sección Comprar está oculta del menú.",
    fields: {
      hero: { kind: "group", label: "Portada", fields: heroText },
      steps: {
        kind: "repeater",
        label: "Proceso de revisión",
        itemLabel: "Paso",
        max: 4,
        fields: {
          title: { kind: "text", label: "Título", required: true, max: 60 },
          description: { kind: "textarea", label: "Descripción", max: 300 },
        },
      },
      banner: { kind: "group", label: "Banner final", fields: { ...ctaBlock, button: { kind: "text", label: "Texto del botón", max: 40 } } },
    },
  },
} as const satisfies Record<string, { title: string; description: string; fields: Fields }>;

export type SettingsKey = keyof typeof SETTINGS_SPEC;
export const SETTINGS_KEYS = Object.keys(SETTINGS_SPEC) as SettingsKey[];
export type SettingsValue<K extends SettingsKey> = InferFields<(typeof SETTINGS_SPEC)[K]["fields"]>;

export function isSettingsKey(k: string): k is SettingsKey {
  return k in SETTINGS_SPEC;
}

// ─── Validación ─────────────────────────────────────────────────────────────
const LINK_RE = /^(https?:\/\/[^\s]+|\/[^\s]*)$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function req(s: z.ZodString, f: Base) {
  return f.required ? s.min(1, "Este campo es obligatorio.") : s;
}

function fieldToZod(f: Field): z.ZodType {
  const str = z.string().trim();
  switch (f.kind) {
    case "text":
    case "textarea":
      return req(str.max(f.max ?? 2000, `Máximo ${f.max ?? 2000} caracteres.`), f);
    case "link":
      return req(str, f).refine((v) => v === "" || LINK_RE.test(v), "Usá una ruta que empiece con / o un enlace https://");
    case "whatsapp":
      return req(str, f).refine((v) => v === "" || /^[0-9]{8,15}$/.test(v), "Sólo números (8 a 15 dígitos), sin + ni espacios.");
    case "email":
      return req(str, f).refine((v) => v === "" || z.email().safeParse(v).success, "Email inválido.");
    case "image":
      return z.string().regex(UUID_RE).nullable();
    case "list":
      return z.array(z.string().trim().min(1).max(500)).max(30);
    case "icon": {
      const allowed: readonly string[] = f.set === "need" ? Object.keys(NEED_ICONS) : EMOJI_ICONS;
      return req(str, f).refine((v) => v === "" || allowed.includes(v), "Elegí un ícono de la lista.");
    }
    case "group":
      return fieldsToZod(f.fields);
    case "repeater":
      return z.array(fieldsToZod(f.fields)).max(f.max ?? 30, `Máximo ${f.max ?? 30} elementos.`);
  }
}

function fieldsToZod(fields: Fields) {
  return z.object(Object.fromEntries(Object.entries(fields).map(([k, f]) => [k, fieldToZod(f)])));
}

export function settingsSchema<K extends SettingsKey>(key: K) {
  return fieldsToZod(SETTINGS_SPEC[key].fields) as unknown as z.ZodType<SettingsValue<K>>;
}

/** Valor vacío que respeta la forma (para completar claves nuevas en el formulario). */
export function emptyValue(fields: Fields): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(fields).map(([k, f]) => {
      switch (f.kind) {
        case "group":
          return [k, emptyValue(f.fields)];
        case "repeater":
        case "list":
          return [k, []];
        case "image":
          return [k, null];
        default:
          return [k, ""];
      }
    })
  );
}

/** Recorre el valor y devuelve los ids de imágenes que referencia. */
export function collectImageIds(fields: Fields, value: unknown, out: Set<string> = new Set()) {
  if (!value || typeof value !== "object") return out;
  const v = value as Record<string, unknown>;
  for (const [k, f] of Object.entries(fields)) {
    if (f.kind === "image" && typeof v[k] === "string") out.add(v[k] as string);
    else if (f.kind === "group") collectImageIds(f.fields, v[k], out);
    else if (f.kind === "repeater" && Array.isArray(v[k]))
      for (const item of v[k] as unknown[]) collectImageIds(f.fields, item, out);
  }
  return out;
}
