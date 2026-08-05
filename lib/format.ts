import type { CurrencyCode, VerificationLevel } from "@/lib/supabase/database.types";

export { formatLocation } from "@/lib/locations/display";

export function formatPrice(price: number, currency: CurrencyCode): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  }

  return new Intl.NumberFormat("fr-CD", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(price) + " CDF";
}

export function verificationLabel(level: VerificationLevel): string {
  switch (level) {
    case "verified":
      return "Vérifié Soko";
    case "id_pending":
      return "Identité en cours de vérification";
    case "phone":
      return "Téléphone vérifié";
    default:
      return "Non vérifié";
  }
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `Il y a ${Math.max(1, minutes)} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days} j`;
}
