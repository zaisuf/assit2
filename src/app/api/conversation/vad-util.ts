// This utility splits a WAV audio buffer into speech segments using VAD
// Uses @ricky0123/vad (WebAssembly VAD for Node.js)
import { Readable } from 'stream';
// @ts-ignore
import * as vad from '@ricky0123/vad';
// @ts-ignore
import * as wav from 'node-wav';

export async function splitAudioByVAD(buffer: Buffer, options = { sampleRate: 16000, minSpeechMs: 300, minSilenceMs: 500 }) {
  // Decode WAV
  const { sampleRate, channelData } = wav.decode(buffer);
  const audio = channelData[0]; // mono
  // Use vad.NonRealTimeVAD
  const vadInst = await vad.NonRealTimeVAD.new({ frameSamples: 1536 });
  const segments = [];
  for await (const seg of vadInst.run(audio, sampleRate)) {
    // seg.audio is Float32Array
    const wavBuf = wav.encode([seg.audio], { sampleRate, float: true, bitDepth: 32 });
    segments.push(wavBuf);
  }
  return segments;
}
