"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { timeAgo } from "@/lib/format";
import type { ConversationRow } from "@/lib/chat/queries";

type Tab = "all" | "buy" | "sell" | "unread";

export function ConversationInbox({
  conversations,
  userId,
  unreadCounts,
}: {
  conversations: ConversationRow[];
  userId: string;
  unreadCounts: Record<string, number>;
}) {
  const [tab, setTab] = useState<Tab>("all");

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      if (tab === "buy") return c.buyer_id === userId;
      if (tab === "sell") return c.seller_id === userId;
      if (tab === "unread") return (unreadCounts[c.id] ?? 0) > 0;
      return true;
    });
  }, [conversations, tab, userId, unreadCounts]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "Tous" },
    { id: "buy", label: "Achat" },
    { id: "sell", label: "Vente" },
    { id: "unread", label: "Non lus" },
  ];

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
              tab === t.id
                ? "bg-soko-forest text-soko-white"
                : "bg-soko-surface-warm text-soko-ink-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-soko-ink-muted">
          Votre discussion est vide. Explorez le marché ou publiez une annonce.
        </p>
      ) : (
        <ul className="mt-4">
          {filtered.map((conv) => {
            const other =
              conv.buyer_id === userId
                ? conv.seller?.display_name
                : conv.buyer?.display_name;
            const unread = unreadCounts[conv.id] ?? 0;

            return (
              <li key={conv.id} className="border-b border-soko-line">
                <Link
                  href={`/messages/${conv.id}`}
                  className="flex items-center justify-between gap-3 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-soko-ink">
                      {conv.listing?.title ?? "Annonce"}
                    </p>
                    <p className="truncate text-sm text-soko-ink-muted">
                      {other ?? "Utilisateur Zandocod"}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {conv.last_message_at ? (
                      <p className="text-xs text-soko-ink-muted">
                        {timeAgo(conv.last_message_at)}
                      </p>
                    ) : null}
                    {unread > 0 ? (
                      <span className="mt-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-soko-amber px-1.5 text-[10px] font-bold text-soko-ink">
                        {unread}
                      </span>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
