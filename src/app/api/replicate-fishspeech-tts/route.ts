import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, language } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Missing text input" }, { status: 400 });
    }

    // Call Replicate API for ttsds/fishspeech_1_5
    const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "f81057e21ad025b00703b8a2f63283d108829b7512f85c4c723c3edcc125f1bc", // Correct version hash for ttsds/fishspeech_1_5
        input: {
          text,
          language: language || "en",
          speaker_reference: "https://replicate.delivery/pbxt/MNFXdPaUPOwYCZjZM4azsymbzE2TCV2WJXfGpeV2DrFWaSq8/example_en.wav",
          text_reference: "and keeping eternity before the eyes, though much",
          // Supported languages: English, Chinese, Japanese, Korean, French, German, Arabic, Spanish
        },
      }),
    });

    if (!replicateRes.ok) {
      const errorText = await replicateRes.text();
      return NextResponse.json({ error: errorText }, { status: 500 });
    }

    const prediction = await replicateRes.json();

    // Poll for completion
    let audioUrl = null;
    let status = prediction.status;
    let pollCount = 0;
    while (!audioUrl && status !== "failed" && pollCount < 30) {
      await new Promise((res) => setTimeout(res, 2000));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` },
      });
      const pollData = await pollRes.json();
      status = pollData.status;
      if (status === "succeeded" && pollData.output) {
        audioUrl = pollData.output;
      } else if (status === "failed") {
        return NextResponse.json({ error: "TTS generation failed" }, { status: 500 });
      }
      pollCount++;
    }

    if (!audioUrl) {
      return NextResponse.json({ error: "TTS generation timed out" }, { status: 504 });
    }

    return NextResponse.json({ audioUrl });
  } catch (error) {
    return NextResponse.json({ error: error?.toString() || "Unknown error" }, { status: 500 });
  }
}
