import { CategoryGrid } from "@/components/category-grid";
import { ListingGrid, MarketSectionHeader } from "@/components/listing-grid";
import { SearchForm } from "@/components/search-form";
import { SokoLogo } from "@/components/soko-logo";
import { getFeaturedCategories, getListings } from "@/lib/listings/queries";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { filterBlockedListings, getBlockedUserIds } from "@/lib/listings/queries";

export default async function HomePage() {
  const categories = await getFeaturedCategories();
  let listings = await getListings();

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
    <div className="px-4 pt-5">
      <section className="relative overflow-hidden rounded-[var(--soko-radius-lg)] border border-soko-forest-deep/20 bg-soko-forest px-5 py-6 text-soko-white shadow-[var(--soko-shadow)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 88% 12%, rgb(232 163 23 / 40%), transparent 42%), linear-gradient(155deg, rgb(10 42 31 / 30%), transparent 55%)",
          }}
        />
        <div className="relative">
          <SokoLogo variant="reverse" size="lg" showTagline />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-soko-sand">
            Annonces vraies. Personnes vraies. Prix vrais.
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-soko-amber">
            Kinshasa · Marché classifié vérifié
          </p>
          <SearchForm className="mt-5" />
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-[family-name:var(--soko-font-display)] text-xl font-semibold text-soko-ink">
            Catégories
          </h2>
        </div>
        <CategoryGrid categories={categories} />
      </section>

      <section className="mt-8 pb-4">
        <MarketSectionHeader />
        <ListingGrid listings={listings} showFeaturedStrip />
      </section>
    </div>
  );
}
