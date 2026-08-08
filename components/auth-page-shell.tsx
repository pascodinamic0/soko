import Link from "next/link";
import { SokoSymbol } from "@/components/soko-symbol";

export function AuthPageShell({
  children,
  configured,
}: {
  children: React.ReactNode;
  configured: boolean;
}) {
  return (
    <div className="flex min-h-dvh w-full flex-1 flex-col">
      <section className="relative shrink-0 overflow-hidden px-6 pb-8 pt-[max(2.5rem,env(safe-area-inset-top))] text-soko-white sm:px-8 sm:pb-10 sm:pt-12">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 15%, rgb(232 163 23 / 42%), transparent 40%), radial-gradient(circle at 10% 90%, rgb(245 230 200 / 12%), transparent 45%), linear-gradient(165deg, rgb(10 42 31 / 40%), transparent 60%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-3">
            <SokoSymbol
              className="h-12 w-12 shadow-[0_6px_20px_rgb(0_0_0_/22%)]"
              variant="color"
            />
            <span className="leading-none">
              <span className="block font-[family-name:var(--soko-font-display)] text-[2rem] font-bold tracking-tight">
                Soko
              </span>
              <span className="mt-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-soko-amber">
                Le marché de confiance
              </span>
            </span>
          </Link>

          <h1 className="mt-7 max-w-[16ch] font-[family-name:var(--soko-font-display)] text-[1.75rem] font-semibold leading-[1.15] tracking-tight sm:text-[2rem]">
            Bienvenue
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-soko-sand/95">
            Achetez, vendez et échangez avec des personnes vérifiées.
          </p>
        </div>
      </section>

      <div className="relative flex flex-1 flex-col rounded-t-[1.75rem] bg-soko-mist px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 shadow-[0_-12px_40px_rgb(0_0_0_/18%)] sm:px-8 sm:pt-8">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <div className="flex-1 rounded-[var(--soko-radius-lg)] border border-soko-line/60 bg-soko-white p-5 shadow-[var(--soko-shadow)] sm:p-6">
            {configured ? (
              children
            ) : (
              <div className="rounded-[var(--soko-radius-md)] bg-soko-sand/40 px-4 py-5 text-center text-sm leading-relaxed text-soko-ink-muted">
                Configurez{" "}
                <code className="text-soko-ink">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
                et{" "}
                <code className="text-soko-ink">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code>{" "}
                dans <code className="text-soko-ink">.env.local</code>.
              </div>
            )}
          </div>

          <p className="mt-5 text-center text-sm text-soko-ink-muted">
            <Link
              href="/"
              className="font-medium text-soko-forest underline-offset-2 transition-colors hover:text-soko-forest-deep hover:underline"
            >
              Continuer sans compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
