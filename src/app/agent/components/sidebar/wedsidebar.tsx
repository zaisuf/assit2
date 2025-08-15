import React, { useState } from "react";
import Image from "next/image";
import { FaRegEdit, FaImage, FaArrowsAltH, FaPalette } from "react-icons/fa";

interface AGSidebarProps {
  selectedChatbotLogo: string;
  setSelectedChatbotLogo: (logo: string) => void;
  selectedVoiceBotLogo: string;
  setSelectedVoiceBotLogo: (logo: string) => void;
  handleShowChatboxUI: () => void;
  setShowLogoOverlay: (type: "chatbot" | "voice" | null) => void;
  setSidebarOverlay: (label: string | null) => void;
  onSizeSelect?: (size: string) => void;
  selectedSize?: string;
  onBgColorChange?: (color: string) => void;
  customBgColor?: string;
  // Add shape selection props
  onShapeSelect?: (shape: string) => void;
  selectedShape?: string;
  // Add style selection props
  onStyleSelect?: (style: string) => void;
  selectedStyle?: string;
  // Add input bar style props
  inputBarStyle?: number;
  setInputBarStyle?: (idx: number) => void;
  inputBarColor?: string;
  setInputBarColor?: (color: string) => void;
  inputBarPlaceholder?: string;
  setInputBarPlaceholder?: (text: string) => void;
  inputBorderLineColor?: string;
  setInputBorderLineColor?: (color: string) => void;
  // ...existing code...
  style2BtnColor?: string;
  setStyle2BtnColor?: (color: string) => void;
  style2BtnTextColor?: string;
  setStyle2BtnTextColor?: (color: string) => void;
  // Add button shape for Style 2
  style2BtnShape?: string;
  setStyle2BtnShape?: (shape: string) => void;
  // Logo shape for Wedget
  logoShape?: string;
  setLogoShape?: (shape: string) => void;
  // Style 2/3 button size
  style2BtnSizeClass?: string;
  setStyle2BtnSizeClass?: (size: string) => void;
  // Style 5 icon style and size (now split)
  style5MicIconStyle: string;
  setStyle5MicIconStyle: (style: string) => void;
  style5BotIconStyle: string;
  setStyle5BotIconStyle: (style: string) => void;
  style5LogoSize?: string;
  setStyle5LogoSize?: (size: string) => void;
  style5IconSize?: string;
  setStyle5IconSize?: (size: string) => void;
  style5BotIconColor?: string;
  setStyle5BotIconColor?: (color: string) => void;
}

const SIZE_OPTIONS = [
  { label: "Small", value: "w-[200px] h-[56px]" }, // reduced height from 80px to 56px
  { label: "Medium", value: "w-[300px] h-[70px]" },
  { label: "Large", value: "w-[320px] h-[80px]" },
];

// Expanded shape options with visual preview classes
const SHAPE_OPTIONS = [
  { label: "Rounded", value: "rounded-2xl", preview: "rounded-2xl border border-white/40" },
  { label: "Square", value: "rounded-none", preview: "rounded-none border border-white/40" },
  { label: "Pill", value: "rounded-full", preview: "rounded-full border border-white/40" },
  { label: "Circle", value: "rounded-full", preview: "rounded-full border border-white/40 w-8 h-8" },
  { label: "Dashed", value: "rounded-lg border-dashed", preview: "rounded-lg border-2 border-dashed border-emerald-400" },
  { label: "Double Border", value: "rounded-xl border-4 border-double", preview: "rounded-xl border-4 border-double border-emerald-400" },
  { label: "Shadow", value: "rounded-xl shadow-lg", preview: "rounded-xl border border-white/40 shadow-lg" },
  { label: "Outline", value: "rounded-xl border-2 border-emerald-400", preview: "rounded-xl border-2 border-emerald-400" },
];

// Add style options for Style Overlay
const STYLE_OPTIONS = [
  {
    name: "Style 1",
    render: (
      inputBarStyle = 0,
      inputBarColor = '',
      inputBarPlaceholder = 'Type a message...',
      inputBorderLineColor = '#10b981'
    ) => {
      // Expanded to 20+ styles, matching RenderUiDesign
      const colorStyle = inputBarColor ? { background: inputBarColor } : {};
      const borderColor = inputBorderLineColor || '#10b981';
      // Helper: set correct border property for each style
      const getInputStyle = (idx: number) => {
        // Underline styles (border-bottom)
        if (idx === 1 || idx === 17) {
          return { ...colorStyle, borderBottomColor: borderColor };
        }
        // No border styles
        if (idx === 3 || idx === 12 || idx === 14) {
          return { ...colorStyle };
        }
        // All other bordered styles
        return { ...colorStyle, borderColor };
      };
      const styles = [
        <input key="1" className="flex-1 px-2 py-1 rounded bg-white/10 border text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={getInputStyle(0)} />,
        <input key="2" className="flex-1 px-2 py-1 border-b-2 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={getInputStyle(1)} />,
        <input key="3" className="flex-1 px-3 py-1 rounded-full bg-emerald-900/30 border-none text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={getInputStyle(2)} />,
        <input key="4" className="flex-1 px-2 py-1 rounded bg-white/10 border text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg" placeholder={inputBarPlaceholder} style={getInputStyle(3)} />,
        <input key="5" className="flex-1 px-2 py-1 rounded-none bg-white/10 border text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={getInputStyle(4)} />,
        <input key="6" className="flex-1 px-2 py-1 rounded-xl border-4 border-double bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={getInputStyle(5)} />,
        <input key="7" className="flex-1 px-2 py-1 rounded-lg border-2 border-dashed bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={getInputStyle(6)} />,
        <input key="8" className="flex-1 px-2 py-1 rounded-xl border-2 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={getInputStyle(7)} />,
        <input key="9" className="flex-1 px-2 py-1 rounded-none bg-white/10 border text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg" placeholder={inputBarPlaceholder} style={getInputStyle(8)} />,
        <input key="10" className="flex-1 px-3 py-1 rounded-full bg-white/10 border-2 text-white placeholder:text-white/40 focus:outline-none text-sm shadow" placeholder={inputBarPlaceholder} style={getInputStyle(9)} />,
        <input key="11" className="flex-1 px-2 py-1 rounded-full border-4 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={getInputStyle(10)} />,
        <input key="12" className="flex-1 px-2 py-1 rounded bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={getInputStyle(11)} />,
        <input key="13" className="flex-1 px-2 py-1 rounded-xl bg-white/20 backdrop-blur-md border text-white placeholder:text-white/40 focus:outline-none text-sm shadow" placeholder={inputBarPlaceholder} style={getInputStyle(12)} />,
        <input key="14" className="flex-1 px-2 py-1 rounded-xl border-2 border-transparent bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={getInputStyle(13)} />,
        <input key="15" className="flex-1 px-2 py-1 rounded bg-white/10 border text-white placeholder:text-white/40 focus:outline-none text-sm shadow-inner" placeholder={inputBarPlaceholder} style={getInputStyle(14)} />,
        <input key="16" className="flex-1 px-4 py-2 rounded-full bg-emerald-900/30 border-2 text-white placeholder:text-white/40 focus:outline-none text-base" placeholder={inputBarPlaceholder} style={getInputStyle(15)} />,
        <input key="17" className="flex-1 px-2 py-1 border-b-2 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm shadow" placeholder={inputBarPlaceholder} style={getInputStyle(16)} />,
        <input key="18" className="flex-1 px-2 py-1 rounded-none border-4 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={getInputStyle(17)} />,
        <input key="19" className="flex-1 px-3 py-1 rounded-full border-2 border-dashed bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={getInputStyle(18)} />,
        <input key="20" className="flex-1 px-2 py-1 rounded-xl border-2 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg" placeholder={inputBarPlaceholder} style={getInputStyle(19)} />,
      ];
      // If index out of bounds, fallback to first style
      const styleIdx = inputBarStyle >= 0 && inputBarStyle < styles.length ? inputBarStyle : 0;
      return (
        <div className="flex items-center w-full gap-2">
          {styles[styleIdx]}
          <Image src="/voicechat1.jpg" alt="Voice Agent" width={32} height={32} className="rounded-full border-2 border-emerald-400" />
        </div>
      );
    },
  },
  {
    name: "Style 2",
    render: () => (
      <div className="flex items-center w-full justify-between gap-2">
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-full shadow text-base md:text-sm lg:text-base min-w-[40px]">
          🎤 Voice
        </button>
        <Image src="/chatbot1.jpg" alt="Chatbot" width={32} height={32} className="rounded-full border-2 border-blue-400" />
      </div>
    ),
  },
  {
    name: "Style 3",
    render: () => (
      <div className="flex flex-col items-center w-full">
        <span className="text-white/80">Style 3 Example</span>
      </div>
    ),
  },
  {
    name: "Style 4",
    render: () => (
      <div className="flex flex-col items-center w-full">
        <span className="text-white/80">Style 4 Example</span>
      </div>
    ),
  },
  {
    name: "Style 5",
    render: () => (
      <div className="flex flex-col items-center w-full">
        <span className="text-white/80">Style 5 Example</span>
      </div>
    ),
  },
];

const AGSidebar: React.FC<AGSidebarProps & { hideOverlays?: boolean; closeVoiceSidebarOverlay?: () => void }> = ({
  selectedChatbotLogo,
  setSelectedChatbotLogo,
  selectedVoiceBotLogo,
  setSelectedVoiceBotLogo,
  handleShowChatboxUI,
  setShowLogoOverlay,
  setSidebarOverlay,
  onSizeSelect,
  selectedSize = "w-[230px] h-[65px]", // Set Medium as default
  onBgColorChange,
  customBgColor,
  // Add shape selection props
  onShapeSelect,
  selectedShape,
  // Add style selection props
  onStyleSelect,
  selectedStyle,
  inputBarStyle = 0,
  setInputBarStyle,
  inputBarColor = '',
  setInputBarColor,
  inputBarPlaceholder = 'Type a message...',
  setInputBarPlaceholder,
  inputBorderLineColor = '#10b981',
  setInputBorderLineColor,
  // ...existing code...
  style2BtnColor = '',
  setStyle2BtnColor,
  style2BtnTextColor = '',
  setStyle2BtnTextColor,
  style2BtnShape = '',
  setStyle2BtnShape,
  logoShape,
  setLogoShape,
  style2BtnSizeClass,
  setStyle2BtnSizeClass,
  style5MicIconStyle,
  setStyle5MicIconStyle,
  style5BotIconStyle,
  setStyle5BotIconStyle,
  style5LogoSize,
  setStyle5LogoSize,
  style5IconSize,
  setStyle5IconSize,
  style5BotIconColor,
  setStyle5BotIconColor,
  hideOverlays,
  closeVoiceSidebarOverlay,
}) => {
  const [overlay, setOverlay] = useState<string | null>(null);
  const [showChatbotUpload, setShowChatbotUpload] = useState(false);
  const [showVoiceBotUpload, setShowVoiceBotUpload] = useState(false);
  // Use props for logo state
  const chatbotLogo = selectedChatbotLogo;
  const voiceBotLogo = selectedVoiceBotLogo;

  // Open overlay from sidebar
  const handleSidebarOverlay = (label: string) => {
    if (typeof closeVoiceSidebarOverlay === 'function') closeVoiceSidebarOverlay();
    setOverlay(label);
    setSidebarOverlay(label);
  };

  // Close overlay
  const handleCloseOverlay = () => {
    setOverlay(null);
    setSidebarOverlay(null);
  };

  return (
    <aside className="fixed top-0 left-0 h-[320px] min-h-[120px] w-[120px] z-20 border border-white/20 shadow-xl rounded-none ml-0.8 mr-4 flex flex-col items-center p-3 gap-4 bg-gradient-to-br from-white/5 via-blue-900/10 to-white/0 backdrop-blur-md bg-opacity-10">
      <h2 className="text-white text-xs font-bold tracking-wide font-sans mb-1 mt-1">Wedget UI</h2>
      <hr className="w-full border-t border-white/20 mb-2" />
      <div className="flex flex-col items-center gap-2 w-full">
        {/* Removed chatbot and voice bot logo and text sections as requested */}
        {[
          { label: 'Logos', icon: <FaImage className="inline-block mr-2 text-white text-base align-middle" /> },
          { label: 'Size', icon: <FaArrowsAltH className="inline-block mr-2 text-white align-middle" /> },
          { label: 'Style', icon: <FaRegEdit className="inline-block mr-2 text-white align-middle" /> },
          { label: 'Background', icon: <FaPalette className="inline-block mr-2 text-white text-base align-middle" /> },
        ].map(({ label, icon }) => (
          <button
            key={label}
            className="text-white w-full text-left py-2 rounded-lg hover:bg-white/10 transition font-semibold focus:outline-none mt-2 flex items-center gap-2"
            style={{
              fontSize: '0.75rem',
              fontWeight: label === 'Style' ? 700 : 500,
            }}
            onClick={() => handleSidebarOverlay(label)}
            type="button"
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
      {/* Overlay rendering logic moved here */}
      {overlay && !hideOverlays && (
        <div className="fixed top-0 left-[120px] h-[650px] min-h-[500px] w-[220px] z-30 border border-white/20 shadow-xl rounded-none flex flex-col items-center p-3 gap-4 bg-gradient-to-br from-white/10 via-blue-900/20 to-white/0 backdrop-blur-md bg-opacity-20">
          {/* Logos overlay content */}
          {overlay === 'Logos' && (
            <div className="mt-4 w-full">
              <span className="text-white text-lg font-bold tracking-wide font-sans mb-4 block">{overlay} Overlay</span>
              <span className="text-white/80 text-xs mb-1 block">Select Chatbot Logo</span>
              <div className="flex flex-wrap gap-2 mb-4">
                {['/chatbot1.jpg','/voicechat1.jpg','/favicon.ico','/default-avatar.svg'].map((logo) => (
                  <button
                    key={logo}
                    className={`w-12 h-12 border border-white/20 bg-white/5 flex items-center justify-center rounded-full hover:bg-emerald-500/10 ${selectedChatbotLogo === logo ? 'ring-2 ring-emerald-400' : ''}`}
                    type="button"
                    title={logo}
                    onClick={() => setSelectedChatbotLogo && setSelectedChatbotLogo(logo)}
                  >
                    <Image src={logo} width={40} height={40} alt="Chatbot Logo" className="rounded-full" />
                  </button>
                ))}
              </div>
              <span className="text-white/80 text-xs mb-1 block">Upload Custom Chatbot Logo</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-xs text-white mt-2 mb-4"
                onChange={async (e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (setSelectedChatbotLogo) {
                        setSelectedChatbotLogo(ev.target?.result as string);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <span className="text-white/80 text-xs mb-1 block">Select Voice Bot Logo</span>
              <div className="flex flex-wrap gap-2 mb-4">
                {['/voicechat1.jpg','/chatbot1.jpg','/favicon.ico','/default-avatar.svg'].map((logo) => (
                  <button
                    key={logo}
                    className={`w-12 h-12 border border-white/20 bg-white/5 flex items-center justify-center rounded-full hover:bg-blue-500/10 ${selectedVoiceBotLogo === logo ? 'ring-2 ring-blue-400' : ''}`}
                    type="button"
                    title={logo}
                    onClick={() => setSelectedVoiceBotLogo && setSelectedVoiceBotLogo(logo)}
                  >
                    <Image src={logo} width={40} height={40} alt="Voice Bot Logo" className="rounded-full" />
                  </button>
                ))}
              </div>
              <span className="text-white/80 text-xs mb-1 block">Upload Custom Voice Bot Logo</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-xs text-white mt-2 mb-4"
                onChange={async (e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (setSelectedVoiceBotLogo) {
                        setSelectedVoiceBotLogo(ev.target?.result as string);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <span className="text-white/80 text-xs mb-1 block">Current Selection</span>
              <div className="flex gap-4 items-center mb-2">
                <div className="flex flex-col items-center">
                  <span className="text-white/60 text-xs">Chatbot</span>
                  <Image src={selectedChatbotLogo} width={40} height={40} alt="Selected Chatbot Logo" className="rounded-full border-2 border-emerald-400" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/60 text-xs">Voice Bot</span>
                  <Image src={selectedVoiceBotLogo} width={40} height={40} alt="Selected Voice Bot Logo" className="rounded-full border-2 border-blue-400" />
                </div>
              </div>
            </div>
          )}
          <button
            className="absolute top-2 right-2 text-white/70 hover:text-white text-2xl font-bold bg-transparent border-none outline-none"
            onClick={handleCloseOverlay}
            aria-label="Close Sidebar Overlay"
            style={{ lineHeight: 1 }}
          >
            &times;
          </button>
          {overlay !== 'Logos' && (
            <span className="text-white text-lg font-bold tracking-wide font-sans mt-8">
              {overlay} Overlay
            </span>
          )}
          {/* Size overlay content */}
          {overlay === 'Size' && (
            <div className="mt-4 w-full">
              <span className="text-white/80 text-xs mb-1 block">Select Size</span>
              <div className="flex flex-col gap-2 mb-4">
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size.value}
                    className={`w-full py-1 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-sm text-left ${selectedSize === size.value ? 'bg-emerald-500/30 font-bold' : ''}`}
                    type="button"
                    onClick={() => onSizeSelect && onSizeSelect(size.value)}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
              {/* Shape selection UI with visual preview */}
              <span className="text-white/80 text-xs mb-1 block">Select Shape</span>
              <div className="grid grid-cols-2 gap-2">
                {SHAPE_OPTIONS.map((shape) => (
                  <button
                    key={shape.value + shape.label}
                    className={`flex flex-col items-center justify-center py-2 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-xs ${selectedShape === shape.value ? 'bg-emerald-500/30 font-bold' : ''}`}
                    type="button"
                    onClick={() => onShapeSelect && onShapeSelect(shape.value)}
                  >
                    <div className={`w-12 h-4 mb-1 bg-white/10 ${shape.preview}`}></div>
                    {shape.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Style overlay content */}
          {overlay === 'Style' && (
            <div className="mt-4 w-full max-h-[480px] overflow-y-auto pr-2 custom-scrollbar no-scrollbar">
{/* Add this CSS to hide the scrollbar */}
<style jsx global>{`
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}</style>
              <span className="text-white/80 text-xs mb-1 block">Select Style</span>
              <div className="flex flex-col gap-2">
                {STYLE_OPTIONS.map((style, idx) => (
                  <button
                    key={style.name}
                    className={`w-full py-2 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-sm text-left${selectedStyle === style.name ? ' bg-emerald-500/30 font-bold' : ''}`}
                    type="button"
                    onClick={() => onStyleSelect && onStyleSelect(style.name)}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
              {/* Style 1 controls */}
              {selectedStyle === 'Style 1' && setInputBarStyle && setInputBarColor && setInputBarPlaceholder && (
                <div className="mt-4">
                  <span className="text-white/80 text-xs mb-1 block">Input Bar Style</span>
                  <div className="grid grid-cols-5 gap-2 mb-2">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <button
                        key={i}
                        className={`w-8 h-8 rounded border border-white/20 bg-white/5 flex items-center justify-center hover:bg-emerald-500/20${inputBarStyle === i ? ' ring-2 ring-emerald-400' : ''}`}
                        onClick={() => setInputBarStyle(i)}
                        type="button"
                        title={`Style ${i+1}`}
                      >
                        {i+1}
                      </button>
                    ))}
                  </div>
                  <span className="text-white/80 text-xs mb-1 block">Custom Input Bar Color</span>
                  <input
                    type="color"
                    title="Custom Input Bar Color"
                    className="w-8 h-8 border-2 border-white/30 rounded cursor-pointer mb-2"
                    value={inputBarColor || '#000000'}
                    onChange={e => setInputBarColor(e.target.value)}
                    style={{ background: inputBarColor || undefined }}
                  />
                  <span className="text-white/80 text-xs mb-1 block">Custom Input Border Line Color</span>
                  <input
                    type="color"
                    title="Custom Input Border Line Color"
                    className="w-8 h-8 border-2 border-white/30 rounded cursor-pointer mb-2"
                    value={inputBorderLineColor || '#10b981'}
                    onChange={e => setInputBorderLineColor && setInputBorderLineColor(e.target.value)}
                    style={{ background: inputBorderLineColor || undefined }}
                  />
                  <span className="text-white/80 text-xs mb-1 block mt-2">Edit Placeholder Text</span>
                  <input
                    type="text"
                    className="w-full px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-xs mb-2"
                    value={inputBarPlaceholder}
                    onChange={e => setInputBarPlaceholder(e.target.value)}
                    placeholder="Type a message..."
                    maxLength={40}
                  />
                </div>
              )}
              {/* Style 2 controls */}
              {(selectedStyle === 'Style 2' || selectedStyle === 'Style 3') && setStyle2BtnColor && setStyle2BtnTextColor && setStyle2BtnShape && setStyle2BtnSizeClass && (
                <div className="mt-4">
                  <span className="text-white/80 text-xs mb-1 block">Button Size</span>
                  <div className="flex gap-2 mb-2">
                    {[
                      { label: '1', value: 'px-3 py-1.5 text-sm' },
                      { label: '2', value: 'px-5 py-2.5 text-lg' },
                      { label: '3', value: 'px-6 py-3 text-xl' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        className={`px-2 py-1 rounded ${style2BtnSizeClass === opt.value ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/80'} text-xs`}
                        onClick={() => setStyle2BtnSizeClass(opt.value)}
                        type="button"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-white/80 text-xs mb-1 block">Custom Button Color</span>
                  <input
                    type="color"
                    title="Custom Button Color"
                    className="w-8 h-8 border-2 border-white/30 rounded cursor-pointer mb-2"
                    value={style2BtnColor || '#10b981'}
                    onChange={e => setStyle2BtnColor(e.target.value)}
                    style={{ background: style2BtnColor || undefined }}
                  />
                  <span className="text-white/80 text-xs mb-1 block mt-2">Custom Button Text Color</span>
                  <input
                    type="color"
                    title="Custom Button Text Color"
                    className="w-8 h-8 border-2 border-white/30 rounded cursor-pointer mb-2"
                    value={style2BtnTextColor || '#ffffff'}
                    onChange={e => setStyle2BtnTextColor(e.target.value)}
                    style={{ background: style2BtnTextColor || undefined }}
                  />
                  <span className="text-white/80 text-xs mb-1 block mt-2">Button Shape</span>
                  <div className="flex gap-2 mb-2">
                    {['rounded-full','rounded-xl','rounded-lg','rounded-md','rounded','rounded-none'].map(shape => (
                      <button
                        key={shape}
                        className={`w-8 h-8 border border-white/20 bg-white/5 flex items-center justify-center ${style2BtnShape === shape ? 'ring-2 ring-emerald-400' : ''} ${shape}`}
                        onClick={() => setStyle2BtnShape(shape)}
                        type="button"
                        title={shape}
                      >
                        <div className={`w-6 h-6 bg-emerald-500 ${shape}`}></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Logo & Button Shape Selection for all styles, plus Style 5 icon/size controls */}
              <div className="mt-6 flex flex-col gap-4">
                {/* Only show Logo/Btn shape if not Style 5 */}
                {selectedStyle !== 'Style 5' && (
                  <>
                    <div>
                      <span className="text-white/80 text-xs mb-1 block">Logo Shape</span>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {['rounded-full','rounded-xl','rounded-lg','rounded-md','rounded','rounded-none'].map(shape => (
                          <button
                            key={shape}
                            className={`w-8 h-8 border border-white/20 bg-white/5 flex items-center justify-center ${logoShape === shape ? 'ring-2 ring-emerald-400' : ''} ${shape}`}
                            type="button"
                            title={shape}
                            onClick={() => setLogoShape && setLogoShape(shape)}
                          >
                            <Image src="/chatbot1.jpg" alt="Logo" width={24} height={24} className={`w-6 h-6 ${shape}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Only show Logo Size once for Style 1, 2, 3, 4 */}
                    {(selectedStyle === 'Style 1' || selectedStyle === 'Style 2' || selectedStyle === 'Style 3' || selectedStyle === 'Style 4') && setStyle5LogoSize && (
                      <div>
                        <span className="text-white/80 text-xs mb-1 block">Logo Size</span>
                        <div className="flex gap-2 mb-2">
                          {[
                            { label: '1', value: 'w-6 h-6' },
                            { label: '2', value: 'w-8 h-8' },
                            { label: '3', value: 'w-10 h-10' },
                            { label: '4', value: 'w-12 h-12' },
                            { label: '5', value: 'w-16 h-16' },
                          ].map(opt => (
                            <button
                              key={opt.value}
                              className={`px-2 py-1 rounded ${style5LogoSize === opt.value ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/80'} text-xs`}
                              onClick={() => setStyle5LogoSize(opt.value)}
                              type="button"
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {/* Style 2, 3, 5 controls: mic icon style previews */}
                {(selectedStyle === 'Style 2' || selectedStyle === 'Style 3' || selectedStyle === 'Style 5') && (
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-white/80 text-xs mb-1 block">Icon Size</span>
                    <div className="flex gap-2 mb-2">
                      {["w-6 h-6","w-8 h-8","w-10 h-10","w-12 h-12"].map(size => (
                        <button
                          key={size}
                          className={`border border-white/20 bg-white/5 flex items-center justify-center ${size} ${style5IconSize === size ? 'ring-2 ring-emerald-400' : ''}`}
                          type="button"
                          title={size}
                          onClick={() => setStyle5IconSize && setStyle5IconSize(size)}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ color: '#10b981' }}>
                            <path d="M12 18c2.21 0 4-1.79 4-4V7a4 4 0 10-8 0v7c0 2.21 1.79 4 4 4zm0 0v2m-4 0h8" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                          </svg>
                        </button>
                      ))}
                    </div>
                    <span className="text-white/80 text-xs mb-1 block">Mic Icon Color</span>
                    <input
                      type="color"
                      title="Custom Mic Icon Color"
                      className="w-8 h-8 border-2 border-white/30 rounded cursor-pointer mb-2"
                      value={style5BotIconColor || '#10b981'}
                      onChange={e => setStyle5BotIconColor && setStyle5BotIconColor(e.target.value)}
                      style={{ background: style5BotIconColor || undefined }}
                    />
                    <span className="text-white/80 text-xs mb-1 block">Mic Icon Style</span>
                    <div className="flex gap-2 mb-2 flex-wrap">
      {[
        { key: "default", label: "Classic", icon: (color: string) => <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/><path d="M15 8a3 3 0 0 1-6 0"/></svg> },
        { key: "default", label: "Classic", icon: (color: string) => <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/><path d="M15 8a3 3 0 0 1-6 0"/></svg> },
        { key: "circle-bg", label: "Circle BG", icon: (color: string) => <span className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#fff" strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span> },
        { key: "square-bg", label: "Square BG", icon: (color: string) => <span className="w-8 h-8 bg-blue-500 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#fff" strokeWidth="2"><rect x="6" y="4" width="12" height="12" rx="3"/><rect x="10" y="7" width="4" height="7" rx="2"/><path d="M12 18v2"/></svg></span> },
        { key: "shadow", label: "Shadow", icon: (color: string) => <span className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span> },
        { key: "bordered", label: "Bordered", icon: (color: string) => <span className="w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span> },
        { key: "pill", label: "Pill", icon: (color: string) => <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="8" y="6" width="8" height="8" rx="4"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span> },
        { key: "outline", label: "Outline", icon: (color: string) => <span className="w-8 h-8 border-2 border-blue-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span> },
        { key: "double-border", label: "Double Border", icon: (color: string) => <span className="w-8 h-8 border-4 border-double border-emerald-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span> },
        { key: "hex", label: "Hexagon", icon: (color: string) => <span className="w-8 h-8 flex items-center justify-center" style={{clipPath:'polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0% 50%)'}}><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span> },
        { key: "triangle", label: "Triangle", icon: (color: string) => <span className="w-8 h-8 flex items-center justify-center" style={{clipPath:'polygon(50% 0%,0% 100%,100% 100%)'}}><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span> },
        { key: "diamond", label: "Diamond", icon: (color: string) => <span className="w-8 h-8 flex items-center justify-center" style={{clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)'}}><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span> },
        { key: "star", label: "Star", icon: (color: string) => <span className="w-8 h-8 flex items-center justify-center" style={{clipPath:'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'}}><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span> },
        { key: "rounded-square", label: "Rounded Square", icon: (color: string) => <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span> },
        { key: "circle-outline", label: "Circle Outline", icon: (color: string) => <span className="w-8 h-8 rounded-full border-2 border-blue-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span> },
        { key: "dashed", label: "Dashed", icon: (color: string) => <span className="w-8 h-8 rounded-lg border-2 border-dashed border-emerald-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span> },
        { key: "shadowed-square", label: "Shadowed Square", icon: (color: string) => <span className="w-8 h-8 rounded-lg shadow-lg flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span> },
        { key: "bordered-square", label: "Bordered Square", icon: (color: string) => <span className="w-8 h-8 rounded-lg border-2 border-emerald-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span> },
        { key: "circle-shadow", label: "Circle Shadow", icon: (color: string) => <span className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span> },
        { key: "minimal", label: "Minimal", icon: (color: string) => <span className="w-8 h-8 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span> },
        { key: "filled", label: "Filled", icon: (color: string) => <span className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill={color} stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span> },
      ].map(({ key: iconStyle, label, icon }) => (
                        <button
                          key={iconStyle}
                          className={`border border-white/20 bg-white/5 flex flex-col items-center justify-center w-14 h-14 p-1 ${style5MicIconStyle === iconStyle ? 'ring-2 ring-emerald-400' : ''}`}
                          type="button"
                          title={label}
                          onClick={() => setStyle5MicIconStyle && setStyle5MicIconStyle(iconStyle)}
                        >
                          {icon(style5BotIconColor || '#10b981')}
                          <span className="text-white/60 text-[10px] mt-1">{label}</span>
                        </button>
                      ))}
                    </div>
                    <span className="text-white/80 text-xs mb-1 block">Bot Icon Style</span>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {[
                        // 20 unique line-art bot icons, all using style5BotIconColor for stroke
                        {
                          key: "bot1",
                          label: "Classic",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><rect x="6" y="9" width="12" height="7" rx="3.5" /><circle cx="9" cy="13" r="1" /><circle cx="15" cy="13" r="1" /><rect x="10.5" y="6" width="3" height="3" rx="1.5" /><path d="M12 3v3" /></svg>),
                        },
                        {
                          key: "bot2",
                          label: "Chat Bubble",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><rect x="5" y="8" width="14" height="7" rx="3.5" /><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><path d="M12 15v2.5l-2 1.5" /></svg>),
                        },
                        {
                          key: "bot3",
                          label: "Antenna",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /><path d="M12 9V5M12 5l2-2M12 5l-2-2" /></svg>),
                        },
                        {
                          key: "bot4",
                          label: "Smile",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><rect x="7" y="9" width="10" height="7" rx="3" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /><path d="M11 15h2" /></svg>),
                        },
                        {
                          key: "bot5",
                          label: "Ears",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><rect x="8" y="10" width="8" height="6" rx="2.5" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /><circle cx="8" cy="10" r="0.7" /><circle cx="16" cy="10" r="0.7" /></svg>),
                        },
                        {
                          key: "bot6",
                          label: "Visor",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><circle cx="12" cy="13" r="5" /><rect x="9" y="11.5" width="6" height="2" rx="1" /><path d="M12 8v-2" /></svg>),
                        },
                        {
                          key: "bot7",
                          label: "Hex Head",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><polygon points="12,5 19,9 19,16 12,20 5,16 5,9" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
                        },
                        {
                          key: "bot8",
                          label: "Oval Eyes",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="0.7" ry="1.2" /><ellipse cx="14" cy="13" rx="0.7" ry="1.2" /></svg>),
                        },
                        {
                          key: "bot9",
                          label: "Square Bot",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><rect x="7" y="9" width="10" height="7" rx="1" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
                        },
                        {
                          key: "bot10",
                          label: "Flat Top",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><rect x="7" y="10" width="10" height="6" rx="2" /><rect x="9" y="7" width="6" height="3" rx="1.5" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
                        },
                        {
                          key: "bot11",
                          label: "Alien",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="1" ry="1.5" /><ellipse cx="14" cy="13" rx="1" ry="1.5" /><path d="M12 9v-2" /></svg>),
                        },
                        {
                          key: "bot12",
                          label: "Crown",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><rect x="7" y="10" width="10" height="6" rx="2" /><path d="M9 10l3-3 3 3" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
                        },
                        {
                          key: "bot13",
                          label: "Cat Bot",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><rect x="8" y="10" width="8" height="6" rx="2.5" /><path d="M8 10l-2-2M16 10l2-2" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /></svg>),
                        },
                        {
                          key: "bot14",
                          label: "Dog Bot",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><rect x="8" y="10" width="8" height="6" rx="2.5" /><path d="M8 10l-2-1M16 10l2-1" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /></svg>),
                        },
                        {
                          key: "bot15",
                          label: "Round Bot",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><circle cx="12" cy="13" r="6" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
                        },
                        {
                          key: "bot16",
                          label: "Cyborg",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><rect x="7" y="10" width="10" height="6" rx="2" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /><path d="M17 13h2" /></svg>),
                        },
                        {
                          key: "bot17",
                          label: "Alien 2",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="1.2" ry="1.2" /><ellipse cx="14" cy="13" rx="1.2" ry="1.2" /><path d="M12 9v-3" /></svg>),
                        },
                        {
                          key: "bot18",
                          label: "Smile 2",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><rect x="7" y="10" width="10" height="6" rx="2" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /><path d="M10 15c1 1 3 1 4 0" /></svg>),
                        },
                        {
                          key: "bot19",
                          label: "Flat Bot",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><rect x="7" y="12" width="10" height="4" rx="2" /><circle cx="10" cy="14" r="1" /><circle cx="14" cy="14" r="1" /></svg>),
                        },
                        {
                          key: "bot20",
                          label: "Alien Smile",
                          icon: (<svg viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke={style5BotIconColor || '#3b82f6'} strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="1" ry="1.5" /><ellipse cx="14" cy="13" rx="1" ry="1.5" /><path d="M10 15c1 1 3 1 4 0" /></svg>),
                        },
                      ].map(({ key, label, icon }) => (
                        <button
                          key={key}
                          className={`border border-white/20 bg-white/5 flex flex-col items-center justify-center w-14 h-14 p-1 ${style5BotIconStyle === key ? 'ring-2 ring-emerald-400' : ''}`}
                          type="button"
                          title={label}
                          onClick={() => setStyle5BotIconStyle && setStyle5BotIconStyle(key)}
                        >
                          {icon}
                          <span className="text-white/60 text-[10px] mt-1">{label}</span>
                        </button>
                      ))}
                    </div>
                    <span className="text-white/80 text-xs mb-1 block">Bot Icon Color</span>
                    <input
                      type="color"
                      title="Custom Bot Icon Color"
                      className="w-8 h-8 border-2 border-white/30 rounded cursor-pointer mb-2"
                      value={style5BotIconColor || '#3b82f6'}
                      onChange={e => setStyle5BotIconColor && setStyle5BotIconColor(e.target.value)}
                      style={{ background: style5BotIconColor || undefined }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Background overlay content */}
          {overlay === 'Background' && (
            <div className="mt-4 w-full">
              <span className="text-white/80 text-xs mb-1 block">Custom Background Color</span>
              <input
                type="color"
                title="Custom Background Color"
                className="w-8 h-8 border-2 border-white/30 rounded cursor-pointer mb-2"
                value={customBgColor || '#000000'}
                onChange={e => onBgColorChange && onBgColorChange(e.target.value)}
                style={{ background: customBgColor || undefined }}
              />
              {/* Upload background image */}
              <span className="text-white/80 text-xs mb-1 block mt-4">Or Upload Background Image</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-xs text-white mt-2"
                onChange={async (e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (onBgColorChange) {
                        onBgColorChange(`url('${ev.target?.result}')`);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {/* Hide/minimize toggle */}
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hide-wedget-bg"
                  className="accent-emerald-500 w-4 h-4"
                  checked={!!(window && window.localStorage && localStorage.getItem('wedgetHideBg') === '1')}
                  onChange={e => {
                    if (window && window.localStorage) {
                      localStorage.setItem('wedgetHideBg', e.target.checked ? '1' : '0');
                      window.dispatchEvent(new Event('storage'));
                    }
                  }}
                />
                <label htmlFor="hide-wedget-bg" className="text-white/80 text-xs select-none cursor-pointer">Hide/Minimize Background</label>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default AGSidebar;
