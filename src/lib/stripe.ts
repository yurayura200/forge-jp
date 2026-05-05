import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY env not set");
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const ENGINEER_PREMIUM_PRICE_ID =
  process.env.STRIPE_ENGINEER_PREMIUM_PRICE_ID || "";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://forge.komugi-ai.jp";
