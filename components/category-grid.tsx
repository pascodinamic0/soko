import { CategoryCard } from "@/components/category-card";
import type { Category } from "@/lib/supabase/database.types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) {
    return null;
  }

  const featured = categories.filter((c) => c.is_featured);
  const others = categories.filter((c) => !c.is_featured);

  return (
    <div className="space-y-4">
      {featured.length > 0 ? (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-soko-ink-muted">
            Liquidité d&apos;abord
          </p>
          <ul className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {featured.map((cat) => (
              <li key={cat.id} className="min-w-0">
                <CategoryCard category={cat} variant="tile" />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {others.length > 0 ? (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-soko-ink-muted">
            Autres catégories
          </p>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {others.map((cat) => (
              <li key={cat.id} className="min-w-0">
                <CategoryCard category={cat} variant="tile" />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
