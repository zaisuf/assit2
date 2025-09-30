'use client'

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const SecondVideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReversed, setIsReversed] = useState(false);
  const reverseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const playReverse = () => {
    if (videoRef.current) {
      // Clear any existing interval
      if (reverseIntervalRef.current) {
        clearInterval(reverseIntervalRef.current);
      }
      
      // Create new interval for reverse playback
      reverseIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          if (videoRef.current.currentTime <= 0) {
            // If we reached the start, switch to forward playback
            setIsReversed(false);
            videoRef.current.play();
            if (reverseIntervalRef.current) {
              clearInterval(reverseIntervalRef.current);
            }
          } else {
            // Move backwards by small increments
            videoRef.current.currentTime -= 0.1;
          }
        }
      }, 50); // Adjust interval for smoother playback
    }
  };

  const handleVideoEnd = () => {
    if (videoRef.current) {
      setIsReversed(true);
      videoRef.current.pause();
      playReverse();
    }
  };

  const handleMouseEnter = () => {
    try {
      setIsReversed(false);
      videoRef.current?.play();
    } catch (error) {
      console.error('Error playing video:', error);
    }
  };
  const handleMouseLeave = () => {
    try {
      videoRef.current?.pause();
      if (reverseIntervalRef.current) {
        clearInterval(reverseIntervalRef.current);
      }
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        setIsReversed(false);
      }
    } catch (error) {
      console.error('Error pausing video:', error);
    }
  };  return (      <div className="relative h-screen w-full overflow-hidden bg-gradient-to-r from-black via-gray-900 to-blue-950">      {/* Box Container - Holds video box */}
      <div className="absolute left-[2%] top-1/2 -translate-y-1/2 z-0">
        {/* Square Box with Video */}<div 
          className="relative w-[600px] h-[600px] border-2 border-white/40 shadow-[0_0_50px_rgba(0,0,0,0.7)] shadow-black/70 group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >          {/* Video inside square */}
          <div className="absolute inset-0 overflow-hidden">            
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              onEnded={handleVideoEnd}
              onError={(e) => console.error('Video error:', e)}
              className="w-full h-full object-cover transform scale-110 translate-x-6 group-hover:translate-x-0 group-hover:scale-100 transition-transform duration-700 ease-out"
            >
              <source src="/hand1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
            {/* Lines Pattern */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Hexagon Pattern Definition */}
                <pattern id="hexagonPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path
                    d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0z"
                    fill="none"
                    stroke="url(#moving-gradient1)"
                    strokeWidth="1"
                    className="transition-all duration-300 opacity-10 group-hover:opacity-100"
                  />
                </pattern>
                <linearGradient id="moving-gradient1" x1="0%" y1="0%" x2="200%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.1)">
                    <animate attributeName="offset" values="-1;1" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="25%" stopColor="#4F46E5">
                    <animate attributeName="offset" values="-0.75;1.25" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="50%" stopColor="#7C3AED">
                    <animate attributeName="offset" values="-0.5;1.5" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="75%" stopColor="#DB2777">
                    <animate attributeName="offset" values="-0.25;1.75" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.1)">
                    <animate attributeName="offset" values="0;2" dur="3s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
                <linearGradient id="moving-gradient2" x1="0%" y1="0%" x2="200%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.1)">
                    <animate attributeName="offset" values="-1;1" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="25%" stopColor="#06B6D4">
                    <animate attributeName="offset" values="-0.75;1.25" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="50%" stopColor="#3B82F6">
                    <animate attributeName="offset" values="-0.5;1.5" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="75%" stopColor="#8B5CF6">
                    <animate attributeName="offset" values="-0.25;1.75" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.1)">
                    <animate attributeName="offset" values="0;2" dur="3s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
              </defs>
              
              {/* Center Cross Lines */}
              <line 
                x1="0" y1="300" 
                x2="600" y2="300" 
                stroke="url(#moving-gradient1)" 
                strokeWidth="1"
                className="transition-all duration-300 opacity-10 group-hover:opacity-100"
              />
              <line 
                x1="300" y1="0" 
                x2="300" y2="600" 
                stroke="url(#moving-gradient2)" 
                strokeWidth="1"
                className="transition-all duration-300 opacity-10 group-hover:opacity-100"
              />                {/* Connecting Lines to Text */}
              <line 
                x1="180" y1="400" 
                x2="140" y2="500" 
                stroke="url(#moving-gradient1)" 
                strokeWidth="1"
                className="transition-all duration-300 opacity-0 group-hover:opacity-100"
              />
              <line 
                x1="300" y1="400" 
                x2="300" y2="500" 
                stroke="url(#moving-gradient2)" 
                strokeWidth="1"
                className="transition-all duration-300 opacity-0 group-hover:opacity-100"
              />
              <line 
                x1="420" y1="400" 
                x2="460" y2="500" 
                stroke="url(#moving-gradient1)" 
                strokeWidth="1"
                className="transition-all duration-300 opacity-0 group-hover:opacity-100"
              />
            </svg>
          </div>
          
          {/* Inner Square */}          <div className="absolute inset-[160px] border border-white/20"></div>
            {/* Video overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

          {/* Additional outer shadow for depth */}
          <div className="absolute -inset-4 bg-black/20 blur-xl -z-10"></div>

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
          <div className="absolute -inset-4 bg-black/30 blur-xl -z-10"></div>          {/* Bottom Text Overlay */}
          <div className="absolute bottom-16 left-0 right-0 z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-center space-y-4 px-8"
            >              <div className="w-64 h-[1px] bg-white/40 mx-auto mb-6"></div>
              <h3 className="text-white text-4xl font-semibold tracking-[0.25em] mb-4">
                FREEDOM TO CREATE
              </h3>              <div className="flex items-center justify-center space-x-8 text-white/90">
                <div className="relative px-6 py-3 backdrop-blur-sm transition-all duration-300 group overflow-hidden">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* Horizontal lines */}
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#DB2777] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-[#4F46E5] via-[#7C3AED] to-[#DB2777] transform translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                      {/* Vertical lines */}
                      <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-[#4F46E5] via-[#7C3AED] to-[#DB2777] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                      <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-t from-[#4F46E5] via-[#7C3AED] to-[#DB2777] transform translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                    </div>
                  </div>
                  <span className="relative text-base tracking-[0.3em] font-light">YOUR AI AGENT</span>
                </div>                <div className="relative px-6 py-3 backdrop-blur-sm transition-all duration-300 group overflow-hidden">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* Horizontal lines */}
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#06B6D4] via-[#3B82F6] to-[#8B5CF6]transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-[#06B6D4] via-[#3B82F6] to-[#8B5CF6] transform translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                      {/* Vertical lines */}
                      <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-[#06B6D4] via-[#3B82F6] to-[#8B5CF6] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                      <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-t from-[#06B6D4] via-[#3B82F6] to-[#8B5CF6] transform translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                    </div>
                  </div>
                  <span className="relative text-base tracking-[0.3em] font-light">YOUR RULES</span>
                </div>                <div className="relative px-6 py-3 backdrop-blur-sm transition-all duration-300 group overflow-hidden">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* Horizontal lines */}
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#DB2777]transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-[#4F46E5] via-[#7C3AED] to-[#DB2777] transform translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                      {/* Vertical lines */}
                      <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-[#4F46E5] via-[#7C3AED] to-[#DB2777] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                      <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-t from-[#4F46E5] via-[#7C3AED] to-[#DB2777] transform translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                    </div>
                  </div>
                  <span className="relative text-base tracking-[0.3em] font-light">YOUR VISION</span>
                </div>              </div>
            </motion.div>
          </div>
        </div>
      </div>      {/* Bottom content removed */}
    </div>
  );
};

export default SecondVideoSection;
