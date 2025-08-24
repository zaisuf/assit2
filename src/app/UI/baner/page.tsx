'use client';

import React from 'react';

const BuildByBanner = () => {
  return (
    <a
      href="https://weblike.ai"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5     transition-all "
    >
      <span className="text-white">Powered by weblike</span>
    
      <span className="text-white"></span>
      <span className="bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text font-medium text-transparent">

      </span>
      <svg
        className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </a>
  );
};

export default BuildByBanner;
