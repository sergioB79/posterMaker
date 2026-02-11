import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    // During build, DATABASE_URL may not exist. Return a proxy that defers
    // errors until actual DB access — prevents build-time crashes.
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (typeof prop === "symbol" || prop === "then") return undefined;
        return () => {
          throw new Error(
            `DATABASE_URL is not set. Cannot use prisma.${String(prop)} at build time.`
          );
        };
      },
    });
  }
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
