import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, language } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Missing text input" }, { status: 400 });
    }

    // Call Replicate API
    const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "139606fe1536f85a9f07d87982400b8140c9a9673733d47913af96738894128f",
        input: {
          text,
          language,
          speaker: "default", // Use the default speaker/voice for neon-tts
        },
      }),
    });

    if (!replicateRes.ok) {
      const errorText = await replicateRes.text();
      console.error("Replicate API error:", errorText);
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
      if (!pollRes.ok) {
        const pollError = await pollRes.text();
        console.error("Replicate poll error:", pollError);
        return NextResponse.json({ error: pollError }, { status: 500 });
      }
      const pollData = await pollRes.json();
      status = pollData.status;
      if (status === "succeeded" && pollData.output) {
        audioUrl = pollData.output;
      } else if (status === "failed") {
        console.error("TTS generation failed:", pollData);
        return NextResponse.json({ error: "TTS generation failed", details: pollData }, { status: 500 });
      }
      pollCount++;
    }

    if (!audioUrl) {
      console.error("TTS generation timed out", { prediction });
      return NextResponse.json({ error: "TTS generation timed out" }, { status: 504 });
    }

    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error("/api/replicate-tts route error:", error);
    return NextResponse.json({ error: error?.toString() || "Unknown error" }, { status: 500 });
  }
}
