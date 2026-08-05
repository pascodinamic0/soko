"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type {
  Profile,
  SellerVerificationStatus,
  VerificationLevel,
} from "@/lib/supabase/database.types";
import { verificationLabel } from "@/lib/format";

export function VerificationFlow({
  profile,
  verificationStatus,
}: {
  profile: Profile;
  verificationStatus: SellerVerificationStatus | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function uploadDocs(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const idFile = (form.elements.namedItem("id_doc") as HTMLInputElement)
      .files?.[0];
    const selfieFile = (form.elements.namedItem("selfie") as HTMLInputElement)
      .files?.[0];

    if (!idFile || !selfieFile) {
      setError("Pièce d'identité et selfie requis.");
      return;
    }

    startTransition(async () => {
      setError(null);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const idPath = `${user.id}/id-${Date.now()}.jpg`;
      const selfiePath = `${user.id}/selfie-${Date.now()}.jpg`;

      const { error: idErr } = await supabase.storage
        .from("verification-docs")
        .upload(idPath, idFile);
      if (idErr) {
        setError(idErr.message);
        return;
      }

      const { error: selfieErr } = await supabase.storage
        .from("verification-docs")
        .upload(selfiePath, selfieFile);
      if (selfieErr) {
        setError(selfieErr.message);
        return;
      }

      const { error: upsertErr } = await supabase
        .from("seller_verifications")
        .upsert(
          {
            user_id: user.id,
            id_document_path: idPath,
            selfie_path: selfiePath,
          },
          { onConflict: "user_id" },
        );

      if (upsertErr) {
        setError(upsertErr.message);
        return;
      }

      router.refresh();
    });
  }

  const steps: {
    level: VerificationLevel;
    title: string;
    done: boolean;
  }[] = [
    {
      level: "phone",
      title: "Téléphone OTP",
      done: ["phone", "id_pending", "verified"].includes(
        profile.verification_level,
      ),
    },
    {
      level: "id_pending",
      title: "Pièce d'identité",
      done: ["id_pending", "verified"].includes(profile.verification_level),
    },
    {
      level: "verified",
      title: "Badge Vérifié Soko",
      done: profile.verification_level === "verified",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--soko-radius-md)] bg-soko-surface-warm px-4 py-4">
        <p className="font-semibold">{profile.display_name}</p>
        <p className="mt-1 text-sm text-soko-ink-muted">
          {verificationLabel(profile.verification_level)}
        </p>
      </div>

      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li
            key={step.level}
            className={`flex items-center gap-3 text-sm ${
              step.done ? "text-soko-success" : "text-soko-ink-muted"
            }`}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step.done ? "bg-soko-success text-white" : "bg-soko-line"
              }`}
            >
              {step.done ? "✓" : i + 1}
            </span>
            {step.title}
          </li>
        ))}
      </ol>

      {profile.verification_level === "verified" ? (
        <p className="text-sm text-soko-success">
          Votre compte est vérifié. Le badge Vérifié Soko s&apos;affiche sur
          vos annonces.
        </p>
      ) : profile.verification_level === "id_pending" ? (
        <p className="text-sm text-soko-ink-muted">
          Identité en cours de vérification
          {verificationStatus === "pending" ? " (24–48 h)" : ""}. Nous vous
          préviendrons dans l&apos;app.
        </p>
      ) : (
        <form onSubmit={uploadDocs} className="space-y-4">
          <p className="text-sm text-soko-ink-muted">
            Téléversez votre pièce d&apos;identité et un selfie pour obtenir le
            badge Vérifié Soko.
          </p>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Pièce d&apos;identité</span>
            <input
              type="file"
              name="id_doc"
              accept="image/*"
              required
              className="w-full text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Selfie</span>
            <input
              type="file"
              name="selfie"
              accept="image/*"
              required
              className="w-full text-sm"
            />
          </label>
          {error ? <p className="text-sm text-soko-danger">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="h-12 w-full rounded-[var(--soko-radius-md)] bg-soko-forest font-semibold text-soko-white disabled:opacity-60"
          >
            {pending ? "Envoi…" : "Soumettre pour vérification"}
          </button>
        </form>
      )}
    </div>
  );
}
