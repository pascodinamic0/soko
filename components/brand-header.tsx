import { SokoSymbol } from "@/components/soko-symbol";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export async function BrandHeader() {
  let userHref = "/auth";
  let userInitial: string | null = null;
  let isLoggedIn = false;

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      isLoggedIn = true;
      userHref = "/menu";
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      const name = profile?.display_name ?? "U";
      userInitial = name.trim().charAt(0).toUpperCase();
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-soko-line/50 bg-gradient-to-b from-soko-white via-soko-white to-soko-mist/90 backdrop-blur-xl supports-[backdrop-filter]:bg-soko-white/90">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-4 px-4 py-3.5 md:max-w-3xl">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <SokoSymbol
            className="h-11 w-11 shrink-0 shadow-[0_4px_14px_rgb(15_61_46_/22%)] transition-transform group-active:scale-95"
            variant="color"
          />
          <span className="min-w-0 leading-none">
            <span className="block font-[family-name:var(--soko-font-display)] text-[1.35rem] font-bold tracking-tight text-soko-forest">
              Soko
            </span>
            <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-soko-amber">
              Le marché de confiance
            </span>
          </span>
        </Link>

        <Link
          href={userHref}
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-95 ${
            isLoggedIn
              ? "border-soko-amber/40 bg-soko-forest text-sm font-bold text-soko-white shadow-[0_4px_12px_rgb(15_61_46_/18%)]"
              : "border-soko-line bg-soko-white text-soko-forest shadow-sm hover:border-soko-forest/25 hover:shadow-md"
          }`}
          aria-label={isLoggedIn ? "Menu compte" : "Connexion"}
        >
          {userInitial ?? <UserIcon />}
          {!isLoggedIn ? (
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-soko-amber ring-2 ring-soko-white" />
          ) : null}
        </Link>
      </div>

      <div className="h-[2px] bg-gradient-to-r from-soko-forest/0 via-soko-amber/55 to-soko-forest/0" />
    </header>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
