import Image from "next/image";
import Link from "next/link";
import { getCategoryVisual } from "@/lib/categories/visuals";
import type { Category } from "@/lib/supabase/database.types";

export function CategoryHero({ category }: { category: Category }) {
  const visual = getCategoryVisual(category.slug);

  return (
    <div className="-mx-4 mb-5">
      <div className="relative aspect-[2/1] w-full overflow-hidden md:rounded-[var(--soko-radius-lg)]">
        <Image
          src={visual.image}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-soko-forest/95 via-soko-forest/50 to-soko-forest/20" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <Link
            href="/"
            className="mb-3 inline-block text-xs font-medium text-soko-sand/90"
          >
            ← Accueil
          </Link>
          <h1 className="font-[family-name:var(--soko-font-display)] text-2xl font-semibold text-soko-white">
            {category.name_fr}
          </h1>
          <p className="mt-1 text-sm text-soko-sand/90">
            {visual.label ?? "Kinshasa"} · Marché Soko
          </p>
        </div>
      </div>
    </div>
  );
}
