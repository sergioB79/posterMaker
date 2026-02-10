import { NextResponse } from "next/server";

// Diagnostic endpoint — shows env key status (GET without ?test)
// or runs a real gpt-image-1 test (GET with ?test=1, costs ~$0.04)
export async function GET(req: Request) {
  const apiKey = (process.env.POSTER_API_KEY || process.env.OPENAI_API_KEY)?.trim();
  const url = new URL(req.url);
  const runTest = url.searchParams.get("test") === "1";

  if (!apiKey) {
    return NextResponse.json({
      status: "error",
      message: "No API key found. Set POSTER_API_KEY or OPENAI_API_KEY in .env.local",
    }, { status: 500 });
  }

  if (!runTest) {
    return NextResponse.json({
      status: "ok",
      keyPrefix: apiKey.slice(0, 10),
      keySuffix: apiKey.slice(-4),
      keyLength: apiKey.length,
      model: "gpt-image-1",
      hint: "Add ?test=1 to run a real image generation test (~$0.04)",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: "A minimal typographic poster with the word HELLO in bold black letters on a white background",
        n: 1,
        size: "1024x1024",
        quality: "low",
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        status: "failed",
        httpStatus: response.status,
        error: data?.error,
      }, { status: 500 });
    }

    return NextResponse.json({
      status: "success",
      hasImage: !!data.data?.[0]?.b64_json || !!data.data?.[0]?.url,
      responseFormat: data.data?.[0]?.b64_json ? "b64_json" : "url",
    });
  } catch (err) {
    return NextResponse.json({
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    }, { status: 500 });
  }
}
