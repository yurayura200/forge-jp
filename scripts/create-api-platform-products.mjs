#!/usr/bin/env node
/**
 * Forge API Platform 用の Stripe Product + Price を作成。
 * 3 tier: Starter / Growth / Scale（Free は Stripe 不要）。
 * 出力された Price ID を Vercel 環境変数に設定 + Supabase api_plans.stripe_price_id に書き込み。
 *
 * 使い方:
 *   cd /Users/yura/Projects/forge
 *   node --env-file=.env.local scripts/create-api-platform-products.mjs
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

const TIERS = [
  {
    tier: "starter",
    name: "Forge API Starter",
    description: "Forge AI Gateway — Starter プラン。月 50,000 リクエスト + 観測ダッシュボード。",
    monthlyJpy: 980,
  },
  {
    tier: "growth",
    name: "Forge API Growth",
    description: "Forge AI Gateway — Growth プラン。月 500,000 リクエスト + 監視・アラート。",
    monthlyJpy: 4980,
  },
  {
    tier: "scale",
    name: "Forge API Scale",
    description: "Forge AI Gateway — Scale プラン。月 5,000,000 リクエスト + SLA 99.5%。",
    monthlyJpy: 19800,
  },
];

async function ensureProductPrice(t) {
  // product 既存チェック
  const existing = await stripe.products.search({
    query: `name:'${t.name}'`,
    limit: 1,
  });
  let product = existing.data[0];
  if (product) {
    console.log(`[ok] ${t.tier} product 既存: ${product.id}`);
  } else {
    product = await stripe.products.create({
      name: t.name,
      description: t.description,
      metadata: { type: "api_plan", tier: t.tier, managed_by: "forge" },
    });
    console.log(`[create] ${t.tier} product: ${product.id}`);
  }

  // price 既存チェック
  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 10 });
  let price = prices.data.find(
    (p) =>
      p.unit_amount === t.monthlyJpy &&
      p.currency === "jpy" &&
      p.recurring?.interval === "month",
  );
  if (price) {
    console.log(`[ok] ${t.tier} price 既存: ${price.id}`);
  } else {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: t.monthlyJpy,
      currency: "jpy",
      recurring: { interval: "month" },
      metadata: { tier: t.tier, type: "api_plan_monthly" },
    });
    console.log(`[create] ${t.tier} price: ${price.id}`);
  }

  return { product, price };
}

async function main() {
  const result = {};
  for (const t of TIERS) {
    const r = await ensureProductPrice(t);
    result[t.tier] = r.price.id;
  }

  console.log("");
  console.log("==================================================");
  console.log("Vercel 環境変数（プレフィックス STRIPE_API_PRICE_）:");
  for (const [tier, pid] of Object.entries(result)) {
    console.log(`STRIPE_API_PRICE_${tier.toUpperCase()}=${pid}`);
  }
  console.log("==================================================");
  console.log("");
  console.log("Supabase api_plans.stripe_price_id に書き込みも実行します:");

  // Supabase Management API で更新
  const sbpRaw = process.env.SBP_TOKEN;
  if (!sbpRaw) {
    console.log("(SBP_TOKEN env が無いのでスキップ。手動で UPDATE してください)");
    return;
  }
  const PROJECT_REF = "xnrajjiflnkayydhgltu";
  const updates = Object.entries(result)
    .map(
      ([tier, pid]) =>
        `update api_plans set stripe_price_id = '${pid}' where tier = '${tier}';`,
    )
    .join("\n");
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sbpRaw}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: updates }),
    },
  );
  console.log(`Supabase update: ${res.status}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
