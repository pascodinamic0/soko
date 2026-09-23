import type {
  Category,
  ListingWithRelations,
  Location,
  SubcategoryRow,
} from "@/lib/supabase/database.types";

// Minimal Kinshasa-first demo dataset for read-only mode

const categories: Category[] = [
  {
    id: "c-phones",
    slug: "telephones-electronique",
    name_fr: "Téléphones & Électronique",
    icon: "phone",
    sort_order: 1,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "c-vehicles",
    slug: "vehicules-motos",
    name_fr: "Véhicules & Motos",
    icon: "car",
    sort_order: 2,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "c-immo",
    slug: "immobilier",
    name_fr: "Immobilier",
    icon: "home",
    sort_order: 3,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
];

const subcategories: SubcategoryRow[] = [
  { id: "s-smartphones", category_id: "c-phones", slug: "smartphones", name_fr: "Smartphones", sort_order: 1 },
  { id: "s-laptops", category_id: "c-phones", slug: "laptops", name_fr: "Laptops", sort_order: 2 },
  { id: "s-voitures", category_id: "c-vehicles", slug: "voitures", name_fr: "Voitures", sort_order: 1 },
  { id: "s-motos", category_id: "c-vehicles", slug: "motos", name_fr: "Motos", sort_order: 2 },
  { id: "s-location", category_id: "c-immo", slug: "location", name_fr: "Location", sort_order: 1 },
  { id: "s-vente", category_id: "c-immo", slug: "vente", name_fr: "Vente", sort_order: 2 },
];

const locations: Location[] = [
  { id: "l-gombe", city: "Kinshasa", commune: "Gombe", quartier: null, slug: "gombe", sort_order: 1, created_at: new Date().toISOString() },
  { id: "l-ngaliema", city: "Kinshasa", commune: "Ngaliema", quartier: null, slug: "ngaliema", sort_order: 2, created_at: new Date().toISOString() },
  { id: "l-limete", city: "Kinshasa", commune: "Limete", quartier: null, slug: "limete", sort_order: 3, created_at: new Date().toISOString() },
];

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600_000).toISOString();

export const listings: ListingWithRelations[] = [
  {
    id: "d-iphone14",
    seller_id: "demo-seller-1",
    category_id: "c-phones",
    subcategory_id: "s-smartphones",
    location_id: "l-gombe",
    title: "iPhone 14 Pro Max 256 Go",
    description: "État impeccable, batterie 89%. Boîte et chargeur inclus. Remise en main propre à Gombe.",
    price: 650,
    currency: "USD",
    negociable: true,
    status: "active",
    verification_status: "verified",
    is_featured: true,
    created_at: hoursAgo(10),
    updated_at: hoursAgo(10),
    published_at: hoursAgo(2),
    category: { slug: "telephones-electronique", name_fr: "Téléphones & Électronique", sort_order: 1 },
    subcategory: { slug: "smartphones", name_fr: "Smartphones", sort_order: 1 },
    location: { city: "Kinshasa", commune: "Gombe", quartier: null, slug: "gombe" },
    listing_media: [{ storage_path: "https://picsum.photos/seed/zandocod-iphone/800/600", is_cover: true, sort_order: 0 }],
    seller: { id: "demo-seller-1", display_name: "Marie K.", verification_level: "verified" },
  },
  {
    id: "d-rav4",
    seller_id: "demo-seller-2",
    category_id: "c-vehicles",
    subcategory_id: "s-voitures",
    location_id: "l-ngaliema",
    title: "Toyota RAV4 2019",
    description: "Automatique, 78 000 km. Entretien à jour.",
    price: 18500,
    currency: "USD",
    negociable: true,
    status: "active",
    verification_status: "verified",
    is_featured: true,
    created_at: hoursAgo(20),
    updated_at: hoursAgo(20),
    published_at: hoursAgo(3),
    category: { slug: "vehicules-motos", name_fr: "Véhicules & Motos", sort_order: 2 },
    subcategory: { slug: "voitures", name_fr: "Voitures", sort_order: 1 },
    location: { city: "Kinshasa", commune: "Ngaliema", quartier: null, slug: "ngaliema" },
    listing_media: [{ storage_path: "https://picsum.photos/seed/zandocod-rav4/800/600", is_cover: true, sort_order: 0 }],
    seller: { id: "demo-seller-2", display_name: "Jean-Paul M.", verification_level: "phone" },
  },
  {
    id: "d-apt-gombe",
    seller_id: "demo-seller-1",
    category_id: "c-immo",
    subcategory_id: "s-location",
    location_id: "l-gombe",
    title: "Appartement 3 chambres — Gombe",
    description: "Vue ville, sécurité 24h, parking. Loyer mensuel.",
    price: 1200,
    currency: "USD",
    negociable: true,
    status: "active",
    verification_status: "verified",
    is_featured: true,
    created_at: hoursAgo(30),
    updated_at: hoursAgo(30),
    published_at: hoursAgo(4),
    category: { slug: "immobilier", name_fr: "Immobilier", sort_order: 3 },
    subcategory: { slug: "location", name_fr: "Location", sort_order: 1 },
    location: { city: "Kinshasa", commune: "Gombe", quartier: null, slug: "gombe" },
    listing_media: [{ storage_path: "https://picsum.photos/seed/zandocod-apt/800/600", is_cover: true, sort_order: 0 }],
    seller: { id: "demo-seller-1", display_name: "Marie K.", verification_level: "verified" },
  },
  {
    id: "d-galaxy",
    seller_id: "demo-seller-3",
    category_id: "c-phones",
    subcategory_id: "s-smartphones",
    location_id: "l-limete",
    title: "Samsung Galaxy S23 Ultra",
    description: "128 Go, noir. Facture disponible.",
    price: 480,
    currency: "USD",
    negociable: true,
    status: "active",
    verification_status: "unverified",
    is_featured: false,
    created_at: hoursAgo(50),
    updated_at: hoursAgo(50),
    published_at: hoursAgo(5),
    category: { slug: "telephones-electronique", name_fr: "Téléphones & Électronique", sort_order: 1 },
    subcategory: { slug: "smartphones", name_fr: "Smartphones", sort_order: 1 },
    location: { city: "Kinshasa", commune: "Limete", quartier: null, slug: "limete" },
    listing_media: [{ storage_path: "https://picsum.photos/seed/zandocod-galaxy/800/600", is_cover: true, sort_order: 0 }],
    seller: { id: "demo-seller-3", display_name: "Grace T.", verification_level: "id_pending" },
  },
];

export function demoGetCategories(): Category[] {
  return categories;
}

export function demoGetSubcategories(): SubcategoryRow[] {
  return subcategories;
}

export function demoGetLocations(): Location[] {
  return locations.sort((a, b) => a.sort_order - b.sort_order);
}

export function demoGetListings(filters: {
  q?: string;
  categorySlug?: string;
  subcategorySlug?: string;
  locationSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  verifiedOnly?: boolean;
  sort?: "recent" | "price_asc" | "price_desc";
} = {}): ListingWithRelations[] {
  let data = listings.slice();

  if (filters.categorySlug) {
    data = data.filter((l) => l.category?.slug === filters.categorySlug);
  }
  if (filters.subcategorySlug) {
    data = data.filter((l) => l.subcategory?.slug === filters.subcategorySlug);
  }
  if (filters.locationSlug) {
    data = data.filter((l) => l.location?.slug === filters.locationSlug);
  }
  if (filters.minPrice != null) {
    data = data.filter((l) => Number(l.price) >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    data = data.filter((l) => Number(l.price) <= filters.maxPrice!);
  }
  if (filters.verifiedOnly) {
    data = data.filter((l) => l.verification_status === "verified");
  }
  if (filters.q?.trim()) {
    const term = filters.q.trim().toLowerCase();
    data = data.filter(
      (l) =>
        l.title.toLowerCase().includes(term) ||
        (l.description ?? "").toLowerCase().includes(term),
    );
  }

  switch (filters.sort) {
    case "price_asc":
      data.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case "price_desc":
      data.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    default:
      data.sort((a, b) => {
        const at = new Date(a.published_at ?? a.created_at).getTime();
        const bt = new Date(b.published_at ?? b.created_at).getTime();
        return bt - at;
      });
  }

  return data.slice(0, 48);
}

export function demoGetListingById(id: string): ListingWithRelations | null {
  return listings.find((l) => l.id === id) ?? null;
}

