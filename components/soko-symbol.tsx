/** Marketplace canopy symbol — three arches, subtle S curve (BRAND.md) */
export function SokoSymbol({
  className = "h-9 w-9",
  variant = "color",
}: {
  className?: string;
  variant?: "color" | "reverse" | "mono";
}) {
  const arch =
    variant === "reverse" ? "#FFFFFF" : variant === "mono" ? "#0F3D2E" : "#E8A317";
  const fill =
    variant === "reverse" ? "#E8A317" : variant === "mono" ? "#0F3D2E" : "#0F3D2E";

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="48" height="48" rx="12" fill={fill} />
      <path
        d="M10 32V20c0-4 3-7 7-7 2.5 0 4.5 1.2 6 3 1.5-1.8 3.5-3 6-3 4 0 7 3 7 7v12"
        stroke={arch}
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 32h28"
        stroke={arch}
        strokeWidth="3.25"
        strokeLinecap="round"
      />
      <circle cx="24" cy="22" r="2.5" fill={arch} />
    </svg>
  );
}
