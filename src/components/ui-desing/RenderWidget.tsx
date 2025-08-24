"use client";

import React, { useState } from "react";
import Image from 'next/image';

// Define the mic icon styles map
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
    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"></span>
  ),
  'circle-outline': (color = '#10b981') => (
    <span className="w-8 h-8 rounded-full border-2 border-blue-400 flex items-center justify-center"></span>
  ),
  dashed: (color = '#10b981') => (
    <span className="w-8 h-8 rounded-lg border-2 border-dashed border-emerald-400 flex items-center justify-center"></span>
  ),
  'shadowed-square': (color = '#10b981') => (
    <span className="w-8 h-8 rounded-lg shadow-lg flex items-center justify-center"></span>
  ),
  'bordered-square': (color = '#10b981') => (
    <span className="w-8 h-8 rounded-lg border-2 border-emerald-400 flex items-center justify-center"></span>
  ),
  'circle-shadow': (color = '#10b981') => (
    <span className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center"></span>
  ),
  minimal: (color = '#10b981') => (
    <span className="w-8 h-8 flex items-center justify-center"></span>
  ),
  filled: (color = '#10b981') => (
    <span className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"></span>
  ),
};

// Define the bot icon styles map
const BOT_ICON_MAP: Record<string, React.ReactNode> = {
  bot1: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="6" y="9" width="12" height="7" rx="3.5" /><circle cx="9" cy="13" r="1" /><circle cx="15" cy="13" r="1" /><rect x="10.5" y="6" width="3" height="3" rx="1.5" /><path d="M12 3v3" /></svg>),
  bot2: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="5" y="8" width="14" height="7" rx="3.5" /><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><path d="M12 15v2.5l-2 1.5" /></svg>),
  // ... (including all bot icons from the original)
};

export default function RenderWidget({ config }: { config?: any }) {
  const [inputText, setInputText] = useState("");

  // Handle interface toggles with parent window communication
  const handleInterfaceToggle = (type: 'chat' | 'voice') => {
    window.parent.postMessage({
      source: 'assistlore-widget',
      action: `open${type.charAt(0).toUpperCase() + type.slice(1)}`,
      designId: config?.designId
    }, '*');
  };

  if (!config?.wedgetBox) return null;

  const w = config.wedgetBox;
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
                  onClick={() => handleInterfaceToggle('voice')}
                >
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
                  onClick={() => handleInterfaceToggle('chat')}
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
                  onClick={() => handleInterfaceToggle('chat')}
                  style={w.style5BotIconColor ? { borderColor: w.style5BotIconColor } : {}}
                />
              )}
              {w.style2BtnColor && (
                <button
                  className={`${w.style2BtnShape || ''} ${w.style2BtnSizeClass || ''} font-semibold flex items-center gap-1 shadow cursor-pointer`}
                  style={{ background: w.style2BtnColor, color: w.style2BtnTextColor || '' }}
                  onClick={() => handleInterfaceToggle('voice')}
                >
                  {MIC_ICON_MAP[w.style5MicIconStyle || 'default'](w.style5BotIconColor || '#10b981')}
                  Voice chat
                </button>
              )}
            </>
          )}

          {/* Default: fallback to Style 1 layout */}
          {w.selectedStyle !== "Style 2" && w.selectedStyle !== "Style 3" && (
            <div className="flex w-full items-center gap-2 justify-between">
              {/* Input bar left */}
              {typeof w.inputBarStyle === 'number' && (
                <div style={{
                  maxWidth: (() => {
                    if (w.wedgetBoxSize?.includes('w-[300px]')) return '260px';
                    if (w.wedgetBoxSize?.includes('w-[320px]')) return '280px';
                    if (w.wedgetBoxSize?.includes('w-[250px]')) return '220px';
                    if (w.wedgetBoxSize?.includes('w-[230px]')) return '200px';
                    return '180px';
                  })(),
                  width: '100%'
                }}>
                  <input
                    type="text"
                    className={`w-full px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm ${w.inputBarColor ? w.inputBarColor : ""}`}
                    style={{
                      minWidth: 0,
                      borderColor: w.inputBorderLineColor || '#10b981',
                      background: w.inputBarColor || undefined,
                      cursor: 'pointer'
                    }}
                    placeholder={w.inputBarPlaceholder || 'Type here...'}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onClick={() => handleInterfaceToggle('chat')}
                  />
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
                  onClick={() => handleInterfaceToggle('voice')}
                  style={w.style5BotIconColor ? { borderColor: w.style5BotIconColor } : {}}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
