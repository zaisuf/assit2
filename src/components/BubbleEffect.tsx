"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';

const BubbleEffect: React.FC = () => {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [runnerPos, setRunnerPos] = useState<{x: number, y: number} | null>(null);
  const runnerRef = useRef<SVGCircleElement | null>(null);
  const animFrame = useRef<number | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  // Polyline data for runner animation (SVG path for each line)
  const lines = [
    { points: '300,120 300,200 300,264', path: 'M300,120 L300,200 L300,264' },
    { points: '120,320 220,320 220,264 300,264', path: 'M120,320 L220,320 L220,264 L300,264' },
    { points: '560,320 460,320 460,264 300,264', path: 'M560,320 L460,320 L460,264 L300,264' },
    { points: '200,440 300,440 300,264', path: 'M200,440 L300,440 L300,264' },
    // 5th line: use the same points as the original SVG polyline for the bottom-right node
    { points: '432,440 432,350 300,264', path: 'M432,440 L432,350 L300,264' },
  ];

  // Animate runner along path
  const animateRunner = (lineIdx: number) => {
    if (animFrame.current) cancelAnimationFrame(animFrame.current); // Always reset
    setRunnerPos(null); // Always reset
    const path = pathRefs.current[lineIdx];
    if (!path) return;
    const total = path.getTotalLength();
    let start: number | null = null;
    const duration = 600; // ms
    function step(ts: number) {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const t = Math.min(elapsed / duration, 1);
      if (!path) return;
      const pos = path.getPointAtLength(t * total);
      setRunnerPos({ x: pos.x, y: pos.y });
      if (t < 1 && hoveredLine === lineIdx) {
        animFrame.current = requestAnimationFrame(step);
      } else {
        setRunnerPos(null);
      }
    }
    animFrame.current = requestAnimationFrame(step);
  };

  // Start animation on hover
  const handleMouseEnter = (i: number) => {
    if (animFrame.current) cancelAnimationFrame(animFrame.current); // Always reset
    setHoveredLine(i);
    setRunnerPos(null);
    setTimeout(() => animateRunner(i), 10);
  };
  // Stop animation on leave
  const handleMouseLeave = () => {
    setHoveredLine(null);
    setRunnerPos(null);
    if (animFrame.current) cancelAnimationFrame(animFrame.current);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Node-link diagram container */}
      <div className="relative flex flex-col items-center justify-center w-full h-[750px] font-sans">
        {/* SVG lines - truly centered diagram */}
        <svg
          className="diagram-svg absolute left-1/2 top-[100px] -translate-x-1/2 w-[600px] h-[600px] pointer-events-auto"
          width="600"
          height="600"
        >
          {lines.map((line, i) => (
            <g key={i}>
              {/* Hidden path for animation */}
              <path
                d={line.path}
                fill="none"
                stroke="none"
                ref={el => { pathRefs.current[i] = el; }}
              />
              <polyline
                className="diagram-line"
                points={line.points}
                fill="none"
                stroke="#1ecfff"
                strokeWidth="1"
                opacity="0.7"
                onMouseEnter={e => {
                  // Only trigger if mouse is directly over the line, not the group
                  if (e.target === e.currentTarget) handleMouseEnter(i);
                }}
                onMouseLeave={handleMouseLeave}
                style={{ pointerEvents: 'stroke' }}
              />
              {/* Animated runner */}
              {hoveredLine === i && runnerPos && (
                <circle
                  r="8"
                  fill="#fff"
                  cx={runnerPos.x}
                  cy={runnerPos.y}
                  style={{ filter: 'drop-shadow(0 0 8px #1ecfff)' }}
                />
              )}
            </g>
          ))}
          {/* Text labels */}
          <text x="295" y="110" fill="#1ecfff" fontSize="20" fontWeight="bold">1</text>
          <text x="105" y="325" fill="#1ecfff" fontSize="20" fontWeight="bold">2</text>
          <text x="565" y="325" fill="#1ecfff" fontSize="20" fontWeight="bold">3</text>
          <text x="185" y="455" fill="#1ecfff" fontSize="20" fontWeight="bold">4</text>
          <text x="440" y="455" fill="#1ecfff" fontSize="20" fontWeight="bold">5</text>
        </svg>
        {/* Center play button node */}
        <div className="absolute left-1/2 top-[330px] -translate-x-1/2 z-10 flex items-center justify-center w-28 h-28 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 shadow-2xl border border-blue-800/40" style={{ borderRadius: 0 }}>
          {/* Dot bubble toward top node */}
          <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-300 rounded-full shadow-lg border border-blue-500 z-20" />
          <div className="flex items-center justify-center w-20 h-20 bg-black/60 shadow-inner relative" style={{ borderRadius: 0 }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="46" height="46" rx="0" stroke="#1ecfff" strokeWidth="2" fill="#0a1627"/>
              <polygon points="20,16 34,24 20,32" fill="none" stroke="#1ecfff" strokeWidth="2"/>
            </svg>
            {/* Center number overlay */}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-700 text-white text-center font-bold flex items-center justify-center text-lg shadow" style={{ borderRadius: 0 }}>5</span>
          </div>
        </div>
        {/* Top node */}
        <div className="absolute left-1/2 top-[180px] -translate-x-1/2 px-8 py-4 border border-white/80 text-white text-lg flex font-sans" style={{ borderRadius: 0, background: '#787882', boxShadow: 'none', fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em' }}>
          {/* Dot bubble toward center node */}
          <span className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white rounded-full border border-white z-20" style={{ boxShadow: '0 0 16px 6px #fff, 0 0 2px 1px #fff' }} />
          <div className="flex items-center gap-2">
            <span className="inline-block w-6 h-6 bg-blue-700 text-white text-center font-bold mr-2" style={{ borderRadius: 0 }}>1</span>
            <div className="font-semibold">AI Expertise</div>
          </div>
          <div className="text-sm text-blue-200">Lucas Kim</div>
        </div>
        {/* Left node with avatar */}
        <div className="absolute left-[18%] top-[380px] px-8 py-4 border border-white/80 text-white text-lg flex items-center gap-3 font-sans" style={{ borderRadius: 0, background: '#787882', boxShadow: 'none', fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em' }}>
          {/* Dot bubble toward center node */}
          <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border border-white z-20" style={{ boxShadow: '0 0 16px 6px #fff, 0 0 2px 1px #fff' }} />
          {/* Avatar SVG */}
          <span className="inline-block w-6 h-6 bg-blue-700 text-white text-center font-bold mr-2" style={{ borderRadius: 0 }}>2</span>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="34" height="34" rx="0" stroke="#1ecfff" strokeWidth="2" fill="#0a1627"/>
            <path d="M18 20c-3 0-6 1.5-6 4.5V27h12v-2.5c0-3-3-4.5-6-4.5z" stroke="#1ecfff" strokeWidth="1.5"/>
            <circle cx="18" cy="14" r="4" stroke="#1ecfff" strokeWidth="1.5"/>
          </svg>
          <div>
            <div className="font-semibold">Pidge Expert</div>
            <div className="text-sm text-blue-200">Sarah M.</div>
          </div>
        </div>
        {/* Right node */}
        <div className="absolute left-[68%] top-[420px] -translate-y-1/2 pr-8 py-4 border border-white/80 text-white text-lg flex items-center gap-3 font-sans" style={{ width: 'fit-content', borderRadius: 0, background: '#787882', boxShadow: 'none', fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em' }}>
          {/* Dot bubble toward center node */}
          <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border border-white z-20" style={{ boxShadow: '0 0 16px 6px #fff, 0 0 2px 1px #fff' }} />
          <span className="inline-block w-6 h-6 bg-blue-700 text-white text-center font-bold mr-2" style={{ borderRadius: 0 }}>3</span>
          <div>
            <div className="font-semibold">VP of research</div>
            <div className="text-sm text-blue-200">12 +</div>
          </div>
        </div>
        {/* Bottom node */}
        <div className="absolute left-[35%] top-[510px] -translate-x-1/2 px-8 py-4 border border-white/80 text-white text-lg flex font-sans" style={{ borderRadius: 0, background: '#787882', boxShadow: 'none', fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em' }}>
          {/* Dot bubble toward center node */}
          <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border border-white z-20" style={{ boxShadow: '0 0 16px 6px #fff, 0 0 2px 1px #fff' }} />
          <div className="flex items-center gap-2">
            <span className="inline-block w-6 h-6 bg-blue-700 text-white text-center font-bold mr-2" style={{ borderRadius: 0 }}>4</span>
            <span>The customer voice</span>
          </div>
        </div>
        {/* Bottom-right node (box5) */}
        <div className="absolute left-[55%] top-[530px] px-8 py-4 border border-white/80 text-white text-lg flex items-center gap-3 font-sans" style={{ width: 'fit-content', borderRadius: 0, background: '#787882', boxShadow: 'none', fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em' }}>
          {/* Dot bubble above the node (box5), moved left, now with purple glowing white color */}
          <span className="absolute left-[26%] top-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border border-white z-20" style={{ boxShadow: '0 0 16px 6px #fff, 0 0 2px 1px #fff' }} />
          <span className="inline-block w-6 h-6 bg-blue-700 text-white text-center font-bold mr-2" style={{ borderRadius: 0 }}>5</span>
          <div>
            <div className="font-semibold">Growth Partner</div>
            <div className="text-sm text-blue-200">Box 5</div>
          </div>
        </div>
        {/* The customer voice description text block left of box4 */}
        <div className="absolute left-[4%] top-[480px] pr-4 w-[320px] flex flex-col items-end z-20" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>
          <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>The customer voice: Insights that shape our solutions and drive improvement.</span>
          <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>Listening, learning, and evolving with every interaction.</span>
        </div>
        {/* Growth Partner description text block right of box5 */}
        <div className="absolute left-[73%] top-[480px] pl-4 w-[320px] flex flex-col items-start z-20" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>
          <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>Growth Partner: Accelerating your business with strategic insights.</span>
          <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>Collaborating to unlock new opportunities and drive sustainable growth.</span>
        </div>
      </div>
      {/* Big Engine text background - now centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[85%] pointer-events-none select-none z-0 w-full flex flex-col items-center justify-center font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>
        <span className="block text-[120px] font-extrabold text-white/20 tracking-widest whitespace-nowrap text-center font-sans" style={{ letterSpacing: '0.2em', userSelect: 'none', width: 'fit-content', fontFamily: 'sans-serif', fontWeight: 400 }}>
          ENGINE
        </span>
      </div>
      {/* pidge description text block moved to left side, even higher */}
      <div className="absolute left-0 top-1/2 -translate-y-[100%] pl-20 w-1/2 font-sans flex flex-col items-start gap-1 text-left z-10" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>
        <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>Empowering your ideas with AI-driven solutions.</span>
        <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>Seamless integration for next-gen experiences.</span>
        <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>Innovation that accelerates your business growth.</span>
        <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>Collaboration at the heart of every project.</span>
        <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>Your vision, our technology—together unstoppable.</span>
      </div>
      {/* VP of research description text block right side */}
      <div className="absolute right-0 top-1/2 -translate-y-[100%] pr-20 w-1/2 font-sans flex flex-col items-end gap-1 text-right z-10" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>
        <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>VP of Research: Driving innovation and discovery.</span>
        <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>Leading teams to push the boundaries of AI.</span>
        <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>Strategic vision for research excellence.</span>
        <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>Collaboration with global experts and partners.</span>
        <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>Transforming ideas into real-world impact.</span>
      </div>
      {/* AI Expertise description text block above no 1 box */}
      <div className="absolute left-1/2 top-[65px] -translate-x-1/2 w-[420px] flex flex-col items-center z-20" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>
        <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>AI Expertise: Harnessing advanced algorithms and deep learning to solve real-world problems.</span>
        <span className="text-lg text-white/80 font-semibold font-sans" style={{fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.02em'}}>Delivering intelligent automation, insights, and innovation for your business.</span>
      </div>
      {/* Call to action button */}
      {/* Removed the 'Let's Talk' button as requested */}
      <style jsx global>{`
        .diagram-svg { pointer-events: auto; }
        .diagram-line {
          transition: stroke 0.2s;
          cursor: pointer;
        }
      `}</style>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ff00cc" />
            <stop offset="20%" stop-color="#3333ff" />
            <stop offset="40%" stop-color="#00ffcc" />
            <stop offset="60%" stop-color="#ffff00" />
            <stop offset="80%" stop-color="#ff6600" />
            <stop offset="100%" stop-color="#ff00cc" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default BubbleEffect;
