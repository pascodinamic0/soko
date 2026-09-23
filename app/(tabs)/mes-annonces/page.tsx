import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { RequestListingVerification } from "@/components/request-listing-verification";
import { formatPrice } from "@/lib/format";
import { getUserListings } from "@/lib/listings/queries";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const statusLabel: Record<string, string> = {
  draft: "Brouillon",
  active: "Active",
  reserved: "Réservée",
  sold: "Vendue",
  archived: "Archivée",
};

export default async function MesAnnoncesPage() {
  if (!hasSupabaseEnv()) redirect("/menu");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/mes-annonces");

  const listings = await getUserListings(user.id);

  return (
    <div className="px-4 pt-8 pb-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--soko-font-display)] text-2xl font-semibold">
          Mes annonces
        </h1>
        <Link
          href="/publier"
          className="text-sm font-semibold text-soko-forest"
        >
          + Publier
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Aucune annonce"
            body="Publiez votre première annonce sur Zandocod."
            actionLabel="Vendre sur Zandocod"
            actionHref="/publier"
          />
        </div>
      ) : (
        <ul className="mt-6">
          {listings.map((listing) => (
            <li key={listing.id} className="border-b border-soko-line py-4">
              <Link href={`/annonce/${listing.id}`} className="block">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-soko-ink">{listing.title}</p>
                    <p className="mt-1 text-sm tabular-nums text-soko-forest">
                      {formatPrice(Number(listing.price), listing.currency)}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-soko-ink-muted">
                    {statusLabel[listing.status] ?? listing.status}
                  </span>
                </div>
                {listing.status === "active" ? (
                  <RequestListingVerification
                    listingId={listing.id}
                    currentStatus={listing.verification_status}
                  />
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
