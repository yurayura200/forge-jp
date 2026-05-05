#!/usr/bin/env node
/**
 * Forge Engineer Premium プラン用の Stripe Product + Price を作成する。
 * 一度だけ実行する。出力された Price ID を Vercel 環境変数 STRIPE_ENGINEER_PREMIUM_PRICE_ID に設定。
 *
 * 使い方:
 *   cd /Users/yura/Projects/forge
 *   node --env-file=.env.local scripts/create-engineer-premium-product.mjs
 */
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY not set");
  process.exit(1);
}

const stripe = new Stripe(key, {
  apiVersion: "2024-11-20.acacia",
});

async function main() {
  const productName = "Forge Engineer Premium";
  const description = "Forge エンジニア向け月額プラン。優先案件配信・直接DM・実績バッジ。";

  // 既存 product チェック
  const existing = await stripe.products.search({
    query: `name:'${productName}'`,
    limit: 1,
  });

  let product;
  if (existing.data.length > 0) {
    product = existing.data[0];
    console.log(`[ok] product 既存: ${product.id}`);
  } else {
    product = await stripe.products.create({
      name: productName,
      description,
      metadata: {
        type: "engineer_premium",
        managed_by: "forge",
      },
    });
    console.log(`[create] product 作成: ${product.id}`);
  }

  // 既存 price チェック（同じ amount/currency/interval）
  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 10,
  });
  const existingPrice = prices.data.find(
    (p) =>
      p.unit_amount === 3000 &&
      p.currency === "jpy" &&
      p.recurring?.interval === "month",
  );

  let price;
  if (existingPrice) {
    price = existingPrice;
    console.log(`[ok] price 既存: ${price.id}`);
  } else {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: 3000,
      currency: "jpy",
      recurring: {
        interval: "month",
      },
      metadata: {
        type: "engineer_premium_monthly",
      },
    });
    console.log(`[create] price 作成: ${price.id}`);
  }

  console.log("");
  console.log("==================================================");
  console.log("Vercel 環境変数に追加してください:");
  console.log(`STRIPE_ENGINEER_PREMIUM_PRICE_ID=${price.id}`);
  console.log("==================================================");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
