import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";


interface AGSidebarProps {
  style1IconStyle: string;
  setStyle1IconStyle: (style: string) => void;
  style1BtnTextColor: string;
  setStyle1BtnTextColor: (color: string) => void;
  selectedChatbotLogo: string;
  selectedVoiceLogo: string;
  handleShowChatboxUI: () => void;
  setShowLogoOverlay: (type: "chatbot" | "voice" | null) => void;
  setSidebarOverlay: (label: string | null) => void;
  overlay: string | null;
  selectedWaveformVideo: string;
  setSelectedWaveformVideo: (src: string) => void;
  style1BtnSize: string;
  setStyle1BtnSize: (size: string) => void;
  style1BtnColor: string;
  setStyle1BtnColor: (color: string) => void;
}



const AGSidebar: React.FC<AGSidebarProps> = ({
  style1IconStyle,
  setStyle1IconStyle,
  style1BtnTextColor,
  setStyle1BtnTextColor,
  selectedChatbotLogo,
  selectedVoiceLogo,
  handleShowChatboxUI,
  setShowLogoOverlay,
  setSidebarOverlay,
  overlay,
  selectedWaveformVideo,
  setSelectedWaveformVideo,
  style1BtnSize,
  setStyle1BtnSize,
  style1BtnColor,
  setStyle1BtnColor
}) => {
  // Open overlay from sidebar
  const handleSidebarOverlay = (label: string) => {
    setSidebarOverlay(label);
  };

  // Close overlay
  const handleCloseOverlay = () => {
    setSidebarOverlay(null);
  };

  const [selectedUIStyle, setSelectedUIStyle] = useState<string>("style 1");
  // Button size state for Style 1 is now controlled by parent
  return (
    <aside className="absolute left-0 top-0 h-[650px] min-h-[120px] w-[120px] z-20 border border-white/20 shadow-xl rounded-none ml-0.8 mr-4 flex flex-col items-center p-3 gap-4 bg-gradient-to-br from-white/5 via-blue-900/10 to-white/0 backdrop-blur-md bg-opacity-10">
      <h2 className="text-white text-xs font-bold tracking-wide font-sans mb-1 mt-1">Voice Agent Ui</h2>
      <hr className="w-full border-t border-white/20 mb-2" />
      <div className="flex flex-col items-center gap-2 w-full">
        {["UI Size","UI Style", "Background","Header", "footer", "Input bar", "Sand", "Response card","Response Loading"].map((label) => (
          <button
            key={label}
            className="text-white w-full text-center py-2 rounded-lg hover:bg-white/10 transition font-semibold focus:outline-none mt-2 text-[0.7rem] font-sans"
            style={{
              fontSize: "0.7rem",
              fontWeight: 500,
              fontFamily: 'sans-serif',
            }}
            onClick={() => handleSidebarOverlay(label)}
            type="button"
          >
            {label}
          </button>
        ))}
        {/* Horizontal line below the last button */}
        <hr className="w-full border-t border-white/20 my-4" />
      </div>
      {/* Overlay rendering logic */}
      {overlay && (
        <div className="fixed top-0 left-[120px] h-[630px] min-h-[200px] w-[220px] z-30 border border-white/20 shadow-xl rounded-none flex flex-col items-center p-3 gap-4 bg-gradient-to-br from-white/10 via-blue-900/20 to-white/0 backdrop-blur-md bg-opacity-20 overflow-y-auto">
          <span className="text-white text-lg font-bold tracking-wide font-sans mt-8">
            {overlay} Overlay
          </span>
          {/* Overlay content for Waveform Style */}
          {overlay === "Waveform Style" ? (
            <div className="mt-4 w-full flex flex-col items-center gap-2">
              <span className="text-white/80 text-xs mb-2">Waveform Style settings have been removed.</span>
            </div>
          ) : overlay === "UI Style" ? (
            <div className="mt-4 w-full flex flex-col items-center gap-2">
              <span className="text-white/80 text-xs mb-2">Choose a UI style:</span>
              <div className="grid grid-cols-1 gap-2 w-full">
                {["style 1", "Style 2", "Style 3", "Style 4", "Style 5"].map((style, idx) => (
                  <button
                    key={style + idx}
                    className={`text-white w-full text-center py-2 rounded-lg transition font-semibold focus:outline-none mt-1 text-[0.8rem] font-sans border border-white/10 ${selectedUIStyle === style ? 'bg-emerald-500/20 font-bold ring-2 ring-emerald-400' : 'hover:bg-emerald-500/10'}`}
                    style={{ fontSize: "0.8rem", fontWeight: selectedUIStyle === style ? 700 : 500, fontFamily: 'sans-serif' }}
                    type="button"
                    onClick={() => setSelectedUIStyle(style)}
                  >
                    {style}
                  </button>
                ))}
              </div>
              {/* Style 1 controls: Button size and custom color */}
              <div className="mt-4 w-full flex flex-col gap-2">
                <span className="text-white/80 text-xs mb-1 block">Button Size (Style 1)</span>
                <div className="flex gap-2 mb-2">
                  {["Small", "Medium", "Large"].map((size, idx) => (
                    <button
                      key={size}
                      className={`px-2 py-1 rounded border border-white/20 text-xs text-white bg-white/10 transition ${style1BtnSize === size ? 'bg-emerald-500/20 font-bold ring-2 ring-emerald-400' : 'hover:bg-emerald-500/10'}`}
                      style={{ fontWeight: style1BtnSize === size ? 700 : 500 }}
                      onClick={() => setStyle1BtnSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <span className="text-white/80 text-xs mb-1 block">Button Custom Color (Style 1)</span>
                <input
                  type="color"
                  title="Custom Button Color"
                  className="w-8 h-8 border-2 border-white/30 rounded cursor-pointer mb-2"
                  value={style1BtnColor}
                  onChange={e => setStyle1BtnColor(e.target.value)}
                  style={{ background: style1BtnColor }}
                />
                <span className="text-white/80 text-xs mb-1 block">Custom Button Text Color (Style 1)</span>
                <input
                  type="color"
                  title="Custom Button Text Color"
                  className="w-8 h-8 border-2 border-white/30 rounded cursor-pointer mb-2"
                  value={style1BtnTextColor}
                  onChange={e => setStyle1BtnTextColor(e.target.value)}
                  style={{ background: style1BtnTextColor }}
                />
                <span className="text-white/80 text-xs mb-1 block">Icon Style (Style 1)</span>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {[
                    { key: 'default', label: 'Default', icon: <svg width="22" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15 Q10 10 16 10 Q22 10 26 15" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" /><rect x="5" y="14" width="4" height="3" rx="1.2" fill="#fff" /><rect x="23" y="14" width="4" height="3" rx="1.2" fill="#fff" /><line x1="20" y1="4" x2="12" y2="22" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg> },
                    { key: 'phone', label: 'Phone', icon: <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 22 2 13.93 2 4.5A1 1 0 013 3.5h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                    { key: 'wave', label: 'Wave', icon: <svg width="22" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 10 Q8 2 16 10 Q24 18 30 10" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg> },
                    { key: 'circle', label: 'Circle', icon: <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="2" fill="none"/></svg> },
                    { key: 'square', label: 'Square', icon: <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#fff" strokeWidth="2" fill="none"/></svg> },
                    { key: 'mic', label: 'Mic', icon: <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="4" width="6" height="12" rx="3" stroke="#fff" strokeWidth="2" fill="none"/><path d="M5 11v2a7 7 0 0014 0v-2" stroke="#fff" strokeWidth="2" fill="none"/><line x1="12" y1="20" x2="12" y2="22" stroke="#fff" strokeWidth="2"/></svg> },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      className={`p-2 rounded border border-white/20 bg-white/10 transition ${style1IconStyle === opt.key ? 'bg-emerald-500/20 font-bold ring-2 ring-emerald-400' : 'hover:bg-emerald-500/10'}`}
                      onClick={() => setStyle1IconStyle(opt.key)}
                      title={opt.label}
                    >
                      {opt.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 w-full text-white/80 text-xs">Content for {overlay} overlay goes here.</div>
          )}
          <button
            className="absolute top-2 right-2 text-white/70 hover:text-white text-2xl font-bold bg-transparent border-none outline-none"
            onClick={handleCloseOverlay}
            aria-label="Close Sidebar Overlay"
            style={{ lineHeight: 1 }}
          >
            &times;
          </button>
        </div>
      )}
    </aside>
  );
};

export default AGSidebar;
