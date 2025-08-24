'use client';

import React from 'react';

interface HexagonPatternProps {
  hovered?: boolean;
}

const HexagonPattern: React.FC<HexagonPatternProps> = ({ hovered }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const effectiveHover = typeof hovered === 'boolean' ? hovered : isHovered;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <svg
        className={`absolute w-full h-full opacity-20 transition-all duration-700 pointer-events-auto ${effectiveHover ? 'scale-105 blur-[2px] drop-shadow-[0_0_20px_#00eaff] opacity-40' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <defs>
          <pattern id="hexagonPattern" width="100" height="120" patternUnits="userSpaceOnUse">
            {/* Base Hexagon */}
            <path
              d="M50,0 L97,25 L97,75 L50,100 L3,75 L3,25 Z"
              fill="none"
              stroke={effectiveHover ? 'rgba(0,234,255,0.35)' : 'rgba(255,255,255,0.15)'}
              strokeWidth="0.5"
            />
            {/* Stretched Vertical Hexagon */}
            <path
              d="M50,-20 L97,15 L97,105 L50,140 L3,105 L3,15 Z"
              fill="none"
              stroke={effectiveHover ? 'rgba(0,234,255,0.18)' : 'rgba(255,255,255,0.1)'}
              strokeWidth="0.5"
            />
            {/* Additional Connecting Lines */}
            <line x1="50" y1="0" x2="50" y2="100" stroke={effectiveHover ? 'rgba(0,234,255,0.12)' : 'rgba(255,255,255,0.05)'} strokeWidth="0.5" />
            <line x1="3" y1="25" x2="97" y2="75" stroke={effectiveHover ? 'rgba(0,234,255,0.12)' : 'rgba(255,255,255,0.05)'} strokeWidth="0.5" />
            <line x1="3" y1="75" x2="97" y2="25" stroke={effectiveHover ? 'rgba(0,234,255,0.12)' : 'rgba(255,255,255,0.05)'} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagonPattern)" />
        
        {/* Overlay Grid */}
        <pattern id="gridPattern" width="50" height="50" patternUnits="userSpaceOnUse">
          <path
            d="M50,0 L0,0 L0,50"
            fill="none"
            stroke={effectiveHover ? 'rgba(0,234,255,0.09)' : 'rgba(255,255,255,0.03)'}
            strokeWidth="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
        
        {/* Animated Glow Hexagon on Hover */}
        {effectiveHover && (
          <g>
            <circle
              cx="50%"
              cy="50%"
              r="180"
              fill="none"
              stroke="#00eaff"
              strokeWidth="2.5"
              opacity="0.18"
              style={{ filter: 'blur(8px)', transformOrigin: 'center', animation: 'hex-glow 1.5s infinite alternate' }}
            />
            <animateTransform attributeName="transform" type="scale" from="1" to="1.08" begin="0s" dur="1.5s" repeatCount="indefinite"/>
          </g>
        )}
      </svg>
      <style jsx>{`
        @keyframes hex-glow {
          0% { opacity: 0.18; }
          100% { opacity: 0.32; }
        }
      `}</style>
    </div>
  );
};

export default HexagonPattern;
