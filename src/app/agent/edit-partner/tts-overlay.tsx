import React, { useEffect, useRef } from "react";

interface TTSOverlayProps {
  onSelectModal?: (modalName: string) => void;
  onClose?: () => void;
  onPricingHover?: (idx: number | null) => void;
}

const botModals = [
  { name: "Avi-o1", platform: "Assistlore", inputToken: "$0.002", outputToken: "$0.003" },
  { name: "11lab", platform: "ElevenLabs", inputToken: "$0.0015", outputToken: "$0.0025" },
  { name: "11lab", platform: "minimax ", inputToken: "$0.0015", outputToken: "$0.0025" },
  { name: "11lab", platform: "ispeech ", inputToken: "$0.0015", outputToken: "$0.0025" },
  { name: "11lab", platform: "Playht ", inputToken: "$0.0015", outputToken: "$0.0025" },
  { name: "11lab", platform: "murf.ai ", inputToken: "$0.0015", outputToken: "$0.0025" },
  { name: "11lab", platform: "Google ", inputToken: "$0.0015", outputToken: "$0.0025" },
  { name: "11lab", platform: "Microsoft ", inputToken: "$0.0015", outputToken: "$0.0025" },
  { name: "11lab", platform: "Openai ", inputToken: "$0.0015", outputToken: "$0.0025" },
];

export default function TTSOverlay(props: TTSOverlayProps) {
  const { onSelectModal, onClose, onPricingHover } = props;
  // hoveredIdx is now managed by parent
  const [selectedModalIdx, setSelectedModalIdx] = React.useState<number|null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close overlay on outside click
  function handleBackgroundClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget && onClose) onClose();
  }

  // Close overlay on scroll outside
  useEffect(() => {
    function handleScroll(e: Event) {
      if (onClose) onClose();
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[99999]" style={{background: 'rgba(0,0,0,0.6)', pointerEvents: 'auto'}} onClick={handleBackgroundClick}>
      <div ref={overlayRef} className="bg-gray-900 border border-white/30 p-8 flex flex-col gap-4 hide-scrollbar" style={{width: 340, minHeight: 140, maxHeight: 420, overflowY: 'auto', borderRadius: 0, boxShadow: '0 4px 32px rgba(0,0,0,0.6)', zIndex: 1002, transform: 'translateX(-450px)', position: 'relative'}} onClick={e => e.stopPropagation()}>
        {/* Close icon in top-right corner */}
        <div style={{position: 'absolute', top: 0, right: 0, zIndex: 100000}}>
          <button
            onClick={() => { if (onClose) onClose(); }}
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
        <div className="mb-4 text-white text-sm font-semibold">
          Bot Modal Name: {selectedModalIdx !== null ? botModals[selectedModalIdx].name : 'None selected'}
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
                  onMouseEnter={() => onPricingHover && onPricingHover(idx)}
                  onMouseLeave={() => onPricingHover && onPricingHover(null)}
                  onClick={() => {
                    setSelectedModalIdx(idx);
                    if (onSelectModal) onSelectModal(modal.name);
                    if (onClose) onClose();
                  }}
                  style={{background: selectedModalIdx === idx ? 'rgba(59,130,246,0.2)' : undefined}}
                >
                  {modal.name}
                  {/* Pricing overlay is now rendered by parent */}
                </td>
                <td className="py-2 px-3 text-left flex items-center gap-2">
                  <img
                    src={
                      modal.platform === 'Assistlore' ? '/aws.svg'
                      : modal.platform === '11' ? '/modal logo/android-chrome-192x192.png'
                      : modal.platform === 'Meta' ? '/chatbot1.jpg'
                      : modal.platform === 'Google' ? '/download.png'
                      : modal.platform === 'Groq' ? '/modal logo/android-chrome-192x192.png'
                      : modal.platform === 'Hugging Face' ? '/firebase.svg'
                      : modal.platform === 'Mistral AI' ? '/firebase-svgrepo-com (1).svg'
                      : modal.platform === 'Moonshot AI' ? '/default-avatar.svg'
                      : '/favicon.ico'
                    }
                    alt={modal.platform + ' logo'}
                    className="w-6 h-6 object-contain"
                  />
                  {modal.platform}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
