export type ProductType = "nuevo" | "usado" | "rental";

export interface Product {
  id: string;
  title: string;
  type: ProductType;
  price: string | null;
  image: string;
  activities: string[];
  badge?: string;
  whatsappContext?: string;
  externalLink?: string;
  description?: string;
}

export interface Post {
  slug: string;
  category: "ECOtrip" | "ECOtip";
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  date: string;
}

export interface Sucursal {
  name: string;
  city: string;
  address?: string;
  phone: string;
  hours?: string;
}

export interface RentalItem {
  category: string;
  items: {
    name: string;
    pricePerDay?: string;
    pricePerWeekend?: string;
    note?: string;
  }[];
}

export interface TallerService {
  name: string;
  description: string;
  icon: string;
  price?: string;
}
