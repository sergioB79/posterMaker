import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { addCredits } from "@/lib/credits";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    console.error("[stripe webhook] Verification failed:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits || "0", 10);

    if (userId && credits > 0) {
      try {
        await addCredits(userId, credits, session.id);
        console.log(`[stripe webhook] Added ${credits} credits to user ${userId}`);
      } catch (err) {
        console.error("[stripe webhook] Failed to add credits:", err);
        return NextResponse.json({ error: "Failed to add credits" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
