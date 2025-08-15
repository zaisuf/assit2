'use client';

import React from 'react';

const DiamondPattern: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <svg className="absolute w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <pattern id="hexagonPattern" width="50" height="43.4" patternUnits="userSpaceOnUse">
          {/* Main Hexagon */}
          <path
            d="M25,0 L47.6,12.5 L47.6,37.5 L25,50 L2.4,37.5 L2.4,12.5 Z"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            transform="scale(0.8)"
          />
          {/* Inner Hexagon */}
          <path
            d="M25,10 L40,18.75 L40,33.75 L25,42.5 L10,33.75 L10,18.75 Z"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            transform="scale(0.8)"          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#hexagonPattern)" />
      </svg>
    </div>
  );
};

export default DiamondPattern;
