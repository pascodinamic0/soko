export function TrustBadge({
  label = "Vérifié Soko",
  className = "",
  size = "md",
}: {
  label?: string;
  className?: string;
  /** `sm` for listing cards; `md` for detail / open space */
  size?: "sm" | "md";
}) {
  const shortLabel = label.replace(/\s*Soko\s*$/i, "").trim() || label;

  if (size === "sm") {
    return (
      <span
        className={`inline-flex max-w-full items-center gap-1 rounded-md bg-soko-forest/90 px-1.5 py-1 text-[10px] font-semibold leading-none text-soko-amber shadow-sm backdrop-blur-[2px] ${className}`}
        title={label}
      >
        <VerifiedIcon className="h-3 w-3 shrink-0" />
        <span className="truncate whitespace-nowrap">{shortLabel}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-soko-forest px-2.5 py-1 text-xs font-semibold leading-none text-soko-amber ${className}`}
    >
      <VerifiedIcon className="h-3.5 w-3.5 shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
}

function VerifiedIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="8" cy="8" r="7" fill="currentColor" className="text-soko-amber" />
      <path
        d="M5 8.2 7 10.2 11 5.8"
        fill="none"
        stroke="#0F3D2E"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
