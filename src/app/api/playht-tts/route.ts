import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const PLAYHT_API_KEY = process.env.PLAYHT_API_KEY;
    const PLAYHT_USER_ID = process.env.PLAYHT_USER_ID;
    if (!PLAYHT_API_KEY || !PLAYHT_USER_ID) {
      return NextResponse.json({ error: "Missing PlayHT API key or user id" }, { status: 500 });
    }
    // PlayHT API endpoint and payload
    const url = "https://api.play.ht/api/v2/tts";
    const payload = {
      text: prompt,
      voice: "nia", // PlayHT voice id for Nia
      output_format: "mp3"
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": PLAYHT_API_KEY,
        "X-User-Id": PLAYHT_USER_ID,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      let errorText = await response.text();
      let errorJson: any = {};
      try { errorJson = JSON.parse(errorText); } catch {}
      console.error("[playht-tts] PlayHT API error response:", errorJson || errorText);
      return NextResponse.json({ error: (errorJson && errorJson.message) ? errorJson.message : errorText || "PlayHT API error" }, { status: 500 });
    }
    const data = await response.json();
    console.log("[playht-tts] PlayHT API response data:", data);
    // PlayHT returns a job id, so we need to poll for completion
    const jobId = data.id || data.transcriptionId || data.job_id;
    if (!jobId) {
      console.error("[playht-tts] No job id returned from PlayHT:", data);
      return NextResponse.json({ error: "No job id returned from PlayHT" }, { status: 500 });
    }
    // Poll for result
    let audioUrl = null;
    let tries = 0;
    while (!audioUrl && tries < 20) {
      await new Promise(res => setTimeout(res, 2000));
      const pollRes = await fetch(`https://api.play.ht/api/v2/tts/${jobId}`, {
        headers: {
          "Authorization": PLAYHT_API_KEY,
          "Accept": "application/json"
        }
      });
      if (pollRes.ok) {
        const pollData = await pollRes.json();
        console.log(`[playht-tts] Poll attempt ${tries + 1}:`, pollData);
        audioUrl = pollData.audioUrl || pollData.audio_url || pollData.url;
        if (audioUrl) break;
      } else {
        let pollErrorText = await pollRes.text();
        let pollErrorJson: any = {};
        try { pollErrorJson = JSON.parse(pollErrorText); } catch {}
        console.error(`[playht-tts] Poll error attempt ${tries + 1}:`, pollErrorJson || pollErrorText);
      }
      tries++;
    }
    if (!audioUrl) {
      console.error("[playht-tts] No audioUrl returned after polling.");
      return NextResponse.json({ error: "No audioUrl returned from PlayHT" }, { status: 500 });
    }
    return NextResponse.json({ audioUrl });
  } catch (error: any) {
    console.error("[playht-tts]", error);
    return NextResponse.json({ error: error.message || "TTS failed" }, { status: 500 });
  }
}
