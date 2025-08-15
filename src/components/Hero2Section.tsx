'use client'

import React from 'react';
import { motion } from 'framer-motion';

interface Hero2SectionProps {
  title?: string;
  subtitle?: string;
}

const Hero2Section: React.FC<Hero2SectionProps> = ({ title = "Welcome to Hero 2", subtitle = "This is your new hero section." }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/Gen-4 Turbo add flow.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ pointerEvents: 'none' }}
      />
      {/* Overlay for gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 opacity-80 z-10" />
      <motion.div
        className="z-20 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">{title}</h1>
        <p className="text-2xl md:text-3xl text-blue-100 mb-8 drop-shadow">{subtitle}</p>
        <button className="px-8 py-3 rounded-full bg-white/20 text-white font-semibold text-lg shadow hover:bg-white/30 transition">Get Started</button>
      </motion.div>
      {/* Decorative background shapes */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-400 opacity-20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-200 opacity-20 rounded-full blur-2xl" />
      </div>
    </div>
  );
};

export default Hero2Section;
