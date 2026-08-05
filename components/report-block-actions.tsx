"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ReportBlockActions({
  listingId,
  reportedUserId,
}: {
  listingId: string;
  reportedUserId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function report() {
    const reason = window.prompt("Motif du signalement :");
    if (!reason?.trim()) return;

    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/auth?next=/annonce/${listingId}`);
        return;
      }

      await supabase.from("reports").insert({
        reporter_id: user.id,
        reported_user_id: reportedUserId,
        listing_id: listingId,
        reason: reason.trim(),
      });
      alert("Signalement envoyé. Merci.");
    });
  }

  function blockUser() {
    if (!window.confirm("Bloquer cet utilisateur ?")) return;

    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("blocks").insert({
        blocker_id: user.id,
        blocked_id: reportedUserId,
      });
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div className="mt-6 flex gap-3 text-sm">
      <button
        type="button"
        onClick={report}
        disabled={pending}
        className="text-soko-danger underline-offset-2 hover:underline"
      >
        Signaler
      </button>
      <button
        type="button"
        onClick={blockUser}
        disabled={pending}
        className="text-soko-ink-muted underline-offset-2 hover:underline"
      >
        Bloquer
      </button>
    </div>
  );
}
