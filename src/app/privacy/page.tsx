import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-xs text-neutral-500 hover:text-orange-300 transition-colors">
          &larr; Back to home
        </Link>

        <h1 className="text-2xl font-bold text-white mt-6 mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-white mb-2">1. Information We Collect</h2>
            <p>When you use Poster Maker, we collect:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong className="text-white">Account information:</strong> Name, email address, and profile picture from your Google account.</li>
              <li><strong className="text-white">Usage data:</strong> Poster generation prompts, style preferences, and generation history.</li>
              <li><strong className="text-white">Payment data:</strong> Processed securely by Stripe. We do not store your card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">2. How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To provide and operate the poster generation service</li>
              <li>To manage your account, credits, and transactions</li>
              <li>To process payments through Stripe</li>
              <li>To improve the service and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">3. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong className="text-white">Google OAuth:</strong> For authentication. Subject to Google&apos;s privacy policy.</li>
              <li><strong className="text-white">OpenAI:</strong> For AI image generation. Prompts are sent to OpenAI&apos;s API.</li>
              <li><strong className="text-white">Stripe:</strong> For payment processing. Subject to Stripe&apos;s privacy policy.</li>
              <li><strong className="text-white">Vercel:</strong> For hosting and image storage.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">4. Data Storage and Security</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Account data is stored in a secure PostgreSQL database.</li>
              <li>Generated images are stored on Vercel Blob Storage.</li>
              <li>We use HTTPS encryption for all data in transit.</li>
              <li>We do not sell your personal data to third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">5. Your Rights</h2>
            <p>Under GDPR and applicable data protection laws, you have the right to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data in a portable format</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">6. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. These are necessary
              for the service to function and cannot be disabled.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">7. Contact</h2>
            <p>
              For any privacy-related questions or data requests, please contact us at the email
              address associated with the service.
            </p>
          </section>

          <p className="text-neutral-500 pt-4 border-t border-neutral-800">
            Last updated: February 2026
          </p>
        </div>
      </div>
    </div>
  );
}
