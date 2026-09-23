import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { SignOutButton } from "@/components/sign-out-button";
import { verificationLabel } from "@/lib/format";

export default async function MenuPage() {
  if (!hasSupabaseEnv()) {
    return (
      <div className="px-4 pt-8">
        <h1 className="font-[family-name:var(--soko-font-display)] text-2xl font-semibold">
          Menu
        </h1>
        <p className="mt-2 text-sm text-soko-ink-muted">
          Configurez Supabase pour accéder à votre compte.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/menu");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const links = [
    { href: "/mes-annonces", label: "Mes annonces" },
    { href: "/verification", label: "Vérification" },
    { href: "/publier", label: "Vendre sur Zandocod" },
    { href: "/menu#support", label: "Aide & signalement" },
  ] as const;

  return (
    <div className="px-4 pt-8">
      <h1 className="font-[family-name:var(--soko-font-display)] text-2xl font-semibold">
        Menu
      </h1>
      <div className="mt-4 rounded-[var(--soko-radius-md)] bg-soko-surface-warm px-4 py-4">
        <p className="font-semibold text-soko-ink">
          {profile?.display_name ?? "Utilisateur Zandocod"}
        </p>
        <p className="mt-1 text-sm text-soko-ink-muted">
          {verificationLabel(profile?.verification_level ?? "none")}
        </p>
      </div>

      <ul className="mt-6">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center justify-between border-b border-soko-line py-4 font-medium text-soko-ink"
            >
              {link.label}
              <span aria-hidden className="text-soko-forest">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <SignOutButton />
      </div>

      <section id="verification" className="mt-8 scroll-mt-24">
        <h2 className="font-[family-name:var(--soko-font-display)] text-lg font-semibold">
          Échelle de confiance
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-soko-ink-muted">
          <li>1. Téléphone OTP</li>
          <li>2. Pièce d&apos;identité (vendeurs)</li>
          <li>3. Badge Vérifié Zandocod</li>
        </ol>
      </section>

      <section id="support" className="mt-8 scroll-mt-24 pb-4">
        <h2 className="font-[family-name:var(--soko-font-display)] text-lg font-semibold">
          Confiance
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-soko-ink-muted">
          Signalez les arnaques. Les numéros ne s&apos;affichent jamais dans
          l&apos;interface. Numéro masqué. Discussion dans l&apos;app.
        </p>
      </section>
    </div>
  );
}
