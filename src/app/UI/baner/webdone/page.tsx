'use client';

import React from 'react';

const BuildByBanner = () => {
  return (
    <a
      href="https://weblike.ai"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 rounded-lg border bg-blue-700 px-3 py-2 text-sm transition-all "
    >
      <span className="text-white">Full Responsive AI website maker</span>
      <svg 
        className="h-4 w-4 text-red-500" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
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
