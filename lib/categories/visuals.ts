/** Curated category visuals — Kinshasa marketplace feel */
export type CategoryVisual = {
  image: string;
  label?: string;
};

const visuals: Record<string, CategoryVisual> = {
  "telephones-electronique": {
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=640&h=800&fit=crop&q=80",
    label: "Smartphones & tech",
  },
  "vehicules-motos": {
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&h=800&fit=crop&q=80",
    label: "Voitures & motos",
  },
  immobilier: {
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=640&h=800&fit=crop&q=80",
    label: "Location & vente",
  },
  "mode-beaute": {
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=640&h=800&fit=crop&q=80",
    label: "Mode & beauté",
  },
  "maison-jardin": {
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=640&h=800&fit=crop&q=80",
    label: "Maison & déco",
  },
  emplois: {
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=640&h=800&fit=crop&q=80",
    label: "Offres d'emploi",
  },
  services: {
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=640&h=800&fit=crop&q=80",
    label: "Services locaux",
  },
  autres: {
    image: "https://picsum.photos/seed/soko-cat-autres/640/800",
    label: "Tout le reste",
  },
};

export function getCategoryVisual(slug: string): CategoryVisual {
  return (
    visuals[slug] ?? {
      image: `https://picsum.photos/seed/soko-${slug}/640/800`,
      label: undefined,
    }
  );
}
