import { CategoryCard } from "@/components/category-card";
import type { Category } from "@/lib/supabase/database.types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const featured = categories.filter((c) => c.is_featured);
  const rest = categories.filter((c) => !c.is_featured);

  return (
    <div className="space-y-6">
      {featured.length > 0 ? (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-soko-ink-muted">
            Liquidité d&apos;abord
          </p>
          <ul className="grid grid-cols-2 gap-3">
            {featured.map((cat, i) => (
              <li key={cat.id} className={i === 0 ? "col-span-2" : undefined}>
                <CategoryCard
                  category={cat}
                  variant={i === 0 ? "banner" : "tile"}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {rest.length > 0 ? (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-soko-ink-muted">
            Autres catégories
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {rest.map((cat) => (
              <li key={cat.id}>
                <CategoryCard category={cat} variant="tile" />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
