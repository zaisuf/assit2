export async function generateSpeech(text: string): Promise<ArrayBuffer> {
  const response = await fetch('https://api.groq.com/v1/audio/text-to-speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      voice: 'nova', // Using Nova voice, you can change this to other available voices
      model: 'mixtral-8x7b', // Using Mixtral model for high-quality speech
      speed: 1.0,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate speech');
  }

  return await response.arrayBuffer();
}

export function playAudio(audioBuffer: ArrayBuffer): Promise<void> {
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    audioContext.decodeAudioData(audioBuffer, (buffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        resolve();
        audioContext.close();
      };
      
      try {
        source.start(0);
      } catch (error) {
        reject(error);
        audioContext.close();
      }
    }, reject);
  });
}
