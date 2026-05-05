import { NextResponse } from "next/server";
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";
import { stripe, ENGINEER_PREMIUM_PRICE_ID, SITE_URL } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!ENGINEER_PREMIUM_PRICE_ID) {
    return NextResponse.json(
      { error: "Premium price ID is not configured" },
      { status: 500 }
    );
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 登録済みエンジニアか確認
  const { data: engineer } = await supabase
    .from("engineers")
    .select("id, email, display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!engineer) {
    return NextResponse.json(
      { error: "Engineer not registered. Apply first at /engineers/apply." },
      { status: 403 }
    );
  }

  const adminSb = createServiceRoleClient();

  // 既存 sub の Stripe customer_id を再利用 or 新規作成
  const { data: existingSub } = await adminSb
    .from("engineer_premium_subscriptions")
    .select("stripe_customer_id, status")
    .eq("engineer_id", engineer.id)
    .maybeSingle();

  if (existingSub?.status === "active") {
    return NextResponse.json(
      { error: "Already subscribed" },
      { status: 400 }
    );
  }

  let customerId = existingSub?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: engineer.email || user.email || undefined,
      name: engineer.display_name,
      metadata: {
        engineer_id: engineer.id,
        forge_engineer: "true",
      },
    });
    customerId = customer.id;

    // upsert: customer_id を仮レコードとして保存（subscription_id は webhook で埋める）
    await adminSb.from("engineer_premium_subscriptions").upsert(
      {
        engineer_id: engineer.id,
        stripe_customer_id: customerId,
        status: "inactive",
      },
      { onConflict: "engineer_id" }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: ENGINEER_PREMIUM_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${SITE_URL}/engineers/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/engineers/subscribe`,
    allow_promotion_codes: true,
    locale: "ja",
    metadata: {
      engineer_id: engineer.id,
      forge_engineer_premium: "true",
    },
    subscription_data: {
      metadata: {
        engineer_id: engineer.id,
        forge_engineer_premium: "true",
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
