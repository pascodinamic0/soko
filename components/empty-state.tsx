import Link from "next/link";

export function EmptyState({
  title,
  body,
  actionLabel,
  actionHref,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-[var(--soko-radius-md)] bg-soko-sand/70 px-4 py-10 text-center">
      <p className="font-[family-name:var(--soko-font-display)] text-lg font-semibold text-soko-ink">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-soko-ink-muted">{body}</p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-[var(--soko-radius-md)] bg-soko-forest px-5 text-sm font-semibold text-soko-white"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
