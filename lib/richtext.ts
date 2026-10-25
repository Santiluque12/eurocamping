import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Lista blanca del contenido enriquecido de las publicaciones. Todo lo que no
 * esté acá (scripts, estilos, iframes, atributos on*) se elimina.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "h2", "h3", "strong", "em", "u", "s", "a", "ul", "ol", "li", "blockquote", "br", "hr", "img"],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
  },
  allowedSchemes: ["https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["https"] },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href ?? "";
      const external = /^https:\/\//.test(href);
      const attrs: sanitizeHtml.Attributes = external
        ? { href, target: "_blank", rel: "noopener noreferrer nofollow" }
        : { href };
      return { tagName, attribs: attrs };
    },
  },
  exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
};

export function sanitizeRichText(html: string) {
  return sanitizeHtml(html, OPTIONS).trim();
}

export function plainText(html: string) {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
}

/** Minutos de lectura estimados a 200 palabras por minuto. */
export function readingMinutes(html: string) {
  const words = plainText(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
