
"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type RenderUiDesignProps = {
  designId: string;
  onFetchedContent?: (data: { content: string; intent?: string; url?: string }) => void;
};

export default function RenderUiDesign({ designId, onFetchedContent }: RenderUiDesignProps) {
  // --- WebRTC + VAD recording logic ---
  const vadStreamRef = useRef<MediaStream | null>(null);
  const vadAudioContextRef = useRef<AudioContext | null>(null);
  const vadSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const vadAnalyserRef = useRef<AnalyserNode | null>(null);
  const vadSilenceStartRef = useRef<number | null>(null);
  const vadChunksRef = useRef<Blob[]>([]);
  const vadMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const vadIsRecordingRef = useRef(false);
  const [micLoading, setMicLoading] = useState(false);

  // Start recording with VAD
  const startWebRTCVADRecording = () => {
    setMicLoading(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
  vadStreamRef.current = stream;
  vadIsRecordingRef.current = true;
  setMicLoading(false);
        vadChunksRef.current = [];
        // MediaRecorder for audio chunks
        const mediaRecorder = new MediaRecorder(stream);
        vadMediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) vadChunksRef.current.push(e.data);
        };
        mediaRecorder.onstop = async () => {
          // Keep vadIsRecordingRef.current true since we're maintaining continuous recording
          // Don't stop the stream since we're keeping the mic on
          // Don't call stopWebRTCVAD() since we want to keep recording

          // Combine chunks and send to STT
          const audioBlob = new Blob(vadChunksRef.current, { type: 'audio/wav' });
          vadChunksRef.current = []; // Clear chunks for next recording

          if (audioBlob.size > 1000) {
            // Check audio duration before sending to STT
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.onloadedmetadata = async () => {
              if (audio.duration < 1) {
                alert("Please speak a bit longer.");
                return;
              }
              try {
                const text = await transcribeAudioWithElevenLabs(audioBlob);
                // Ignore if text is a sound label or contains beeping sounds
                const isSoundLabel = /^\s*\([^)]+\)\s*$/i.test(text.trim()) ||
                  text.toLowerCase().includes('beeping sound') ||
                  text.toLowerCase().includes('beep') ||
                  /\.\.\./g.test(text); // Ignore ellipsis patterns

                // Filter out system sounds and require actual speech
                if (
                  text &&
                  !isSoundLabel &&
                  /([a-zA-Z]{2,}\s+){1,}[a-zA-Z]{2,}/.test(text.trim()) &&
                  !/(background noise|notification sound|system sound)/i.test(text)
                ) {
                  await handleSendMessage(text);
                }
              } catch (err: any) {
                // Handle ElevenLabs error gracefully
                let msg = "Failed to transcribe audio.";
                if (err && err.message && err.message.includes('audio_too_short')) {
                  msg = "Audio is too short. Please speak a bit longer.";
                }
                alert(msg);
              }
            };
            // Force load metadata (for some browsers)
            audio.load();
          }
        };
        mediaRecorder.start();
        // VAD setup
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        vadAudioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        vadSourceNodeRef.current = source;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        vadAnalyserRef.current = analyser;
        source.connect(analyser);
        vadSilenceStartRef.current = null;
        function vadLoop() {
          const data = new Uint8Array(analyser.fftSize);
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const val = (data[i] - 128) / 128;
            sum += val * val;
          }
          const rms = Math.sqrt(sum / data.length);
          // Make VAD more strict to ignore non-speech noise
          const threshold = 0.03; // slightly higher threshold for speech
          if (rms < threshold) {
            if (vadSilenceStartRef.current === null) vadSilenceStartRef.current = Date.now();
            if (Date.now() - vadSilenceStartRef.current > 1000) {
              // 2s silence detected, process current recording but keep mic on
              if (vadMediaRecorderRef.current && vadMediaRecorderRef.current.state !== 'inactive') {
                const currentRecorder = vadMediaRecorderRef.current;
                currentRecorder.stop();

                // Start a new recorder immediately to maintain continuous recording
                const newRecorder = new MediaRecorder(vadStreamRef.current!);
                vadMediaRecorderRef.current = newRecorder;
                newRecorder.ondataavailable = currentRecorder.ondataavailable;
                newRecorder.onstop = currentRecorder.onstop;
                newRecorder.start();
              }
            }
          } else {
            vadSilenceStartRef.current = null;
          }
          requestAnimationFrame(vadLoop);
        }
        vadLoop();
      })
      .catch(() => {
        setMicLoading(false);
        alert('Could not access microphone.');
      });
  };

  // Stop VAD and clean up
  const stopWebRTCVAD = () => {
  // No vadAnimationRef needed, cleanup handled by stopping recording and closing audio context
    if (vadAudioContextRef.current) {
      vadAudioContextRef.current.close();
      vadAudioContextRef.current = null;
    }
    if (vadSourceNodeRef.current) {
      vadSourceNodeRef.current.disconnect();
      vadSourceNodeRef.current = null;
    }
    if (vadAnalyserRef.current) {
      vadAnalyserRef.current.disconnect();
      vadAnalyserRef.current = null;
    }
  };
  // --- WebSocket for real-time audio streaming ---
  const wsRef = useRef<WebSocket | null>(null);
  const [isWSConnected, setIsWSConnected] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');

  // Connect to WebSocket server (update ws://localhost:8001 as needed)
  const connectWebSocket = () => {
    if (wsRef.current && (wsRef.current.readyState === 1 || wsRef.current.readyState === 0)) return;
    const ws = new WebSocket('ws://localhost:8001');
    wsRef.current = ws;
    ws.onopen = () => setIsWSConnected(true);
    ws.onclose = () => setIsWSConnected(false);
    ws.onerror = () => setIsWSConnected(false);
    ws.onmessage = (event) => {
      // Expect server to send back JSON: { text: "..." }
      try {
        const data = JSON.parse(event.data);
        if (data.text) setLiveTranscript(data.text);
      } catch {}
    };
  };

  // --- Real-time recording and streaming logic ---
  const startStreamingRecording = () => {
    connectWebSocket();
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0 && wsRef.current && wsRef.current.readyState === 1) {
            wsRef.current.send(e.data);
          }
        };
        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          if (wsRef.current && wsRef.current.readyState === 1) wsRef.current.send(JSON.stringify({ done: true }));
        };
        mediaRecorder.start(250); // send audio chunks every 250ms
      })
      .catch(() => {
        alert('Could not access microphone.');
      });
  };

  const stopStreamingRecording = () => {
  // ...existing code...
  };
  // --- WebRTC basic audio function ---
  // Call this to start a WebRTC peer connection and add user's mic audio
  const startWebRTCAudio = async () => {
    try {
      // 1. Get user's microphone audio
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // 2. Create a new RTCPeerConnection
      const peerConnection = new RTCPeerConnection();
      // 3. Add audio tracks to the connection
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
      // 4. Create an offer (for demo, log it)
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log('WebRTC Offer SDP:', offer.sdp);
      // You would send this offer to a remote peer/server for signaling
      // For demo, we just log it
      // Optionally, listen for ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('ICE Candidate:', event.candidate);
        }
      };
      alert('WebRTC audio started. See console for offer SDP.');
    } catch (err) {
      alert('WebRTC error: ' + (err instanceof Error ? err.message : err));
    }
  };
  // --- STT mic logic hooks (must be at top level) ---
  // (Removed old recording logic, now only using WebRTC + VAD)
  // State to show fetched content box next to chat UI
  const [fetchedContent, setFetchedContentState] = useState<string | null>(null);
  // Style 5 mic icon map
  const MIC_ICON_MAP: Record<string, (color?: string) => React.ReactNode> = {
    default: (color = '#10b981') => (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={color} strokeWidth="1.5"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/><path d="M15 8a3 3 0 0 1-6 0"/></svg>
    ),
    'circle-bg': () => (
      <span className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#fff" strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span>
    ),
    'square-bg': () => (
      <span className="w-8 h-8 bg-blue-500 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#fff" strokeWidth="2"><rect x="6" y="4" width="12" height="12" rx="3"/><rect x="10" y="7" width="4" height="7" rx="2"/><path d="M12 18v2"/></svg></span>
    ),
    shadow: (color = '#10b981') => (
      <span className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="1.5"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span>
    ),
    bordered: (color = '#10b981') => (
      <span className="w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="1.5"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span>
    ),
    pill: (color = '#10b981') => (
      <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="8" y="6" width="8" height="8" rx="4"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>
    ),
    outline: (color = '#10b981') => (
      <span className="w-8 h-8 border-2 border-blue-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>
    ),
    'double-border': (color = '#10b981') => (
      <span className="w-8 h-8 border-4 border-double border-emerald-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>
    ),
    hex: (color = '#10b981') => (
      <span className="w-8 h-8 flex items-center justify-center" style={{clipPath:'polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0% 50%)'}}><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>
    ),
    triangle: (color = '#10b981') => (
      <span className="w-8 h-8 flex items-center justify-center" style={{clipPath:'polygon(50% 0%,0% 100%,100% 100%)'}}><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
    diamond: (color = '#10b981') => (
      <span className="w-8 h-8 flex items-center justify-center" style={{clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)'}}><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
    star: (color = '#10b981') => (
      <span className="w-8 h-8 flex items-center justify-center" style={{clipPath:'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'}}><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
    'rounded-square': (color = '#10b981') => (
      <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>
    ),
    'circle-outline': (color = '#10b981') => (
      <span className="w-8 h-8 rounded-full border-2 border-blue-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
    dashed: (color = '#10b981') => (
      <span className="w-8 h-8 rounded-lg border-2 border-dashed border-emerald-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
    'shadowed-square': (color = '#10b981') => (
      <span className="w-8 h-8 rounded-lg shadow-lg flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>
    ),
    'bordered-square': (color = '#10b981') => (
      <span className="w-8 h-8 rounded-lg border-2 border-emerald-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>
    ),
    'circle-shadow': (color = '#10b981') => (
      <span className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
    minimal: (color = '#10b981') => (
      <span className="w-8 h-8 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>
    ),
    filled: (color = '#10b981') => (
      <span className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill={color} stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
  };

  // Style 5 bot icon map
  const BOT_ICON_MAP: Record<string, React.ReactNode> = {
    bot1: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="6" y="9" width="12" height="7" rx="3.5" /><circle cx="9" cy="13" r="1" /><circle cx="15" cy="13" r="1" /><rect x="10.5" y="6" width="3" height="3" rx="1.5" /><path d="M12 3v3" /></svg>),
    bot2: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="5" y="8" width="14" height="7" rx="3.5" /><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><path d="M12 15v2.5l-2 1.5" /></svg>),
    bot3: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /><path d="M12 9V5M12 5l2-2M12 5l-2-2" /></svg>),
    bot4: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="9" width="10" height="7" rx="3" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /><path d="M11 15h2" /></svg>),
    bot5: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="8" y="10" width="8" height="6" rx="2.5" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /><circle cx="8" cy="10" r="0.7" /><circle cx="16" cy="10" r="0.7" /></svg>),
    bot6: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="13" r="5" /><rect x="9" y="11.5" width="6" height="2" rx="1" /><path d="M12 8v-2" /></svg>),
    bot7: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><polygon points="12,5 19,9 19,16 12,20 5,16 5,9" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
    bot8: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="0.7" ry="1.2" /><ellipse cx="14" cy="13" rx="0.7" ry="1.2" /></svg>),
    bot9: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="9" width="10" height="7" rx="1" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
    bot10: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="10" width="10" height="6" rx="2" /><rect x="9" y="7" width="6" height="3" rx="1.5" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
    bot11: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="1" ry="1.5" /><ellipse cx="14" cy="13" rx="1" ry="1.5" /><path d="M12 9v-2" /></svg>),
    bot12: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="10" width="10" height="6" rx="2" /><path d="M9 10l3-3 3 3" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
    bot13: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="8" y="10" width="8" height="6" rx="2.5" /><path d="M8 10l-2-2M16 10l2-2" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /></svg>),
    bot14: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="8" y="10" width="8" height="6" rx="2.5" /><path d="M8 10l-2-1M16 10l2-1" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /></svg>),
    bot15: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="13" r="6" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
    bot16: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="10" width="10" height="6" rx="2" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /><path d="M17 13h2" /></svg>),
    bot17: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="1.2" ry="1.2" /><ellipse cx="14" cy="13" rx="1.2" ry="1.2" /><path d="M12 9v-3" /></svg>),
    bot18: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="10" width="10" height="6" rx="2" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /><path d="M10 15c1 1 3 1 4 0" /></svg>),
    bot19: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="12" width="10" height="4" rx="2" /><circle cx="10" cy="14" r="1" /><circle cx="14" cy="14" r="1" /></svg>),
    bot20: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="1" ry="1.5" /><ellipse cx="14" cy="13" rx="1" ry="1.5" /><path d="M10 15c1 1 3 1 4 0" /></svg>),
  };
  const [config, setConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  // Track which view is active: 'widget', 'chat', or 'voice'
  const [activeView, setActiveView] = useState<'widget' | 'chat' | 'voice'>('widget');

  useEffect(() => {
    const fetchConfig = async () => {
      setLoadingConfig(true);
      try {
        const res = await fetch(`/api/get-ui-design?designId=${designId}`);
        const data = await res.json();
        setConfig(data.config || null);
      } catch {
        setConfig(null);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchConfig();
  }, [designId]);

  // Listen for chatbot fetched content in responses
  const lastFetchedContentRef = useRef<string | null>(null);
  // Accepts content, intent, url
  const setFetchedContent = (content: string, intent?: string, url?: string) => {
    if (content && content !== lastFetchedContentRef.current) {
      lastFetchedContentRef.current = content;
      setFetchedContentState(content);
      if (onFetchedContent) onFetchedContent({ content, intent, url });
      // Also dispatch a custom event for legacy support
      window.dispatchEvent(new CustomEvent('fetched-content', { detail: { content, intent, url } }));
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const callAssistantAPI = async (text: string): Promise<string> => {
    try {
      const res = await fetch('/api/chatbot-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, designId }),
      });
      const data = await res.json();
      if (data.fetchedContent) setFetchedContent(data.fetchedContent, data.debug?.matchedIntent, data.debug?.foundUrl);
      if (data.response) return data.response;
    return 'Sorry, no response.' as string;
    } catch {
      return 'Error contacting AI.';
    }
  };

  // --- Google TTS integration ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [pendingTTS, setPendingTTS] = useState<string | null>(null);

  // Call Google TTS API and play audio
  const playGoogleTTS = async (text: string) => {
    try {
      const response = await fetch('/api/google-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: 'en-US-Standard-A',  // You can change this to any supported Google voice
          languageCode: 'en-US'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const data = await response.json();
      
      if (audioRef.current && data.audioUrl) {
        audioRef.current.src = data.audioUrl;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  // Play TTS when a new assistant message is added
  useEffect(() => {
    if (pendingTTS) {
      playGoogleTTS(pendingTTS);
      setPendingTTS(null);
    }
  }, [pendingTTS]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user" as "user", content: text, timestamp: new Date() }]);
    setInputText("");
    setIsLoading(true);
    try {
      const response = await callAssistantAPI(text);
      setMessages((prev) => {
        const newMsgs = [...prev, { role: "assistant" as "assistant", content: response, timestamp: new Date() }];
        if (typeof setPendingTTS === 'function') setPendingTTS(response); // trigger TTS for new assistant message if function exists
        return newMsgs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingConfig) return <div className="text-white text-xl p-12">Loading...</div>;
  if (!config) return <div className="text-white text-xl p-12">Design not found.</div>;

  // Import VoiceCallContainer directly from the voicecall component
  // @ts-ignore
  const { VoiceCallContainer } = require("@/app/agent/components/voicecall");
  // If VoiceCallContainer is not exported as named, fallback to default
  const VoiceCall = VoiceCallContainer || require("@/app/agent/components/voicecall").default || (() => null);

  // Widget box UI (bottom right corner) using config.wedgetBox
  const WidgetBox = () => {
    const w = config.wedgetBox || {};
    if (!w.selectedChatbotLogo && !w.selectedVoiceBotLogo && !w.inputBarPlaceholder && !w.style2BtnColor && !w.style5MicIconStyle && !w.style5BotIconStyle && typeof w.inputBarStyle !== 'number') return null;
    // Merge style props to avoid duplicate 'style' key
    let baseStyle = w.customBgColor ? { background: w.customBgColor } : {};
    let borderClass = 'border border-white/10';
    if (w.hideBg === true) {
      baseStyle = { background: 'transparent' };
      borderClass = '';
    }
    const style1Extra = w.selectedStyle === "Style 1" ? { cursor: 'pointer' } : {};
    const mergedStyle = { ...baseStyle, ...style1Extra };
    return (
      <div className="fixed bottom-8 left-8 z-10">
        <div
          className={`flex flex-col items-center justify-center ${w.selectedShape || ''} ${w.wedgetBoxSize || ''} shadow-2xl ${borderClass}`}
          style={mergedStyle}
        >
          <div className="flex items-center w-full gap-2 px-4 py-2 justify-center">
            {/* Style 2: Voice chat button left, bot logo right */}
            {w.selectedStyle === "Style 2" && (
              <>
                {w.style2BtnColor && (
                  <button
                    className={`${w.style2BtnShape || ''} ${w.style2BtnSizeClass || ''} font-semibold flex items-center gap-1 shadow cursor-pointer`}
                    style={{ background: w.style2BtnColor, color: w.style2BtnTextColor || '' }}
                    onClick={() => setActiveView('voice')}
                  >
                    {/* Use saved mic icon style if available, else default */}
                    {MIC_ICON_MAP[w.style5MicIconStyle || 'default'](w.style5BotIconColor || '#10b981')}
                    Voice chat
                  </button>
                )}
                {w.selectedChatbotLogo && (
                  <Image
                    src={w.selectedChatbotLogo}
                    alt="Chatbot"
                    width={48}
                    height={48}
                    className={`${w.logoShape || ''} ${w.style5LogoSize || ''} border-2 cursor-pointer`}
                    onClick={() => setActiveView('chat')}
                    style={w.style5BotIconColor ? { borderColor: w.style5BotIconColor } : {}}
                  />
                )}
              </>
            )}
            {/* Style 3: Bot logo left, voice chat button right */}
            {w.selectedStyle === "Style 3" && (
              <>
                {w.selectedChatbotLogo && (
                  <Image
                    src={w.selectedChatbotLogo}
                    alt="Chatbot"
                    width={48}
                    height={48}
                    className={`${w.logoShape || ''} ${w.style5LogoSize || ''} border-2 cursor-pointer`}
                    onClick={() => setActiveView('chat')}
                    style={w.style5BotIconColor ? { borderColor: w.style5BotIconColor } : {}}
                  />
                )}
                {w.style2BtnColor && (
                  <button
                    className={`${w.style2BtnShape || ''} ${w.style2BtnSizeClass || ''} font-semibold flex items-center gap-1 shadow cursor-pointer`}
                    style={{ background: w.style2BtnColor, color: w.style2BtnTextColor || '' }}
                    onClick={() => setActiveView('voice')}
                  >
                    {/* Use saved mic icon style if available, else default */}
                    {MIC_ICON_MAP[w.style5MicIconStyle || 'default'](w.style5BotIconColor || '#10b981')}
                    Voice chat
                  </button>
                )}
              </>
            )}
            {/* Default: fallback to previous layout for other styles */}
            {w.selectedStyle !== "Style 2" && w.selectedStyle !== "Style 3" && (
              <>
                {/* Style 1: input bar left, voicebot logo right */}
                {w.selectedStyle === "Style 1" ? (
                  <div className="flex w-full items-center gap-2 justify-between">
                    {/* Input bar left */}
                    {typeof w.inputBarStyle === 'number' && (
                      <div
                        style={(() => {
                          // Map wedgetBoxSize to input bar width
                          let width = '180px';
                          if (w.wedgetBoxSize?.includes('w-[300px]')) width = '260px';
                          else if (w.wedgetBoxSize?.includes('w-[320px]')) width = '280px';
                          else if (w.wedgetBoxSize?.includes('w-[250px]')) width = '220px';
                          else if (w.wedgetBoxSize?.includes('w-[230px]')) width = '200px';
                          return { maxWidth: width, width: '100%' };
                        })()}
                      >
                        {(() => {
                          // 20 input bar styles, matching sidebar
                          const inputBarStyles = [
                            { className: "w-full px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 border-b-2 border-emerald-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-3 py-1 rounded-full bg-emerald-900/30 border-none text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-none bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-xl border-4 border-double border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-lg border-2 border-dashed border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-xl border-2 border-emerald-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-none bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg", style: { minWidth: 0 } },
                            { className: "w-full px-3 py-1 rounded-full bg-white/10 border-2 border-emerald-400 text-white placeholder:text-white/40 focus:outline-none text-sm shadow", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-full border-4 border-blue-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/40 focus:outline-none text-sm shadow", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-xl border-2 border-transparent bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0, backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #10b981, #3b82f6)', backgroundClip: 'padding-box, border-box', backgroundOrigin: 'padding-box, border-box' } },
                            { className: "w-full px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-inner", style: { minWidth: 0 } },
                            { className: "w-full px-4 py-2 rounded-full bg-emerald-900/30 border-2 border-emerald-400 text-white placeholder:text-white/40 focus:outline-none text-base", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 border-b-2 border-blue-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm shadow", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-none border-4 border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-3 py-1 rounded-full border-2 border-dashed border-blue-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-xl border-2 border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg", style: { minWidth: 0 } },
                          ];
                          const idx = Math.max(0, Math.min(19, w.inputBarStyle));
                          const styleObj = inputBarStyles[idx];
                          // Use inputBorderLineColor from Firestore config
                          const borderColor = w.inputBorderLineColor || '#10b981';
                          // Determine if style uses border or border-bottom
                          let style: React.CSSProperties = { ...styleObj.style, cursor: 'pointer' };
                          if (styleObj.className.includes('border-b-2')) {
                            (style as React.CSSProperties).borderBottomColor = borderColor;
                          } else if (styleObj.className.includes('border')) {
                            (style as React.CSSProperties).borderColor = borderColor;
                          }
                          if (w.inputBarColor) {
                            (style as React.CSSProperties).background = w.inputBarColor;
                          }
                          return (
                            <input
                              type="text"
                              className={styleObj.className + (w.inputBarColor ? ` ${w.inputBarColor}` : "")}
                              style={style}
                              placeholder={w.inputBarPlaceholder || 'Type here...'}
                              onClick={() => setActiveView('chat')}
                              onFocus={() => setActiveView('chat')}
                              onMouseDown={() => setActiveView('chat')}
                              value={inputText}
                              onChange={e => setInputText(e.target.value)}
                            />
                          );
                        })()}
                      </div>
                    )}
                    {/* Voicebot logo right */}
                    {w.selectedVoiceBotLogo && (
                      <Image
                        src={w.selectedVoiceBotLogo}
                        alt="Voicebot"
                        width={48}
                        height={48}
                        className={`${w.logoShape || ''} ${w.style5LogoSize || ''} border-2 cursor-pointer`}
                        onClick={e => {
                          e.stopPropagation();
                          setActiveView('voice');
                          // Auto-start mic when voice chat logo is clicked
                          setTimeout(() => {
                            // ...existing code...
                          }, 100);
                          console.log('Voicebot logo clicked, activeView set to voice and mic started');
                        }}
                        style={w.style5BotIconColor ? { borderColor: w.style5BotIconColor } : {}}
                      />
                    )}
                  </div>
                ) : (
                  <>
                    {/* Chatbot logo/icon: open chat UI */}
                    {w.selectedChatbotLogo && (
                      <Image
                        src={w.selectedChatbotLogo}
                        alt="Chatbot"
                        width={48}
                        height={48}
                        className={`${w.logoShape || ''} ${w.style5LogoSize || ''} border-2 cursor-pointer`}
                        onClick={() => setActiveView('chat')}
                      />
                    )}
                    {/* Voice chat button/icon: open voice bot UI */}
                    {w.style2BtnColor && (
                      <button
                        className={`${w.style2BtnShape || ''} ${w.style2BtnSizeClass || ''} font-semibold flex items-center gap-1 shadow cursor-pointer`}
                        style={{ background: w.style2BtnColor, color: w.style2BtnTextColor || '' }}
                        onClick={() => setActiveView('voice')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18c2.21 0 4-1.79 4-4V7a4 4 0 10-8 0v7c0 2.21 1.79 4 4 4zm0 0v2m-4 0h8" />
                        </svg>
                        Voice chat
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Always render all UIs so small chat box is always visible
  const renderVoiceBox = () => {
    if (activeView === 'voice' && config.voiceBotBox) {
      const v = config.voiceBotBox || {};
      return (
        <div className="fixed bottom-8 right-8 z-20">
          {VoiceCall ? (
            <VoiceCall
              sizeClass={v.sizeClass}
              shapeClass={v.shapeClass}
              customBgColor={v.customBgColor}
              videoSrc={v.videoSrc}
              disconnectBtnSize={v.disconnectBtnSize}
              disconnectBtnColor={v.disconnectBtnColor}
              disconnectBtnTextColor={v.disconnectBtnTextColor}
              disconnectBtnIconStyle={v.disconnectBtnIconStyle}
            />
          ) : (
            <div className="bg-black/80 text-white p-8 rounded-xl">Voice Bot UI not available</div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChatBox = () => {
    if (activeView === 'chat') {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-black via-blue-950 to-gray-900">
          <div className="flex flex-row items-start">
            <div className="flex flex-col h-[500px] w-[450px] rounded-xl overflow-hidden shadow-2xl border border-white/10"
              style={{ background: config.customBgColor || undefined }}>
              {/* Header */}
              <div className={`p-4 border-b border-white/10 flex items-center space-x-3 ${config.selectedHeaderStyle} ${config.selectedHeaderColor}`}
                style={config.customHeaderColor ? { background: config.customHeaderColor } : {}}>
                <div className={`w-10 h-10 p-[1px] bg-black/30 backdrop-blur flex items-center justify-center ${config.selectedHeaderStyle}`}>
                  <span className="text-white">🤖</span>
                </div>
              </div>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] ${config.selectedResponseCardStyle?.className || ''} ${config.selectedResponseCardStyle?.shape || ''}`}
                      style={config.selectedTextColor === 'custom' && config.customTextColor ? { color: config.customTextColor } : {}}
                    >
                      <span className={config.selectedResponseCardStyle?.textClass || ''}>{message.content}</span>
                      <div className="text-xs text-white/40 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`max-w-[80%] ${config.selectedResponseCardStyle?.className || ''} ${config.selectedResponseCardStyle?.shape || ''}`}>Loading...</div>
                  </div>
                )}
                <div ref={messageEndRef} />
              </div>
              {/* Input Bar */}
              <form
                className={`p-4 flex items-center gap-2 border-t border-white/10 ${config.selectedFooterStyle} ${config.selectedFooterColor}`}
                style={config.customFooterColor ? { background: config.customFooterColor } : {}}
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }}
                onClick={() => setActiveView('chat')}
              >
                <div style={{position: 'relative', width: '100%'}}>
                  <input
                    type="text"
                    className={`flex-1 px-4 py-2 bg-transparent text-white outline-none ${config.selectedInputBarStyle?.class || ''} ${config.selectedInputBarColor}`}
                    style={config.customInputBarColor ? { background: config.customInputBarColor } : {}}
                    placeholder={config.inputPlaceholder || 'Type here...'}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onFocus={() => setActiveView('chat')}
                    onMouseDown={() => setActiveView('chat')}
                  />
                </div>
                <button
                  type="submit"
                  className={config.selectedSendButtonStyle?.class || ''}
                  style={config.customSendButtonColor ? { background: config.customSendButtonColor, borderColor: config.customSendButtonColor } : {}}
                  disabled={isLoading || !inputText.trim()}
                >
                  <span>➤</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // --- STT mic logic ---
  // ElevenLabs Scribe v1 STT
  const ELEVENLABS_STT_API_URL = "https://api.elevenlabs.io/v1/speech-to-text";
  const ELEVENLABS_API_KEY = "sk_dc03c3c739fdaa31b2a8cf94c91bcc5b736896f31e393c47";
  const sttLanguage = "en";

  const transcribeAudioWithElevenLabs = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");
    formData.append("model_id", "scribe_v1");
    formData.append("language", sttLanguage);
    formData.append("output_format", "text");
    const response = await fetch(ELEVENLABS_STT_API_URL, {
      method: "POST",
      headers: { "xi-api-key": ELEVENLABS_API_KEY },
      body: formData,
    });
    if (!response.ok) throw new Error(await response.text() || "Failed to transcribe audio");
    const result = await response.json();
    return result.text || "";
  };

  // ...existing code...


  const renderSmallChatBox = () => (
    <div style={{
      position: 'fixed',
      bottom: 320,
      right: 24,
      zIndex: 1000,
      width: 240,
      maxHeight: 380,
      height: 320,
      background: '#1e1e1e',
      borderRadius: 12,
      boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '12px 16px',
        background: '#2563eb',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#ffffff" strokeWidth="2">
          <rect x="7" y="10" width="10" height="6" rx="2" />
          <circle cx="10" cy="13" r="1" fill="#ffffff" />
          <circle cx="14" cy="13" r="1" fill="#ffffff" />
        </svg>
        Chat Assistant
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 16,
        maxHeight: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? '#2563eb' : '#2d2d2d',
            padding: '8px 12px',
            borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
            color: '#fff',
            fontSize: 13,
            maxWidth: '80%'
          }}>
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{
        padding: 12,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        gap: 8
      }}>
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '4px 8px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#2d2d2d',
            color: '#fff',
            fontSize: 12,
            outline: 'none',
            minWidth: 0,
            maxWidth: '120px'
          }}
        />
        <button
          aria-label={vadIsRecordingRef.current ? "Stop recording" : "Start voice input"}
          onClick={() => {
            // Always use WebRTC + VAD system
            if (!vadIsRecordingRef.current && !micLoading) startWebRTCVADRecording();
            else if (vadMediaRecorderRef.current && vadMediaRecorderRef.current.state !== 'inactive') vadMediaRecorderRef.current.stop();
          }}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            background: vadIsRecordingRef.current ? '#ef4444' : '#10b981',
            color: '#fff',
            fontSize: 13,
            border: 'none',
            cursor: micLoading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: vadIsRecordingRef.current ? '2px solid #10b981' : undefined,
            position: 'relative',
            minWidth: 40,
            minHeight: 40
          }}
          title={vadIsRecordingRef.current ? 'Stop Recording' : 'Start Recording'}
          disabled={micLoading}
        >
          {micLoading ? (
            <span style={{ display: 'inline-block', width: 24, height: 24 }}>
              <svg viewBox="0 0 50 50" style={{ width: 24, height: 24, display: 'block' }}>
                <circle cx="25" cy="25" r="20" fill="none" stroke="#fff" strokeWidth="5" opacity="0.2" />
                <circle cx="25" cy="25" r="20" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="90 150" strokeLinecap="round">
                  <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
                </circle>
              </svg>
            </span>
          ) : (
            MIC_ICON_MAP[config?.wedgetBox?.style5MicIconStyle || 'default'](vadIsRecordingRef.current ? '#10b981' : '#6b7280')
          )}
        </button>
        {/* Show live transcript if available */}
        {liveTranscript && (
          <div style={{ color: '#10b981', fontSize: 13, marginTop: 4, maxWidth: 180, wordBreak: 'break-word' }}>
            {liveTranscript}
          </div>
        )}
        <button 
          onClick={() => handleSendMessage(inputText)}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            background: '#2563eb',
            color: '#fff',
            fontSize: 13,
            border: 'none',
            cursor: 'pointer'
          }}
          disabled={isLoading || !inputText.trim()}
        >
          Send
        </button>
      </div>
      {/* Hidden audio element for TTS playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );

  return (
    <>
      <WidgetBox />
      {renderVoiceBox()}
      {renderChatBox()}
      {renderSmallChatBox()}
  {/* Demo button to start WebRTC audio */}
  <button onClick={startWebRTCAudio} style={{position:'fixed',top:8,right:8,zIndex:9999,padding:8,background:'#2563eb',color:'#fff',borderRadius:8}}>Start WebRTC Audio (Demo)</button>
    </>
  );
}
