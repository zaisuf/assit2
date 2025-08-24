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

  // Ref for the hero canvas container (3D object or background)
  const heroCanvasContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden font-sans" style={{ background: 'transparent' }}>
      {/* Video Background removed */}
      {/* Hero Content */}
      {showContent && (
        <motion.div
          className="relative z-10 h-full flex items-center justify-center font-sans"
          style={{ background: 'transparent' }}
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
          <div className="container mx-auto px-4 flex items-center justify-center h-full">
            <div className="max-w-7xl mx-auto relative">
              {/* Removed Big square box line */}
                {/* Hero Section with 3D Object */}
        <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden" style={{ background: 'transparent' }}>
          {/* 3D Icosahedron Background */}
       
          <div className="relative z-10 p-4">
            <h1 className="text-6xl md:text-9xl leading-none font-extrabold text-white text-center select-text font-sans" style={{fontFamily: 'sans-serif', letterSpacing: '-0.04em'}}>
              {['MAKE YOUR', 'COMPANY', 'ARTIFICIA'].map((line, i) => (
                <span key={i} className={`block border-0${i === 2 ? ' mt-2' : ''}`}>{
                  line.split('').map((char, idx) => (
                    <span
                      key={idx}
                      className="inline-block cursor-pointer hover:font-thin"
                      style={{ minWidth: '0.5em', transition: 'font-variation-settings 0.2s, font-weight 0.2s' }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))
                }</span>
              ))}
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-400">
              The definitive platform for ambitious brands to forge their digital commerce empire.
            </p>
          </div>
        </section>

              {/* Connecting lines (optional, can also be removed if not needed) */}
              {/* <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
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
              </svg> */}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HeroSection;
