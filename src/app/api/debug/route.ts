import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json({
      status: "error",
      message: "OPENAI_API_KEY not found in environment",
      hint: "Make sure .env.local exists in the project root with: OPENAI_API_KEY=sk-proj-...",
    });
  }

  return NextResponse.json({
    status: "ok",
    keyPrefix: apiKey.slice(0, 10),
    keySuffix: apiKey.slice(-4),
    keyLength: apiKey.length,
    message: "Key is loaded. If generation still fails, the key may be invalid or lack permissions.",
  });
}
