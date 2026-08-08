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
    <div className="mt-8 border-t border-soko-line/70 pt-5">
      <p className="text-xs text-soko-ink-muted">
        Un problème avec cette annonce ?
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={report}
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-[var(--soko-radius-md)] border border-soko-line/80 bg-soko-white px-3 py-2.5 text-sm font-medium text-soko-ink transition-colors hover:border-soko-danger/40 hover:bg-soko-danger/5 hover:text-soko-danger disabled:opacity-50"
        >
          <FlagIcon />
          Signaler
        </button>
        <button
          type="button"
          onClick={blockUser}
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-[var(--soko-radius-md)] border border-soko-line/80 bg-soko-white px-3 py-2.5 text-sm font-medium text-soko-ink-muted transition-colors hover:border-soko-ink/25 hover:bg-soko-mist/60 hover:text-soko-ink disabled:opacity-50"
        >
          <BlockIcon />
          Bloquer
        </button>
      </div>
    </div>
  );
}

function FlagIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 21V4m0 0h9.5l-1.2 3.2L16 11H5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BlockIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7.2 7.2 16.8 16.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
