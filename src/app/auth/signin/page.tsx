"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await signIn("email", { email, redirect: false });
    setEmailSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Sign in to Poster Maker</h1>
          <p className="text-sm text-neutral-400 mt-1">Get 2 free credits to start creating</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/create" })}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-medium py-3 text-sm transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-800" />
            <span className="text-xs text-neutral-500">or</span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>

          {emailSent ? (
            <div className="text-center py-4">
              <p className="text-sm text-neutral-300">Check your email</p>
              <p className="text-xs text-neutral-500 mt-1">
                We sent a magic link to <strong className="text-neutral-300">{email}</strong>
              </p>
            </div>
          ) : (
            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-neutral-800 border border-neutral-700 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 border border-neutral-700 text-white font-medium py-3 text-sm transition-colors"
              >
                {loading ? "Sending..." : "Sign in with Email"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-neutral-600 mt-6">
          By signing in you agree to our terms of service.
        </p>

        <div className="text-center mt-4">
          <Link href="/" className="text-xs text-neutral-500 hover:text-orange-300 transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
