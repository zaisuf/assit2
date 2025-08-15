"use client";

import React, { useState } from "react";
import HexagonGrid from "@/components/HexagonGrid";
import Sidebar from "@/components/sidebar/page";

export default function EditPartnerPage() {
  const [selectedSidebar, setSelectedSidebar] = useState("design");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showModalOverlay, setShowModalOverlay] = useState(false); // Overlay state
  const [selectedModals, setSelectedModals] = useState<string[]>([]); // Multi-select state

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

  // Handle plus button click
  function handlePlusClick() {
    setShowModalOverlay(true);
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

  // Close overlay
  function closeOverlay() {
    setShowModalOverlay(false);
  }

  function handleLanguageClick() {
    setShowLanguageOverlay(true);
  }
  function handleSelectLanguage(code: string) {
    setSelectedLanguage(code);
    setShowLanguageOverlay(false);
  }

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
            <div className={selectedSection === 'ai-conversation-agent' ? "absolute top-[51%] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent" : "absolute top-[51%]"} style={{ left: '3%', width: 1085, height: 970, background: 'rgba(0,0,0,0.4)', transform: 'translateY(-45%)', borderRadius: 0, pointerEvents: 'auto' }}>
            </div>
            {/* Show Redirect and Conventional boxes only in Systms section */}
            {selectedSection === 'systms' && (
              <>
                {/* Redirect Box */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '3%', top: '35%', width: 350, height: 100, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Redirect
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  <div className="flex items-center w-full">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><path d="M17 2l4 4-4 4"/><path d="M21 6H7a5 5 0 0 0 0 10h3"/></svg>
                    <span className="text-white text-xs opacity-80 mt-0">The agent can redirect the user to other pages on your website, based on their message or voice command</span>
                    <div className="ml-auto flex items-center -mt-10">
                      <label className="relative inline-flex items-center cursor-pointer group ml-4">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                      </label>
                    </div>
                  </div>
                </div>
                {/* Conventional box, same style as Redirect */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '34%', top: '35%', width: 350, height: 100, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Conventional
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  <div className="flex items-center w-full">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                    <span className="text-white text-xs opacity-80 mt-0">The agent convinces user to buy your products and services.</span>
                    <div className="ml-auto flex items-center -mt-10">
                      <label className="relative inline-flex items-center cursor-pointer group ml-4">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* Select Modal Box for Ai conversation Agent */}
            {selectedSection === 'ai-conversation-agent' && (
              <>
                {/* Select TTS Modal Box (new, left of Default Language) */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '3%', top: '20%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Select TTS Modal
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  {/* Tagline */}
                  <div className="flex items-center w-full mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                    <span className="text-white text-xs opacity-80 mt-0">Select the TTS modal for the agent's voice synthesis.</span>
                  </div>
                  <div className="flex items-center w-full">
                    <span className="text-white text-xs opacity-80 mt-0 mr-2">TTS Modal Name</span>
                    <button
                      className="ml-2 px-2 py-1 bg-gray-800 border border-white/30 text-white text-xs font-semibold rounded-none hover:bg-blue-900 transition"
                    >Select</button>
                  </div>
                </div>
                {/* Language Box */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '30%', top: '20%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Default Language
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  {/* Default tagline */}
                  <div className="flex items-center w-full mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><path d="M4 19h16M4 5h16M7 5v14M17 5v14"/></svg>
                    <span className="text-white text-xs opacity-80 mt-0">The default language for the agent's conversation and responses.</span>
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
                      <div className="bg-gray-900 border border-white/30 p-6 flex flex-col gap-2" style={{width: 260, borderRadius: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.5)'}}>
                        <div className="text-white text-base font-semibold mb-2">Select Language</div>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                          {SUPPORTED_LANGUAGES.map(lang => (
                            <button
                              key={lang.code}
                              className={`px-2 py-1 text-left text-white text-xs border border-white/20 rounded-none hover:bg-blue-800 transition ${selectedLanguage === lang.code ? 'bg-blue-700' : 'bg-gray-800'}`}
                              onClick={() => handleSelectLanguage(lang.code)}
                            >{lang.name}</button>
                          ))}
                        </div>
                        <button
                          className="mt-4 w-full bg-blue-700 text-white py-2 border border-white/20 rounded-none hover:bg-blue-800 transition"
                          onClick={() => setShowLanguageOverlay(false)}
                        >Done</button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Voice Character Box */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '57%', top: '20%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Manually select m/f character
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  <div className="flex items-center w-full mb-2">
                    {/* Icon for voice - moved down a bit */}
                    <span className="flex flex-col items-center justify-center mr-2" style={{height: '32px', minWidth: '32px'}}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginTop: '10px'}}><path d="M12 3v10"/><rect x="9" y="13" width="6" height="7" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                    </span>
                    <span className="text-white text-xs opacity-80 mt-0 mr-2">Choose the voice character for the agent: male or female.</span>
                    {/* Enable button */}
                    <label className="relative inline-flex items-center cursor-pointer group ml-4">
                      <input type="checkbox" className="sr-only peer" checked={voiceEnabled} onChange={e => setVoiceEnabled(e.target.checked)} />
                      <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                    </label>
                  </div>
                  {/* Manually select language row */}
                  <div className="flex items-center w-full mb-0 mt-0">
                    <span className="text-white text-base font-semibold ml-6 flex items-center">
                      <span>Manually select language</span>
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  <div className="flex items-center w-full mb-2">
                    <span className="text-white text-xs opacity-80 mt-0 mr-2 ml-6">Choose the language for the agent's voice character.</span>
                    {/* Enable button for language */}
                    <label className="relative inline-flex items-center cursor-pointer group ml-4">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                    </label>
                  </div>
                </div>
                {/* Add new square box in ai conversation agent section */}
                <div className="absolute border border-white/30 flex flex-col items-center justify-center px-4 pt-3" style={{ left: '40%', top: '70%', width: 180, height: 180, background: 'linear-gradient(135deg, rgba(40,40,60,0.85) 0%, rgba(60,80,120,0.65) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <span className="text-white text-base font-semibold mb-2">Square Box</span>
                  <span className="text-white text-xs opacity-80">This is a new square box for the ai conversation agent section.</span>
                </div>
                {/* More Box: Auto Ask Text & Redirect */}
                <div className="absolute flex flex-row gap-2" style={{ left: '2.9%', top: '39%', width: 1150, height: 180, transform: 'translateY(-50%)', zIndex: 15 }}>
                  {/* Auto Ask Text Box */}
                  <div className="border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0 }}>
                    {/* Auto Ask Text Row */}
                    <div className="flex items-center w-full mb-1">
                      <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                        Auto Ask text
                        <span className="ml-2 text-lg font-bold">→</span>
                      </span>
                    </div>
                    <div className="flex items-center w-full mb-2">
                      <span className="flex flex-col items-center justify-center mr-2" style={{height: '32px', minWidth: '32px'}}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginTop: '10px'}}><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                      </span>
                      <span className="text-white text-xs opacity-80 mt-0 mr-2">Choose the auto ask text for the agent's session.</span>
                      {/* Enable button */}
                      <label className="relative inline-flex items-center cursor-pointer group ml-4">
                        <input type="checkbox" className="sr-only peer" />
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
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* Redirect Box (first) */}
                  <div className="border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0 }}>
                    <div className="flex items-center w-full mb-1">
                      <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                        Redirect
                        <span className="ml-2 text-lg font-bold">→</span>
                      </span>
                    </div>
                    <div className="flex items-center w-full mb-2">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><path d="M17 2l4 4-4 4"/><path d="M21 6H7a5 5 0 0 0 0 10h3"/></svg>
                      <span className="text-white text-xs opacity-80 mt-0">The agent can redirect the user to other pages on your website, based on their message or voice command</span>
                      <label className="relative inline-flex items-center cursor-pointer group ml-4">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                      </label>
                    </div>
                  </div>
                  {/* Additional Redirect Box (with tagline and icon) */}
                  <div className="border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0 }}>
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
                  </div>
                </div>
              </>
            )}
            {/* Select Chatbot Modal Box for Ai chatbot Agent */}
            {selectedSection === 'ai-chatbot-agent' && (
              <>
                {/* Default Language Box (replaces Manually select m/f character6) */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '30%', top: '20%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Default Language
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  <div className="flex items-center w-full mb-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><path d="M4 19h16M4 5h16M7 5v14M17 5v14"/></svg>
                    <span className="text-white text-xs opacity-80 mt-0">The default language for the agent's conversation and responses.</span>
                  </div>
                  <div className="flex items-center w-full">
                    <span className="text-white text-xs opacity-80 mt-0 mr-2">English</span>
                    <button
                      className="ml-2 px-2 py-1 bg-gray-800 border border-white/30 text-white text-xs font-semibold rounded-none hover:bg-blue-900 transition"
                      onClick={handleLanguageClick}
                    >Select</button>
                  </div>
                </div>
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
                    <span className="text-white text-xs opacity-80 mt-0">Automatically detect the user's language for the chatbot agent.</span>
                    <label className="relative inline-flex items-center cursor-pointer group ml-4">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                    </label>
                  </div>
                </div>
                {/* Select bot modal Box (move left, next to Default Language box) */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '3%', top: '20%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Select bot modal
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  <div className="flex items-center w-full mb-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                    <span className="text-white text-xs opacity-80 mt-0">Choose up to 3 modals for the AI chatbot agent to interact with users.</span>
                  </div>
                  <button
                    className="w-10 h-10 flex items-center justify-center bg-gray-800 border border-white/30 text-white text-2xl font-bold mb-2 hover:bg-blue-900 transition rounded-none"
                    onClick={handlePlusClick}
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                    aria-label="Add Modal"
                  >
                    +
                  </button>
                </div>
                {/* Redirect Box (below Select bot modal box, increase height to match Default Language box, move down a bit) */}
                <div className="absolute border border-white/30 flex flex-col items-start justify-start px-4 pt-3" style={{ left: '3%', top: '39%', width: 350, height: 180, background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', borderRadius: 0, transform: 'translateY(-50%)', zIndex: 15 }}>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-white text-base font-semibold mt-2 ml-6 flex items-center">
                      Redirect
                      <span className="ml-2 text-lg font-bold">→</span>
                    </span>
                  </div>
                  <div className="flex items-center w-full mb-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 -mt-10"><path d="M17 2l4 4-4 4"/><path d="M21 6H7a5 5 0 0 0 0 10h3"/></svg>
                    <span className="text-white text-xs opacity-80 mt-0">The agent can redirect the user to other pages on your website, based on their message or voice command</span>
                    <label className="relative inline-flex items-center cursor-pointer group ml-4">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-black peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-400 rounded-full shadow-inner border-2 border-blue-300 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 peer-checked:border-green-300 flex items-center justify-center"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 peer-checked:translate-x-4 group-hover:bg-blue-200 peer-checked:bg-green-200 border border-gray-300"></div>
                    </label>
                  </div>
                </div>
              </>
            )}
            <h2 className="text-2xl font-bold text-white mb-2">My Partner</h2>
            <div className="border-t border-white/20 -mx-8 mb-6" style={{ width: 'calc(100% + 4rem)' }}></div>
            {/* Vertical straight line slightly right from the right side, full height of box, thin and same color as box border */}
            <div className="flex-1 flex flex-col justify-center items-center relative" style={{height: 'calc(100% + 12rem)'}}>
              <div className="absolute right-40 top-[-6rem] w-px bg-white/20" style={{height: 'calc(100% + 12rem)'}}></div>
              {/* You can add partner details or edit form here */}
              {/* Agent text on the right side, moved further up and smaller */}
              <div className="absolute right-[-2rem] top-[-0.7rem] z-20 w-48 flex flex-col items-end">
                <button
                  className="text-white text-base font-normal mr-20 opacity-70 hover:underline cursor-pointer text-right"
                  onClick={() => setSelectedSection(null)}
                >Analysis</button>
                <div className="border-t border-white/20 mt-1 mb-4" style={{ width: '12rem' }}></div>
                <button
                  className="text-white text-sm font-normal mr-20 opacity-70 hover:underline cursor-pointer text-right"
                  onClick={() => setSelectedSection('ai-conversation-agent')}
                >Ai conversation Agent </button>
                <div className="border-t border-white/20 mt-1 mb-4" style={{ width: '12rem' }}></div>
                <button
                  className="text-white text-sm font-normal mr-20 opacity-70 hover:underline cursor-pointer text-right"
                  onClick={() => setSelectedSection('ai-chatbot-agent')}
                >Ai chatbot Agent</button>
                <div className="border-t border-white/20 mt-1 mb-4" style={{ width: '12rem' }}></div>
                <button
                  className="text-white text-sm font-normal mr-20 opacity-70 hover:underline cursor-pointer text-right"
                  onClick={() => setSelectedSection('systms')}
                >Systms</button>
                <div className="border-t border-white/20 mt-1 mb-4" style={{ width: '12rem' }}></div>
              </div>
            </div>
          </div>
          {/* End My Partner Box */}
        </div>
      </div>
    </div>
  );
}
