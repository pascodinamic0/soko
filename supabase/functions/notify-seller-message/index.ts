// Supabase Edge Function: notify seller on new message via Twilio SMS
// Deploy: supabase functions deploy notify-seller-message
// Set secrets: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type WebhookPayload = {
  type: "INSERT";
  table: "messages";
  record: {
    id: string;
    conversation_id: string;
    sender_id: string;
    body: string;
  };
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const payload = (await req.json()) as WebhookPayload;
  if (payload.type !== "INSERT" || payload.table !== "messages") {
    return new Response(JSON.stringify({ ok: true, skipped: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: conversation } = await supabase
    .from("conversations")
    .select("buyer_id, seller_id, listing:listings(title)")
    .eq("id", payload.record.conversation_id)
    .single();

  if (!conversation) {
    return new Response(JSON.stringify({ ok: false, error: "no conversation" }), {
      status: 404,
    });
  }

  const sellerId = conversation.seller_id;
  if (payload.record.sender_id === sellerId) {
    return new Response(JSON.stringify({ ok: true, skipped: "seller sent" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: sellerAuth } = await supabase.auth.admin.getUserById(sellerId);
  const phone = sellerAuth.user?.phone;
  if (!phone) {
    return new Response(JSON.stringify({ ok: true, skipped: "no phone" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const listingTitle =
    (conversation.listing as { title?: string } | null)?.title ?? "une annonce";
  const body = `Zandocod: Nouveau message sur « ${listingTitle} ». Ouvrez l'app pour répondre.`;

  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const from = Deno.env.get("TWILIO_FROM_NUMBER");

  if (!accountSid || !authToken || !from) {
    return new Response(JSON.stringify({ ok: true, skipped: "twilio not configured" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params = new URLSearchParams({ To: phone, From: from, Body: body });

  const twilioRes = await fetch(twilioUrl, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!twilioRes.ok) {
    const err = await twilioRes.text();
    return new Response(JSON.stringify({ ok: false, error: err }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
