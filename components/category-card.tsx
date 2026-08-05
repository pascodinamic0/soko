import Image from "next/image";
import Link from "next/link";
import { getCategoryVisual } from "@/lib/categories/visuals";
import type { Category } from "@/lib/supabase/database.types";

export function CategoryCard({
  category,
  variant = "tile",
}: {
  category: Category;
  variant?: "tile" | "banner";
}) {
  const visual = getCategoryVisual(category.slug);

  return (
    <Link
      href={`/categorie/${category.slug}`}
      className={`group relative block overflow-hidden rounded-[var(--soko-radius-lg)] border border-soko-line/60 bg-soko-sand shadow-[var(--soko-shadow)] transition-transform active:scale-[0.98] ${
        variant === "banner" ? "aspect-[2/1]" : "aspect-[4/5]"
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src={visual.image}
          alt={category.name_fr}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes={
            variant === "banner"
              ? "(max-width: 768px) 100vw, 480px"
              : "(max-width: 768px) 30vw, 160px"
          }
          priority={variant === "banner"}
          unoptimized={visual.image.includes("picsum.photos")}
        />
      </div>

      {category.is_featured ? (
        <span className="absolute right-2 top-2 z-10 rounded-full bg-soko-amber px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-soko-ink shadow-sm">
          Top
        </span>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-soko-ink/85 via-soko-ink/35 to-transparent px-3 pb-3 pt-10">
        <p
          className={`font-semibold leading-snug text-soko-white ${
            variant === "banner" ? "text-base" : "text-xs sm:text-sm"
          }`}
        >
          {category.name_fr}
        </p>
        {visual.label ? (
          <p className="mt-0.5 line-clamp-1 text-[10px] text-soko-sand/90 sm:text-xs">
            {visual.label}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
