import { redirect } from "next/navigation";
import { ListingGrid } from "@/components/listing-grid";
import { EmptyState } from "@/components/empty-state";
import { getUserFavorites } from "@/lib/listings/queries";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function FavorisPage() {
  if (!hasSupabaseEnv()) {
    return (
      <div className="px-4 pt-8">
        <EmptyState
          title="Favoris"
          body="Connectez Supabase pour enregistrer des annonces."
          actionLabel="Accueil"
          actionHref="/"
        />
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/favoris");
  }

  const listings = await getUserFavorites(user.id);

  return (
    <div className="px-4 pt-8 pb-4">
      <h1 className="font-[family-name:var(--soko-font-display)] text-2xl font-semibold">
        Favoris
      </h1>
      <p className="mt-2 text-sm text-soko-ink-muted">
        Enregistrez des annonces pour les retrouver ici. Aucun numéro de
        téléphone — tout reste dans Zandocod.
      </p>
      <div className="mt-6">
        {listings.length === 0 ? (
          <EmptyState
            title="Aucun favori"
            body="Votre liste est vide. Explorez le marché et enregistrez ce qui vous intéresse."
            actionLabel="Explorer le marché"
            actionHref="/"
          />
        ) : (
          <ListingGrid listings={listings} />
        )}
      </div>
    </div>
  );
}
