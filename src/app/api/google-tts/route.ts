import { WAVENET_VOICES } from "./wavenet-voices";
// GET endpoint to return all supported WaveNet voices and languages
export async function GET() {
  return NextResponse.json({ voices: WAVENET_VOICES });
}
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
  const { text, voice = "en-US-Wavenet-A", languageCode = "en-US" } = await req.json();
  // Optionally, validate the requested voice is in the supported list
  // If not, you could return an error or fallback to a default

    // Extract the language code from the voice name if it exists
    const voiceLanguage = voice.split('-').slice(0, 2).join('-') || languageCode;

    // Using the REST API directly with the API key
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            text
          },
          voice: {
            languageCode: voiceLanguage,
            name: voice
          },
          audioConfig: {
            audioEncoding: "MP3",
            pitch: 0,
            speakingRate: 1
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      console.error('Google API Error Details:', errorData);
      throw new Error(`Google API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    if (!data.audioContent) {
      console.error('Google API Response:', data);
      throw new Error("No audio content received from Google TTS API");
    }

    // The API returns base64 encoded audio content
    const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;

    return NextResponse.json({ audioUrl });
  } catch (error: any) {
    console.error("Google TTS Error:", error);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: error.message || "Text-to-speech failed",
        details: error.response?.data || error.stack
      },
      { status: 500 }
    );
  }
}
