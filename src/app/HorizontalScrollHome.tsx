"use client";

import React, { useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import HeroSection from "../components/HeroSection";
import AIFeaturesSection from "../components/AIFeaturesSection";
import BubbleEffect from "../components/BubbleEffect";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroControls = useAnimation();
  const aiControls = useAnimation();

  // Handle scroll event for horizontal transition
  React.useEffect(() => {
    let isAnimating = false;
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) return;
      if (e.deltaY < 0) {
        isAnimating = true;
        heroControls.start({ x: "-100vw", opacity: 0, transition: { duration: 0.7 } }).then(() => { isAnimating = false; });
        aiControls.start({ x: 0, opacity: 1, transition: { duration: 0.7 } });
      } else if (e.deltaY > 0) {
        isAnimating = true;
        heroControls.start({ x: 0, opacity: 1, transition: { duration: 0.7 } }).then(() => { isAnimating = false; });
        aiControls.start({ x: "100vw", opacity: 0, transition: { duration: 0.7 } });
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [heroControls, aiControls]);

  return (
    <div ref={containerRef} className="relative w-screen h-screen overflow-hidden flex">
      <motion.div
        initial={{ x: 0, opacity: 1 }}
        animate={heroControls}
        className="w-full h-full absolute top-0 left-0"
        style={{ zIndex: 2 }}
      >
        <HeroSection onVideoComplete={() => {}} />
      </motion.div>
      <motion.div
        initial={{ x: "100vw", opacity: 0 }}
        animate={aiControls}
        className="w-full h-full absolute top-0 left-0"
        style={{ zIndex: 1 }}
      >
        <AIFeaturesSection />
      </motion.div>
      {/* BubbleEffect can be placed below or above as needed */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <BubbleEffect />
      </div>
    </div>
  );
}
