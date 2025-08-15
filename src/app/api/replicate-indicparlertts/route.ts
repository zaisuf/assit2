import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, description } = await req.json();
    const input = { prompt, description };
    const output = await replicate.run(
      "sruthiselvaraj/indicparlertts:feba89f750cb30bd7c5fb53533b78873a313ff7cc168ae2df304f202cca5b1c8",
      { input }
    );
    return NextResponse.json({ audioUrl: output });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "TTS failed" }, { status: 500 });
  }
}
