"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function RequestListingVerification({
  listingId,
  currentStatus,
}: {
  listingId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (currentStatus === "verified" || currentStatus === "pending") {
    return (
      <p className="mt-2 text-xs text-soko-ink-muted">
        {currentStatus === "verified"
          ? "Annonce vérifiée"
          : "Vérification en cours"}
      </p>
    );
  }

  function request() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase
        .from("listings")
        .update({ verification_status: "pending" })
        .eq("id", listingId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={request}
      disabled={pending}
      className="mt-2 text-xs font-semibold text-soko-forest disabled:opacity-60"
    >
      {pending ? "Envoi…" : "Demander Annonce vérifiée"}
    </button>
  );
}
