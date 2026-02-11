"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { CREDIT_PACKS } from "@/lib/credit-packs";

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string>();

  const handleBuy = async (packId: string) => {
    if (!session) {
      window.location.href = "/auth/signin";
      return;
    }

    setLoading(packId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <nav className="border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <span className="text-base font-semibold text-white tracking-tight">Poster Maker</span>
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-xs text-neutral-400">{session.user.credits} credits</span>
                <Link href="/create" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">Create</Link>
              </>
            ) : (
              <Link href="/auth/signin" className="text-sm text-neutral-300 hover:text-white transition-colors">Sign in</Link>
            )}
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-white text-center mb-3">Buy Credits</h1>
        <p className="text-neutral-400 text-center mb-4">1 credit = 1 poster image. No subscription required.</p>
        {!session && (
          <p className="text-center text-sm text-orange-300 mb-8">
            Sign up first to get <strong>2 free credits</strong>.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`rounded-2xl border p-8 relative ${
                pack.popular
                  ? "bg-orange-500/5 border-orange-500/30 shadow-lg shadow-orange-500/5"
                  : "bg-neutral-900 border-neutral-800"
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-400 bg-orange-500/15 border border-orange-500/30 rounded-full px-3 py-1">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">{pack.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">&euro;{pack.priceDisplay}</span>
                </div>
                <p className="text-neutral-400 mt-2">{pack.credits} credits</p>
                <p className="text-xs text-neutral-500 mt-1">&euro;{pack.perImage} per poster</p>

                <button
                  onClick={() => handleBuy(pack.id)}
                  disabled={loading === pack.id}
                  className={`w-full mt-6 rounded-xl py-3 text-sm font-semibold transition-all ${
                    pack.popular
                      ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/20"
                      : "bg-neutral-800 border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white"
                  } disabled:opacity-50`}
                >
                  {loading === pack.id ? "Redirecting..." : `Buy ${pack.credits} Credits`}
                </button>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-neutral-400">
                <li className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  High-resolution output
                </li>
                <li className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  All styles & influences
                </li>
                <li className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  Credits never expire
                </li>
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How many credits per poster?", a: "Each poster image costs 1 credit. If you generate 4 variations, that uses 4 credits." },
              { q: "Do credits expire?", a: "No, your credits never expire. Use them whenever you want." },
              { q: "Can I get a refund?", a: "If you have unused credits within 7 days of purchase, contact us for a full refund." },
              { q: "What payment methods do you accept?", a: "All major credit cards via Stripe. Your payment info is never stored on our servers." },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl bg-neutral-900 border border-neutral-800 p-5">
                <h3 className="text-sm font-medium text-white">{faq.q}</h3>
                <p className="text-sm text-neutral-400 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-800 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-xs text-neutral-600">
          <span>Poster Maker</span>
          <Link href="/" className="hover:text-neutral-400 transition-colors">Home</Link>
        </div>
      </footer>
    </div>
  );
}
