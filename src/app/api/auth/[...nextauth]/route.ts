import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Lazy-init handler to avoid running NextAuth + PrismaAdapter at build time
let _handler: ((req: NextRequest, ctx: { params: { nextauth: string[] } }) => Promise<Response>) | null = null;

async function getHandler() {
  if (!_handler) {
    const { default: NextAuth } = await import("next-auth");
    const { getAuthOptions } = await import("@/lib/auth");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _handler = NextAuth(getAuthOptions()) as any;
  }
  return _handler!;
}

export async function GET(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
  const handler = await getHandler();
  return handler(req, ctx);
}

export async function POST(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
  const handler = await getHandler();
  return handler(req, ctx);
}
