import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Full voice list for jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13
const VALID_VOICES = [
  "af_heart",
  "af_alloy",
  "af_aoede",
  "af_bella",
  "af_jessica",
  "af_kore",
  "af_nicole",
  "af_nova",
  "af_river",
  "af_sarah",
  "af_sky",
  "am_adam",
  "am_echo",
  "am_eric",
  "am_fenrir",
  "am_liam",
  "am_michael",
  "am_onyx",
  "am_puck",
  "am_santa",
  "bf_alice",
  "bf_emma",
  "bf_isabella",
  "bf_lily",
  "bm_daniel",
  "bm_fable",
  "bm_george",
  "bm_lewis",
  "ef_dora",
  "em_alex",
  "em_santa",
  "ff_siwis",
  "hf_alpha",
  "hf_beta",
  "hm_omega",
  "hm_psi",
  "if_sara",
  "im_nicola",
  "jf_alpha",
  "jf_gongitsune",
  "jf_nezumi",
  "jf_tebukuro",
  "jm_kumo",
  "cm_wei",
  "sf_maria",
  "ff_jeanne",
  "pf_dora",
  // ...add more as needed from the full enum
];

export async function POST(req: NextRequest) {
  try {
    const { text, language, voice } = await req.json();
    // Use provided voice if valid, else fallback
    const selectedVoice = VALID_VOICES.includes(voice) ? voice : "af_bella";
    const input = {
      text,
      voice: selectedVoice,
    };
    const output = await replicate.run(
      "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
      { input }
    );
    return NextResponse.json({ audioUrl: output });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "TTS failed" }, { status: 500 });
  }
}
