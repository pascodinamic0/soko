import { redirect } from "next/navigation";
import { ConversationInbox } from "@/components/conversation-inbox";
import { EmptyState } from "@/components/empty-state";
import {
  getConversations,
  getUnreadCount,
} from "@/lib/chat/queries";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function MessagesPage() {
  if (!hasSupabaseEnv()) {
    return (
      <div className="px-4 pt-8">
        <EmptyState
          title="Messages"
          body="Connectez Supabase pour discuter dans l'app."
          actionLabel="Accueil"
          actionHref="/"
        />
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/messages");

  const conversations = await getConversations(user.id);
  const unreadCounts = await getUnreadCount(conversations, user.id);

  return (
    <div className="px-4 pt-8 pb-4">
      <h1 className="font-[family-name:var(--soko-font-display)] text-2xl font-semibold">
        Messages
      </h1>
      <p className="mt-2 text-sm text-soko-ink-muted">
        Numéro masqué. Discussion dans l&apos;app.
      </p>
      <div className="mt-6">
        {conversations.length === 0 ? (
          <EmptyState
            title="Aucune discussion"
            body="Votre discussion est vide. Explorez le marché ou publiez une annonce."
            actionLabel="Explorer le marché"
            actionHref="/"
          />
        ) : (
          <ConversationInbox
            conversations={conversations}
            userId={user.id}
            unreadCounts={unreadCounts}
          />
        )}
      </div>
    </div>
  );
}
