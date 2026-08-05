import { ListingFiltersBar } from "@/components/listing-filters";
import { ListingGrid } from "@/components/listing-grid";
import { SearchForm } from "@/components/search-form";
import {
  filterBlockedListings,
  getBlockedUserIds,
  getListings,
  getLocations,
} from "@/lib/listings/queries";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

type SearchParams = Promise<{
  q?: string;
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
  const filters = {
    q: params.q,
    locationSlug: params.location,
    minPrice: params.min ? Number(params.min) : undefined,
    maxPrice: params.max ? Number(params.max) : undefined,
    verifiedOnly: params.verified === "1",
    sort: (params.sort as "recent" | "price_asc" | "price_desc") ?? "recent",
  };

  let listings = await getListings(filters);
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
      <ListingFiltersBar locations={locations} params={params} />
      <div className="mt-4">
        <ListingGrid listings={listings} />
      </div>
    </div>
  );
}
