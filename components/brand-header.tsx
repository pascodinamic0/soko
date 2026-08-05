import { SokoLogo } from "@/components/soko-logo";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export async function BrandHeader({
  subtitle = "Kinshasa",
}: {
  subtitle?: string;
}) {
  let userLabel = "Connexion";
  let userHref = "/auth";

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      userLabel = profile?.display_name?.split(" ")[0] ?? "Menu";
      userHref = "/menu";
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-soko-forest-deep/40 bg-soko-forest text-soko-white shadow-[0_1px_0_rgb(232_163_23_/_12%)]">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-2.5 md:max-w-3xl">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <SokoLogo variant="reverse" size="sm" />
          <span className="hidden truncate border-l border-soko-sand/25 pl-3 text-xs font-medium text-soko-sand/90 sm:inline">
            {subtitle}
          </span>
        </Link>
        <Link
          href={userHref}
          className="shrink-0 rounded-full bg-soko-amber px-3.5 py-1.5 text-xs font-bold text-soko-ink shadow-sm"
        >
          {userLabel}
        </Link>
      </div>
    </header>
  );
}
