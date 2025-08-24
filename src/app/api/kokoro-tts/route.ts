import { NextRequest, NextResponse } from "next/server";

// Proxy to replicate-kokoro-tts for frontend TTS requests
export async function POST(req: NextRequest) {
  try {
    const { text, language, voice } = await req.json();
    // Forward to replicate-kokoro-tts route (must use absolute URL on server)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/replicate-kokoro-tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language, voice }),
      // @ts-ignore
      next: { revalidate: 0 }, // ensure not cached
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Kokoro TTS error:", data.error || data);
      return NextResponse.json({ error: data.error || "Kokoro TTS failed" }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Kokoro TTS route exception:", error);
    return NextResponse.json({ error: error.message || "Kokoro TTS failed" }, { status: 500 });
  }
}
