'use client'

import React from 'react';
import Sidebar from '@/components/sidebar/page';
import Background from '@/components/styles/Background';
import Button from '@/components/styles/Button';

const jsonExample = `{
  "apiKey": "<your_api_key>",
  "agentId": "<your_agent_id>",
  "text": "Tell me about modern house design.",
  "tts": true
}`;

const responseExample = `{
  "text": "AI response text...",
  "audio": "<base64_wav_audio>" // Only if tts=true
}`;

const textClientCode = `fetch('/api/conversation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: 'YOUR_API_KEY',
    agentId: 'YOUR_AGENT_ID',
    text: 'Tell me about modern house design.',
    tts: true
  })
})
  .then(res => res.json())
  .then(data => console.log(data));`;

const audioClientCode = `const formData = new FormData();
formData.append('apiKey', 'YOUR_API_KEY');
formData.append('agentId', 'YOUR_AGENT_ID');
formData.append('file', audioBlob, 'audio.wav');
formData.append('tts', 'true');

fetch('/api/conversation', {
  method: 'POST',
  body: formData
})
  .then(res => res.json())
  .then(data => console.log(data));`;

const Documentation: React.FC = () => {
  return (
    <Background variant="gradient">
      <Sidebar />
      <div className="min-h-screen text-white pt-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-orbitron mb-4 bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text">
              Conversation API Documentation
            </h1>
            <p className="text-xl text-gray-300 font-space">
              Use this API to interact with the modern house design AI assistant using text or audio. The backend manages all speech detection and transcription automatically.
            </p>
          </header>

          {/* Endpoint Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins mb-4">Endpoint</h2>
            <pre className="bg-dark p-4 rounded-lg font-mono mb-4">POST /api/conversation</pre>
          </section>

          {/* Text Input Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins mb-4">Text Input (JSON)</h2>
            <pre className="bg-dark p-4 rounded-lg font-mono mb-4">{jsonExample}</pre>
            <p className="text-gray-300 font-space mb-2">Send as <span className="font-mono">application/json</span>. <br/> <b>tts</b> is optional (returns audio if true).</p>
          </section>

          {/* Audio Input Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins mb-4">Audio Input (multipart/form-data)</h2>
            <pre className="bg-dark p-4 rounded-lg font-mono mb-4">apiKey: &lt;your_api_key&gt;
agentId: &lt;your_agent_id&gt;
file: &lt;audio file&gt; (.wav, .webm, .mp3)
tts: true (optional)
language: en (optional, default: en)</pre>
            <p className="text-gray-300 font-space mb-2">Upload a single audio file (with speech and silence). The backend will auto-detect speech, transcribe, and process the conversation.</p>
          </section>

          {/* Response Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins mb-4">Response</h2>
            <pre className="bg-dark p-4 rounded-lg font-mono mb-4">{responseExample}</pre>
          </section>

          {/* Example Client Code Section (Text) */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins mb-4">Example Client Code (Text)</h2>
            <pre className="bg-dark p-4 rounded-lg font-mono mb-4">{textClientCode}</pre>
          </section>

          {/* Example Client Code Section (Audio) */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins mb-4">Example Client Code (Audio)</h2>
            <pre className="bg-dark p-4 rounded-lg font-mono mb-4">{audioClientCode}</pre>
          </section>

          {/* Footer */}
          <footer className="text-center py-8 border-t border-[#BAFFF5]/20">
            <p className="text-gray-400 font-space">Need help? Contact our support team</p>
          </footer>
        </div>
        <Button variant="primary" size="md" onClick={() => console.log('clicked')}>
          Try it now
        </Button>
      </div>
    </Background>
  );
};

export default Documentation;

