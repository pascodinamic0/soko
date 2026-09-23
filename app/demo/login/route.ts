import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const role = (body?.role as "buyer" | "seller") ?? "buyer";

  const buyerEmail = process.env.DEMO_BUYER_EMAIL;
  const buyerPassword = process.env.DEMO_BUYER_PASSWORD;
  const sellerEmail = process.env.DEMO_SELLER_EMAIL;
  const sellerPassword = process.env.DEMO_SELLER_PASSWORD;

  const email =
    role === "seller" ? sellerEmail ?? "" : buyerEmail ?? "";
  const password =
    role === "seller" ? sellerPassword ?? "" : buyerPassword ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing demo credentials" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}

