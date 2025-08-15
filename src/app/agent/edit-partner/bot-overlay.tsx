import React from "react";
import Image from "next/image";

interface BotOverlayTableProps {
  onSelectModal?: (modalName: string) => void;
  onClose?: () => void;
}

const botModals = [
  { name: "qwen3-32b", platform: "Alibaba Cloud", inputToken: "4M/$0.20", outputToken: "4M/$0.30" },
   { name: "phi-4", platform: "microsoft", inputToken: "1M/$0.08", outputToken: "1M/$0.12" },
  { name: "DeepSeek-R1", platform: "DeepSeek", inputToken: "1M/$1.1", outputToken: "1.1M/$1.4" },
  { name: "Llama 3.1 8B Instruct", platform: "Meta", inputToken: "1M/$0.01", outputToken: "1M/$0.08" },
  { name: "Gemini 2.0 Flash", platform: "Google", inputToken: "1m/$0.30", outputToken: "1M/$0.80" },
  { name: "Gemin", platform: "Perplexity", inputToken: "2M/$1.2", outputToken: "2M/$1.50" },
  { name: "GPT 4o Mini", platform: "Openai", inputToken: "1M/$0.40", outputToken: "1M/$0.90" },
  { name: "granite-3b", platform: "IBM", inputToken: "3M/$1.2", outputToken: "3M/$1.5" },
  { name: "ministral-3b", platform: "Mistral AI", inputToken: "3M/$0.15", outputToken: "3M/$0.40" },
  { name: "Kimi k2", platform: "Moonshot AI", inputToken: "1M/$0.80", outputToken: "1/$2.50" },
];

export default function BotOverlayTable({ onSelectModal, onClose }: BotOverlayTableProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number|null>(null);
  // Track overlay position and content
  const [overlayPos, setOverlayPos] = React.useState<{top: number, left: number} | null>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  // Handler to show overlay at correct position
  function handleMouseEnter(idx: number, event: React.MouseEvent) {
    setHoveredIdx(idx);
    // Find the bot overlay container position
    const botOverlayDiv = (event.target as HTMLElement).closest('.bot-overlay-container');
    let left = 0, top = 0;
    if (botOverlayDiv) {
      const overlayRect = botOverlayDiv.getBoundingClientRect();
      left = overlayRect.right + window.scrollX + 24; // 24px gap to the right
      top = overlayRect.top + window.scrollY; // align to top of overlay
    } else {
      // fallback to previous logic
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      left = rect.right + window.scrollX + 24;
      top = rect.top + window.scrollY;
    }
    setOverlayPos({ top, left });
  }
  function handleMouseLeave() {
    setHoveredIdx(null);
    setOverlayPos(null);
  }

  return (
    <>
      <div
        style={{maxHeight: 320, overflowY: 'auto', position: 'relative'}}
        className="scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent hide-scrollbar bot-overlay-container"
      >
        {/* Close icon in top-right corner */}
        <div style={{position: 'absolute', top: 0, right: 0, zIndex: 100000}}>
          <button
            onClick={() => {
              if (typeof onClose === 'function') {
                onClose();
              }
            }}
            style={{
              background: 'rgba(30,41,59,0.85)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
            aria-label="Close overlay"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <table className="w-full text-left border-collapse text-sm max-w-md mx-auto">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-3 border-b border-white/20 text-right">Modal Name</th>
              <th className="py-2 px-3 border-b border-white/20 text-left">Platform</th>
            </tr>
          </thead>
          <tbody>
            {botModals.map((modal, idx) => (
              <tr key={idx} className="border-b border-white/10 text-white hover:bg-gray-800">
                <td
                  className="py-2 px-3 text-right relative cursor-pointer"
                  onMouseEnter={e => handleMouseEnter(idx, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    if (onSelectModal) onSelectModal(modal.name);
                  }}
                >
                  {modal.name}
                </td>
                <td className="py-2 px-3 text-left flex items-center gap-2">
                  <Image
                    src={(() => {
                      if (modal.platform === 'Alibaba Cloud') return '/modal logo/qwen.png';
                      if (modal.platform === 'DeepSeek') return '/modal logo/deepseek.png';
                      if (modal.platform === 'Anthropic') return '/modal logo/anthropic.png';
                      if (modal.platform === 'Meta') return '/modal logo/meta.png';
                      if (modal.platform === 'Google') return '/modal logo/google.png';
                      if (modal.platform === 'Groq') return '/modal logo/open ai.png';
                      if (modal.platform === 'IBM') return '/modal logo/IBM.png';
                      if (modal.platform === 'Mistral AI') return '/modal logo/Mistral.png';
                      if (modal.platform === 'Moonshot AI') return '/modal logo/Moonshot.png';
                      return '/favicon.ico';
                    })()}
                    alt={modal.platform + ' logo'}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                  {modal.platform}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pricing overlay rendered outside scrollable container */}
      {hoveredIdx !== null && overlayPos && (
        <div
          style={{
            position: 'absolute',
            top: overlayPos.top,
            left: overlayPos.left,
            zIndex: 99999,
            background: '#1e293b',
            border: '1px solid #d1d5db', // Tailwind border-gray-300
            boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
            borderRadius: 0,
            padding: '28px',
            width: '340px',
            height: '170px',
            color: 'white',
            fontSize: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            fontFamily: 'sans-serif',
          }}
          ref={overlayRef}
        >
          <div className="font-bold mb-2 text-xl text-blue-300" style={{fontFamily: 'sans-serif'}}>Pricing</div>
          <div className="mb-1 text-sm" style={{color: '#60a5fa', fontFamily: 'sans-serif', fontWeight: 600}}>
            <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Image
                src={(() => {
                  const platform = botModals[hoveredIdx].platform;
                  if (platform === 'Alibaba Cloud') return '/modal logo/qwen.png';
                  if (platform === 'DeepSeek') return '/modal logo/deepseek.png';
                  if (platform === 'Anthropic') return '/modal logo/claude ai.png';
                  if (platform === 'Meta') return '/modal logo/meta.png';
                  if (platform === 'Google') return '/modal logo/google.png';
                  if (platform === 'Groq') return '/modal logo/open ai.png';
                  if (platform === 'IBM') return '/modal logo/IBM.png';
                  if (platform === 'Mistral AI') return '/modal logo/Mistral.png';
                  if (platform === 'Moonshot AI') return '/modal logo/Moonshot.png';
                  return '/favicon.ico';
                })()}
                alt={botModals[hoveredIdx].platform + ' logo'}
                width={20}
                height={20}
                style={{objectFit: 'contain'}}
              />
              {botModals[hoveredIdx].name}
            </span>
          </div>
          <div className="flex flex-col gap-3" style={{fontFamily: 'sans-serif'}}>
            <span>Input Token: <span className="text-sm" style={{color: '#8e9094ff', fontFamily: 'sans-serif', fontSize: '12px'}}>{String(botModals[hoveredIdx].inputToken || "-").replace(/^(\$)/, "").replace(/(\d+M)\/(\$?\d+(\.\d+)?)/, "$1 / $2")}</span></span>
            <span>Output Token: <span className="text-sm" style={{color: '#8e9094ff', fontFamily: 'sans-serif', fontSize: '12px'}}>{String(botModals[hoveredIdx].outputToken).replace(/^(\$)/, "").replace(/(\d+M)\/(\$?\d+(\.\d+)?)/, "$1 / $2")}</span></span>
            <span style={{marginTop: '8px', color: '#f3f4f6', fontWeight: 600, fontSize: '13px'}}>
              Total Cost: <span style={{color: '#8e9094ff'}}>{(() => {
                function extractPrice(str: string) {
                  const match = str.match(/\/(\$?)(\d+(\.\d+)?)/);
                  return match ? parseFloat(match[2]) : 0;
                }
                const input = botModals[hoveredIdx].inputToken || "";
                const output = botModals[hoveredIdx].outputToken || "";
                const total = extractPrice(input) + extractPrice(output);
                return total ? `$${total}` : "-";
              })()}</span>
            </span>
          </div>
        </div>
      )}
    </>
  );
}
