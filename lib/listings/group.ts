import type { Category, ListingWithRelations } from "@/lib/supabase/database.types";

type SubcategoryRef = {
  id: string;
  category_id: string;
  sort_order: number;
};

function compareListings(a: ListingWithRelations, b: ListingWithRelations): number {
  if (a.is_featured !== b.is_featured) {
    return Number(b.is_featured) - Number(a.is_featured);
  }

  const aDate = new Date(a.published_at ?? a.created_at).getTime();
  const bDate = new Date(b.published_at ?? b.created_at).getTime();
  return bDate - aDate;
}

export function sortListingsByCategoryAndType(
  listings: ListingWithRelations[],
  categories: Category[],
  subcategories: SubcategoryRef[],
): ListingWithRelations[] {
  const categoryOrder = new Map(categories.map((c) => [c.id, c.sort_order]));
  const subcategoryOrder = new Map(subcategories.map((s) => [s.id, s.sort_order]));

  return [...listings].sort((a, b) => {
    const categoryDiff =
      (categoryOrder.get(a.category_id) ?? 999) -
      (categoryOrder.get(b.category_id) ?? 999);
    if (categoryDiff !== 0) return categoryDiff;

    const subDiff =
      (subcategoryOrder.get(a.subcategory_id ?? "") ?? 999) -
      (subcategoryOrder.get(b.subcategory_id ?? "") ?? 999);
    if (subDiff !== 0) return subDiff;

    return compareListings(a, b);
  });
}

export function groupListingsByCategory(
  listings: ListingWithRelations[],
  categories: Category[],
  subcategories: SubcategoryRef[],
): { category: Category; listings: ListingWithRelations[] }[] {
  const sorted = sortListingsByCategoryAndType(listings, categories, subcategories);
  const byCategory = new Map<string, ListingWithRelations[]>();

  for (const listing of sorted) {
    const bucket = byCategory.get(listing.category_id) ?? [];
    bucket.push(listing);
    byCategory.set(listing.category_id, bucket);
  }

  return categories
    .filter((category) => byCategory.has(category.id))
    .map((category) => ({
      category,
      listings: byCategory.get(category.id) ?? [],
    }));
}

export function sortListingsByType(
  listings: ListingWithRelations[],
  subcategories: SubcategoryRef[],
): ListingWithRelations[] {
  const subcategoryOrder = new Map(subcategories.map((s) => [s.id, s.sort_order]));

  return [...listings].sort((a, b) => {
    const subDiff =
      (subcategoryOrder.get(a.subcategory_id ?? "") ?? 999) -
      (subcategoryOrder.get(b.subcategory_id ?? "") ?? 999);
    if (subDiff !== 0) return subDiff;
    return compareListings(a, b);
  });
}
