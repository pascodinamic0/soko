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

  if (variant === "banner") {
    return (
      <Link
        href={`/categorie/${category.slug}`}
        className="group relative block aspect-[21/9] overflow-hidden rounded-[var(--soko-radius-lg)] shadow-[var(--soko-shadow)]"
      >
        <CategoryImage src={visual.image} alt={category.name_fr} priority />
        <CategoryOverlay
          name={category.name_fr}
          hint={visual.label}
          featured={category.is_featured}
          large
        />
      </Link>
    );
  }

  return (
    <Link
      href={`/categorie/${category.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-[var(--soko-radius-lg)] shadow-[var(--soko-shadow)] transition-transform active:scale-[0.98]"
    >
      <CategoryImage src={visual.image} alt={category.name_fr} />
      <CategoryOverlay
        name={category.name_fr}
        hint={visual.label}
        featured={category.is_featured}
      />
    </Link>
  );
}

function CategoryImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const external = src.startsWith("http");

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 45vw, 220px"
        priority={priority}
        unoptimized={!external || src.includes("picsum.photos")}
      />
      <div className="absolute inset-0 bg-soko-forest/10 transition group-hover:bg-soko-forest/5" />
    </>
  );
}

function CategoryOverlay({
  name,
  hint,
  featured,
  large = false,
}: {
  name: string;
  hint?: string;
  featured?: boolean;
  large?: boolean;
}) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-soko-forest/92 via-soko-forest/45 to-soko-forest/10" />
      {featured && !large ? (
        <span className="absolute right-2.5 top-2.5 rounded-full bg-soko-amber px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-soko-ink">
          Top
        </span>
      ) : null}
      <div
        className={`absolute inset-x-0 bottom-0 ${large ? "p-5" : "p-3.5"}`}
      >
        <p
          className={`font-semibold leading-snug text-soko-white ${
            large ? "text-xl" : "text-sm"
          }`}
        >
          {name}
        </p>
        {hint ? (
          <p className={`mt-0.5 text-soko-sand/90 ${large ? "text-sm" : "text-xs"}`}>
            {hint}
          </p>
        ) : null}
      </div>
    </>
  );
}
