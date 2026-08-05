import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { ListingWithRelations } from "@/lib/supabase/database.types";

export type ListingFilters = {
  q?: string;
  categorySlug?: string;
  locationSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  verifiedOnly?: boolean;
  sort?: "recent" | "price_asc" | "price_desc";
};

const LISTING_SELECT = `
  *,
  category:categories(slug, name_fr),
  location:locations(commune, quartier, slug),
  listing_media(storage_path, is_cover, sort_order),
  seller:profiles!listings_seller_id_fkey(id, display_name, verification_level)
`;

export async function getFeaturedCategories() {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getLocations() {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("locations")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getCategoryBySlug(slug: string) {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  return data;
}

export async function getListings(
  filters: ListingFilters = {},
): Promise<ListingWithRelations[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  let query = supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "active");

  if (filters.categorySlug) {
    const category = await getCategoryBySlug(filters.categorySlug);
    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  if (filters.locationSlug) {
    const { data: location } = await supabase
      .from("locations")
      .select("id")
      .eq("slug", filters.locationSlug)
      .single();
    if (location) {
      query = query.eq("location_id", location.id);
    }
  }

  if (filters.minPrice != null) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters.maxPrice != null) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters.verifiedOnly) {
    query = query.eq("verification_status", "verified");
  }

  if (filters.q?.trim()) {
    const term = filters.q.trim();
    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query
        .order("is_featured", { ascending: false })
        .order("published_at", { ascending: false });
  }

  const { data } = await query.limit(48);
  return (data as ListingWithRelations[]) ?? [];
}

export async function getListingById(id: string): Promise<ListingWithRelations | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("id", id)
    .single();

  return data as ListingWithRelations | null;
}

export async function getUserFavorites(userId: string): Promise<ListingWithRelations[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select(`listing_id, listings(${LISTING_SELECT})`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data
    .map((row) => {
      const listing = (row as { listings: ListingWithRelations | null }).listings;
      return listing?.status === "active" ? listing : null;
    })
    .filter(Boolean) as ListingWithRelations[];
}

export async function getUserListings(userId: string): Promise<ListingWithRelations[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("seller_id", userId)
    .order("updated_at", { ascending: false });

  return (data as ListingWithRelations[]) ?? [];
}

export async function isFavorite(userId: string, listingId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("listing_id")
    .eq("user_id", userId)
    .eq("listing_id", listingId)
    .maybeSingle();

  return !!data;
}

export async function getBlockedUserIds(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blocks")
    .select("blocked_id")
    .eq("blocker_id", userId);

  return data?.map((b) => b.blocked_id) ?? [];
}

export function filterBlockedListings(
  listings: ListingWithRelations[],
  blockedIds: string[],
): ListingWithRelations[] {
  if (blockedIds.length === 0) return listings;
  return listings.filter((l) => !blockedIds.includes(l.seller_id));
}
