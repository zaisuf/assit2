"use client";

import React, { useEffect, useRef } from 'react';

const DottedGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before scaling
      ctx.scale(dpr, dpr);
      drawDottedGrid(ctx);
    };

    const drawDottedGrid = (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const dotSpacing = 32;
      const dotRadius = 2.2; // Increased dot size
      ctx.fillStyle = 'rgba(255,255,255,0.32)'; // Increased opacity
      for (let y = dotSpacing / 2; y < window.innerHeight; y += dotSpacing) {
        for (let x = dotSpacing / 2; x < window.innerWidth; x += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        opacity: 0.32, // Increased overall canvas opacity
        background: 'transparent',
      }}
    />
  );
};

export default DottedGrid;