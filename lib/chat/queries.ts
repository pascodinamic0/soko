import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Conversation, Listing, Profile } from "@/lib/supabase/database.types";

export type ConversationRow = Conversation & {
  listing: Pick<Listing, "id" | "title"> | null;
  buyer: Pick<Profile, "id" | "display_name"> | null;
  seller: Pick<Profile, "id" | "display_name"> | null;
};

export async function getConversations(userId: string): Promise<ConversationRow[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select(`
      *,
      listing:listings(id, title),
      buyer:profiles!conversations_buyer_id_fkey(id, display_name),
      seller:profiles!conversations_seller_id_fkey(id, display_name)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  return (data as ConversationRow[]) ?? [];
}

export async function getConversation(
  conversationId: string,
  userId: string,
): Promise<ConversationRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select(`
      *,
      listing:listings(id, title),
      buyer:profiles!conversations_buyer_id_fkey(id, display_name),
      seller:profiles!conversations_seller_id_fkey(id, display_name)
    `)
    .eq("id", conversationId)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .maybeSingle();

  return data as ConversationRow | null;
}

export async function getMessages(conversationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

export async function getUnreadCount(
  conversations: ConversationRow[],
  userId: string,
): Promise<Record<string, number>> {
  const supabase = await createClient();
  const counts: Record<string, number> = {};

  for (const conv of conversations) {
    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("conversation_id", conv.id)
      .neq("sender_id", userId)
      .is("read_at", null);

    counts[conv.id] = count ?? 0;
  }

  return counts;
}
