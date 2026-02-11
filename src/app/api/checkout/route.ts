import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { CREDIT_PACKS } from "@/lib/credit-packs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { packId } = await req.json();
  const pack = CREDIT_PACKS.find((p) => p.id === packId);

  if (!pack) {
    return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
  }

  const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${pack.name} — ${pack.credits} Credits`,
            description: `${pack.credits} poster generation credits for Poster Maker`,
          },
          unit_amount: pack.priceEur,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id,
      packId: pack.id,
      credits: String(pack.credits),
    },
    success_url: `${origin}/create?purchased=${pack.credits}`,
    cancel_url: `${origin}/pricing`,
    customer_email: session.user.email || undefined,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
