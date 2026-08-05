"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function FavoriteButton({
  listingId,
  initialFavorited,
}: {
  listingId: string;
  initialFavorited: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [favorited, setFavorited] = useState(initialFavorited);

  function toggle() {
    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/auth?next=/annonce/${listingId}`);
        return;
      }

      if (favorited) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("listing_id", listingId);
        setFavorited(false);
      } else {
        await supabase.from("favorites").insert({
          user_id: user.id,
          listing_id: listingId,
        });
        setFavorited(true);
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={favorited}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-soko-line bg-soko-white text-soko-forest disabled:opacity-60"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${favorited ? "fill-soko-clay text-soko-clay" : "fill-none"}`}
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
      </svg>
      <span className="sr-only">
        {favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
      </span>
    </button>
  );
}
