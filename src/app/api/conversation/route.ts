import { NextRequest, NextResponse } from "next/server";

import Replicate from "replicate";

/**
 * POST /api/conversation
 *
 * This endpoint provides a modal-aware conversation service for moliva v1.
 * Accepts: { modalNo, userText, tts, audio } (audio is base64 wav, optional)
 * Returns: { modalNo, text, audio }
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ error: "Only application/json is supported." }, { status: 400 });
    }
    const body = await req.json();
    const modalNo = body.modalNo;
    let userText = body.userText;
    const tts = !!body.tts;
    const audioBase64 = body.audio; // base64 wav audio (optional)

    if (typeof modalNo !== "number" || (!userText && !audioBase64)) {
      return NextResponse.json({ error: "Missing required fields (modalNo, userText or audio)." }, { status: 400 });
    }

    // --- If audio is provided, use STT (ElevenLabs) to get userText ---
    if (!userText && audioBase64) {
      // Convert base64 to Buffer
      const audioBuffer = Buffer.from(audioBase64, "base64");
      const formData = new FormData();
      const audioArrayBuffer = audioBuffer.buffer.slice(audioBuffer.byteOffset, audioBuffer.byteOffset + audioBuffer.byteLength);
      formData.append("file", new Blob([audioArrayBuffer as ArrayBuffer], { type: "audio/wav" }), "audio.wav");
      formData.append("model_id", "scribe_v1");
      formData.append("language", "en");
      formData.append("output_format", "text");
      const sttRes = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
        method: "POST",
        headers: {
          "xi-api-key": "sk_428f03a2846494eefc8e9840dd7f72f93f881b99f7ed6dff",
        },
        body: formData,
      });
      if (!sttRes.ok) {
        const errorText = await sttRes.text();
        return NextResponse.json({ error: `STT API error: ${errorText}` }, { status: 500 });
      }
      const sttData = await sttRes.json();
      userText = sttData.text || "";
      if (!userText) {
        return NextResponse.json({ error: "STT returned empty text." }, { status: 500 });
      }
    }

    // --- Real AI response using Groq API ---
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a modern house design AI assistant. Keep your responses concise, focused on architecture and interior design. Be direct and informative.",
          },
          {
            role: "user",
            content: userText,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
        top_p: 1,
        stream: false,
      }),
    });
    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      return NextResponse.json({ error: `Groq API error: ${errorText}` }, { status: 500 });
    }
    const groqData = await groqRes.json();
    const aiText = groqData.choices[0].message.content;

    // --- TTS: Kokoro 82m via Replicate ---
    let audio = null;
    if (tts && body.voice) {
      try {
        const replicate = new Replicate();
        const output = await replicate.run(
          "kjjk10/kokoro-82m:882bc45ec70c819feeb972cb70af760fcfd67125bb66130e7b478e95bbd275d5",
          { input: { text: aiText, voice: body.voice } }
        );
        console.log("Replicate output:", output);
        if (typeof output === "string" && (output as string).startsWith("http")) {
          // Fetch audio file and convert to base64
          const audioRes = await fetch(output);
          const audioBuffer = await audioRes.arrayBuffer();
          const base64Audio = Buffer.from(audioBuffer).toString("base64");
          audio = base64Audio;
          console.log("Base64 audio (first 100 chars):", base64Audio.slice(0, 100));
        } else {
          audio = null;
          console.error("Replicate TTS returned unexpected output", { text: aiText, voice: body.voice, output });
        }
      } catch (err) {
        console.error("Replicate TTS error", err);
        // If TTS fails, audio remains null
      }
    }

    return NextResponse.json({ modalNo, text: aiText, audio, audioUrl: typeof audio === 'string' ? undefined : audio });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
