import Link from "next/link";
import Image from "next/image";
import { TrustBadge } from "@/components/trust-badge";
import { formatLocation, formatPrice, timeAgo } from "@/lib/format";
import { mediaUrl } from "@/lib/media/url";
import type { ListingWithRelations } from "@/lib/supabase/database.types";

export type ListingCardVariant = "grid" | "featured";

function getCover(listing: ListingWithRelations) {
  return (
    listing.listing_media
      ?.slice()
      .sort(
        (a, b) =>
          Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order,
      )[0]?.storage_path ?? null
  );
}

export function ListingCard({
  listing,
  variant = "grid",
}: {
  listing: ListingWithRelations;
  variant?: ListingCardVariant;
}) {
  const cover = getCover(listing);
  const locationLabel = formatLocation(
    listing.location?.city,
    listing.location?.commune,
    listing.location?.quartier,
  );
  const published = listing.published_at ?? listing.created_at;
  const categoryName = listing.category?.name_fr;

  if (variant === "featured") {
    return (
      <Link
        href={`/annonce/${listing.id}`}
        className="group block w-[17.5rem] shrink-0 snap-start overflow-hidden rounded-[var(--soko-radius-lg)] border border-soko-line/70 bg-soko-white shadow-[var(--soko-shadow)] transition-transform active:scale-[0.98] sm:w-[19rem]"
      >
        <div className="relative aspect-[16/10] bg-soko-sand">
          <ListingImage cover={cover} title={listing.title} sizes="320px" />
          <div className="absolute inset-0 bg-gradient-to-t from-soko-ink/55 via-transparent to-transparent" />
          <span className="absolute left-2.5 top-2.5 rounded-full bg-soko-amber px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-soko-ink">
            À la une
          </span>
          {listing.verification_status === "verified" ? (
            <span className="absolute right-2.5 top-2.5">
              <TrustBadge className="text-[10px] shadow-sm" />
            </span>
          ) : null}
          <p className="absolute bottom-2.5 left-2.5 right-2.5 font-[family-name:var(--soko-font-ui)] text-xl font-bold tabular-nums text-soko-white drop-shadow">
            {formatPrice(Number(listing.price), listing.currency)}
          </p>
        </div>
        <div className="p-3.5">
          <h3 className="line-clamp-2 font-semibold leading-snug text-soko-ink group-hover:text-soko-forest">
            {listing.title}
          </h3>
          <ListingMeta
            location={locationLabel}
            published={published}
            category={categoryName}
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/annonce/${listing.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--soko-radius-lg)] border border-soko-line/70 bg-soko-white shadow-[var(--soko-shadow)] transition-transform active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] bg-soko-sand">
        <ListingImage cover={cover} title={listing.title} sizes="(max-width:768px) 45vw, 220px" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-1 p-2">
          {listing.verification_status === "verified" ? (
            <TrustBadge className="text-[10px] shadow-sm" />
          ) : (
            <span />
          )}
          {listing.negociable ? (
            <span className="rounded-full bg-soko-clay/95 px-2 py-0.5 text-[10px] font-semibold text-soko-white">
              Négociable
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="font-[family-name:var(--soko-font-ui)] text-lg font-bold tabular-nums leading-none text-soko-forest">
          {formatPrice(Number(listing.price), listing.currency)}
        </p>
        <h3 className="mt-2 line-clamp-2 flex-1 text-sm font-semibold leading-snug text-soko-ink group-hover:text-soko-forest">
          {listing.title}
        </h3>
        <ListingMeta
          location={locationLabel}
          published={published}
          category={categoryName}
          className="mt-2.5"
        />
      </div>
    </Link>
  );
}

function ListingImage({
  cover,
  title,
  sizes,
}: {
  cover: string | null;
  title: string;
  sizes: string;
}) {
  if (!cover) {
    return (
      <div className="flex h-full items-center justify-center bg-soko-sand text-xs font-medium text-soko-ink-muted">
        Soko
      </div>
    );
  }

  return (
    <Image
      src={mediaUrl(cover)}
      alt={title}
      fill
      className="object-cover transition duration-300 group-hover:scale-[1.03]"
      sizes={sizes}
      unoptimized={cover.startsWith("http")}
    />
  );
}

function ListingMeta({
  location,
  published,
  category,
  className = "",
}: {
  location: string;
  published: string;
  category?: string | null;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center gap-1 text-xs text-soko-ink-muted">
        <PinIcon />
        <span className="truncate">{location}</span>
      </div>
      <div className="flex items-center justify-between gap-2 text-[11px] text-soko-ink-muted">
        {category ? (
          <span className="truncate font-medium text-soko-forest/80">
            {category}
          </span>
        ) : (
          <span />
        )}
        <span className="shrink-0">{timeAgo(published)}</span>
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
