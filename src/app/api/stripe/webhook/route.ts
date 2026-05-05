import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { generateApiKey } from "@/lib/api-gateway/encryption";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// =================================================================
// Engineer Premium subscription
// =================================================================

type EngineerPremiumStatus =
  | "inactive" | "active" | "past_due" | "cancelled" | "expired";

function mapStripeStatus(s: Stripe.Subscription.Status): EngineerPremiumStatus {
  switch (s) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
      return "cancelled";
    case "incomplete":
    case "incomplete_expired":
      return "inactive";
    default:
      return "inactive";
  }
}

async function upsertEngineerSubscription(sub: Stripe.Subscription) {
  const engineerId = (sub.metadata?.engineer_id as string | undefined) || null;
  if (!engineerId) return;

  const adminSb = createServiceRoleClient();

  await adminSb.from("engineer_premium_subscriptions").upsert(
    {
      engineer_id: engineerId,
      stripe_customer_id:
        typeof sub.customer === "string" ? sub.customer : sub.customer.id,
      stripe_subscription_id: sub.id,
      status: mapStripeStatus(sub.status),
      current_period_start: sub.current_period_start
        ? new Date(sub.current_period_start * 1000).toISOString()
        : null,
      current_period_end: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
      cancelled_at: sub.canceled_at
        ? new Date(sub.canceled_at * 1000).toISOString()
        : null,
    },
    { onConflict: "engineer_id" }
  );
}

// =================================================================
// API Platform subscription
// =================================================================

type ApiPlanTier = "free" | "starter" | "growth" | "scale" | "enterprise";

function mapStripeApiStatus(
  s: Stripe.Subscription.Status,
  fallback: ApiPlanTier
): ApiPlanTier {
  if (s === "active" || s === "trialing") return fallback;
  // 失効した場合は free にフォールバック
  return "free";
}

async function upsertApiSubscription(sub: Stripe.Subscription) {
  const tier = (sub.metadata?.api_plan_tier as ApiPlanTier | undefined) || null;
  const customerEmail = (sub.metadata?.customer_email as string | undefined) || null;
  if (!tier) return; // API plan 以外は無視

  const adminSb = createServiceRoleClient();
  const stripeCustomerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  // metadata の email から既存 api_customers を引く（webhook が先に来る場合あり）
  let customerId: string | null = null;
  if (customerEmail) {
    const { data: existing } = await adminSb
      .from("api_customers")
      .select("id")
      .eq("email", customerEmail)
      .maybeSingle();
    customerId = existing?.id ?? null;
  }

  // まだ存在しなければ仮レコード作成（user_id は magic link ログイン時に紐付け）
  if (!customerId && customerEmail) {
    const { data: created } = await adminSb
      .from("api_customers")
      .insert({
        email: customerEmail,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: sub.id,
        current_plan: tier,
      })
      .select("id")
      .single();
    customerId = created?.id ?? null;
  }

  if (!customerId) return;

  await adminSb
    .from("api_customers")
    .update({
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: sub.id,
      current_plan: mapStripeApiStatus(sub.status, tier),
      current_period_start: sub.current_period_start
        ? new Date(sub.current_period_start * 1000).toISOString()
        : null,
      current_period_end: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
    })
    .eq("id", customerId);
}

async function ensureApiKeyForCustomer(customerId: string): Promise<string | null> {
  const adminSb = createServiceRoleClient();
  const { data: existing } = await adminSb
    .from("api_keys")
    .select("id")
    .eq("customer_id", customerId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  if (existing) return null; // 既存あり、新規発行は dashboard 側で

  const { key, prefix, hash } = generateApiKey();
  await adminSb.from("api_keys").insert({
    customer_id: customerId,
    key_prefix: prefix,
    key_hash: hash,
    display_name: "Default",
    status: "active",
  });
  return key;
}

// =================================================================
// Webhook handler
// =================================================================

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json(
      { error: "Missing stripe signature or webhook secret" },
      { status: 400 }
    );
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        // どのタイプか metadata で判定（重複しても無害）
        if (sub.metadata?.engineer_id) await upsertEngineerSubscription(sub);
        if (sub.metadata?.api_plan_tier) await upsertApiSubscription(sub);
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;
        const subId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;
        const sub = await stripe.subscriptions.retrieve(subId);

        if (session.metadata?.forge_engineer_premium === "true") {
          await upsertEngineerSubscription(sub);
        }

        if (session.metadata?.forge_api_plan === "true") {
          await upsertApiSubscription(sub);
          // 初回 API key 発行
          if (sub.metadata?.customer_email) {
            const adminSb = createServiceRoleClient();
            const { data: c } = await adminSb
              .from("api_customers")
              .select("id")
              .eq("email", sub.metadata.customer_email as string)
              .maybeSingle();
            if (c) {
              await ensureApiKeyForCustomer(c.id);
            }
          }
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook] handler error:", err);
    return NextResponse.json(
      {
        error: "Handler error",
        detail: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
