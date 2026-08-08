import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactButton } from "@/components/contact-button";
import { FavoriteButton } from "@/components/favorite-button";
import { ReportBlockActions } from "@/components/report-block-actions";
import { TrustBadge } from "@/components/trust-badge";
import { formatLocation, formatPrice, verificationLabel } from "@/lib/format";
import { getListingById, isFavorite } from "@/lib/listings/queries";
import { mediaUrl } from "@/lib/media/url";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

type Params = Promise<{ id: string }>;

export default async function ListingDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing || listing.status !== "active") {
    notFound();
  }

  let favorited = false;
  let currentUserId: string | null = null;

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    currentUserId = user?.id ?? null;
    if (user) {
      favorited = await isFavorite(user.id, listing.id);
    }
  }

  const images = listing.listing_media
    ?.slice()
    .sort((a, b) => a.sort_order - b.sort_order) ?? [];

  const cover = images[0]?.storage_path;

  return (
    <div className="pb-[calc(var(--soko-action-bar-offset)+5.5rem)]">
      <div className="relative aspect-[4/3] w-full bg-soko-sand">
        {cover ? (
          <Image
            src={mediaUrl(cover)}
            alt={listing.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized={cover.startsWith("http")}
          />
        ) : null}
        <Link
          href="/"
          className="absolute left-4 top-4 rounded-full bg-soko-white/90 px-3 py-1.5 text-sm font-medium text-soko-ink"
        >
          ← Retour
        </Link>
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto px-4 py-3">
          {images.map((img) => (
            <div
              key={img.storage_path}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--soko-radius-sm)]"
            >
              <Image
                src={mediaUrl(img.storage_path)}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
                unoptimized={img.storage_path.startsWith("http")}
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="px-4 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {listing.verification_status === "verified" ? <TrustBadge /> : null}
          {listing.negociable ? (
            <span className="text-xs font-medium text-soko-clay">Négociable</span>
          ) : null}
        </div>

        <h1 className="mt-2 font-[family-name:var(--soko-font-display)] text-2xl font-semibold leading-tight">
          {listing.title}
        </h1>

        <p className="mt-2 font-[family-name:var(--soko-font-ui)] text-2xl font-semibold tabular-nums text-soko-forest">
          {formatPrice(Number(listing.price), listing.currency)}
        </p>

        <p className="mt-1 text-sm text-soko-ink-muted">
          {formatLocation(
            listing.location?.city,
            listing.location?.commune,
            listing.location?.quartier,
          )}
        </p>

        <div className="mt-4 rounded-[var(--soko-radius-md)] bg-soko-surface-warm px-4 py-3">
          <p className="text-sm font-medium text-soko-ink">
            {listing.seller?.display_name ?? "Vendeur Soko"}
          </p>
          <p className="mt-0.5 text-xs text-soko-ink-muted">
            {verificationLabel(listing.seller?.verification_level ?? "none")}
          </p>
          <p className="mt-2 text-xs text-soko-ink-muted">
            Numéro masqué. Discussion dans l&apos;app.
          </p>
        </div>

        <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-soko-ink">
          {listing.description}
        </p>

        {currentUserId !== listing.seller_id ? (
          <ReportBlockActions
            listingId={listing.id}
            reportedUserId={listing.seller_id}
          />
        ) : null}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-[var(--soko-action-bar-offset)] z-50 px-4 pb-2">
        <div className="pointer-events-auto mx-auto flex max-w-lg items-center gap-3 rounded-[var(--soko-radius-lg)] border border-soko-line/80 bg-soko-white/95 p-3 shadow-[0_-8px_28px_rgb(15_61_46_/12%)] backdrop-blur-md md:max-w-3xl">
          <FavoriteButton listingId={listing.id} initialFavorited={favorited} />
          {currentUserId !== listing.seller_id ? (
            <ContactButton listingId={listing.id} sellerId={listing.seller_id} />
          ) : (
            <Link
              href="/mes-annonces"
              className="flex h-12 flex-1 items-center justify-center rounded-[var(--soko-radius-md)] bg-soko-forest font-semibold text-soko-white"
            >
              Mes annonces
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
