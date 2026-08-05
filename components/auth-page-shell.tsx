import Link from "next/link";

export function AuthPageShell({
  children,
  configured,
}: {
  children: React.ReactNode;
  configured: boolean;
}) {
  return (
    <div className="flex w-full flex-col">
      <div className="relative mb-5 flex items-center justify-center">
        <Link
          href="/"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-soko-line/80 bg-soko-white text-soko-forest shadow-sm transition-colors hover:bg-soko-sand/50"
          aria-label="Retour à l'accueil"
        >
          <BackIcon />
        </Link>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-soko-ink-muted">
          Compte Soko
        </span>
      </div>

      <section className="relative overflow-hidden rounded-[var(--soko-radius-lg)] border border-soko-forest-deep/20 bg-soko-forest px-5 py-7 text-center text-soko-white shadow-[var(--soko-shadow)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 88% 12%, rgb(232 163 23 / 38%), transparent 42%), linear-gradient(155deg, rgb(10 42 31 / 35%), transparent 55%)",
          }}
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-soko-amber">
            Le marché de confiance
          </p>
          <h1 className="mt-2 font-[family-name:var(--soko-font-display)] text-2xl font-semibold tracking-tight">
            Bienvenue sur Soko
          </h1>
          <p className="mx-auto mt-2 max-w-[17rem] text-sm leading-relaxed text-soko-sand/95">
            Achetez, vendez et échangez avec des personnes vérifiées.
          </p>
        </div>
      </section>

      <div className="relative z-10 -mt-5 w-full">
        <div className="rounded-[var(--soko-radius-lg)] border border-soko-line/70 bg-soko-white p-5 shadow-[0_8px_30px_rgb(15_61_46_/8%)] sm:p-6">
          {configured ? (
            children
          ) : (
            <div className="rounded-[var(--soko-radius-md)] bg-soko-sand/40 px-4 py-5 text-center text-sm leading-relaxed text-soko-ink-muted">
              Configurez{" "}
              <code className="text-soko-ink">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
              <code className="text-soko-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
              dans <code className="text-soko-ink">.env.local</code>.
            </div>
          )}
        </div>

        <ul className="mx-auto mt-6 max-w-[18rem] space-y-3 text-center">
          <TrustPoint>Discussions sécurisées dans l&apos;application</TrustPoint>
          <TrustPoint>Annonces et vendeurs vérifiés</TrustPoint>
          <TrustPoint>Partout en RDC</TrustPoint>
        </ul>
      </div>
    </div>
  );
}

function TrustPoint({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center justify-center gap-2 text-sm text-soko-ink-muted">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-soko-forest/10 text-soko-forest">
        <CheckIcon />
      </span>
      <span>{children}</span>
    </li>
  );
}

function BackIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18 9 12l6-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m5 12 4 4 10-10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
