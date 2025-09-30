'use client'

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Message {
  text: string;
  isAI: boolean;
  timestamp: Date;
}

const AIFeaturesSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "How can I assist you today?", isAI: true, timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const buttonLabels = [
    'Shopify',
    'WooCommerce',
    'Magento',
    'BigCommerce',
    'Wix eCommerce',
  ];
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const voiceBoxRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [polylinePoints, setPolylinePoints] = useState({
    chatToButton: '',
    voiceToButton: ''
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Helper to recalculate polyline points
  const recalcPolylines = React.useCallback(() => {
    const wrapper = wrapperRef.current?.getBoundingClientRect();
    const chatBox = chatBoxRef.current?.getBoundingClientRect();
    const voiceBox = voiceBoxRef.current?.getBoundingClientRect();
    const btn = buttonRefs.current[selectedIndex]?.getBoundingClientRect();
    if (!chatBox || !voiceBox || !btn || !wrapper) {
      setPolylinePoints({ chatToButton: '', voiceToButton: '' });
      return;
    }
    const offsetX = (x: number) => x - wrapper.left;
    const offsetY = (y: number) => y - wrapper.top;
    const chatX = offsetX(chatBox.right);
    const chatY = offsetY(chatBox.top + chatBox.height / 2);
    const voiceX = offsetX(voiceBox.left);
    const voiceY = offsetY(voiceBox.top + voiceBox.height / 2);
    const btnLeftX = offsetX(btn.left);
    const btnCenterY = offsetY(btn.top + btn.height / 2);
    const btnRightX = offsetX(btn.right);
    const chatToButton = `${chatX},${chatY} ${chatX+40},${chatY} ${chatX+40},${btnCenterY} ${btnLeftX},${btnCenterY}`;
    const voiceToButton = `${voiceX},${voiceY} ${voiceX-40},${voiceY} ${voiceX-40},${btnCenterY} ${btnRightX},${btnCenterY}`;
    setPolylinePoints({ chatToButton, voiceToButton });
  }, [selectedIndex]);

  useLayoutEffect(() => {
    // Delay to ensure refs are set after DOM paint
    const timeout = setTimeout(recalcPolylines, 0);
    window.addEventListener('resize', recalcPolylines);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', recalcPolylines);
    };
  }, [selectedIndex, buttonLabels.length, recalcPolylines]);

  // Use MutationObserver to recalc on DOM/layout changes
  useEffect(() => {
    const container = document.querySelector('.container');
    if (!container) return;
    const observer = new MutationObserver(() => {
      setTimeout(recalcPolylines, 0);
    });
    observer.observe(container, { childList: true, subtree: true, attributes: true });
    return () => observer.disconnect();
  }, [selectedIndex, buttonLabels.length, recalcPolylines]);

  return (    
    <div ref={wrapperRef} className="relative min-h-screen w-full overflow-hidden bg-transparent font-sans">
      {/* Removed Animated Background Elements */}
      {/* <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 50 + 20}px`,
                height: `${Math.random() * 50 + 20}px`,
                background: `linear-gradient(${Math.random() * 360}deg, rgba(79, 70, 229, 0.2), rgba(124, 58, 237, 0.2))`,
                borderRadius: '50%',
                filter: 'blur(8px)'
              }}
            />
          ))}
        </div>
      </div> */}

      {/* Removed Interactive Gradient Line */}
      {/* <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[2px] w-1/3 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#DB2777] animate-pulse"></div>
      </div> */}

      <div className="container mx-auto flex items-center justify-between h-screen px-8 gap-8 relative">
        {/* SVG Polyline Diagram Connecting Boxes */}
        <svg className="absolute left-0 top-0 w-full h-full pointer-events-none z-10" style={{overflow: 'visible'}}>
          {/* Polyline from AI Chat Box to selected button with 2 turn points and endpoint aligned to left center of button */}
          {polylinePoints.chatToButton && (
            <polyline 
              points={polylinePoints.chatToButton}
              stroke="#e0e0e0" strokeWidth="1.2" fill="none" markerEnd="url(#arrow)" 
            />
          )}
          {/* Polyline from AI Voice Box to selected button with 2 turn points and endpoint aligned to right center of button */}
          {polylinePoints.voiceToButton && (
            <polyline 
              points={polylinePoints.voiceToButton}
              stroke="#e0e0e0" strokeWidth="1.2" fill="none" markerEnd="url(#arrow)" 
            />
          )}
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L8,4 L0,8 L2,4 Z" fill="#e0e0e0" />
            </marker>
          </defs>
        </svg>
        {/* Left Side - Enhanced Chatbot Template */}
        <motion.div 
          ref={chatBoxRef}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-[380px] h-[480px] bg-gradient-to-br from-black/40 via-black/20 to-transparent backdrop-blur-lg p-4 relative group isolate border border-white/10 shadow-[0_0_15px_rgba(124,58,237,0.1)]"
          style={{ borderRadius: 0 }}
        >
          {/* Chatbot Header */}
          <div className="border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] p-[1px]">
                <div className="w-full h-full rounded-xl bg-black/30 backdrop-blur flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-white text-2xl font-semibold tracking-wide bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent font-sans" style={{fontFamily: 'sans-serif'}}>
                  AI Chat Assistant
                </h3>
                <p className="text-gray-400 mt-1 text-sm font-sans" style={{fontFamily: 'sans-serif'}}>
                  Intelligent conversation at your service
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Chat Messages Area */}
          <div className="h-[400px] overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-[#7C3AED] scrollbar-track-transparent/10 px-2 relative">
            <div className="absolute inset-0 pointer-events-none bg-transparent"></div>
            {messages.map((message, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={index}
                className={`flex items-start space-x-3 ${!message.isAI ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  message.isAI 
                    ? 'bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]'
                    : 'bg-gradient-to-br from-[#06B6D4] to-[#3B82F6]'
                } p-[1px] group-hover:animate-pulse`}>
                  <div className="w-full h-full rounded-xl bg-black/30 backdrop-blur flex items-center justify-center">
                    <span className="text-white text-xs font-sans" style={{fontFamily: 'sans-serif'}}>{message.isAI ? 'AI' : 'You'}</span>
                  </div>
                </div>
                <div className={`${
                  message.isAI 
                    ? 'bg-gradient-to-br from-white/10 to-white/5' 
                    : 'bg-gradient-to-br from-[#7C3AED]/30 to-[#7C3AED]/10'
                } rounded-2xl p-4 max-w-[80%] backdrop-blur-sm border border-white/5`}>
                  <p className="text-white text-sm leading-relaxed font-sans" style={{fontFamily: 'sans-serif'}}>{message.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Input Area */}
          <div className="absolute bottom-6 left-6 right-6 z-50">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!inputMessage.trim()) return;
              
              setMessages(prev => [...prev, {
                text: inputMessage,
                isAI: false,
                timestamp: new Date()
              }]);
              
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  text: "Thank you for your message! I'm here to help you with any questions about modern houses and architecture.",
                  isAI: true,
                  timestamp: new Date()
                }]);
              }, 1000);
              
              setInputMessage("");
            }} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#DB2777] rounded-xl opacity-50 blur-md group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full bg-black/40 backdrop-blur-xl border-0 rounded-xl px-4 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] relative z-50 pr-12 font-sans"
                  style={{fontFamily: 'sans-serif'}}
                />
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] p-2 rounded-xl shadow-lg transition-all duration-300 hover:shadow-[#7C3AED]/50 hover:shadow-lg z-50 cursor-pointer group"
                >
                  <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </form>
          </div>

          {/* Enhanced Hover Effects */}
          {/* Removed hover color passing in line */}
        </motion.div>

        {/* E-commerce Text Between Boxes */}
        <div className="flex flex-col items-center justify-center h-[480px] min-w-[180px] mt-[-60px]">
          <div className="flex flex-col items-center space-y-6">
            {buttonLabels.map((label, idx) => (
              <button
                key={label}
                ref={el => { buttonRefs.current[idx] = el; }}
                className={`w-40 h-16 flex items-center justify-center text-base font-semibold text-white font-sans border border-white/70 rounded-none shadow-lg transition-all duration-200 hover:scale-105 bg-transparent ${selectedIndex === idx ? 'border-[#06B6D4] scale-105 ring-2 ring-[#06B6D4]' : ''}`}
                style={{fontFamily: 'sans-serif'}}
                onClick={() => setSelectedIndex(idx)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Enhanced Voice AI Agent */}
        <motion.div 
          ref={voiceBoxRef}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-[380px] h-[480px] bg-gradient-to-r from-black via-blue-950 to-gray-900 flex flex-col backdrop-blur-lg p-4 relative group border border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          style={{ borderRadius: 0 }}
        >
          {/* Voice AI Header */}
          <div className="border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#3B82F6] p-[1px]">
                <div className="w-full h-full rounded-xl bg-black/30 backdrop-blur flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-white text-2xl font-semibold tracking-wide bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent font-sans" style={{fontFamily: 'sans-serif'}}>
                  AI Voice Assistant
                </h3>
                <p className="text-gray-400 mt-1 text-sm font-sans" style={{fontFamily: 'sans-serif'}}>
                  Experience visual AI interactions
                </p>
              </div>
            </div>
          </div>          {/* Video Display Area */}          <div className="h-[400px] flex flex-col items-center justify-center space-y-8">
            <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden flex items-center justify-center">
              {/* Video Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/20 to-[#3B82F6]/20 animate-pulse"></div>
              {/* Circular Border Decoration */}
              <div className="absolute inset-[-2px] rounded-full border-2 border-[#06B6D4]/30 animate-spin-slow"></div>
              <div className="absolute inset-[-1px] rounded-full border border-[#3B82F6]/20"></div>
              {/* Rotating Gradient Border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#06B6D4]/20 via-[#3B82F6]/20 to-[#06B6D4]/20 animate-rotate-gradient"></div>
              {/* Center Video */}
              <div className="absolute inset-[2px] rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#06B6D4]/10 to-[#3B82F6]/10">
                <video
                  src="/vn2.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '160%', height: '160%', objectFit: 'cover', borderRadius: '9999px' }}
                />
              </div>
            </div>
          </div>
          {/* Let's Talk Button at the bottom of the box */}
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                // Add your voice chat logic here
                console.log("Starting voice chat...");
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white font-semibold text-xs shadow-md transition-all duration-300 z-10 font-sans"
              style={{fontFamily: 'sans-serif'}}
            >
              <span>Let&apos;s Talk</span>
            </motion.button>
          </div>

          {/* Enhanced Hover Effects */}
          {/* Removed hover color passing in line */}
        </motion.div>
      </div>
    </div>
  );
};

export default AIFeaturesSection;
