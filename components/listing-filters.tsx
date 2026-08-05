"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Location } from "@/lib/supabase/database.types";

export function ListingFiltersBar({
  locations,
  params,
}: {
  locations: Location[];
  params: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/recherche?${next.toString()}`);
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        <select
          value={params.location ?? ""}
          onChange={(e) => update("location", e.target.value)}
          className="rounded-[var(--soko-radius-sm)] border border-soko-line bg-soko-white px-3 py-2 text-sm"
        >
          <option value="">Tous les quartiers</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.slug}>
              {loc.quartier ? `${loc.quartier}, ${loc.commune}` : loc.commune}
            </option>
          ))}
        </select>
        <select
          value={params.sort ?? "recent"}
          onChange={(e) => update("sort", e.target.value)}
          className="rounded-[var(--soko-radius-sm)] border border-soko-line bg-soko-white px-3 py-2 text-sm"
        >
          <option value="recent">Plus récent</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>
        <label className="flex items-center gap-2 rounded-[var(--soko-radius-sm)] border border-soko-line bg-soko-white px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={params.verified === "1"}
            onChange={(e) => update("verified", e.target.checked ? "1" : "")}
          />
          Vérifié
        </label>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Prix min"
          defaultValue={params.min ?? ""}
          onBlur={(e) => update("min", e.target.value)}
          className="w-1/2 rounded-[var(--soko-radius-sm)] border border-soko-line bg-soko-white px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Prix max"
          defaultValue={params.max ?? ""}
          onBlur={(e) => update("max", e.target.value)}
          className="w-1/2 rounded-[var(--soko-radius-sm)] border border-soko-line bg-soko-white px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
