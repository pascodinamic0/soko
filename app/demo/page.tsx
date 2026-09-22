import Link from "next/link";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function DemoPage() {
  const configured = hasSupabaseEnv();

  return (
    <div className="px-4 pt-8 pb-8">
      <h1 className="font-[family-name:var(--soko-font-display)] text-2xl font-semibold">
        Démo Zandocod
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-soko-ink-muted">
        {configured
          ? "Votre projet Supabase est configuré. Utilisez les comptes ci-dessous pour tester ou créez les vôtres."
          : "Mode démo sans backend: navigation et fiches annonces actives. Pour la messagerie, favoris et publication, ajoutez les variables Supabase."}
      </p>

      <section className="mt-6">
        <h2 className="font-[family-name:var(--soko-font-display)] text-lg font-semibold">
          Comptes de test (Email / Mot de passe)
        </h2>
        <ul className="mt-3 space-y-2 rounded-[var(--soko-radius-md)] bg-soko-surface-warm p-4 text-sm">
          <li>
            <span className="font-semibold text-soko-ink">Acheteur</span>{" "}
            — buyer@demo.zandocod.com / <span className="font-mono">Passw0rd!</span>
          </li>
          <li>
            <span className="font-semibold text-soko-ink">Vendeur</span>{" "}
            — seller@demo.zandocod.com / <span className="font-mono">Passw0rd!</span>
          </li>
          <li>
            <span className="font-semibold text-soko-ink">Admin</span>{" "}
            — admin@demo.zandocod.com / <span className="font-mono">Passw0rd!</span>
          </li>
        </ul>
        <p className="mt-2 text-xs text-soko-ink-muted">
          Créez ces comptes dans Supabase → Auth → Users pour activer la démo complète.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-[family-name:var(--soko-font-display)] text-lg font-semibold">
          Flows à essayer
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-soko-ink">
          <li>
            Parcourir les catégories et ouvrir une annonce depuis{" "}
            <Link href="/" className="text-soko-forest underline">
              l&apos;accueil
            </Link>
            .
          </li>
          <li>
            Rechercher “iPhone” puis filtrer par catégorie Téléphones depuis{" "}
            <Link href="/recherche" className="text-soko-forest underline">
              Recherche
            </Link>
            .
          </li>
          <li>Se connecter puis ajouter/supprimer un favori.</li>
          <li>Contacter un vendeur (numéro masqué, discussion dans l&apos;app).</li>
          <li>Publier une annonce (photos, détails, localisation).</li>
        </ol>
      </section>
    </div>
  );
}

