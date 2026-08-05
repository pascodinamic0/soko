import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { SokoLogo } from "@/components/soko-logo";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const metadata = {
  title: "Connexion",
};

export default function AuthPage() {
  const configured = hasSupabaseEnv();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col px-4 py-8">
      <Link
        href="/"
        className="mb-8 text-sm font-medium text-soko-forest"
      >
        ← Retour au marché
      </Link>

      <div className="mb-6">
        <SokoLogo variant="primary" size="lg" showTagline />
        <h1 className="mt-6 font-[family-name:var(--soko-font-display)] text-2xl font-semibold text-soko-ink">
          Connexion
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-soko-ink-muted">
          Google ou e-mail — accès immédiat, sans vérification.
        </p>
      </div>

      {configured ? (
        <Suspense fallback={<p className="text-sm text-soko-ink-muted">Chargement…</p>}>
          <AuthForm />
        </Suspense>
      ) : (
        <div className="rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-sand/50 px-4 py-5 text-sm leading-relaxed text-soko-ink-muted">
          Configurez{" "}
          <code className="text-soko-ink">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
          <code className="text-soko-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          dans <code className="text-soko-ink">.env.local</code>.
        </div>
      )}

      <p className="mt-8 text-center text-xs text-soko-ink-muted">
        Discussion dans l&apos;app · numéros masqués
      </p>
    </div>
  );
}
