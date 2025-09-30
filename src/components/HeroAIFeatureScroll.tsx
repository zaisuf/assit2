'use client'

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface HeroSectionProps {
  onVideoComplete: () => void;
}

const HeroSection = ({ onVideoComplete }: HeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(true); // Always show content
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [bubbleOffsets, setBubbleOffsets] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  // State to control the overlay opacity for the hover effect
  const [overlayOpacity, setOverlayOpacity] = useState(0.9);

  // Overlay and content logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setMouse({ x: mx, y: my });
      // Move each bubble away from cursor, with different strengths
      setBubbleOffsets([
        { x: (mx - rect.width * 0.2) * -0.08, y: (my - rect.height * 0.3) * -0.08 },
        { x: (mx - rect.width * 0.7) * -0.07, y: (my - rect.height * 0.18) * -0.07 },
        { x: (mx - rect.width * 0.45) * -0.06, y: (my - rect.height * 0.7) * -0.06 },
        { x: (mx - rect.width * 0.8) * -0.05, y: (my - rect.height * 0.65) * -0.05 },
        { x: (mx - rect.width * 0.25) * -0.09, y: (my - rect.height * 0.8) * -0.09 },
      ]);
      // Redraw hex grid with lighting
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Ref for hexagon grid canvas
  const hexCanvasRef = useRef<HTMLCanvasElement>(null);

  // Draw hex grid with electric white line effect following the cursor
  function drawHexGridWithLighting(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const HERO_WIDTH = 800;
    const HERO_HEIGHT = 400;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = HERO_WIDTH * dpr;
    canvas.height = HERO_HEIGHT * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, HERO_WIDTH, HERO_HEIGHT);
    const size = 24;
    const width = size * Math.sqrt(3);
    const height = size * 2;
    const horizontalSpacing = width;
    const verticalSpacing = height * 0.75;
    const columns = Math.ceil(HERO_WIDTH / horizontalSpacing) + 1;
    const rows = Math.ceil(HERO_HEIGHT / verticalSpacing) + 1;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = col * horizontalSpacing + (row % 2) * (width / 2);
        const y = row * verticalSpacing;
        // No mouse effect, use static alpha and line width
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const xPos = x + size * Math.cos(angle);
          const yPos = y + size * Math.sin(angle);
          if (i === 0) {
            ctx.moveTo(xPos, yPos);
          } else {
            ctx.lineTo(xPos, yPos);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  // Function to handle hex grid hover effect
  const handleHexGridHover = (hovering: boolean) => {
    setOverlayOpacity(hovering ? 0.3 : 0.9); // Lower opacity on hover for light effect
  };

  // On mount, draw static grid at center
  useEffect(() => {
    if (hexCanvasRef.current) {
      drawHexGridWithLighting(hexCanvasRef.current);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          preload="auto"
          style={{ pointerEvents: 'none', filter: 'brightness(0.3)' }} // Reduce brightness
          ref={el => {
            if (el) el.pause(); // Ensure video is paused
          }}
        >
          <source src="/Ghelo7_45PM.mp4" type="video/mp4" />
        </video>
        {/* Dark blue bright light overlay */}
        {/* This overlay is removed to eliminate the mouse-following effect */}
        {/* <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            opacity: overlayOpacity,
            transition: 'opacity 0.3s',
            background: `radial-gradient(600px at ${mouse.x}px ${mouse.y}px, rgba(10,19,51,0.85) 0%, rgba(10,19,51,0.7) 40%, rgba(10,19,51,0.5) 70%, rgba(10,19,51,0.2) 100%)`
          }}
        /> */}
        {/* Removed shadow/overlay layer over the video */}
        {/* <div className="absolute inset-0 bg-[#0a1333]/90" /> */}
      </div>
      {/* Hero Content */}
      {showContent && (
        <motion.div
          className="relative z-10 h-full flex items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
              }
            }
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto relative">
              {/* Big square box line */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
                <div
                  className="w-[800px] h-[400px] border border-white/30 rounded-none relative overflow-hidden"
                  style={{ boxShadow: '0 0 0 0 transparent', transition: 'none' }}
                >
                  {/* HexagonGrid inside the box */}
                  <div className="absolute inset-0 w-full h-full">
                    {/* Custom HexagonGrid for this box only, now less visible */}
                    <canvas
                      ref={hexCanvasRef}
                      width={800}
                      height={400}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '800px',
                        height: '400px',
                        opacity: 0.99,
                        pointerEvents: 'none', // Disable pointer/click events
                        background: 'transparent',
                        zIndex: 20,
                        transition: 'none', // Remove filter transition
                      }}
                      className=""
                    />
                  </div>
                  {/* 3D Bubbles overlay - now in front of HexagonGrid */}
                  {/* Removed all bubbles from HeroSection as requested */}
                  
                  {/* Centered Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-auto" style={{ top: '30px', position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                    <h1 className="text-5xl md:text-6xl font-semibold tracking-wide bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent text-center select-text">
                      make Your Company Artificial with your own AI agent partner
                    </h1>
                    <p className="text-base md:text-lg font-semibold tracking-wide bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent text-center mt-10 max-w-2xl font-sans">
                      Deploy smart AI agents for your business, automate workflows, and unlock new possibilities with our powerful platform.
                    </p>
                    <div className="flex flex-wrap gap-6 mt-12 justify-center">
                      <button
                        className="inline-flex items-center justify-center rounded-md font-bold text-base px-6 py-3 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-transparent"
                        style={{
                          minWidth: '150px',
                          background: 'linear-gradient(90deg,rgb(72, 98, 129) 0%,rgb(125, 106, 182) 100%)', // light blue to purple
                          color: 'white',
                          borderColor: 'transparent',
                        }}
                      >
                        Get Started
                      </button>
                      <button
                        className="inline-flex items-center justify-center rounded-md font-bold text-base px-6 py-3 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 hover:bg-white/10 hover:text-white"
                        style={{
                          minWidth: '150px',
                          background: 'transparent',
                          color: 'white',
                          borderColor: 'rgba(255,255,255,0.3)', // matches the Hexagon Grid box line
                        }}
                      >
                        Try Demo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Connecting lines (optional, can also be removed if not needed) */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                <motion.path
                  d="M 300 200 L 500 200"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="10 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                />
                <motion.path
                  d="M 500 200 L 700 200"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="10 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 1.4 }}
                />
              </svg>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HeroSection;
