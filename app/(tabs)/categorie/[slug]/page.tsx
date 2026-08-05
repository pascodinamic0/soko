import { notFound } from "next/navigation";
import { ListingFiltersBar } from "@/components/listing-filters";
import { ListingGrid } from "@/components/listing-grid";
import { CategoryHero } from "@/components/category-hero";
import { SubcategoryTabs } from "@/components/subcategory-tabs";
import { sortListingsByType } from "@/lib/listings/group";
import {
  filterBlockedListings,
  getBlockedUserIds,
  getCategoryBySlug,
  getListings,
  getLocations,
  getSubcategories,
} from "@/lib/listings/queries";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | undefined>>;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const subcategories = await getSubcategories(slug);

  let listings = await getListings({
    categorySlug: slug,
    subcategorySlug: query.type,
    locationSlug: query.location,
    minPrice: query.min ? Number(query.min) : undefined,
    maxPrice: query.max ? Number(query.max) : undefined,
    verifiedOnly: query.verified === "1",
    sort: (query.sort as "recent" | "price_asc" | "price_desc") ?? "recent",
  });

  if ((query.sort ?? "recent") === "recent") {
    listings = sortListingsByType(listings, subcategories);
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
    <div className="px-4 pt-4 pb-4">
      <CategoryHero category={category} />
      <SubcategoryTabs
        categorySlug={slug}
        subcategories={subcategories}
        activeType={query.type}
      />
      <ListingFiltersBar
        locations={locations}
        params={query}
        basePath={`/categorie/${slug}`}
      />
      <div className="mt-4">
        <ListingGrid listings={listings} />
      </div>
    </div>
  );
}
