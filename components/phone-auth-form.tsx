"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { normalizeCongoPhone } from "@/lib/phone";

type Step = "phone" | "otp";

export function PhoneAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/menu";
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [e164, setE164] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSendOtp(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const normalized = normalizeCongoPhone(phone);
    if (!normalized) {
      setError("Numéro invalide. Ex. 0812 345 678 ou +243 812 345 678");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: normalized,
      });
      if (otpError) {
        setError(otpError.message);
        return;
      }
      setE164(normalized);
      setStep("otp");
    });
  }

  function onVerifyOtp(event: FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: e164,
        token: otp.trim(),
        type: "sms",
      });
      if (verifyError) {
        setError(verifyError.message);
        return;
      }
      router.replace(nextPath);
      router.refresh();
    });
  }

  if (step === "otp") {
    return (
      <form onSubmit={onVerifyOtp} className="space-y-4">
        <p className="text-sm text-soko-ink-muted">
          Code envoyé au{" "}
          <span className="font-medium text-soko-ink">{e164}</span>
        </p>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Code SMS</span>
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={8}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="h-12 w-full rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white px-3 text-lg tracking-[0.3em] outline-none focus:border-soko-forest"
            placeholder="••••••"
            required
          />
        </label>
        {error ? <p className="text-sm text-soko-danger">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center rounded-[var(--soko-radius-md)] bg-soko-forest font-semibold text-soko-white disabled:opacity-60"
        >
          {pending ? "Vérification…" : "Valider"}
        </button>
        <button
          type="button"
          className="w-full text-sm font-medium text-soko-forest"
          onClick={() => {
            setStep("phone");
            setOtp("");
            setError(null);
          }}
        >
          Changer de numéro
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onSendOtp} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Téléphone</span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-12 w-full rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white px-3 outline-none focus:border-soko-forest"
          placeholder="0812 345 678"
          required
        />
      </label>
      {error ? <p className="text-sm text-soko-danger">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center rounded-[var(--soko-radius-md)] bg-soko-amber font-semibold text-soko-ink disabled:opacity-60"
      >
        {pending ? "Envoi…" : "Recevoir le code"}
      </button>
    </form>
  );
}
