import { SokoSymbol } from "@/components/soko-symbol";

export function SokoLogo({
  variant = "primary",
  size = "md",
  showTagline = false,
  iconOnly = false,
  className = "",
}: {
  variant?: "primary" | "reverse" | "mono";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  iconOnly?: boolean;
  className?: string;
}) {
  const symbolVariant =
    variant === "reverse" ? "reverse" : variant === "mono" ? "mono" : "color";

  const sizes = {
    sm: { symbol: "h-7 w-7", word: "text-lg", tag: "text-[10px]" },
    md: { symbol: "h-9 w-9", word: "text-xl", tag: "text-xs" },
    lg: { symbol: "h-12 w-12", word: "text-3xl", tag: "text-sm" },
  }[size];

  const wordColor =
    variant === "reverse"
      ? "text-soko-white"
      : variant === "mono"
        ? "text-soko-forest"
        : "text-soko-forest";

  const tagColor =
    variant === "reverse" ? "text-soko-sand/90" : "text-soko-ink-muted";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <SokoSymbol className={sizes.symbol} variant={symbolVariant} />
      {iconOnly ? null : (
        <div className="min-w-0 leading-none">
          <p
            className={`font-[family-name:var(--soko-font-display)] font-bold tracking-tight ${sizes.word} ${wordColor}`}
          >
            Zandocod
          </p>
          {showTagline ? (
            <p className={`mt-1 font-medium ${sizes.tag} ${tagColor}`}>
              Le marché de confiance
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
