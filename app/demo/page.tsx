import Link from "next/link";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { DemoButtons } from "./demo-buttons";

export const metadata = {
  title: "Démo",
};

export default function DemoPage() {
  const configured = hasSupabaseEnv();

  return (
    <div className="px-4 pt-8 pb-10">
      <h1 className="font-[family-name:var(--soko-font-display)] text-2xl font-semibold">
        Démo Zandocod
      </h1>
      <p className="mt-2 text-sm text-soko-ink-muted">
        Parcourez comme acheteur ou publiez comme vendeur. Connexion démo sans
        friction.
      </p>

      {configured ? (
        <DemoButtons />
      ) : (
        <div className="mt-5 rounded-[var(--soko-radius-md)] bg-soko-surface-warm px-4 py-4 text-sm leading-relaxed text-soko-ink">
          <p className="font-medium">Aperçu sans compte</p>
          <p className="mt-1 text-soko-ink-muted">
            La démo est limitée sans Supabase configuré. Vous pouvez explorer le
            marché et les écrans, mais la messagerie et la publication
            nécessitent une connexion.
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex h-11 items-center justify-center rounded-[var(--soko-radius-md)] bg-soko-forest px-5 text-sm font-semibold text-soko-white"
          >
            Explorer le marché
          </Link>
        </div>
      )}
    </div>
  );
}

