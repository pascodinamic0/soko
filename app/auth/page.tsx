import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { AuthPageShell } from "@/components/auth-page-shell";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const metadata = {
  title: "Connexion",
};

export default function AuthPage() {
  const configured = hasSupabaseEnv();

  return (
    <AuthPageShell configured={configured}>
      <Suspense
        fallback={
          <div className="space-y-3 py-6">
            <div className="h-12 animate-pulse rounded-[var(--soko-radius-md)] bg-soko-mist" />
            <div className="h-12 animate-pulse rounded-[var(--soko-radius-md)] bg-soko-mist" />
            <div className="h-12 animate-pulse rounded-[var(--soko-radius-md)] bg-soko-mist" />
          </div>
        }
      >
        <AuthForm />
      </Suspense>
    </AuthPageShell>
  );
}
