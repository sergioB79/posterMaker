import { NextResponse } from "next/server";

// Minimal test endpoint — replicates the exact PowerShell call that worked
export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json({ error: "No API key found" }, { status: 500 });
  }

  try {
    // Exact same call as the PowerShell test
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: "A minimal typographic poster, black and white",
        n: 1,
        size: "1024x1024",
      }),
      // Bypass Next.js fetch cache
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        status: "failed",
        httpStatus: response.status,
        error: data?.error,
        keyUsed: `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}`,
      }, { status: 500 });
    }

    return NextResponse.json({
      status: "success",
      imageUrl: data.data?.[0]?.url,
      revisedPrompt: data.data?.[0]?.revised_prompt?.slice(0, 100),
    });
  } catch (err) {
    return NextResponse.json({
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    }, { status: 500 });
  }
}
