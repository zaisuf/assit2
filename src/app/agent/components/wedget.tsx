import React from "react";
import Image from "next/image";

interface WedgetProps {
  boxShapeClass: string;
  chatboxSizeClass: string;
  onLogoClick?: () => void;
  style?: React.CSSProperties;
  selectedStyle?: { name: string; render: (...args: any[]) => React.ReactNode };
  inputBarStyle?: number;
  inputBarColor?: string;
  inputBorderLineColor?: string;
  inputBarPlaceholder?: string;
  style2BtnColor?: string;
  style2BtnTextColor?: string;
  style2BtnShape?: string;
  logoShape?: string;
  style5MicIconStyle?: string;
  style5BotIconStyle?: string;
  style5MicIconColor?: string;
  style5BotIconColor?: string;
  style5LogoSize?: string;
  chatbotLogo?: string | null;
  voiceBotLogo?: string | null;
  voiceBtnSizeClass?: string; // for voice chat button size
  logoSizeClass?: string; // for logo size
  onOpenVoiceBotBox?: () => void;
  onOpenChatView?: () => void;
}

const Wedget: React.FC<WedgetProps> = (props) => {
  const {
    boxShapeClass,
    chatboxSizeClass,
    onLogoClick,
    style,
    selectedStyle,
    inputBarStyle = 0,
    inputBarColor,
    inputBorderLineColor,
    inputBarPlaceholder = "Type a message...",
    style2BtnColor,
    style2BtnTextColor,
    style2BtnShape,
    logoShape = "rounded-full",
    style5MicIconStyle = "default",
    style5BotIconStyle = "default",
    style5MicIconColor,
    style5BotIconColor,
    style5LogoSize,
    chatbotLogo,
    voiceBotLogo,
    voiceBtnSizeClass,
    logoSizeClass,
    onOpenVoiceBotBox,
    onOpenChatView,
  } = props;
  // Patch the renderers to use logoShape for logo
  const patchedStyle = selectedStyle && {
    ...selectedStyle,
    render: function(...args: any[]) {
      if (selectedStyle.name === "Style 1") {
        // args: inputBarStyle, inputBarColor, inputBarPlaceholder, sizeClass, inputBorderLineColor
        const [inputBarStyle, inputBarColor, inputBarPlaceholder, sizeClass] = args;
        const colorStyle = inputBarColor ? { background: inputBarColor } : {};
        const borderColor = (typeof arguments[4] !== 'undefined') ? arguments[4] : '#10b981';
        const iconSize = "w-8 h-8"; // Always fixed for voice chat icon
        const logoSize = style5LogoSize || "w-8 h-8";
        const borderStyles = [0,1,3,4,5,6,7,8,9,10,11,13,14,15,16,17,18,19,20,21,22,23,24];
        const underlineStyles = [1,16,20,21,22,23];
        const getInputBorderStyle = (idx: number) => {
          if (underlineStyles.includes(idx)) {
            return { borderBottomColor: borderColor };
          }
          if (borderStyles.includes(idx)) {
            return { borderColor: borderColor };
          }
          return {};
        };
        const styles = [
          // 1. Minimal rounded
          <input key="1" className="flex-1 px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle, ...getInputBorderStyle(0) }} onClick={onOpenChatView} />,
          // 2. Underline only
          <input key="2" className="flex-1 px-2 py-1 border-b-2 border-emerald-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle, ...getInputBorderStyle(1) }} onClick={onOpenChatView} />,
          // 3. Filled, pill
          <input key="3" className="flex-1 px-3 py-1 rounded-full bg-emerald-900/30 border-none text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} onClick={onOpenChatView} />,
          // 4. Shadowed
          <input key="4" className="flex-1 px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} onClick={onOpenChatView} />,
          // 5. Square
          <input key="5" className="flex-1 px-2 py-1 rounded-none bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} onClick={onOpenChatView} />,
          // 6. Double border
          <input key="6" className="flex-1 px-2 py-1 rounded-xl border-4 border-double border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} onClick={onOpenChatView} />,
          // 7. Dashed border
          <input key="7" className="flex-1 px-2 py-1 rounded-lg border-2 border-dashed border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} onClick={onOpenChatView} />,
          // 8. Outline
          <input key="8" className="flex-1 px-2 py-1 rounded-xl border-2 border-emerald-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} onClick={onOpenChatView} />,
          // 9. Shadowed square
          <input key="9" className="flex-1 px-2 py-1 rounded-none bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} onClick={onOpenChatView} />,
          // 10. Pill, shadow, border
          <input key="10" className="flex-1 px-3 py-1 rounded-full bg-white/10 border-2 border-emerald-400 text-white placeholder:text-white/40 focus:outline-none text-sm shadow" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} onClick={onOpenChatView} />,
          // 11. Circle input
          <input key="11" className="flex-1 px-2 py-1 rounded-full border-4 border-blue-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} onClick={onOpenChatView} />,
          // 12. Minimal, no border
          <input key="12" className="flex-1 px-2 py-1 rounded bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} onClick={onOpenChatView} />,
          // 13. Glassmorphism
          <input key="13" className="flex-1 px-2 py-1 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/40 focus:outline-none text-sm shadow" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} onClick={onOpenChatView} />,
          // 14. Gradient border
          <input key="14" className="flex-1 px-2 py-1 rounded-xl border-2 border-transparent bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #10b981, #3b82f6)', backgroundClip: 'padding-box, border-box', backgroundOrigin: 'padding-box, border-box', ...colorStyle }} onClick={onOpenChatView} />,
          // 15. Inset shadow
          <input key="15" className="flex-1 px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-inner" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} onClick={onOpenChatView} />,
          // 16. Large pill
          <input key="16" className="flex-1 px-4 py-2 rounded-full bg-emerald-900/30 border-2 border-emerald-400 text-white placeholder:text-white/40 focus:outline-none text-base" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} onClick={onOpenChatView} />,
          // 17. Underline, shadow
          <input key="17" className="flex-1 px-2 py-1 border-b-2 border-blue-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm shadow" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
          // 18. Square, thick border
          <input key="18" className="flex-1 px-2 py-1 rounded-none border-4 border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
          // 19. Pill, dashed border
          <input key="19" className="flex-1 px-3 py-1 rounded-full border-2 border-dashed border-blue-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
          // 20. Shadowed, outline
          <input key="20" className="flex-1 px-2 py-1 rounded-xl border-2 border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
          // 21. Glow underline (emerald)
          <input key="21" className="flex-1 px-2 py-1 border-b-2 border-emerald-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm focus:border-emerald-400 focus:shadow-[0_2px_10px_0_rgba(16,185,129,0.7)] transition-shadow" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
          // 22. Glow underline (blue)
          <input key="22" className="flex-1 px-2 py-1 border-b-2 border-blue-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm focus:border-blue-400 focus:shadow-[0_2px_10px_0_rgba(59,130,246,0.7)] transition-shadow" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
          // 23. Glow border (emerald)
          <input key="23" className="flex-1 px-2 py-1 rounded border-2 border-emerald-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm focus:shadow-[0_0_8px_2px_rgba(16,185,129,0.7)] transition-shadow" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
          // 24. Glow border (blue)
          <input key="24" className="flex-1 px-2 py-1 rounded border-2 border-blue-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm focus:shadow-[0_0_8px_2px_rgba(59,130,246,0.7)] transition-shadow" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
          // 25. Glow underline (pink)
          <input key="25" className="flex-1 px-2 py-1 border-b-2 border-pink-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm focus:border-pink-400 focus:shadow-[0_2px_10px_0_rgba(244,114,182,0.7)] transition-shadow" placeholder={inputBarPlaceholder} style={{ minWidth: 0, ...colorStyle }} />,
        ];
        return (
          <div className="flex items-center w-full gap-2">
            {styles[inputBarStyle]}
            {voiceBotLogo && (
              <Image
                src={voiceBotLogo}
                alt="Voice Agent"
                width={32}
                height={32}
                className={`${style5LogoSize || "w-8 h-8"} ${logoShape} border-2 border-emerald-400 cursor-pointer`}
                onClick={onOpenVoiceBotBox}
              />
            )}
          </div>
        );
      } else if (selectedStyle.name === "Style 2") {
        // args: sizeClass, btnColor, btnTextColor, btnShape
        const [sizeClass, btnColor, btnTextColor, btnShape] = args;
        // Use the passed prop for button size
        let btnSize = voiceBtnSizeClass || "px-4 py-2 text-base";
        // Use the passed prop for logo size (do NOT link to btnSize)
        let iconSize = logoSizeClass || "w-8 h-8";
        const buttonStyle = btnColor ? { background: btnColor } : {};
        const textStyle = btnTextColor ? { color: btnTextColor } : {};
        const shapeClass = btnShape || "rounded-full";
        // Use mic icon renderers from Style 5
        const micIconRenderers: Record<string, (color: string, iconSize: string) => React.ReactNode> = {
          default: (color, iconSize) => <svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/><path d="M15 8a3 3 0 0 1-6 0"/></svg>,
          "circle-bg": (color, iconSize) => <span className={iconSize + " rounded-full bg-emerald-500 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="#fff" strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span>,
          "square-bg": (color, iconSize) => <span className={iconSize + " bg-blue-500 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="#fff" strokeWidth="1" width="48" height="48"><rect x="6" y="4" width="12" height="12" rx="3"/><rect x="10" y="7" width="4" height="7" rx="2"/><path d="M12 18v2"/></svg></span>,
          shadow: (color, iconSize) => <span className={iconSize + " rounded-full shadow-lg flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span>,
          bordered: (color, iconSize) => <span className={iconSize + " rounded-full border-2 border-emerald-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span>,
          pill: (color, iconSize) => <span className={iconSize + " rounded-full bg-white/10 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="8" y="6" width="8" height="8" rx="4"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          outline: (color, iconSize) => <span className={iconSize + " border-2 border-blue-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>,
          "double-border": (color, iconSize) => <span className={iconSize + " border-4 border-double border-emerald-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>,
          hex: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"} style={{clipPath:'polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0% 50%)'}}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>,
          triangle: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"} style={{clipPath:'polygon(50% 0%,0% 100%,100% 100%)'}}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          diamond: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"} style={{clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)'}}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          star: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"} style={{clipPath:'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'}}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          "rounded-square": (color, iconSize) => <span className={iconSize + " rounded-lg bg-white/10 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          "circle-outline": (color, iconSize) => <span className={iconSize + " rounded-full border-2 border-blue-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          dashed: (color, iconSize) => <span className={iconSize + " rounded-lg border-2 border-dashed border-emerald-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          "shadowed-square": (color, iconSize) => <span className={iconSize + " rounded-lg shadow-lg flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          "bordered-square": (color, iconSize) => <span className={iconSize + " rounded-lg border-2 border-emerald-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          "circle-shadow": (color, iconSize) => <span className={iconSize + " rounded-full shadow-lg flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          minimal: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          filled: (color, iconSize) => <span className={iconSize + " rounded-full bg-emerald-500 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/><path d="M15 8a3 3 0 0 1-6 0"/></svg></span>,
        };
        const micStyle = style5MicIconStyle || 'default';
        // Use style5BotIconColor as the mic icon color for Style 2/3 (matches overlay color picker)
        const micColor = style5BotIconColor || style5MicIconColor || '#10b981';
        const micIcon = micIconRenderers[micStyle]
          ? micIconRenderers[micStyle](micColor, "w-8 h-8")
          : micIconRenderers['default'](micColor, "w-8 h-8");
        return (
          <div className="flex items-center w-full justify-between gap-2">
            <button
              type="button"
              className={`${shapeClass} shadow ${btnSize} flex items-center gap-2`}
              style={{ ...buttonStyle, ...textStyle }}
              onClick={onOpenVoiceBotBox}
            >
              {micIcon}
              Voice chat
            </button>
            <Image
              src={chatbotLogo || "/chatbot1.jpg"}
              alt="Chatbot"
              width={32}
              height={32}
              className={`${iconSize} ${logoShape} cursor-pointer border border-white/30 object-contain`}
              onClick={onLogoClick}
              style={{ cursor: 'pointer', aspectRatio: '0.7/1' }}
            />
          </div>
        );
      } else if (selectedStyle.name === "Style 3") {
        // args: sizeClass, btnColor, btnTextColor, btnShape
        const [sizeClass, btnColor, btnTextColor, btnShape] = args;
        // Use the passed prop for button size
        let btnSize = voiceBtnSizeClass || "px-4 py-2 text-base";
        // Use the passed prop for logo size (do NOT link to btnSize)
        let iconSize = logoSizeClass || "w-8 h-8";
        const buttonStyle = btnColor ? { background: btnColor } : {};
        const textStyle = btnTextColor ? { color: btnTextColor } : {};
        const shapeClass = btnShape || "rounded-full";
        // Use mic icon renderers from Style 5
        const micIconRenderers: Record<string, (color: string, iconSize: string) => React.ReactNode> = {
          default: (color, iconSize) => <svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/><path d="M15 8a3 3 0 0 1-6 0"/></svg>,
          "circle-bg": (color, iconSize) => <span className={iconSize + " rounded-full bg-emerald-500 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="#fff" strokeWidth="2" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span>,
          "square-bg": (color, iconSize) => <span className={iconSize + " bg-blue-500 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="#fff" strokeWidth="2" width="48" height="48"><rect x="6" y="4" width="12" height="12" rx="3"/><rect x="10" y="7" width="4" height="7" rx="2"/><path d="M12 18v2"/></svg></span>,
          shadow: (color, iconSize) => <span className={iconSize + " rounded-full shadow-lg flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span>,
          bordered: (color, iconSize) => <span className={iconSize + " rounded-full border-2 border-emerald-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span>,
          pill: (color, iconSize) => <span className={iconSize + " rounded-full bg-white/10 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="8" y="6" width="8" height="8" rx="4"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          outline: (color, iconSize) => <span className={iconSize + " border-2 border-blue-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>,
          "double-border": (color, iconSize) => <span className={iconSize + " border-4 border-double border-emerald-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>,
          hex: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"} style={{clipPath:'polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0% 50%)'}}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>,
          triangle: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"} style={{clipPath:'polygon(50% 0%,0% 100%,100% 100%)'}}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          diamond: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"} style={{clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)'}}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          star: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"} style={{clipPath:'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'}}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          "rounded-square": (color, iconSize) => <span className={iconSize + " rounded-lg bg-white/10 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          "circle-outline": (color, iconSize) => <span className={iconSize + " rounded-full border-2 border-blue-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          dashed: (color, iconSize) => <span className={iconSize + " rounded-lg border-2 border-dashed border-emerald-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          "shadowed-square": (color, iconSize) => <span className={iconSize + " rounded-lg shadow-lg flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          "bordered-square": (color, iconSize) => <span className={iconSize + " rounded-lg border-2 border-emerald-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          "circle-shadow": (color, iconSize) => <span className={iconSize + " rounded-full shadow-lg flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          minimal: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="2" width="48" height="48"><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          filled: (color, iconSize) => <span className={iconSize + " rounded-full bg-emerald-500 flex items-center justify-center"}></span>,
        };
        const micStyle = style5MicIconStyle || 'default';
        // Use style5BotIconColor as the mic icon color for Style 2/3 (matches overlay color picker)
        const micColor = style5BotIconColor || style5MicIconColor || '#10b981';
        const micIcon = micIconRenderers[micStyle]
          ? micIconRenderers[micStyle](micColor, "w-8 h-8")
          : micIconRenderers['default'](micColor, "w-8 h-8");
        return (
          <div className="flex items-center w-full justify-between gap-2">
            <Image
              src={chatbotLogo || "/chatbot1.jpg"}
              alt="Chatbot"
              width={32}
              height={32}
              className={`${iconSize} ${logoShape} cursor-pointer`}
              onClick={onLogoClick}
              style={{ cursor: 'pointer' }}
            />
            <button
              type="button"
              className={`${shapeClass} shadow ${btnSize} flex items-center gap-2`}
              style={{ ...buttonStyle, ...textStyle }}
              onClick={onOpenVoiceBotBox}
            >
              {micIcon}
              Voice chat
            </button>
          </div>
        );
      } else if (selectedStyle.name === "Style 4") {
        const [sizeClass] = args;
        let iconSize = style5LogoSize || "w-8 h-8";
        return (
          <div className="flex items-center w-full justify-center gap-4">
            <Image
              src={chatbotLogo || "/chatbot1.jpg"}
              alt="Chatbot Logo"
              width={32}
              height={32}
              className={`${iconSize} ${logoShape} cursor-pointer border border-white/30 object-contain`}
              onClick={onLogoClick}
              style={{ cursor: 'pointer', aspectRatio: '0.7/1' }}
            />
            <Image
              src={voiceBotLogo || "/voicechat1.jpg"}
              alt="Voice Chat Logo"
              width={32}
              height={32}
              className={`${iconSize} ${logoShape}`}
              style={{ cursor: 'pointer' }}
              onClick={onLogoClick}
            />
          </div>
        );
      } else if (selectedStyle.name === "Style 5") {
        // Show mic and selected bot icon SVGs, matching the sidebar's icon set
        // Use logoSizeClass prop for icon size (e.g. 'w-8 h-8', 'w-10 h-10', etc)
        const iconSize = logoSizeClass || 'w-12 h-12';
        const botColor = style5BotIconColor || '#3b82f6';
        // All bot icon SVGs, keyed by style
        const botIcons: Record<string, (color: string, iconSize: string) => React.ReactNode> = {
          bot1: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><rect x="6" y="9" width="12" height="7" rx="3.5" /><circle cx="9" cy="13" r="1" /><circle cx="15" cy="13" r="1" /><rect x="10.5" y="6" width="3" height="3" rx="1.5" /><path d="M12 3v3" /></svg>),
          bot2: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><rect x="5" y="8" width="14" height="7" rx="3.5" /><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><path d="M12 15v2.5l-2 1.5" /></svg>),
          bot3: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><ellipse cx="12" cy="13" rx="6" ry="4" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /><path d="M12 9V5M12 5l2-2M12 5l-2-2" /></svg>),
          bot4: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><rect x="7" y="9" width="10" height="7" rx="3" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /><path d="M11 15h2" /></svg>),
          bot5: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><rect x="8" y="10" width="8" height="6" rx="2.5" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /><circle cx="8" cy="10" r="0.7" /><circle cx="16" cy="10" r="0.7" /></svg>),
          bot6: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><circle cx="12" cy="13" r="5" /><rect x="9" y="11.5" width="6" height="2" rx="1" /><path d="M12 8v-2" /></svg>),
          bot7: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><polygon points="12,5 19,9 19,16 12,20 5,16 5,9" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
          bot8: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="0.7" ry="1.2" /><ellipse cx="14" cy="13" rx="0.7" ry="1.2" /></svg>),
          bot9: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><rect x="7" y="9" width="10" height="7" rx="1" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
          bot10: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><rect x="7" y="10" width="10" height="6" rx="2" /><rect x="9" y="7" width="6" height="3" rx="1.5" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
          bot11: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="1" ry="1.5" /><ellipse cx="14" cy="13" rx="1" ry="1.5" /><path d="M12 9v-2" /></svg>),
          bot12: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><rect x="7" y="10" width="10" height="6" rx="2" /><path d="M9 10l3-3 3 3" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
          bot13: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><rect x="8" y="10" width="8" height="6" rx="2.5" /><path d="M8 10l-2-2M16 10l2-2" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /></svg>),
          bot14: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><rect x="8" y="10" width="8" height="6" rx="2.5" /><path d="M8 10l-2-1M16 10l2-1" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /></svg>),
          bot15: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><circle cx="12" cy="13" r="6" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
          bot16: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><rect x="7" y="10" width="10" height="6" rx="2" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /><path d="M17 13h2" /></svg>),
          bot17: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="1.2" ry="1.2" /><ellipse cx="14" cy="13" rx="1.2" ry="1.2" /><path d="M12 9v-3" /></svg>),
          bot18: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><rect x="7" y="10" width="10" height="6" rx="2" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /><path d="M10 15c1 1 3 1 4 0" /></svg>),
          bot19: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><rect x="7" y="12" width="10" height="4" rx="2" /><circle cx="10" cy="14" r="1" /><circle cx="14" cy="14" r="1" /></svg>),
          bot20: (color, iconSize) => (<svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="1" ry="1.5" /><ellipse cx="14" cy="13" rx="1" ry="1.5" /><path d="M10 15c1 1 3 1 4 0" /></svg>),
        };
        // fallback: if not found, use bot1
        const selectedBotIconRenderer = botIcons[style5BotIconStyle || 'bot1'] || botIcons['bot1'];

        // Mic icon renderers for all 20 styles
        const micIconRenderers: Record<string, (color: string, iconSize: string) => React.ReactNode> = {
          default: (color, iconSize) => <svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/><path d="M15 8a3 3 0 0 1-6 0"/></svg>,
          "circle-bg": (color, iconSize) => <span className={iconSize + " rounded-full bg-emerald-500 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="#fff" strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/><path d="M15 8a3 3 0 0 1-6 0"/></svg></span>,
          "square-bg": (color, iconSize) => <span className={iconSize + " bg-blue-500 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="#fff" strokeWidth="1" width="48" height="48"><rect x="6" y="4" width="12" height="12" rx="3"/><rect x="10" y="7" width="4" height="7" rx="2"/><path d="M12 18v2"/></svg></span>,
          shadow: (color, iconSize) => <span className={iconSize + " rounded-full shadow-lg flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/><path d="M15 8a3 3 0 0 1-6 0"/></svg></span>,
          bordered: (color, iconSize) => <span className={iconSize + " rounded-full border-2 border-emerald-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/><path d="M15 8a3 3 0 0 1-6 0"/></svg></span>,
          pill: (color, iconSize) => <span className={iconSize + " rounded-full bg-white/10 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="8" y="6" width="8" height="8" rx="4"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          outline: (color, iconSize) => <span className={iconSize + " border-2 border-blue-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>,
          "double-border": (color, iconSize) => <span className={iconSize + " border-4 border-double border-emerald-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>,
          hex: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"} style={{clipPath:'polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0% 50%)'}}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>,
          triangle: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"} style={{clipPath:'polygon(50% 0%,0% 100%,100% 100%)'}}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          diamond: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"} style={{clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)'}}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          star: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"} style={{clipPath:'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'}}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          "rounded-square": (color, iconSize) => <span className={iconSize + " rounded-lg bg-white/10 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          "circle-outline": (color, iconSize) => <span className={iconSize + " rounded-full border-2 border-blue-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          dashed: (color, iconSize) => <span className={iconSize + " rounded-lg border-2 border-dashed border-emerald-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          "shadowed-square": (color, iconSize) => <span className={iconSize + " rounded-lg shadow-lg flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          "bordered-square": (color, iconSize) => <span className={iconSize + " rounded-lg border-2 border-emerald-400 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          "circle-shadow": (color, iconSize) => <span className={iconSize + " rounded-full shadow-lg flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
          minimal: (color, iconSize) => <span className={iconSize + " flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1" width="48" height="48"><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>,
          filled: (color, iconSize) => <span className={iconSize + " rounded-full bg-emerald-500 flex items-center justify-center"}><svg viewBox="0 0 24 24" className="w-12 h-12" fill={color} stroke={color} strokeWidth="1" width="48" height="48"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>,
        };
        const micIcon = micIconRenderers[style5MicIconStyle || 'default']
          ? micIconRenderers[style5MicIconStyle || 'default'](style5BotIconColor || '#10b981', iconSize)
          : micIconRenderers['default'](style5BotIconColor || '#10b981', iconSize);
        // Icon style wrappers (for bot)
        const wrapBotIcon = (icon: React.ReactNode, iconStyle: string) => {
          return (
            <button
              type="button"
              className={iconSize + " flex items-center justify-center focus:outline-none"}
              onClick={onLogoClick}
              tabIndex={0}
              aria-label="Bot Icon"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              {icon}
            </button>
          );
        };
        return (
          <div className="flex flex-col items-center w-full gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className={iconSize + " flex items-center justify-center focus:outline-none"}
                onClick={onOpenVoiceBotBox}
                tabIndex={0}
                aria-label="Mic Icon"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                {micIcon}
              </button>
              {wrapBotIcon(selectedBotIconRenderer(botColor, iconSize), style5BotIconStyle)}
            </div>
          </div>
        );
      } else {
        return selectedStyle.render(...args);
      }
    }
  };
  return (
    <div
      className={`flex flex-col items-center justify-center ${boxShapeClass} ${chatboxSizeClass} bg-white/10 border border-white/10 shadow-2xl`}
      style={style}
    >
      {/* Custom Chat Box Content */}
      <div className="flex-1 w-full flex flex-col items-center justify-center p-4">
        {patchedStyle
          ? patchedStyle.name === "Style 1"
            ? patchedStyle.render(inputBarStyle, inputBarColor, inputBarPlaceholder, chatboxSizeClass, (typeof inputBorderLineColor !== 'undefined' ? inputBorderLineColor : '#10b981'))
            : patchedStyle.name === "Style 2"
            ? patchedStyle.render(chatboxSizeClass, style2BtnColor, style2BtnTextColor, style2BtnShape)
            : patchedStyle.name === "Style 3"
            ? patchedStyle.render(chatboxSizeClass, style2BtnColor, style2BtnTextColor, style2BtnShape)
            : patchedStyle.render()
          : null}
      </div>
    </div>
  );
};

interface MainBoxProps {
  isBgMinimal: boolean;
  selectedUiTemplate: any;
  selectedBoxSize: any;
  selectedBoxShape: any;
  customBgColor: string;
  selectedStyle: any;
  selectedStyleColor: string;
  selectedInputBarStyleIdx: number;
  selectedVoiceButtonShapeIdx: number;
}

// Helper: convert shape string or object to className for MainBox
const getShapeClassName = (shape: any) => {
  if (!shape) return "";
  if (typeof shape === "string") return shape;
  if (typeof shape === "object" && shape.value) return shape.value;
  return "";
};

// Default size for Wedget box
const DEFAULT_WEDGET_SIZE = "w-[200px] h-[56px]";

const MainBox: React.FC<MainBoxProps> = ({
  isBgMinimal,
  selectedUiTemplate,
  selectedBoxSize,
  selectedBoxShape,
  customBgColor,
  selectedStyle,
  selectedStyleColor,
  selectedInputBarStyleIdx,
  selectedVoiceButtonShapeIdx,
}) => (
  <div className="fixed bottom-8 right-8 z-10">
    <div
      className={`relative flex flex-col overflow-hidden shadow-2xl${
        isBgMinimal ? "" : " border border-white/10"
      } ${isBgMinimal ? "" : selectedUiTemplate.bg} ${selectedBoxSize?.className || DEFAULT_WEDGET_SIZE} ${getShapeClassName(
        selectedBoxShape
      )}`}
      style={
        isBgMinimal
          ? { background: "transparent", border: "none" }
          : customBgColor
          ? { background: customBgColor }
          : undefined
      }
    >
      {/* Style preview area */}
      <div className="flex-1 flex items-center justify-center">
        {selectedStyle.name === "Style 1"
          ? selectedStyle.render(
              selectedStyleColor,
              selectedBoxSize,
              selectedInputBarStyleIdx
            )
          : selectedStyle.name === "Style 2"
          ? selectedStyle.render(
              selectedStyleColor,
              undefined,
              undefined,
              selectedVoiceButtonShapeIdx
            )
          : selectedStyle.name === "Style 3"
          ? selectedStyle.render(
              selectedStyleColor,
              undefined,
              undefined,
              selectedVoiceButtonShapeIdx
            )
          : selectedStyle.render(selectedStyleColor, selectedBoxSize)}
      </div>
    </div>
  </div>
);

export { MainBox };
export default Wedget;
