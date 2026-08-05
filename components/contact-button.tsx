"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ContactButton({
  listingId,
  sellerId,
}: {
  listingId: string;
  sellerId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function contact() {
    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/auth?next=/annonce/${listingId}`);
        return;
      }

      if (user.id === sellerId) {
        router.push("/mes-annonces");
        return;
      }

      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("listing_id", listingId)
        .eq("buyer_id", user.id)
        .maybeSingle();

      if (existing) {
        router.push(`/messages/${existing.id}`);
        return;
      }

      const { data: created, error } = await supabase
        .from("conversations")
        .insert({
          listing_id: listingId,
          buyer_id: user.id,
          seller_id: sellerId,
        })
        .select("id")
        .single();

      if (error) {
        console.error(error);
        return;
      }

      router.push(`/messages/${created.id}`);
    });
  }

  return (
    <button
      type="button"
      onClick={contact}
      disabled={pending}
      className="flex h-12 flex-1 items-center justify-center rounded-[var(--soko-radius-md)] bg-soko-forest font-semibold text-soko-white disabled:opacity-60"
    >
      {pending ? "Ouverture…" : "Contacter"}
    </button>
  );
}
