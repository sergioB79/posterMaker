import Link from "next/link";
import { CREDIT_PACKS } from "@/lib/credit-packs";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <nav className="border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <span className="text-base font-semibold text-white tracking-tight">Poster Maker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-neutral-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="/gallery" className="text-sm text-neutral-400 hover:text-white transition-colors">Gallery</Link>
            <Link href="/auth/signin" className="text-sm text-neutral-300 hover:text-white transition-colors">Sign in</Link>
            <Link href="/auth/signin" className="rounded-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium px-4 py-2 text-sm transition-all">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs text-orange-300 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          Powered by AI
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight max-w-3xl mx-auto">
          Design stunning posters
          <br />
          <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            in seconds, not hours
          </span>
        </h1>
        <p className="text-lg text-neutral-400 mt-6 max-w-xl mx-auto leading-relaxed">
          Describe your vision, choose artistic influences from legendary designers,
          and let AI generate professional poster designs instantly.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link href="/auth/signin" className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold px-8 py-3.5 text-sm transition-all shadow-lg shadow-orange-500/20">
            Start Creating — 2 Free Credits
          </Link>
          <Link href="#how-it-works" className="rounded-xl border border-neutral-700 hover:border-neutral-600 text-neutral-300 font-medium px-8 py-3.5 text-sm transition-colors">
            How it works
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
              title: "25+ Artist Influences",
              desc: "Choose from Saul Bass, Paula Scher, Muller-Brockmann, and more. Each influence brings authentic visual DNA to your design.",
            },
            {
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
              title: "12 Styles & Formats",
              desc: "Swiss, Brutalist, Retro, Art Deco, and more. Export in A4, A3, Instagram, or custom formats.",
            },
            {
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
              title: "Perfect Text Rendering",
              desc: "Advanced AI model trained for typography. Your poster text appears exactly as specified — letter-perfect.",
            },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 hover:border-neutral-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-white text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Describe", desc: "Write a brief describing your poster concept and add text fields with priority levels." },
            { step: "02", title: "Style it", desc: "Choose a visual style, artistic influences, format, and design tone." },
            { step: "03", title: "Generate", desc: "AI creates multiple poster variations based on your specifications." },
            { step: "04", title: "Download", desc: "Pick your favorite, download in high resolution, ready to print or share." },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent mb-3">{s.step}</div>
              <h3 className="text-white font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-neutral-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-white text-center mb-3">Simple pricing</h2>
        <p className="text-neutral-400 text-center mb-10">Start free. Pay only when you need more.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {CREDIT_PACKS.map((pack) => (
            <div key={pack.id} className={`rounded-2xl border p-6 text-center ${pack.popular ? "bg-orange-500/5 border-orange-500/30" : "bg-neutral-900 border-neutral-800"}`}>
              {pack.popular && <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-orange-400 bg-orange-500/10 rounded-full px-2 py-0.5 mb-3">Popular</span>}
              <h3 className="text-white font-semibold">{pack.name}</h3>
              <div className="mt-2"><span className="text-3xl font-bold text-white">&euro;{pack.priceDisplay}</span></div>
              <p className="text-sm text-neutral-400 mt-1">{pack.credits} credits</p>
              <p className="text-xs text-neutral-500 mt-0.5">&euro;{pack.perImage} per poster</p>
              <Link href="/auth/signin" className={`block mt-4 rounded-xl py-2.5 text-sm font-medium transition-colors ${pack.popular ? "bg-gradient-to-r from-orange-500 to-red-600 text-white" : "bg-neutral-800 border border-neutral-700 text-neutral-300 hover:border-neutral-600"}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-neutral-600 mt-6">1 credit = 1 poster image. Free tier includes 2 credits on signup.</p>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-600/10 border border-orange-500/20 p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to create?</h2>
          <p className="text-neutral-400 mb-6">Sign up and get 2 free poster credits. No credit card required.</p>
          <Link href="/auth/signin" className="inline-block rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold px-8 py-3.5 text-sm transition-all shadow-lg shadow-orange-500/20">
            Start Creating Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-neutral-800 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-xs text-neutral-600">
          <span>Poster Maker</span>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hover:text-neutral-400 transition-colors">Pricing</Link>
            <Link href="/auth/signin" className="hover:text-neutral-400 transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
