import { ListingFiltersBar } from "@/components/listing-filters";
import { ListingGrid } from "@/components/listing-grid";
import { SearchForm } from "@/components/search-form";
import { sortListingsByCategoryAndType } from "@/lib/listings/group";
import {
  filterBlockedListings,
  getBlockedUserIds,
  getCategories,
  getListings,
  getLocations,
  getSubcategories,
} from "@/lib/listings/queries";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { redirect } from "next/navigation";

type SearchParams = Promise<{
  q?: string;
  category?: string;
  type?: string;
  location?: string;
  min?: string;
  max?: string;
  verified?: string;
  sort?: string;
}>;

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  if (params.category && !params.q && !params.location && !params.type) {
    redirect(`/categorie/${params.category}`);
  }

  const categories = await getCategories();
  const subcategories = await getSubcategories();
  const filters = {
    q: params.q,
    categorySlug: params.category,
    subcategorySlug: params.type,
    locationSlug: params.location,
    minPrice: params.min ? Number(params.min) : undefined,
    maxPrice: params.max ? Number(params.max) : undefined,
    verifiedOnly: params.verified === "1",
    sort: (params.sort as "recent" | "price_asc" | "price_desc") ?? "recent",
  };

  let listings = await getListings(filters);
  if ((params.sort ?? "recent") === "recent") {
    listings = sortListingsByCategoryAndType(listings, categories, subcategories);
  }

  const locations = await getLocations();

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const blocked = await getBlockedUserIds(user.id);
      listings = filterBlockedListings(listings, blocked);
    }
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="font-[family-name:var(--soko-font-display)] text-2xl font-semibold">
        Recherche
      </h1>
      <SearchForm defaultValue={params.q ?? ""} className="mt-4" />
      <ListingFiltersBar
        locations={locations}
        categories={categories}
        params={params}
      />
      <div className="mt-4">
        <ListingGrid listings={listings} />
      </div>
    </div>
  );
}
