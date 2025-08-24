'use client'

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './HeroSection';
import AIFeaturesSection from './AIFeaturesSection';
import BubbleEffect from './BubbleEffect';

const CombinedHeroAISection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [videoComplete, setVideoComplete] = useState(false);
  const [showBubbles, setShowBubbles] = useState(false);  const [aiSectionVisible, setAiSectionVisible] = useState(false);
  const [canTransitionFromAI, setCanTransitionFromAI] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handler to receive video completion signal from HeroSection
  const handleVideoComplete = () => {
    setVideoComplete(true);
  };
  // Effect to handle AI section visibility
  useEffect(() => {
    if (scrollProgress > 0 && scrollProgress < 0.5) {
      // When AI section comes into view
      setAiSectionVisible(true);
      setCanTransitionFromAI(true);
      setIsTransitioning(false);
    } else {
      // When AI section is not visible
      setAiSectionVisible(false);
      setCanTransitionFromAI(true);
    }
  }, [scrollProgress]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        e.preventDefault();
        
        // Only allow transition if video is complete
        if (videoComplete) {
          setScrollProgress(prev => {            // Check if we should prevent scrolling
            if ((aiSectionVisible && !canTransitionFromAI) && prev >= 0.1) {
              return 0.1;
            }
            
            const delta = e.deltaY > 0 ? 0.1 : -0.1;
            const newProgress = Math.max(0, Math.min(1, prev + delta));
            setShowBubbles(newProgress > 0.5);
            return newProgress;
          });
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [videoComplete, aiSectionVisible, canTransitionFromAI]);

  return (
    <div ref={containerRef} className="relative h-[250vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        <div className="relative w-full h-full bg-black">
          {/* Hero Section Container */}
          <motion.div 
            className="fixed inset-0 w-full h-full bg-black will-change-transform"
            initial={{ x: '0%' }}
            animate={{
              x: scrollProgress > 0 ? '-100%' : '0%',
              opacity: 1 - scrollProgress
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)',
              WebkitTransform: 'translate3d(0, 0, 0)'
            }}
          >
            <HeroSection onVideoComplete={handleVideoComplete} />
          </motion.div>
          
          {/* AI Features Section Container */}
          <motion.div 
            className="fixed inset-0 w-full h-full bg-black will-change-transform"
            initial={{ x: '100%' }}
            animate={{
              x: scrollProgress >= 0.5 ? '-100%' : scrollProgress > 0 ? '0%' : '100%',
              opacity: aiSectionVisible ? 1 : 0
            }}
            transition={{ 
              duration: 0.5, 
              ease: "easeInOut",
              opacity: { duration: 0.3 }
            }}
            style={{
              zIndex: scrollProgress > 0 && scrollProgress < 0.5 ? 2 : 1,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)',
              WebkitTransform: 'translate3d(0, 0, 0)'
            }}
          >
            <AIFeaturesSection />
          </motion.div>

          {/* Bubble Effect Container */}
          <motion.div 
            className="fixed inset-0 w-full h-full bg-black will-change-transform"
            initial={{ x: '100%' }}
            animate={{
              x: scrollProgress >= 0.5 ? '0%' : '100%',
              opacity: scrollProgress >= 0.5 ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              zIndex: scrollProgress >= 0.5 ? 3 : 1,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)',
              WebkitTransform: 'translate3d(0, 0, 0)'
            }}
          >
            <BubbleEffect />
          </motion.div>
          {/* Scroll Hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none">
            <div className="flex flex-col items-center text-white/70 text-sm animate-bounce">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1"><path d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg>
              <span>Scroll down to explore AI features</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedHeroAISection;