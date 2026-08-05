import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import type { Category, ListingWithRelations } from "@/lib/supabase/database.types";

export function CategoryListingSection({
  category,
  listings,
  previewCount = 6,
}: {
  category: Category;
  listings: ListingWithRelations[];
  previewCount?: number;
}) {
  const preview = listings.slice(0, previewCount);

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h3 className="font-[family-name:var(--soko-font-display)] text-lg font-semibold text-soko-ink">
            {category.name_fr}
          </h3>
          <p className="mt-0.5 text-xs text-soko-ink-muted">
            {listings.length} annonce{listings.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href={`/categorie/${category.slug}`}
          className="shrink-0 rounded-full border border-soko-line bg-soko-white px-3 py-1.5 text-xs font-semibold text-soko-forest shadow-sm"
        >
          Voir tout
        </Link>
      </div>
      <ul className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
        {preview.map((listing) => (
          <li key={listing.id} className="w-[9.5rem] shrink-0 snap-start sm:w-[10.5rem]">
            <ListingCard listing={listing} variant="grid" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CategoryListingSections({
  sections,
}: {
  sections: { category: Category; listings: ListingWithRelations[] }[];
}) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {sections.map(({ category, listings }) => (
        <CategoryListingSection
          key={category.id}
          category={category}
          listings={listings}
        />
      ))}
    </div>
  );
}
