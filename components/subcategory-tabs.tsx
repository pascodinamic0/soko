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
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-soko-ink-muted">
        Type
      </p>
      <div className="relative">
        <div
          className="flex gap-2 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 pr-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Types"
        >
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
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-soko-bg via-soko-bg/80 to-transparent"
        />
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
      role="tab"
      aria-selected={active}
      className={`inline-flex h-9 shrink-0 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors ${
        active
          ? "bg-soko-forest text-soko-white"
          : "bg-soko-mist text-soko-ink ring-1 ring-inset ring-soko-line/70"
      }`}
    >
      {children}
    </Link>
  );
}
