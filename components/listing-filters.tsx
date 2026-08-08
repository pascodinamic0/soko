"use client";

import { useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatLocationOption, groupLocationsByCity } from "@/lib/locations/display";
import type { Category, Location } from "@/lib/supabase/database.types";

const selectClass =
  "h-11 w-full appearance-none rounded-[var(--soko-radius-md)] border border-soko-line/80 bg-soko-white bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat px-3 pr-9 text-sm text-soko-ink outline-none transition-colors focus:border-soko-forest";

const selectArrow =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.75' d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

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
  const ids = {
    category: useId(),
    location: useId(),
    sort: useId(),
    min: useId(),
    max: useId(),
  };

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${basePath}?${next.toString()}`);
  }

  return (
    <div className="mt-4 space-y-3 rounded-[var(--soko-radius-lg)] border border-soko-line/70 bg-soko-white/80 p-3 shadow-[0_1px_0_rgb(15_61_46_/4%)]">
      {categories.length > 0 ? (
        <Field label="Catégorie" htmlFor={ids.category}>
          <select
            id={ids.category}
            value={params.category ?? ""}
            onChange={(e) => update("category", e.target.value)}
            className={selectClass}
            style={{ backgroundImage: selectArrow }}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name_fr}
              </option>
            ))}
          </select>
        </Field>
      ) : null}

      <Field label="Lieu" htmlFor={ids.location}>
        <select
          id={ids.location}
          value={params.location ?? ""}
          onChange={(e) => update("location", e.target.value)}
          className={selectClass}
          style={{ backgroundImage: selectArrow }}
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
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Trier" htmlFor={ids.sort}>
          <select
            id={ids.sort}
            value={params.sort ?? "recent"}
            onChange={(e) => update("sort", e.target.value)}
            className={selectClass}
            style={{ backgroundImage: selectArrow }}
          >
            <option value="recent">Plus récent</option>
            <option value="price_asc">Prix ↑</option>
            <option value="price_desc">Prix ↓</option>
          </select>
        </Field>

        <Field label="Confiance">
          <button
            type="button"
            onClick={() => update("verified", params.verified === "1" ? "" : "1")}
            aria-pressed={params.verified === "1"}
            className={`flex h-11 w-full items-center justify-center gap-2 rounded-[var(--soko-radius-md)] border text-sm font-semibold transition-colors ${
              params.verified === "1"
                ? "border-soko-forest bg-soko-forest text-soko-white"
                : "border-soko-line/80 bg-soko-white text-soko-ink"
            }`}
          >
            <VerifiedIcon active={params.verified === "1"} />
            Vérifié
          </button>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Prix min" htmlFor={ids.min}>
          <input
            id={ids.min}
            type="number"
            inputMode="numeric"
            placeholder="0"
            defaultValue={params.min ?? ""}
            onBlur={(e) => update("min", e.target.value)}
            className="h-11 w-full rounded-[var(--soko-radius-md)] border border-soko-line/80 bg-soko-white px-3 text-sm outline-none focus:border-soko-forest"
          />
        </Field>
        <Field label="Prix max" htmlFor={ids.max}>
          <input
            id={ids.max}
            type="number"
            inputMode="numeric"
            placeholder="—"
            defaultValue={params.max ?? ""}
            onBlur={(e) => update("max", e.target.value)}
            className="h-11 w-full rounded-[var(--soko-radius-md)] border border-soko-line/80 bg-soko-white px-3 text-sm outline-none focus:border-soko-forest"
          />
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block min-w-0">
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-soko-ink-muted"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function VerifiedIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      aria-hidden
    >
      <path
        d="M9 12.5 11 14.5 15.5 9.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="8.25"
        stroke="currentColor"
        strokeWidth="1.5"
        className={active ? "opacity-100" : "opacity-70"}
      />
    </svg>
  );
}
