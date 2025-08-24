"use client";

import React, { useEffect, useRef } from 'react';

const HexagonGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      
      // Set display size (css pixels)
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      // Set actual size in memory (scaled to account for extra pixel density)
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      // Scale context to ensure correct drawing operations
      ctx.scale(dpr, dpr);
      
      drawHexagonGrid(ctx);
    };

    const drawHexagonGrid = (ctx: CanvasRenderingContext2D) => {
      // Clear canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Hexagon configuration
      const size = 20; // Size of hexagon from center to corner
      const width = size * Math.sqrt(3);
      const height = size * 2;
      const horizontalSpacing = width;
      const verticalSpacing = height * 0.75;
      
      // Calculate number of hexagons needed
      const columns = Math.ceil(window.innerWidth / horizontalSpacing) + 1;
      const rows = Math.ceil(window.innerHeight / verticalSpacing) + 1;
        // Style settings
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; // Increased alpha for more visible lines
      ctx.lineWidth = 1.1; // Slightly thicker line for better visibility
      
      // Draw the grid
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const x = col * horizontalSpacing + (row % 2) * (width / 2);
          const y = row * verticalSpacing;
          drawHexagon(ctx, x, y, size);
        }
      }
    };

    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
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
    };

    // Initial draw
    resizeCanvas();

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.1,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
};

export default HexagonGrid;