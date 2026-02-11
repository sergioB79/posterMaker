import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";

type TxClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

export async function checkCredits(userId: string, required: number = 1) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  const credits = user?.credits ?? 0;
  return { ok: credits >= required, credits };
}

export async function deductCredits(
  userId: string,
  amount: number,
  generationId: string
) {
  return prisma.$transaction(async (tx: TxClient) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user || user.credits < amount) {
      throw new Error("Insufficient credits");
    }

    const updated = await tx.user.update({
      where: { id: userId },
      data: { credits: { decrement: amount } },
      select: { credits: true },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount: -amount,
        type: "generation",
        reference: generationId,
      },
    });

    return updated.credits;
  });
}

export async function addCredits(
  userId: string,
  amount: number,
  stripeSessionId: string
) {
  const existing = await prisma.creditTransaction.findFirst({
    where: { userId, reference: stripeSessionId, type: "purchase" },
  });
  if (existing) return;

  return prisma.$transaction(async (tx: TxClient) => {
    await tx.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount,
        type: "purchase",
        reference: stripeSessionId,
      },
    });
  });
}

export async function getCreditHistory(userId: string, limit: number = 20) {
  return prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
