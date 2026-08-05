"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/supabase/database.types";

export function ChatThread({
  conversationId,
  userId,
  initialMessages,
  listingTitle,
  otherName,
}: {
  conversationId: string;
  userId: string;
  initialMessages: Message[];
  listingTitle: string;
  otherName: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const supabase = createClient();

    async function markRead() {
      for (const msg of initialMessages) {
        if (msg.sender_id !== userId && !msg.read_at) {
          await supabase
            .from("messages")
            .update({ read_at: new Date().toISOString() })
            .eq("id", msg.id);
        }
      }
    }

    markRead();
  }, [conversationId, userId, initialMessages]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
          );
          if (msg.sender_id !== userId) {
            supabase
              .from("messages")
              .update({ read_at: new Date().toISOString() })
              .eq("id", msg.id);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId]);

  function send(event: FormEvent) {
    event.preventDefault();
    const text = body.trim();
    if (!text) return;

    startTransition(async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          body: text,
        })
        .select("*")
        .single();

      if (!error && data) {
        setMessages((prev) =>
          prev.some((m) => m.id === data.id) ? prev : [...prev, data],
        );
        setBody("");
      }
    });
  }

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col">
      <div className="border-b border-soko-line px-4 py-3">
        <Link href="/messages" className="text-sm font-medium text-soko-forest">
          ← Messages
        </Link>
        <p className="mt-1 font-semibold text-soko-ink">{listingTitle}</p>
        <p className="text-xs text-soko-ink-muted">
          {otherName} · Numéro masqué
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((msg) => {
          const mine = msg.sender_id === userId;
          return (
            <div
              key={msg.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <p
                className={`max-w-[85%] rounded-[var(--soko-radius-md)] px-3 py-2 text-sm ${
                  mine
                    ? "bg-soko-forest text-soko-white"
                    : "bg-soko-surface-warm text-soko-ink"
                }`}
              >
                {msg.body}
              </p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={send}
        className="border-t border-soko-line bg-soko-surface/95 px-4 py-3 backdrop-blur-md"
      >
        <div className="flex gap-2">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Votre message…"
            maxLength={4000}
            className="h-11 flex-1 rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white px-3 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={pending || !body.trim()}
            className="h-11 rounded-[var(--soko-radius-md)] bg-soko-forest px-4 text-sm font-semibold text-soko-white disabled:opacity-60"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
}
