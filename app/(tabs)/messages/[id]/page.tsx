import { notFound, redirect } from "next/navigation";
import { ChatThread } from "@/components/chat-thread";
import {
  getConversation,
  getMessages,
} from "@/lib/chat/queries";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

type Params = Promise<{ id: string }>;

export default async function MessageThreadPage({
  params,
}: {
  params: Params;
}) {
  if (!hasSupabaseEnv()) redirect("/messages");

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/auth?next=/messages/${id}`);

  const conversation = await getConversation(id, user.id);
  if (!conversation) notFound();

  const messages = await getMessages(id);
  const otherName =
    conversation.buyer_id === user.id
      ? conversation.seller?.display_name ?? "Vendeur"
      : conversation.buyer?.display_name ?? "Acheteur";

  return (
    <ChatThread
      conversationId={id}
      userId={user.id}
      initialMessages={messages}
      listingTitle={conversation.listing?.title ?? "Annonce"}
      otherName={otherName ?? "Utilisateur Soko"}
    />
  );
}
