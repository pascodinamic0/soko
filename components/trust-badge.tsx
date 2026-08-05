export function TrustBadge({
  label = "Vérifié Soko",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-soko-forest px-2 py-0.5 text-[11px] font-semibold text-soko-amber ${className}`}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
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
      {label}
    </span>
  );
}
