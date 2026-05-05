#!/usr/bin/env node
/**
 * Forge 用の Stripe Webhook Endpoint を作成する。
 * 一度だけ実行する。出力された signing secret を Vercel 環境変数 STRIPE_WEBHOOK_SECRET に設定。
 */
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY not set");
  process.exit(1);
}

const stripe = new Stripe(key, {
  apiVersion: "2025-02-24.acacia",
});

const FORGE_WEBHOOK_URL = "https://forge.komugi-ai.jp/api/stripe/webhook";

async function main() {
  // 既存 webhook をチェック
  const existing = await stripe.webhookEndpoints.list({ limit: 100 });
  const found = existing.data.find((w) => w.url === FORGE_WEBHOOK_URL);

  if (found) {
    console.log(`[ok] webhook 既存: ${found.id}`);
    console.log(`     URL: ${found.url}`);
    console.log(
      `     注意: signing secret は作成時にしか取得不可。既存の値を使うか、削除して再作成してください。`
    );
    return;
  }

  const endpoint = await stripe.webhookEndpoints.create({
    url: FORGE_WEBHOOK_URL,
    enabled_events: [
      "checkout.session.completed",
      "customer.subscription.created",
      "customer.subscription.updated",
      "customer.subscription.deleted",
    ],
    description: "Forge — Engineer Premium subscription handler",
    metadata: {
      managed_by: "forge",
      type: "engineer_premium",
    },
  });

  console.log(`[create] webhook 作成: ${endpoint.id}`);
  console.log(`     URL: ${endpoint.url}`);
  console.log("");
  console.log("==================================================");
  console.log("Vercel 環境変数に追加してください:");
  console.log(`STRIPE_WEBHOOK_SECRET=${endpoint.secret}`);
  console.log("==================================================");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
