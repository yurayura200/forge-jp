import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type EngineerPremiumStatus =
  | "inactive"
  | "active"
  | "past_due"
  | "cancelled"
  | "expired";

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

async function upsertSubscription(sub: Stripe.Subscription) {
  const engineerId =
    (sub.metadata?.engineer_id as string | undefined) ||
    null;

  if (!engineerId) {
    // Forge Engineer Premium 以外の subscription は無視
    return;
  }

  const adminSb = createServiceRoleClient();

  const periodStart = sub.current_period_start
    ? new Date(sub.current_period_start * 1000).toISOString()
    : null;
  const periodEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  await adminSb
    .from("engineer_premium_subscriptions")
    .upsert(
      {
        engineer_id: engineerId,
        stripe_customer_id:
          typeof sub.customer === "string" ? sub.customer : sub.customer.id,
        stripe_subscription_id: sub.id,
        status: mapStripeStatus(sub.status),
        current_period_start: periodStart,
        current_period_end: periodEnd,
        cancel_at_period_end: sub.cancel_at_period_end ?? false,
        cancelled_at: sub.canceled_at
          ? new Date(sub.canceled_at * 1000).toISOString()
          : null,
      },
      { onConflict: "engineer_id" }
    );
}

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
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscription(sub);
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (
          session.mode === "subscription" &&
          session.subscription &&
          session.metadata?.forge_engineer_premium === "true"
        ) {
          const subId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertSubscription(sub);
        }
        break;
      }
      default:
        // 他イベントは無視
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook] handler error:", err);
    return NextResponse.json(
      { error: "Handler error", detail: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
