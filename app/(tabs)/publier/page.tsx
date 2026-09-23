import { PublishWizard } from "@/components/publish-wizard";
import { getFeaturedCategories, getLocations } from "@/lib/listings/queries";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import Link from "next/link";

export default async function PublierPage() {
  if (!hasSupabaseEnv()) {
    return (
      <div className="px-4 pt-8">
        <h1 className="font-[family-name:var(--soko-font-display)] text-2xl font-semibold">
          Vendre sur Zandocod
        </h1>
        <p className="mt-2 text-sm text-soko-ink-muted">
          Configurez Supabase pour publier une annonce.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="px-4 pt-8">
        <h1 className="font-[family-name:var(--soko-font-display)] text-2xl font-semibold">
          Vendre sur Zandocod
        </h1>
        <p className="mt-2 text-sm text-soko-ink-muted">
          Connectez-vous pour publier. Numéro masqué — tout reste dans l&apos;app.
        </p>
        <Link
          href="/auth?next=/publier"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-[var(--soko-radius-md)] bg-soko-amber px-6 font-semibold text-soko-ink"
        >
          Se connecter pour publier
        </Link>
      </div>
    );
  }

  const categories = await getFeaturedCategories();
  const locations = await getLocations();
  const { data: subcategories } = await supabase
    .from("subcategories")
    .select("*")
    .order("sort_order");

  return (
    <PublishWizard
      categories={categories}
      subcategories={subcategories ?? []}
      locations={locations}
    />
  );
}
