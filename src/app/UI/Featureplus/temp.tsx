'use client'
import React, { useState, useRef, useEffect } from 'react';

interface Bubble {
  x: number;
  y: number;
  z: number;
  originalPos: {
    x: number;
    y: number;
    z: number;
  };
  defaultColor: string;
  expandedColor: string;
}

const GeneratedComponent: React.FC = () => {
  const [smallBubbles, setSmallBubbles] = useState<Bubble[]>([]);
  const [imageError, setImageError] = useState(false);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  useEffect(() => {
    // Generate bubbles to initially cover the main bubble
    const generateBubbles = () => {
      const defaultColors = [
        'from-gray-800/90 to-gray-900/90',
        'from-gray-900/90 to-black/90',
        'from-black/90 to-gray-900/90',
        'from-gray-800/90 to-black/90',
      ] as const;

      const expandedColors = [
        'from-blue-400/40 to-blue-600/20',
        'from-purple-400/40 to-purple-600/20',
        'from-pink-400/40 to-pink-600/20',
        'from-cyan-400/40 to-cyan-600/20',
        'from-green-400/40 to-green-600/20',
        'from-yellow-400/40 to-yellow-600/20'
      ] as const;

      const bubbles = Array.from({ length: 100 }, (_, i) => {
        const phi = Math.acos(1 - 2 * (i + 0.5) / 100);
        const theta = Math.PI * 2 * i * (1 + Math.sqrt(5)) / 2;
        
        // Initial tight radius to cover the main bubble
        const coverRadius = 150;
        const x = coverRadius * Math.cos(theta) * Math.sin(phi);
        const y = coverRadius * Math.sin(theta) * Math.sin(phi);
        const z = coverRadius * Math.cos(phi);

        return {
          x, y, z,
          originalPos: { x, y, z },
          defaultColor: defaultColors[Math.floor(Math.random() * defaultColors.length)],
          expandedColor: expandedColors[Math.floor(Math.random() * expandedColors.length)]
        };
      });

      setSmallBubbles(bubbles);
    };

    generateBubbles();
  }, []);

  const handleMainBubbleMouseMove = () => {
    if (!bubbleContainerRef.current) return;
    isHovering.current = true;

    // Move bubbles away dramatically
    setSmallBubbles(prev => prev.map(bubble => {
      const distanceFromCenter = Math.sqrt(
        Math.pow(bubble.originalPos.x, 2) + 
        Math.pow(bubble.originalPos.y, 2) +
        Math.pow(bubble.originalPos.z, 2)
      );
      
      const directionX = bubble.originalPos.x / distanceFromCenter;
      const directionY = bubble.originalPos.y / distanceFromCenter;
      const directionZ = bubble.originalPos.z / distanceFromCenter;

      // Expanded radius for dramatic spread
      const moveAwayRadius = 800;
      
      return {
        ...bubble,
        x: directionX * moveAwayRadius,
        y: directionY * moveAwayRadius,
        z: directionZ * moveAwayRadius
      };
    }));
  };

  const handleMainBubbleMouseLeave = () => {
    isHovering.current = false;
    
    // Return bubbles to their original covering positions
    setSmallBubbles(prev => prev.map(bubble => ({
      ...bubble,
      x: bubble.originalPos.x,
      y: bubble.originalPos.y,
      z: bubble.originalPos.z
    })));
  };

  return (
    <div>
      <section className="min-h-screen bg-gradient-to-r from-black via-blue-950 to-gray-900 py-20 overflow-hidden relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* Left content */}
            <div className="lg:w-1/2 space-y-8 relative z-20 text-center lg:text-left">
              {/* Your existing content */}
            </div>

            {/* 3D Bubble with AI Text and Small Bubbles */}
            <div className="lg:w-1/2 relative h-[700px] hidden lg:block" ref={bubbleContainerRef}>
              <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 perspective-[2000px]">
                {/* Main 3D Bubble */}
                <div 
                  className="relative w-[300px] h-[300px] animate-float-slow transform-style-preserve-3d"
                  onMouseEnter={handleMainBubbleMouseMove}
                  onMouseLeave={handleMainBubbleMouseLeave}
                >
                  {/* Core Sphere */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 backdrop-blur-3xl shadow-2xl">
                    {/* Outer Glow */}
                    <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                    
                    {/* Inner Core */}
                    <div className="absolute inset-0 rounded-full overflow-hidden backdrop-blur-3xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900"></div>
                    </div>
                  </div>

                  {/* Small Bubbles */}
                  {smallBubbles.map((bubble, index) => (
                    <div key={index}>
                      {/* Small Bubble */}
                      <div
                        className={`absolute left-1/2 top-1/2 w-8 h-8 rounded-full backdrop-blur-sm transform-gpu pointer-events-none bg-gradient-to-br ${
                          isHovering.current ? bubble.expandedColor : bubble.defaultColor
                        }`}
                        style={{
                          transform: `translate3d(${bubble.x}px, ${bubble.y}px, ${bubble.z}px)`,
                          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          boxShadow: isHovering.current 
                            ? '0 0 30px rgba(255,255,255,0.2)' 
                            : '0 0 15px rgba(0,0,0,0.4)',
                          backdropFilter: 'blur(8px)',
                          opacity: isHovering.current ? 0.6 : 0.9,
                          scale: isHovering.current ? '0.8' : '1'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeneratedComponent;
