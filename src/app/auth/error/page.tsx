"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "Access denied. You may not have permission.",
    Verification: "The verification link has expired or has already been used.",
    Default: "An authentication error occurred.",
  };

  const message = errorMessages[error || "Default"] || errorMessages.Default;

  return (
    <div className="w-full max-w-sm text-center">
      <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center mx-auto mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-white mb-2">Authentication Error</h1>
      <p className="text-sm text-neutral-400 mb-6">{message}</p>
      <Link
        href="/auth/signin"
        className="inline-block rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 text-sm transition-colors"
      >
        Try Again
      </Link>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-neutral-500 text-sm">Loading...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
