import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, description } = await req.json();
    // You can parse emotion, voice_id, language_boost, etc. from description if needed
    // For now, use defaults or parse simple values
    const input = {
      text: prompt,
      emotion: "happy",
      voice_id: "Friendly_Person",
      language_boost: "English",
      english_normalization: true,
    };
    const output = await replicate.run("minimax/speech-02-hd", { input });
    // output is a URL string
    return NextResponse.json({ audioUrl: output });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "TTS failed" }, { status: 500 });
  }
}
