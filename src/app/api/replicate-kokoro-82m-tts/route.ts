import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate();

export async function POST(req: NextRequest) {
  try {
    const { text, voice } = await req.json();
    if (!text || !voice) {
      return NextResponse.json({ error: "Missing text or voice" }, { status: 400 });
    }
    const output = await replicate.run(
      "kjjk10/kokoro-82m:882bc45ec70c819feeb972cb70af760fcfd67125bb66130e7b478e95bbd275d5",
      { input: { text, voice } }
    );
    // output is a URL to the audio file
    return NextResponse.json({ audioUrl: output });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate speech" }, { status: 500 });
  }
}
