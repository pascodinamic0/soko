"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "sign-in" | "sign-up";

export function AuthForm() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <AuthFormSkeleton />;
  }

  return <AuthFormContent />;
}

function AuthFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/menu";
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (searchParams.get("error") === "oauth") {
      setError("La connexion Google a échoué. Veuillez réessayer.");
    }
  }, [searchParams]);

  function onGoogleSignIn() {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (oauthError) {
        setError(oauthError.message);
      }
    });
  }

  function onEmailSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const supabase = createClient();

      if (mode === "sign-up") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: displayName.trim() || email.split("@")[0],
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data.session) {
          router.replace(nextPath);
          router.refresh();
          return;
        }

        setError(
          "Compte créé. Activez la connexion instantanée dans les paramètres Supabase Auth si nécessaire.",
        );
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-5 flex rounded-[var(--soko-radius-md)] bg-soko-mist/80 p-1">
        <ModeButton
          active={mode === "sign-in"}
          onClick={() => {
            setMode("sign-in");
            setError(null);
          }}
        >
          Connexion
        </ModeButton>
        <ModeButton
          active={mode === "sign-up"}
          onClick={() => {
            setMode("sign-up");
            setError(null);
          }}
        >
          Inscription
        </ModeButton>
      </div>

      <button
        type="button"
        onClick={onGoogleSignIn}
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white text-sm font-semibold text-soko-ink shadow-sm transition-all hover:border-soko-forest/20 hover:shadow disabled:opacity-60"
      >
        <GoogleIcon />
        Continuer avec Google
      </button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-soko-line/80" />
        <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-soko-ink-muted">
          ou par e-mail
        </span>
        <div className="h-px flex-1 bg-soko-line/80" />
      </div>

      <form onSubmit={onEmailSubmit} className="space-y-4">
        {mode === "sign-up" ? (
          <Field label="Nom affiché">
            <input
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputClass}
              placeholder="Marie K."
            />
          </Field>
        ) : null}

        <Field label="Adresse e-mail">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="vous@exemple.com"
            required
          />
        </Field>

        <Field
          label="Mot de passe"
          hint={mode === "sign-up" ? "6 caractères minimum" : undefined}
        >
          <input
            type="password"
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
            required
          />
        </Field>

        {error ? (
          <p className="rounded-[var(--soko-radius-md)] border border-soko-danger/20 bg-soko-danger/5 px-3 py-2.5 text-sm text-soko-danger">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className={`flex h-12 w-full items-center justify-center rounded-[var(--soko-radius-md)] font-semibold transition-opacity disabled:opacity-60 ${
            mode === "sign-up"
              ? "bg-soko-amber text-soko-ink shadow-[0_4px_14px_rgb(232_163_23_/25%)]"
              : "bg-soko-forest text-soko-white shadow-[0_4px_14px_rgb(15_61_46_/18%)]"
          }`}
        >
          {pending
            ? "Patientez…"
            : mode === "sign-up"
              ? "Créer mon compte"
              : "Se connecter"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs leading-relaxed text-soko-ink-muted">
        En continuant, vous acceptez les règles du marché Soko et notre engagement
        pour des échanges sûrs.
      </p>
    </div>
  );
}

function AuthFormSkeleton() {
  return (
    <div className="space-y-3 py-1" aria-hidden>
      <div className="h-11 animate-pulse rounded-[var(--soko-radius-md)] bg-soko-mist" />
      <div className="h-12 animate-pulse rounded-[var(--soko-radius-md)] bg-soko-mist" />
      <div className="h-12 animate-pulse rounded-[var(--soko-radius-md)] bg-soko-mist" />
      <div className="h-12 animate-pulse rounded-[var(--soko-radius-md)] bg-soko-mist" />
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-[var(--soko-radius-md)] border border-soko-line/80 bg-soko-mist/40 px-3.5 text-sm outline-none transition-colors placeholder:text-soko-ink-muted/70 focus:border-soko-forest focus:bg-soko-white";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-soko-ink">{label}</span>
        {hint ? (
          <span className="text-xs text-soko-ink-muted">{hint}</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-[10px] py-2.5 text-sm font-semibold transition-all ${
        active
          ? "bg-soko-white text-soko-forest shadow-sm"
          : "text-soko-ink-muted hover:text-soko-ink"
      }`}
    >
      {children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
