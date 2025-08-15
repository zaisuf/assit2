
import React, { useState } from "react";
import Image from 'next/image';

interface VoiceBotBoxProps {
  disconnectBtnTextColor?: string;
  sizeClass?: string;
  shapeClass?: string;
  customBgColor?: string;
  videoSrc?: string;
  onMinimize?: () => void;
  disconnectBtnSize?: string;
  disconnectBtnColor?: string;
  disconnectBtnIconStyle?: string; // for disconnect button only
  minimizeBtnIconStyle?: string; // for minimize icon only
}

const DEFAULT_WEDGET_SIZE = "w-[200px] h-[156px]";




const VoiceBotBox: React.FC<VoiceBotBoxProps> = ({ sizeClass, shapeClass, customBgColor, videoSrc, onMinimize, disconnectBtnSize, disconnectBtnColor, disconnectBtnTextColor, disconnectBtnIconStyle, minimizeBtnIconStyle }) => {
  let heightClass = "h-[180px]";
  if (sizeClass?.includes("w-[300px]")) heightClass = "h-[230px]";
  else if (sizeClass?.includes("w-[320px]")) heightClass = "h-[250px]";
  else if (sizeClass?.includes("w-[200px]")) heightClass = "h-[200px]";

  // Remove any h-[56px], h-[70px], h-[80px] from sizeClass to avoid height conflict
  let cleanedSizeClass = sizeClass
    ? sizeClass.replace(/h-\[56px\]|h-\[70px\]|h-\[80px\]/g, "")
    : DEFAULT_WEDGET_SIZE.replace(/h-\[156px\]/g, "");

  // Normalize GIF src if it has '|gif' suffix and ensure valid path
  let normalizedSrc = videoSrc;
  if (videoSrc && videoSrc.endsWith('|gif')) {
    normalizedSrc = videoSrc.replace('|gif', '');
  }
  // If GIF is a relative path, ensure it starts with '/'
  if (normalizedSrc && normalizedSrc.endsWith('.gif') && !normalizedSrc.startsWith('http') && !normalizedSrc.startsWith('/')) {
    normalizedSrc = '/' + normalizedSrc;
  }
  return (
    <div className="fixed bottom-8 right-8 z-10">
      <div
        className={`relative flex flex-col overflow-hidden shadow-2xl border border-white/10 ${cleanedSizeClass} ${heightClass} ${shapeClass || "rounded-full"}`}
        style={customBgColor ? { background: customBgColor } : { background: "rgba(255,255,255,0.1)" }}
      >
        {/* Minimize icon in top right corner */}
        <button
          className="absolute top-1 right-2 z-20"
          style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          aria-label="Minimize Voice Bot Box"
          onClick={onMinimize}
        >
          <span style={{ position: 'relative', display: 'inline-block', width: '22px', height: '20px' }}>
            {/* Render selected minimix icon style for minimize button */}
            {(() => {
              // Use disconnectBtnColor for the icon color if provided, else fallback to white
              const iconColor = disconnectBtnColor || '#fff';
              switch (minimizeBtnIconStyle) {
                case 'minimix1':
                  return (
                    <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="8" width="16" height="8" rx="2" stroke={iconColor} strokeWidth="2" fill="none"/><circle cx="8" cy="12" r="2" fill={iconColor}/><circle cx="16" cy="12" r="2" fill={iconColor}/></svg>
                  );
                case 'minimix2':
                  return (
                    <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="12" height="12" rx="6" stroke={iconColor} strokeWidth="2" fill="none"/><rect x="10" y="10" width="4" height="4" rx="2" fill={iconColor}/></svg>
                  );
                case 'minimix3':
                  return (
                    <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="12" rx="8" ry="4" stroke={iconColor} strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="2" fill={iconColor}/></svg>
                  );
                case 'minimix4':
                  return (
                    <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,4 20,20 4,20" stroke={iconColor} strokeWidth="2" fill="none"/><circle cx="12" cy="16" r="2" fill={iconColor}/></svg>
                  );
                case 'minimix5':
                  return (
                    <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="8" stroke={iconColor} strokeWidth="2" fill="none"/><rect x="8" y="8" width="8" height="8" rx="4" fill={iconColor}/></svg>
                  );
                case 'downarrow':
                  return (
                    <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 10l6 6 6-6" stroke={iconColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="4" x2="12" y2="16" stroke={iconColor} strokeWidth="2.2" strokeLinecap="round"/></svg>
                  );
                default:
                  return (
                    <svg width="18" height="18" viewBox="0 0 18 18" style={{ position: 'absolute', top: 0, left: 0 }}>
                      <rect x="5" y="8.5" width="8" height="1" rx="0.5" fill={disconnectBtnTextColor || 'white'} />
                    </svg>
                  );
              }
            })()}
          </span>
        </button>
        {/* Loading spinner animation in header */}
        <div className="absolute top-1 left-2 z-20 flex items-center" aria-label="Loading">
          <span className="inline-block w-4 h-4">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="#fff" strokeOpacity="0.2" strokeWidth="2" />
              <path d="M8 1a7 7 0 0 1 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        {/* Header line */}
        <div className="w-full h-px bg-white/10 mt-6 mb-2 border-b border-white/10" />
        {/* Voice Bot Box content with video/gif animation */}
        <div className="flex-1 flex flex-col items-center justify-center p-0">
          <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden shadow -mt-10">
            {normalizedSrc && normalizedSrc.endsWith('.gif') ? (
              <Image
                src={normalizedSrc}
                width={82}
                height={82}
                className="absolute top-1/2 left-1/2 object-cover"
                style={{ transform: 'translate(-50%, -50%)', background: 'transparent' }}
                alt="Voice Bot GIF"
                onError={() => {}}
              />
            ) : (
              <video
                src={normalizedSrc && normalizedSrc !== '' ? normalizedSrc : "/bubble3.mp4"}
                className="absolute top-1/2 left-1/2 w-[82px] h-[82px] object-cover"
                style={{ transform: 'translate(-50%, -50%)', background: 'transparent' }}
                autoPlay
                loop
                muted
                playsInline
              />
            )}
          </div>
          {/* Video timer display */}
          <div className="mt-2 text-xs text-white/80 font-mono tracking-wide">00:00</div>
           {/* Disconnect button below video and timer */}
           <button
             className={`mt-10 rounded-full font-bold shadow focus:outline-none flex items-center gap-1 ${
               disconnectBtnSize === 'Small' ? 'px-2 py-1 text-xs' : disconnectBtnSize === 'Large' ? 'px-6 py-2 text-base' : 'px-4 py-1.5 text-sm'
             }`}
             style={{
               minWidth: disconnectBtnSize === 'Small' ? '48px' : disconnectBtnSize === 'Large' ? '96px' : '64px',
               fontSize: disconnectBtnSize === 'Small' ? '0.7rem' : disconnectBtnSize === 'Large' ? '1rem' : '0.85rem',
               letterSpacing: '0.01em',
               background: disconnectBtnColor || '#000',
               color: disconnectBtnTextColor || '#fff'
             }}
             aria-label="End Call"
           >
             {/* Render selected icon style */}
             {(() => {
               // All icons get a diagonal slash for disconnect
               switch (disconnectBtnIconStyle) {
                 case 'default':
                   return (
                     <svg width="22" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle" style={{marginRight: '4px', transform: 'translateY(-2px)'}}>
                       <path d="M6 15 Q10 10 16 10 Q22 10 26 15" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                       <rect x="5" y="14" width="4" height="3" rx="1.2" fill={disconnectBtnTextColor || '#fff'} />
                       <rect x="23" y="14" width="4" height="3" rx="1.2" fill={disconnectBtnTextColor || '#fff'} />
                       <line x1="20" y1="4" x2="12" y2="22" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" strokeLinecap="round" />
                       <line x1="24" y1="-3" x2="4" y2="32" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" strokeLinecap="round" />
                     </svg>
                   );
                 case 'phone':
                   return (
                     <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle" style={{marginRight: '4px', transform: 'translateY(-2px)'}}>
                       <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 22 2 13.93 2 4.5A1 1 0 013 3.5h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                       <line x1="18" y1="-3" x2="2" y2="32" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" strokeLinecap="round" />
                     </svg>
                   );
                 case 'wave':
                   return (
                     <svg width="22" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle" style={{marginRight: '4px', transform: 'translateY(-2px)'}}>
                       <path d="M2 10 Q8 2 16 10 Q24 18 30 10" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="2" fill="none" strokeLinecap="round"/>
                       <line x1="24" y1="-3" x2="4" y2="32" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" strokeLinecap="round" />
                     </svg>
                   );
                 case 'circle':
                   return (
                     <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle" style={{marginRight: '4px', transform: 'translateY(-2px)'}}>
                       <circle cx="12" cy="12" r="8" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="2" fill="none"/>
                       <line x1="18" y1="-3" x2="2" y2="32" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" strokeLinecap="round" />
                     </svg>
                   );
                 case 'square':
                   return (
                     <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle" style={{marginRight: '4px', transform: 'translateY(-2px)'}}>
                       <rect x="4" y="4" width="16" height="16" rx="2" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="2" fill="none"/>
                       <line x1="18" y1="-3" x2="2" y2="32" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" strokeLinecap="round" />
                     </svg>
                   );
                 case 'double':
                   return (
                     <svg width="22" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle" style={{marginRight: '4px', transform: 'translateY(-2px)'}}>
                       <path d="M6 15 Q10 10 16 10 Q22 10 26 15" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                       <path d="M8 17 Q12 12 16 12 Q20 12 24 17" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                       <line x1="24" y1="-3" x2="4" y2="32" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" strokeLinecap="round" />
                     </svg>
                   );
                 case 'dashed':
                   return (
                     <svg width="22" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle" style={{marginRight: '4px', transform: 'translateY(-2px)'}}>
                       <path d="M6 15 Q10 10 16 10 Q22 10 26 15" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" fill="none" strokeDasharray="4 2" strokeLinecap="round" />
                       <line x1="24" y1="-3" x2="4" y2="32" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" strokeLinecap="round" />
                     </svg>
                   );
                 case 'mic':
                   return (
                     <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle" style={{marginRight: '4px', transform: 'translateY(-2px)'}}>
                       <rect x="9" y="4" width="6" height="12" rx="3" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="2" fill="none"/>
                       <path d="M5 11v2a7 7 0 0014 0v-2" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="2" fill="none"/>
                       <line x1="12" y1="20" x2="12" y2="22" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="2"/>
                       <line x1="18" y1="-3" x2="2" y2="32" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" strokeLinecap="round" />
                     </svg>
                   );
                 case 'mute':
                   return (
                     <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle" style={{marginRight: '4px', transform: 'translateY(-2px)'}}>
                       <rect x="9" y="4" width="6" height="12" rx="3" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="2" fill="none"/>
                       <path d="M5 11v2a7 7 0 0014 0v-2" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="2" fill="none"/>
                       <line x1="12" y1="20" x2="12" y2="22" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="2"/>
                       <line x1="18" y1="-3" x2="2" y2="32" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" strokeLinecap="round" />
                     </svg>
                   );
                 default:
                   return (
                     <svg width="22" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle" style={{marginRight: '4px', transform: 'translateY(-2px)'}}>
                       <path d="M6 15 Q10 10 16 10 Q22 10 26 15" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                       <rect x="5" y="14" width="4" height="3" rx="1.2" fill={disconnectBtnTextColor || '#fff'} />
                       <rect x="23" y="14" width="4" height="3" rx="1.2" fill={disconnectBtnTextColor || '#fff'} />
                       <line x1="20" y1="4" x2="12" y2="22" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" strokeLinecap="round" />
                       <line x1="24" y1="-3" x2="4" y2="32" stroke={disconnectBtnTextColor || '#fff'} strokeWidth="1.5" strokeLinecap="round" />
                     </svg>
                   );
               }
             })()}
             Disconnect
           </button>
          {/* Select languages section */}
          <div className="-mt-16 w-full flex flex-row items-center justify-between">
            <select
              id="voicebot-language-select"
              className="w-[50px] px-0 py-0.5 rounded text-xs border focus:outline-none self-start"
              style={{
                marginLeft: 72,
                background: customBgColor ? customBgColor : 'rgba(0,0,0,0.3)',
                color: disconnectBtnTextColor || '#fff',
                borderColor: disconnectBtnTextColor || 'rgba(255,255,255,0.1)'
              }}
              defaultValue="en"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
              <option value="zh">Chinese</option>
              <option value="ru">Russian</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
              <option value="pt">Portuguese</option>
            </select>
            {/* Mic mute/unmute icon button removed as requested */}
          </div>
        </div>
      </div>
    </div>
  );
};

// New VoiceBotBox1 component for the second box
interface VoiceBotBox1Props extends VoiceBotBoxProps {
  onRestore?: () => void;
}

export const VoiceBotBox1: React.FC<VoiceBotBox1Props> = ({ sizeClass, shapeClass, customBgColor, videoSrc, onRestore }) => {
  // Wedget box uses: bottom-8, right-8, z-10, w-[200px] h-[56px] by default, and shapeClass for border radius
  // Use Wedget's default size if none provided
  const DEFAULT_WEDGET_SIZE = "w-[110px] h-[56px]";
  // Always use reduced width for minimized box
  let boxSizeClass = "w-[110px] h-[56px]";
  // Use shapeClass or default to Wedget's border radius (rounded-full)
  const boxShapeClass = shapeClass || "rounded-full";
  // Normalize GIF src if it has '|gif' suffix and ensure valid path
  let normalizedSrc = videoSrc;
  if (videoSrc && videoSrc.endsWith('|gif')) {
    normalizedSrc = videoSrc.replace('|gif', '');
  }
  if (normalizedSrc && normalizedSrc.endsWith('.gif') && !normalizedSrc.startsWith('http') && !normalizedSrc.startsWith('/')) {
    normalizedSrc = '/' + normalizedSrc;
  }
  return (
    <div className="fixed bottom-8 right-8 z-10" onClick={onRestore} style={{cursor: 'pointer'}}>
      <div
        className={`relative flex flex-col overflow-hidden shadow-2xl border border-white/10 ${boxSizeClass} ${boxShapeClass}`}
        style={customBgColor ? { background: customBgColor } : { background: "rgba(255,255,255,0.1)" }}
      >
        {/* Voice Bot1 Box content without logo */}
        <div className="flex-1 flex items-center justify-center pt-0 pb-4 px-4">
          {/* Centered video/gif animation, moved up by reducing top padding */}
          <div className="relative w-[48px] h-[48px] rounded-full overflow-hidden shadow mt-1" title="Restore Voice Bot Box">
            {normalizedSrc && normalizedSrc.endsWith('.gif') ? (
              <Image
                src={normalizedSrc}
                width={60}
                height={62}
                className="absolute top-1/2 left-1/2 object-cover"
                style={{ transform: 'translate(-50%, -50%)', background: 'transparent', pointerEvents: 'none' }}
                alt="Voice Bot GIF"
                onError={() => {}}
              />
            ) : (
              <video
                src={normalizedSrc && normalizedSrc !== '' ? normalizedSrc : "/bubble3.mp4"}
                className="absolute top-1/2 left-1/2 w-[60px] h-[62px] object-cover"
                style={{ transform: 'translate(-50%, -50%)', background: 'transparent', pointerEvents: 'none' }}
                autoPlay
                loop
                muted
                playsInline
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// Parent container to manage minimize state
export const VoiceCallContainer: React.FC<VoiceBotBoxProps> = (props) => {
  const [minimized, setMinimized] = useState(false);
  const handleRestore = () => setMinimized(false);
  return minimized ? (
    <VoiceBotBox1
      sizeClass={props.sizeClass}
      shapeClass={props.shapeClass}
      customBgColor={props.customBgColor}
      videoSrc={props.videoSrc}
      onRestore={handleRestore}
      minimizeBtnIconStyle={props.minimizeBtnIconStyle}
    />
  ) : (
    <VoiceBotBox
      {...props}
      onMinimize={() => setMinimized(true)}
      minimizeBtnIconStyle={props.minimizeBtnIconStyle}
    />
  );
};

export default VoiceCallContainer;
