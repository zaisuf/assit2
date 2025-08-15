'use client';

import React from 'react';

const SquareBoxPattern: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <svg className="absolute w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <pattern id="squarePattern" width="800" height="800" patternUnits="userSpaceOnUse">
          {/* Single Square Box */}
          <rect
            x="40"
            y="40"
            width="720"
            height="720"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
          />
          {/* Diagonal Lines */}
          <line x1="40" y1="40" x2="760" y2="760" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <line x1="760" y1="40" x2="40" y2="760" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#squarePattern)" />
      </svg>
    </div>
  );
};

export default SquareBoxPattern;
