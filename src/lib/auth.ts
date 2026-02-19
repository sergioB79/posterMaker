import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "./prisma";

let _authOptions: NextAuthOptions | null = null;

export function getAuthOptions(): NextAuthOptions {
  if (_authOptions) return _authOptions;

  _authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      ...(process.env.GOOGLE_CLIENT_ID
        ? [
            GoogleProvider({
              clientId: process.env.GOOGLE_CLIENT_ID!,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            }),
          ]
        : []),
      ...(process.env.EMAIL_SERVER
        ? [
            EmailProvider({
              server: process.env.EMAIL_SERVER,
              from: process.env.EMAIL_FROM || "Poster Maker <noreply@postermaker.app>",
            }),
          ]
        : []),
    ],
    callbacks: {
      async session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { credits: true },
          });
          session.user.credits = dbUser?.credits ?? 0;
        }
        return session;
      },
    },
    events: {
      async createUser({ user }) {
        const email = user.email?.toLowerCase();
        if (!email) return;

        // Check if this email already received the signup bonus
        const alreadyUsed = await prisma.usedSignupEmail.findUnique({
          where: { email },
        });

        if (alreadyUsed) return; // No free credits for re-registrations

        // Grant signup bonus and record the email
        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: { credits: 2 },
          }),
          prisma.creditTransaction.create({
            data: {
              userId: user.id,
              amount: 2,
              type: "signup_bonus",
              reference: "welcome",
            },
          }),
          prisma.usedSignupEmail.create({
            data: { email },
          }),
        ]);
      },
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
    session: {
      strategy: "database",
    },
  };

  return _authOptions;
}

// For getServerSession() calls — lazy getter
export const authOptions = new Proxy({} as NextAuthOptions, {
  get(_, prop) {
    return Reflect.get(getAuthOptions(), prop);
  },
});
