"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "sign-in" | "sign-up";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/menu";
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "oauth"
      ? "Connexion Google impossible. Réessayez."
      : null,
  );
  const [pending, startTransition] = useTransition();

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
          "Compte créé. Si la connexion ne démarre pas, désactivez la confirmation e-mail dans Supabase Auth.",
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
    <div className="space-y-5">
      <button
        type="button"
        onClick={onGoogleSignIn}
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white font-semibold text-soko-ink shadow-sm transition-colors hover:bg-soko-mist disabled:opacity-60"
      >
        <GoogleIcon />
        Continuer avec Google
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-soko-line" />
        <span className="text-xs font-medium uppercase tracking-wide text-soko-ink-muted">
          ou
        </span>
        <div className="h-px flex-1 bg-soko-line" />
      </div>

      <div className="flex rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-mist/60 p-1">
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

      <form onSubmit={onEmailSubmit} className="space-y-4">
        {mode === "sign-up" ? (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Nom affiché</span>
            <input
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-12 w-full rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white px-3 outline-none focus:border-soko-forest"
              placeholder="Marie K."
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">E-mail</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white px-3 outline-none focus:border-soko-forest"
            placeholder="vous@exemple.com"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Mot de passe</span>
          <input
            type="password"
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white px-3 outline-none focus:border-soko-forest"
            placeholder="••••••••"
            required
          />
        </label>

        {error ? <p className="text-sm text-soko-danger">{error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center rounded-[var(--soko-radius-md)] bg-soko-forest font-semibold text-soko-white disabled:opacity-60"
        >
          {pending
            ? "Chargement…"
            : mode === "sign-up"
              ? "Créer mon compte"
              : "Se connecter"}
        </button>
      </form>
    </div>
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
      className={`flex-1 rounded-[10px] py-2.5 text-sm font-semibold transition-colors ${
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
