"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { SubcategoryRow } from "@/lib/supabase/database.types";

export function SubcategoryTabs({
  categorySlug,
  subcategories,
  activeType,
}: {
  categorySlug: string;
  subcategories: SubcategoryRow[];
  activeType?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const basePath = pathname ?? `/categorie/${categorySlug}`;

  function hrefFor(type?: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (type) next.set("type", type);
    else next.delete("type");
    const query = next.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  if (subcategories.length === 0) {
    return null;
  }

  return (
    <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-1">
      <div className="flex w-max gap-2">
        <TabLink href={hrefFor()} active={!activeType}>
          Tous
        </TabLink>
        {subcategories.map((sub) => (
          <TabLink
            key={sub.id}
            href={hrefFor(sub.slug)}
            active={activeType === sub.slug}
          >
            {sub.name_fr}
          </TabLink>
        ))}
      </div>
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-soko-forest text-soko-white shadow-sm"
          : "border border-soko-line bg-soko-white text-soko-ink hover:border-soko-forest/30"
      }`}
    >
      {children}
    </Link>
  );
}
