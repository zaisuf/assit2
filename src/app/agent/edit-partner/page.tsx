import Image from "next/image";
"use client";

import TTSOverlay from "./tts-overlay";
import BotOverlayTable from "./bot-overlay";

import React, { useState, Fragment } from "react";
import HexagonGrid from "@/components/HexagonGrid";
import Sidebar from "@/components/sidebar/page";

export default function EditPartnerPage() {
  // ...existing code...
  // Place this after selectedSection is declared
  const [autoTriggeredEnabled, setAutoTriggeredEnabled] = React.useState(true);
  // Only keep one declaration for silenceDetectionEnabled
  // ...existing code...
  const [selectedSidebar, setSelectedSidebar] = useState("design");
  const [selectedSection, setSelectedSection] = useState<string>("ai-conversation-agent");
  const [showBotOverlay, setShowBotOverlay] = useState(false); // BotOverlay state
  const [selectedModals, setSelectedModals] = useState<string[]>([]); // Multi-select state
  const [selectedBotModalName, setSelectedBotModalName] = useState<string>("");

  // TTS Overlay state
  const [showTTSOverlay, setShowTTSOverlay] = useState(false);
  const [selectedTTSModalName, setSelectedTTSModalName] = useState<string>("");
  // Pricing overlay state for TTS
  const [ttsPricingHoveredIdx, setTTSPricingHoveredIdx] = useState<number|null>(null);

  // Close overlay on global scroll
  React.useEffect(() => {
    if (!showBotOverlay) return;
    const handleScroll = () => closeBotOverlay();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showBotOverlay]);

  // TTS Modal overlay state
  const [showTTSModalOverlay, setShowTTSModalOverlay] = useState(false);

  const SUPPORTED_LANGUAGES = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pl", name: "Polish" },
    { code: "uk", name: "Ukrainian" },
    { code: "nl", name: "Dutch" },
    { code: "ro", name: "Romanian" },
    { code: "hu", name: "Hungarian" },
    { code: "el", name: "Greek" },
    { code: "cs", name: "Czech" },
    { code: "sv", name: "Swedish" },
    { code: "pt", name: "Portuguese" },
    { code: "hr", name: "Croatian" },
    { code: "bg", name: "Bulgarian" },
    { code: "da", name: "Danish" },
    { code: "sk", name: "Slovak" },
    { code: "fi", name: "Finnish" },
    { code: "lt", name: "Lithuanian" },
    { code: "sl", name: "Slovenian" },
    { code: "lv", name: "Latvian" },
    { code: "et", name: "Estonian" },
    { code: "ga", name: "Irish" },
    { code: "mt", name: "Maltese" },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageOverlay, setShowLanguageOverlay] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("male");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1); // New state for audio speed
  const [chatbotRedirectEnabled, setChatbotRedirectEnabled] = React.useState(true); // State for redirect enable/disable in chatbot agent
  const [conversationRedirectEnabled, setConversationRedirectEnabled] = React.useState(true); // State for redirect enable/disable in conversation agent
  const [autoDetectLanguageEnabled, setAutoDetectLanguageEnabled] = useState(selectedSection === 'ai-chatbot-agent'); // State for auto detect language enable/disable
  const [silenceDetectionEnabled, setSilenceDetectionEnabled] = React.useState(true); // State for silence detection response enable/disable
  // Ensure autoDetectLanguageEnabled is always enabled by default when switching to ai-chatbot-agent section
  React.useEffect(() => {
    if (selectedSection === 'ai-chatbot-agent') {
      setAutoDetectLanguageEnabled(true);
    }
  }, [selectedSection]);
  const [feedbackRating, setFeedbackRating] = useState(0); // State for feedback rating
  const [feedbackEnabled, setFeedbackEnabled] = React.useState(true); // State for Conversation Feedback Rating toggle
  const [poweredByText, setPoweredByText] = useState<string | null>(null); // State for powered by text

  // New states for chatbot UI
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string }[]>([]);

  // Handle plus button click
  function handlePlusClick() {
    setShowBotOverlay(true);
  }

  // Handle modal select from overlay
  function handleSelectBotModal(modalName: string) {
    setSelectedBotModalName(modalName);
    setShowBotOverlay(false);
  }

  // Handle TTS Modal select button click
  function handleTTSModalClick() {
    setShowTTSOverlay(true);
  }

  // Handle TTS modal selection from overlay
  function handleSelectTTSModal(modalName: string) {
    setSelectedTTSModalName(modalName);
    setShowTTSOverlay(false);
  }

  // Handle modal option select/deselect
  function handleModalOption(modal: string) {
    setSelectedModals((prev) => {
      if (prev.includes(modal)) {
        return prev.filter((m) => m !== modal);
      } else if (prev.length < 3) {
        return [...prev, modal];
      } else {
        return prev;
      }
    });
  }

  // Close bot overlay
  function closeBotOverlay() {
    setShowBotOverlay(false);
  }

  function handleLanguageClick() {
    setShowLanguageOverlay(true);
  }
  function handleSelectLanguage(code: string) {
    setSelectedLanguage(code);
    setShowLanguageOverlay(false);
  }

  // Handle send message in chatbot UI
  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatHistory(prev => [...prev, { sender: "user", text: chatInput }]);
    // Simulate bot reply
    setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: "bot", text: "This is a sample bot reply." }]);
    }, 600);
    setChatInput("");
  }

  // Handler for AI conversation Agent button
  const handleAIAgentClick = () => {
    alert('AI conversation Agent clicked!');
  };

  return (
    <div className="min-h-[1200px] w-full flex flex-col bg-gradient-to-r from-black via-blue-950 to-gray-900 py-16 px-4 font-sans overflow-y-auto" style={{fontFamily: 'sans-serif', height: '100vh'}}>
      {/* Top Sidebar */}
      <Sidebar />
      <div className="flex w-full">
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden relative">
          {/* Hexagon Pattern Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <HexagonGrid />
          </div>
          {/* My Partner Box */}
          <div className="relative z-10 w-full rounded-none shadow-2xl p-8 flex flex-col border border-white/20 text-white bg-transparent backdrop-blur-md h-[1000px] mt-0">
            {/* Black transparent square layer (moved left, down a bit, 1100px wide x 650px tall, no border, add scrolling for ai conversation agent section) */}
            <div className={selectedSection === 'ai-conversation-agent' ? "absolute top-[51%] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent" : "absolute top-[51%]"} style={{ left: '3%', width: 1085, height: 930, background: 'rgba(0,0,0,0.4)', transform: 'translateY(-45%)', borderRadius: 0, pointerEvents: 'auto' }}>
            </div>
            {/* Show Redirect and Conventional boxes only in Systms section */}
            {selectedSection === 'systms' && (
              <>

                {/* knowledge Base file */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '3%', top: '40%', width: 525, height: 580, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      knowledge Base file 
                    </span>
                  </div>
                  <div className="flex items-center w-full mb-2">
                  </div>
                </div>
                {/*   Chat Ui Box */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '43.9%', top: '40%', width: 525, height: 580, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Chat Ui
                    </span>
                  </div>
                  <div className="flex items-center w-full mb-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><polygon points="13 2 2 15 12 15 11 22 22 9 12 9 13 2"/></svg>
                    <span className="text-white text-xs opacity-80 mt-0">This is the Laihting box. Add your description here.</span>
                  </div>
                  {/* Chatbot UI */}
                  <div className="flex flex-col w-full h-full mt-16">
                    <div className="flex-1 flex flex-col bg-black/30 rounded p-2 border border-white/10" style={{minHeight: 200, maxHeight: 400}}>
                      <div className="flex-1 overflow-y-auto">
                        {chatHistory && chatHistory.length > 0 ? (
                          chatHistory.map((msg, idx) => (
                            <div key={idx} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`px-3 py-2 rounded-lg text-xs max-w-[70%] ${msg.sender === 'user' ? 'bg-blue-700 text-white' : 'bg-gray-700 text-white'}`}>{msg.text}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 text-xs text-center mt-24">No messages yet. Start the conversation!</div>
                        )}
                      </div>
                      <form className="flex items-center gap-2 mt-2" onSubmit={handleSendMessage}>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-white/20 focus:outline-none focus:border-blue-400 text-xs"
                          placeholder="Type your message..."
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 text-xs border border-white/20"
                          disabled={!chatInput.trim()}
                        >Send</button>
                      </form>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center -mt-10">
                    <label className="relative inline-flex items-center cursor-pointer group ml-4">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                    </label>
                  </div>
                </div>


              </>
            )}
            {/* Select Modal Box for Ai conversation Agent */}
            {selectedSection === 'ai-conversation-agent' && (
              <>
                {/* Select TTS Modal Box (new, left of Default Language) */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '2.9%', top: '20%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Select TTS Modal
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  {/* Tagline */}
                  <div className="flex items-center w-full mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                    <span className="text-white text-xs opacity-80 mt-0">Select the TTS modal for the agent&apos;s voice synthesis.</span>
                  </div>
                  <div className="flex items-center w-full">
                    <span className="text-white text-xs opacity-80 mt-0 mr-2">TTS Modal Name</span>
                    <span className="text-blue-300 text-xs font-bold mr-2">{selectedTTSModalName || "None selected"}</span>
                    <button
                      className="ml-2 px-2 py-1 bg-gray-800 border border-white/30 text-white text-xs font-semibold rounded-none hover:bg-blue-900 transition"
                      onClick={handleTTSModalClick}
                    >Select</button>
                  </div>
                {/* Overlay for TTS Modal options (removed, now rendered at top level) */}
                </div>
                {/* Language Box */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '30.1%', top: '20%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Default Language
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  {/* Default tagline */}
                  <div className="flex items-center w-full mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><path d="M4 19h16M4 5h16M7 5v14M17 5v14"/></svg>
                    <span className="text-white text-xs opacity-80 mt-0">The default language for the agent&apos;s conversation and responses.</span>
                  </div>
                  <div className="flex items-center w-full">
                    <span className="text-white text-xs opacity-80 mt-0 mr-2">{SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}</span>
                    <button
                      className="ml-2 px-2 py-1 bg-gray-800 border border-white/30 text-white text-xs font-semibold rounded-none hover:bg-blue-900 transition"
                      onClick={handleLanguageClick}
                    >Select</button>
                  </div>
                  {/* Overlay for language options */}
                  {showLanguageOverlay && (
                    <div className="fixed inset-0 flex items-center justify-center z-50" style={{background: 'rgba(0,0,0,0.4)'}}>
                      <div className="bg-gray-900 border border-white/30 p-4 flex flex-col gap-2" style={{width: 220, borderRadius: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.5)', transform: 'translateY(-50px)'}}>
                        <div className="text-white text-sm font-semibold mb-2">Select Language</div>
                        <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                          {SUPPORTED_LANGUAGES.map(lang => (
                            <button
                              key={lang.code}
                              className={`px-2 py-1 text-left text-white text-[11px] border border-white/20 rounded-none hover:bg-blue-800 transition ${selectedLanguage === lang.code ? 'bg-blue-700' : 'bg-gray-800'}`}
                              onClick={() => handleSelectLanguage(lang.code)}
                            >{lang.name}</button>
                          ))}
                        </div>
                        <button
                          className="mt-3 w-full bg-blue-700 text-white py-2 border border-white/20 rounded-none hover:bg-blue-800 transition text-xs"
                          onClick={() => setShowLanguageOverlay(false)}
                        >Done</button>
                      </div>
                    </div>
                  )}
                </div>
                {/* More Box: Auto Ask Text & Audio Speed */}
                <div className="absolute flex flex-row gap-2" style={{ left: '2.9%', top: '39%', width: 1150, height: 180, transform: 'translateY(-50%)', zIndex: 15 }}>
                  {/* Duplicate Auto Ask Text & Silence Detection Response Box */}
                  <div className="border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0 }}>
                    {/* Auto Ask Text Row */}
                    <div className="flex items-center w-full mb-1">
                      <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                        Auto Triggered Conversation
                        <span className="ml-2 text-lg font-bold">→</span>
                      </span>
                    </div>
                    <div className="flex items-center w-full mb-2">
                      <span className="flex flex-col items-center justify-center mr-2" style={{height: '32px', minWidth: '32px'}}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginTop: '10px'}}><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                      </span>
                      <span className="text-white text-xs opacity-80 mt-0 mr-2"> Start the voice conversation automatically when user visits the site. </span>
                      {/* Enable button */}
                      <label className="relative inline-flex items-center cursor-pointer group ml-4">
                        <input type="checkbox" className="sr-only peer" checked={autoTriggeredEnabled} onChange={e => setAutoTriggeredEnabled(e.target.checked)} />
                        <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                      </label>
                    </div>
                    {/* Silence Detection Response Row */}
                    <div className="flex flex-col w-full mb-2">
                      <span className="text-white text-base font-semibold ml-6 flex items-center mb-1">
                        Silence Detection Response 
                        <span className="ml-2 text-lg font-bold">→</span>
                      </span>
                      <div className="flex items-center w-full">
                        <span className="flex flex-col items-center justify-center mr-2" style={{height: '32px', minWidth: '32px'}}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginTop: '10px'}}><path d="M12 3v18"/><path d="M5 12h14"/></svg>
                        </span>
                        <span className="text-white text-xs opacity-80 mt-0 mr-2">Enable silence detection response text for the agent (responds if user is silent for a while).</span>
                        <label className="relative inline-flex items-center cursor-pointer group ml-4">
                          <input type="checkbox" className="sr-only peer" checked={silenceDetectionEnabled} onChange={e => setSilenceDetectionEnabled(e.target.checked)} />
                          <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* Auto Speed Box (moved up, below Duplicate Auto Ask Text box) */}
                  <div className="border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0 }}>
                    <div className="flex items-center w-full mb-1">
                      <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                        Audio Speed
                        <span className="ml-2 text-lg font-bold">→</span>
                      </span>
                    </div>
                    <div className="flex items-center w-full mb-2">
                      <span className="flex flex-col items-center justify-center mr-2" style={{height: '32px', minWidth: '32px'}}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginTop: '10px'}}><path d="M3 10v4a1 1 0 0 0 1 1h3l4 4V5l-4 4H4a1 1 0 0 0-1 1z"/><path d="M16 12h2"/><path d="M19 12h.01"/></svg>
                      </span>
                      <span className="text-white text-xs opacity-80 mt-0 mr-2">Control the playback speed of the agent&apos;s audio responses.</span>
                    </div>
                    <div className="flex items-center w-full mt-4">
                      <span className="text-white text-xs mr-2">Speed:</span>
                      <input type="range" min="0.5" max="2" step="0.05" value={audioSpeed} onChange={e => setAudioSpeed(parseFloat(e.target.value))} className="w-32 accent-blue-500" />
                      <span className="text-white text-xs ml-2">{audioSpeed}x</span>
                    </div>
                  </div>
                  {/* Additional Redirect Box (with tagline and icon) - moved right */}
                  <div className="border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ position: 'absolute', left: '62%', top: '-55%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 16 }}>
                    <div className="flex items-center w-full mb-1">
                      <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                        Redirect
                        <span className="ml-2 text-lg font-bold">→</span>
                      </span>
                    </div>
                    <div className="flex items-center w-full mb-2">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><path d="M17 2l4 4-4 4"/><path d="M21 6H7a5 5 0 0 0 0 10h3"/></svg>
                      <span className="text-white text-xs opacity-80 mt-0">The agent can redirect the user to other pages on your website, based on their message or voice command</span>
                    </div>
                    {/* Image below tagline */}
                    <div className="w-full flex justify-center mt-2 mb-2">
                      <img src="/54tr3.png" alt="Redirect Illustration" style={{maxWidth: '120px', maxHeight: '60px', objectFit: 'contain'}} />
                    </div>
                    {/* Enable button for redirect */}
                    <div className="ml-auto flex items-center -mt-10">
                      <label className="relative inline-flex items-center cursor-pointer group ml-4">
                        <input type="checkbox" className="sr-only peer" checked={conversationRedirectEnabled} onChange={e => setConversationRedirectEnabled(e.target.checked)} />
                        <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                      </label>
                    </div>
                  </div>
                  {/* Conversation Feedback Rating  Box (now below Auto Ask Text, not in flex row) */}
                  <div className="border border-white/30 flex flex-col items-start justify-start px-4 pt-3 mt-4" style={{ width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, position: 'absolute', left: '0.1%', top: '146%', transform: 'translateY(-50%)', zIndex: 16, opacity: 0.6, pointerEvents: 'none' }}>
                    <div className="flex items-center w-full mb-1">
                      <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                        Conversation Feedback Rating (Disabled)
                        <span className="ml-2 text-lg font-bold">→</span>
                      </span>
                    </div>
                    <div className="flex items-center w-full mb-2">
                      {/* Star icon */}
                      <span className="flex flex-col items-center justify-center mr-2" style={{height: '32px', minWidth: '32px'}}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#facc15" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginTop: '10px'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </span>
                      <span className="text-white text-xs opacity-80 mt-0">Collect 1-5 star feedback rating after complete conversation session.</span>
                    </div>
                    {/* 1-5 Star Rating Function */}
                    <div className="flex items-center w-full mt-4 ml-6">
                      {[1,2,3,4,5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="focus:outline-none"
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill={feedbackRating >= star ? '#facc15' : 'none'}
                            stroke="#facc15"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{marginRight: 4, cursor: 'pointer'}}
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        </button>
                      ))}
                      <span className="text-white text-xs ml-2">{feedbackRating > 0 ? `${feedbackRating} / 5` : ''}</span>
                    </div>
                    {/* Enable button for Conversation Feedback Rating  */}
                    <div className="ml-auto flex items-center -mt-10">
                      <label className="relative inline-flex items-center cursor-pointer group ml-4">
                        <input type="checkbox" className="sr-only peer" checked={feedbackEnabled} onChange={e => setFeedbackEnabled(e.target.checked)} />
                        <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* Select Chatbot Modal Box for Ai chatbot Agent */}
            {selectedSection === 'ai-chatbot-agent' && (
              <>
                {/* Auto detect language Box (move right next to Default Language, increase height) */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '57%', top: '20%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Auto detect language
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  <div className="flex items-center w-full mb-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><path d="M12 3v18"/><path d="M5 12h14"/></svg>
                    <span className="text-white text-xs opacity-80 mt-0">Automatically detect the user&apos;s language for the chatbot agent.</span>
                    <label className="relative inline-flex items-center cursor-pointer group ml-4">
                      <input type="checkbox" className="sr-only peer" checked={autoDetectLanguageEnabled} onChange={e => setAutoDetectLanguageEnabled(e.target.checked)} />
                      <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                    </label>
                  </div>
                </div>
                {/* Select bot modal Box (styled like Select TTS Modal) */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '2.9%', top: '20%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Select bot modal
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  {/* Tagline */}
                  <div className="flex items-center w-full mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                    <span className="text-white text-xs opacity-80 mt-0">Choose up to 3 modals for the AI chatbot agent to interact with users.</span>
                  </div>
                <div className="flex items-center w-full">
                  <span className="text-white text-xs opacity-80 mt-0 mr-2">Bot Modal Name</span>
                  <span className="text-blue-300 text-xs font-bold mr-2">{selectedBotModalName || "None selected"}</span>
                  <button
                    className="ml-2 px-2 py-1 bg-gray-800 border border-white/30 text-white text-xs font-semibold rounded-none hover:bg-blue-900 transition"
                    onClick={handlePlusClick}
                  >Select</button>
                </div>
                </div>
                {/*  Redirect3 Box (below Select bot modal box, increase height to match Default Language box, move down a bit) */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '2.9%', top: '39%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Redirect
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  <div className="flex items-center w-full mb-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><path d="M17 2l4 4-4 4"/><path d="M21 6H7a5 5 0 0 0 0 10h3"/></svg>
                    <span className="text-white text-xs opacity-80 mt-0">The agent can redirect the user to other pages on your website, based on their message or voice command</span>
                    {/* Enable/disable toggle button */}
                    <label className="relative inline-flex items-center cursor-pointer group ml-4">
                      <input type="checkbox" className="sr-only peer" checked={chatbotRedirectEnabled} onChange={e => setChatbotRedirectEnabled(e.target.checked)} />
                      <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                    </label>
                  </div>
                  {/* Image below tagline */}
                  <div className="w-full flex justify-center mt-2 mb-2">
                    <Image src="/54tr3.png" alt="Redirect Illustration" width={120} height={60} style={{maxWidth: '120px', maxHeight: '60px', objectFit: 'contain'}} />
                  </div>
                </div>
                {/* Suggestion Prompt Box (right next to Redirect3) */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '30.1%', top: '20%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Suggestion Prompt
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  <div className="flex items-center w-full mb-2">
                    {/* Lightbulb icon */}
                    <span className="flex flex-col items-center justify-center mr-2" style={{height: '32px', minWidth: '32px'}}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginTop: '10px'}}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.5-1.5 4.5-3.5 5.5V17a1 1 0 0 1-2 0v-2.5C6.5 13.5 5 11.5 5 9a7 7 0 0 1 7-7z"/></svg>
                    </span>
                    <span className="text-white text-xs opacity-80 mt-0">Show users helpful prompt suggestions to guide their conversation with the agent.</span>
                    {/* Disabled toggle button */}
                    <label className="relative inline-flex items-center ml-4 opacity-60 cursor-not-allowed">
                      <input type="checkbox" className="sr-only peer" disabled />
                      <div className="w-9 h-5 bg-black rounded-full shadow-inner border-2 border-blue-300 flex items-center justify-center"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg border border-gray-300"></div>
                    </label>
                  </div>
                  {/* Prompt suggestions */}
                  <div className="flex flex-col gap-1 mt-2 ml-2">
                    <span className="text-white text-xs opacity-90">For Example:</span>
                    <span className="text-blue-200 text-xs">• What can you help me with?</span>
                    <span className="text-blue-200 text-xs">• Suggest a product for me</span>
                    <span className="text-blue-200 text-xs">• How do I get started?</span>
                   
                  </div>
                </div>
                {/* Custom Knowledge Taxed Box (new, for both AI conversation agent and AI chatbot agent) */}
              </>
            )}
            {/* Watermark Box (new, for AI conversation agent section) */}
            {selectedSection === 'ai-conversation-agent' && (
              <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '57%', top: '38.9%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                <div className="flex items-center w-full mb-1">
                  <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                    Watermark
                    <span className="ml-2 text-lg font-bold">→</span>
                  </span>
                </div>
                <div className="flex items-center w-full mb-2">
                  {/* Watermark icon */}
                  <span className="flex flex-col items-center justify-center mr-2" style={{height: '32px', minWidth: '32px'}}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginTop: '10px'}}><path d="M12 2C12 2 7 8.5 7 13a5 5 0 0 0 10 0c0-4.5-5-11-5-11z"/><circle cx="12" cy="13" r="4"/></svg>
                  </span>
                  <span className="text-white text-xs opacity-80 mt-0 mr-2">Show a watermark on the agent UI for branding or copyright.</span>
                  {/* Enable button */}
                  <label className="relative inline-flex items-center ml-4 opacity-60 cursor-not-allowed">
                    <input type="checkbox" className="sr-only peer" disabled />
                    <div className="w-9 h-5 bg-black rounded-full shadow-inner border-2 border-blue-300 flex items-center justify-center"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg border border-gray-300"></div>
                  </label>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
              <h2 className="text-2xl font-bold text-white" style={{marginLeft: '30rem'}}>My Partner</h2>
              <span className="text-sm font-bold text-white ml-80" style={{letterSpacing: '0.5px'}}>
                <span className="inline-flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="6.01" y2="15"/><line x1="10" y1="15" x2="10.01" y2="15"/></svg>
                  Pricing: <span className="text-blue-400 font-bold">$0.00</span>
                </span>
              </span>
              </div>
              <div className="flex-1 flex justify-end">
                <button
                  className="w-40 h-12 flex items-center justify-center border border-white/30 text-white text-base font-bold rounded-none transition shadow-lg"
                  style={{ minWidth: 120, minHeight: 48, borderRadius: 0, marginRight: '-1rem', backgroundColor: '#232a2f' }}
                  onClick={() => {/* TODO: Add save logic here */}}
                >
                  Save & Continue
                </button>
              </div>
            </div>
            <div className="border-t border-white/20 -mx-8 mb-6" style={{ width: 'calc(100% + 4rem)' }}></div>
            {/* Vertical straight line slightly right from the right side, full height of box, thin and same color as box border */}
            <div className="flex-1 flex flex-col justify-center items-center relative" style={{height: 'calc(100% + 12rem)'}}>
              <div className="absolute right-40 top-[-6rem] w-px bg-white/20" style={{height: 'calc(100% + 12rem)'}}></div>
              {/* You can add partner details or edit form here */}
              {/* Agent text on the right side, moved further up and smaller */}
              <div className="absolute right-[-2rem] top-[-0.7rem] z-20 w-48 flex flex-col items-end">
                <div className="border-t border-white/20 mt-1 mb-4" style={{ width: '12rem' }}></div>
                <button
                  className={`mr-2 cursor-pointer text-right transition-all duration-200 whitespace-nowrap max-w-[12rem] 
                    ${selectedSection === 'ai-conversation-agent' ? 'text-base font-bold text-white' : 'text-sm font-normal opacity-70 text-white hover:underline'}`}
                  onClick={() => setSelectedSection('ai-conversation-agent')}
                >
                  Ai conversation Agent
                </button>
                <div className="border-t border-white/20 mt-1 mb-4" style={{ width: '12rem' }}></div>
                <button
                  className={`mr-2 cursor-pointer text-right transition-all duration-200 whitespace-nowrap max-w-[12rem] 
                    ${selectedSection === 'ai-chatbot-agent' ? 'text-sm font-bold text-white' : 'text-xs font-normal opacity-70 text-white hover:underline'}`}
                  onClick={() => setSelectedSection('ai-chatbot-agent')}
                >
                  Ai chatbot Agent
                </button>
                <div className="border-t border-white/20 mt-1 mb-4" style={{ width: '12rem' }}></div>
                <button
                  className={`mr-2 cursor-pointer text-right transition-all duration-200 
                    ${selectedSection === 'systms' ? 'text-sm font-bold text-white' : 'text-xs font-normal opacity-70 text-white hover:underline'}`}
                  onClick={() => setSelectedSection('systms')}
                >
                  UI/Systms
                </button>
                <div className="border-t border-white/20 mt-1 mb-4" style={{ width: '12rem' }}></div>
                {/* Pricing removed from sidebar */}
              </div>
            </div>
          </div>
          {/* End My Partner Box */}
        </div>
      </div>
      {/* BotOverlay modal always rendered last for top stacking */}
      {showBotOverlay && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[99999]"
          style={{background: 'rgba(0,0,0,0.6)', pointerEvents: 'auto', justifyContent: 'flex-start'}}
          onClick={e => {
            // Only close if click is on the background, not inside the overlay
            if (e.target === e.currentTarget) closeBotOverlay();
          }}
          onScroll={closeBotOverlay}
        >
          <div
            className="bg-gray-900 border border-white/30 p-8 flex flex-col gap-4"
            style={{width: 340, minHeight: 220, borderRadius: 0, boxShadow: '0 4px 32px rgba(0,0,0,0.6)', transform: 'translateY(-50px) translateX(40px)', zIndex: 1002}}
            onClick={e => e.stopPropagation()}
          >
            <BotOverlayTable onSelectModal={handleSelectBotModal} onClose={closeBotOverlay} />
          </div>
        </div>
      )}

      {/* TTSOverlay modal always rendered last for top stacking */}
      {showTTSOverlay && (
        <>
          <div className="fixed inset-0 z-[100000]">
            <TTSOverlay
              onSelectModal={handleSelectTTSModal}
              onClose={() => setShowTTSOverlay(false)}
              onPricingHover={setTTSPricingHoveredIdx}
            />
          </div>
          {/* Pricing overlay rendered outside TTSOverlay */}
          {ttsPricingHoveredIdx !== null && (
            <div style={{
              position: 'fixed',
              left: 420,
              top: 180,
              zIndex: 100001,
              background: '#1e293b',
              border: '1px solid #d1d5db',
              boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
              borderRadius: 0,
              padding: '24px',
              width: '320px',
              height: '160px',
              color: 'white',
              fontSize: '18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              fontFamily: 'sans-serif',
            }}>
              <div className="font-bold mb-4 text-xl text-blue-300" style={{fontFamily: 'sans-serif'}}>Pricing</div>
              <div className="flex flex-col gap-3" style={{fontFamily: 'sans-serif'}}>
                {(() => {
                  const botModals = [
                    { name: "Alibaba Cloud", platform: "Assistlore", inputToken: "$0.002", outputToken: "$0.003" },
                    { name: "DeepSeek", platform: "DeepSeek", inputToken: "$0.0015", outputToken: "$0.0025" },
                    { name: "DeepSeek", platform: "DeepSeek", inputToken: "$0.0015", outputToken: "$0.0025" },
                    { name: "Meta", platform: "Meta", inputToken: "$0.001", outputToken: "$0.002" },
                    { name: "Google", platform: "Google", inputToken: "$0.002", outputToken: "$0.003" },
                    { name: "Groq", platform: "Groq", inputToken: "$0.0012", outputToken: "$0.0022" },
                    { name: "Hugging Face", platform: "Hugging Face", inputToken: "$0.0018", outputToken: "$0.0028" },
                    { name: "Mistral AI", platform: "Mistral AI", inputToken: "$0.0016", outputToken: "$0.0026" },
                    { name: "Moonshot AI", platform: "Moonshot AI", inputToken: "$0.0014", outputToken: "$0.0024" },
                  ];
                  const modal = botModals[ttsPricingHoveredIdx];
                  return (
                    <>
                      <span>Input Token: <span className="text-blue-400 text-lg" style={{fontFamily: 'sans-serif'}}>1M/{modal.inputToken}</span></span>
                      <span>Output Token: <span className="text-green-400 text-lg" style={{fontFamily: 'sans-serif'}}>1M/{modal.outputToken}</span></span>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
