export type ProductType = "nuevo" | "usado" | "rental";

export interface ImageRef {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  type: ProductType;
  /** Precio ya formateado ("Desde $18.000 / día"); null = consultar. */
  price: string | null;
  image: ImageRef | null;
  tags: string[];
  badge?: string;
  description?: string;
  specLine?: string;
  availability: "available" | "unavailable" | "consult";
  externalLink?: string;
  externalLabel?: string;
  waLink: string;
}

export interface Post {
  slug: string;
  category: "ECOtrip" | "ECOtip";
  title: string;
  excerpt: string;
  image: ImageRef | null;
  readTime: string;
  date: string;
}

export interface PostDetail extends Post {
  bodyHtml: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface Sucursal {
  id: string;
  name: string;
  city: string;
  region: string;
  address?: string;
  phones: string[];
  whatsapp?: string;
  hours?: string;
  maps?: string;
  rental: boolean;
  services: string[];
  seasonal?: string;
  note?: string;
}
