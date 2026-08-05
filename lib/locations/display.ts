import type { Location } from "@/lib/supabase/database.types";

export function formatLocation(
  city: string | null | undefined,
  commune: string | null | undefined,
  quartier: string | null | undefined,
): string {
  if (quartier && commune) {
    const local = `${quartier}, ${commune}`;
    if (city && city !== "Kinshasa") return `${local} · ${city}`;
    return local;
  }

  if (commune) {
    if (city && city !== commune && city !== "Kinshasa") {
      return `${commune}, ${city}`;
    }
    return commune;
  }

  if (city) return city;
  return "RDC";
}

export function formatLocationOption(
  loc: Pick<Location, "city" | "commune" | "quartier"> & { city?: string },
): string {
  if (loc.quartier) return `${loc.quartier}, ${loc.commune}`;
  const city = loc.city ?? "Kinshasa";
  if (city !== loc.commune) return `${loc.commune}, ${city}`;
  return loc.commune;
}

export function groupLocationsByCity(locations: Location[]): Map<string, Location[]> {
  const grouped = new Map<string, Location[]>();

  for (const location of locations) {
    const city = location.city ?? "Kinshasa";
    const list = grouped.get(city) ?? [];
    list.push(location);
    grouped.set(city, list);
  }

  return grouped;
}
