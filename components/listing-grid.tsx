import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { EmptyState } from "@/components/empty-state";
import type { ListingWithRelations } from "@/lib/supabase/database.types";

export function ListingGrid({
  listings,
  showFeaturedStrip = false,
}: {
  listings: ListingWithRelations[];
  showFeaturedStrip?: boolean;
}) {
  if (listings.length === 0) {
    return (
      <EmptyState
        title="Rien pour l'instant"
        body="Explorez d'autres catégories ou publiez la première annonce de votre quartier."
        actionLabel="Explorer le marché"
        actionHref="/recherche"
      />
    );
  }

  const featured = showFeaturedStrip
    ? listings.filter((l) => l.is_featured)
    : [];
  const gridListings =
    showFeaturedStrip && featured.length > 0
      ? listings.filter((l) => !l.is_featured)
      : listings;

  return (
    <div className="space-y-5">
      {featured.length > 0 ? (
        <div className="-mx-4 px-4">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-soko-amber">
            Annonces à la une
          </p>
          <ul className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
            {featured.map((listing) => (
              <li key={`feat-${listing.id}`}>
                <ListingCard listing={listing} variant="featured" />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {gridListings.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {gridListings.map((listing) => (
            <li key={listing.id} className="min-w-0">
              <ListingCard listing={listing} variant="grid" />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function MarketSectionHeader() {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-[family-name:var(--soko-font-display)] text-xl font-semibold text-soko-ink">
          Sur le marché
        </h2>
        <p className="mt-0.5 text-sm text-soko-ink-muted">
          Les dernières annonces à Kinshasa
        </p>
      </div>
      <Link
        href="/recherche"
        className="shrink-0 rounded-full border border-soko-line bg-soko-white px-3 py-1.5 text-xs font-semibold text-soko-forest shadow-sm"
      >
        Voir tout
      </Link>
    </div>
  );
}
