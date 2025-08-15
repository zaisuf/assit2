'use client';

import React, { useState, useRef, useEffect } from 'react';

const TestResemble: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'ru', name: 'Russian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'cs', name: 'Czech' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'id', name: 'Indonesian' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' },
  ];

  // Cleanup function for audio URL
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleTTSRequest = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      console.log('Sending request with text:', inputText);
      
      // Step 1: Create the clip
      const createResponse = await fetch('https://p.cluster.resemble.ai/synthesize', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer zerb2Gr0fH0vpA1dlZTbsgtt',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          voice_uuid: "13ebf31c",
          data: inputText
        })
      });

      console.log('Create Response Status:', createResponse.status);
      
      const responseText = await createResponse.text();
      console.log('Raw Response:', responseText);

      if (!createResponse.ok) {
        throw new Error(`API Error (${createResponse.status}): ${responseText}`);
      }

      const jsonResponse = JSON.parse(responseText);
      console.log('Parsed API Response:', jsonResponse);

      if (!jsonResponse.audio_content) {
        throw new Error('No audio content in response');
      }

      // Convert base64 audio content to binary
      const audioData = atob(jsonResponse.audio_content);
      const arrayBuffer = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        arrayBuffer[i] = audioData.charCodeAt(i);
      }

      // Clean up old audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      // Create blob and audio URL
      const audioBlob = new Blob([arrayBuffer], { type: 'audio/wav' });
      const newAudioUrl = URL.createObjectURL(audioBlob);
      console.log('Audio blob created:', {
        type: audioBlob.type,
        size: audioBlob.size
      });

      setAudioUrl(newAudioUrl);

      // Wait for the next render cycle
      await new Promise(resolve => setTimeout(resolve, 100));

      if (audioRef.current) {
        audioRef.current.load();
        try {
          await audioRef.current.play();
        } catch (playError) {
          console.error('Playback failed:', playError);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('TTS Error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Resemble.ai Text-to-Speech Test Page</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              className="w-full p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            
            <div className="flex gap-4">
              <button
                onClick={handleTTSRequest}
                disabled={isLoading || !inputText.trim()}
                className={`px-6 py-3 rounded-lg ${
                  isLoading || !inputText.trim()
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } transition-colors`}
              >
                {isLoading ? 'Converting...' : 'Convert to Speech'}
              </button>
            </div>
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                {error}
              </div>
            )}

            {audioUrl && (
              <div className="p-4 bg-gray-700 rounded-lg">
                <audio 
                  ref={audioRef} 
                  controls 
                  className="w-full"
                  key={audioUrl} // Add key to force re-render when URL changes
                  preload="auto"
                >
                  <source src={audioUrl} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Enter the text you want to convert to speech in the text area above</li>
            <li>Select the language for the speech synthesis</li>
            <li>Click the &quot;Convert to Speech&quot; button</li>
            <li>Wait for the conversion to complete</li>
            <li>Use the audio player to listen to the generated speech</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default TestResemble;
