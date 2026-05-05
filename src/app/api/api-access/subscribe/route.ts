import { NextRequest, NextResponse } from "next/server";
import { stripe, SITE_URL } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { generateApiKey } from "@/lib/api-gateway/encryption";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PRICE_ID_BY_TIER: Record<string, string | undefined> = {
  starter: process.env.STRIPE_API_PRICE_STARTER,
  growth: process.env.STRIPE_API_PRICE_GROWTH,
  scale: process.env.STRIPE_API_PRICE_SCALE,
};

export async function POST(req: NextRequest) {
  let body: { email?: string; tier?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const email = (body.email || "").trim().toLowerCase();
  const tier = body.tier || "";

  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!["free", "starter", "growth", "scale"].includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const adminSb = createServiceRoleClient();

  // Free プランは Stripe を介さず即座に customer 作成 + magic link でログイン誘導
  if (tier === "free") {
    let { data: customer } = await adminSb
      .from("api_customers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!customer) {
      const { data: created } = await adminSb
        .from("api_customers")
        .insert({ email, current_plan: "free" })
        .select("id")
        .single();
      customer = created || null;
    }
    if (customer) {
      // 初回 API key 発行
      const { data: existingKey } = await adminSb
        .from("api_keys")
        .select("id")
        .eq("customer_id", customer.id)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();
      if (!existingKey) {
        const { prefix, hash } = generateApiKey();
        await adminSb.from("api_keys").insert({
          customer_id: customer.id,
          key_prefix: prefix,
          key_hash: hash,
          display_name: "Default",
          status: "active",
        });
      }
    }

    // Magic link を発行（Supabase Auth）
    const { error: linkErr } = await adminSb.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${SITE_URL}/companies/dashboard`,
    });
    // 既に存在するユーザーには generateLink で OTP 送信
    if (linkErr) {
      await adminSb.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo: `${SITE_URL}/companies/dashboard` },
      });
    }

    return NextResponse.json({ ok: true, free: true });
  }

  // 有料プラン → Stripe Checkout
  const priceId = PRICE_ID_BY_TIER[tier];
  if (!priceId) {
    return NextResponse.json(
      { error: "Plan price not configured" },
      { status: 500 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${SITE_URL}/companies/dashboard?welcome=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/api-access`,
    allow_promotion_codes: true,
    locale: "ja",
    metadata: {
      forge_api_plan: "true",
      api_plan_tier: tier,
      customer_email: email,
    },
    subscription_data: {
      metadata: {
        forge_api_plan: "true",
        api_plan_tier: tier,
        customer_email: email,
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
