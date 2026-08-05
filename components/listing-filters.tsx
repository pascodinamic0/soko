"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { formatLocationOption, groupLocationsByCity } from "@/lib/locations/display";
import type { Category, Location } from "@/lib/supabase/database.types";

export function ListingFiltersBar({
  locations,
  params,
  categories = [],
  basePath = "/recherche",
}: {
  locations: Location[];
  params: Record<string, string | undefined>;
  categories?: Category[];
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationsByCity = groupLocationsByCity(locations);

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${basePath}?${next.toString()}`);
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        {categories.length > 0 ? (
          <select
            value={params.category ?? ""}
            onChange={(e) => update("category", e.target.value)}
            className="rounded-[var(--soko-radius-sm)] border border-soko-line bg-soko-white px-3 py-2 text-sm"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name_fr}
              </option>
            ))}
          </select>
        ) : null}
        <select
          value={params.location ?? ""}
          onChange={(e) => update("location", e.target.value)}
          className="rounded-[var(--soko-radius-sm)] border border-soko-line bg-soko-white px-3 py-2 text-sm"
        >
          <option value="">Partout en RDC</option>
          {[...locationsByCity.entries()].map(([city, cityLocations]) => (
            <optgroup key={city} label={city}>
              {cityLocations.map((loc) => (
                <option key={loc.id} value={loc.slug}>
                  {formatLocationOption(loc)}
                </option>
              ))}
            </optgroup>
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
