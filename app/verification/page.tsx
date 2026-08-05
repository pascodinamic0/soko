import Link from "next/link";
import { redirect } from "next/navigation";
import { VerificationFlow } from "@/components/verification-flow";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function VerificationPage() {
  if (!hasSupabaseEnv()) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-8 md:max-w-3xl">
        <Link href="/menu" className="text-sm font-medium text-soko-forest">
          ← Menu
        </Link>
        <h1 className="mt-4 font-[family-name:var(--soko-font-display)] text-2xl font-semibold">
          Vérification
        </h1>
        <p className="mt-2 text-sm text-soko-ink-muted">
          Configurez Supabase pour accéder à la vérification.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/verification");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: verification } = await supabase
    .from("seller_verifications")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/menu");

  return (
    <div className="mx-auto max-w-lg px-4 pt-8 pb-8 md:max-w-3xl">
      <Link href="/menu" className="text-sm font-medium text-soko-forest">
        ← Menu
      </Link>
      <h1 className="mt-4 font-[family-name:var(--soko-font-display)] text-2xl font-semibold">
        Vérification
      </h1>
      <p className="mt-2 text-sm text-soko-ink-muted">
        Personnes vraies. Annonces vraies.
      </p>
      <div className="mt-6">
        <VerificationFlow
          profile={profile}
          verificationStatus={verification?.status ?? null}
        />
      </div>
    </div>
  );
}
