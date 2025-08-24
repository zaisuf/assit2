"use client";

import React, { useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

import AIFeaturesSection from "../components/AIFeaturesSection";
import BubbleEffect from "../components/BubbleEffect";
import HeroSection from "../components/HeroSection";
import Header from "../components/Header";
import AIFeaturesSection2 from "../components/AIFeaturesSection2";
import SixBoxSection from "../components/SixBoxSection";
import AIBlogSection from "../components/AIBlogSection";
import AIServerSection from "../components/AIServerSection";
import FooterSection from "../components/FooterSection";
import HexagonGrid from "../components/HexagonGrid";
import "../styles/global-transparent.css";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroControls = useAnimation();
  const aiControls = useAnimation();
  const bubbleControls = useAnimation();
  const ai2Controls = useAnimation();
  const sixBoxControls = useAnimation();
  const aiBlogControls = useAnimation();
  const aiServerControls = useAnimation();
  const footerControls = useAnimation();
  const [aiBlogKey, setAiBlogKey] = useState(0);
  const [isAIBlogLocked, setAIBlogLocked] = useState(true);
  const isAnimatingRef = useRef(false);

  // Track which section is active
  const sectionIndex = useRef(0);

  // Handle scroll event for horizontal transition
  React.useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // When entering AIBlogSection, reset key and lock
      if (sectionIndex.current === 5 && !isAIBlogLocked) {
        setAiBlogKey((k) => k + 1);
        setAIBlogLocked(true);
      }
      // Lock scroll in AIBlogSection until unlocked
      if (sectionIndex.current === 5 && isAIBlogLocked) {
        e.preventDefault();
        return;
      }
      if (isAnimatingRef.current) return;
      if (e.deltaY < 0 && sectionIndex.current === 0) {
        isAnimatingRef.current = false;
        return;
      }
      if (e.deltaY > 0 && sectionIndex.current === 7) {
        isAnimatingRef.current = false;
        return;
      }
      isAnimatingRef.current = true;

      if (e.deltaY > 0 && sectionIndex.current < 7) {
        sectionIndex.current += 1;
        updateSectionPositions();
      } else if (e.deltaY < 0 && sectionIndex.current > 0) {
        sectionIndex.current -= 1;
        updateSectionPositions();
      }
    };

    const updateSectionPositions = () => {
      const sections = [
        { control: heroControls, index: 0 },
        { control: aiControls, index: 1 },
        { control: bubbleControls, index: 2 },
        { control: ai2Controls, index: 3 },
        { control: sixBoxControls, index: 4 },
        { control: aiBlogControls, index: 5 },
        { control: aiServerControls, index: 6 },
        { control: footerControls, index: 7 },
      ];

      sections.forEach(({ control, index }) => {
        const position = index - sectionIndex.current;
        control.start({
          x: `${position * 100}vw`,
          opacity: position === 0 ? 1 : 0,
          transition: { duration: 0.7 },
        }).then(() => {
          if (position === 0) {
            isAnimatingRef.current = false;
          }
        });
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [
    heroControls,
    aiControls,
    bubbleControls,
    ai2Controls,
    sixBoxControls,
    aiBlogControls,
    aiServerControls,
    footerControls,
    isAIBlogLocked,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative flex w-screen h-screen overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900 font-sans"
    >
      <div className="absolute inset-0 z-0">
        <HexagonGrid />
      </div>
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none bg-transparent">
        <Header />
      </div>
      <motion.div
        initial={{ x: 0, opacity: 1 }}
        animate={heroControls}
        className="absolute top-0 left-0 w-full h-full bg-transparent"
        style={{ zIndex: 6 }}
      >
        <HeroSection onVideoComplete={() => {}} />
      </motion.div>
      <motion.div
        initial={{ x: "100vw", opacity: 0 }}
        animate={aiControls}
        className="absolute top-0 left-0 w-full h-full bg-transparent"
        style={{ zIndex: 5 }}
      >
        <AIFeaturesSection />
      </motion.div>
      <motion.div
        initial={{ x: "200vw", opacity: 0 }}
        animate={bubbleControls}
        className="absolute top-0 left-0 w-full h-full bg-transparent"
        style={{ zIndex: 4 }}
      >
        <BubbleEffect />
      </motion.div>
      <motion.div
        initial={{ x: "300vw", opacity: 0 }}
        animate={ai2Controls}
        className="absolute top-0 left-0 w-full h-full bg-transparent"
        style={{ zIndex: 3 }}
      >
        <AIFeaturesSection2 />
      </motion.div>
      <motion.div
        initial={{ x: "400vw", opacity: 0 }}
        animate={sixBoxControls}
        className="absolute top-0 left-0 w-full h-full bg-transparent"
        style={{ zIndex: 2 }}
      >
        <SixBoxSection />
      </motion.div>
      <motion.div
        initial={{ x: "500vw", opacity: 0 }}
        animate={aiBlogControls}
        className="absolute top-0 left-0 w-full h-full bg-transparent"
        style={{ zIndex: 1 }}
      >
        <AIBlogSection key={aiBlogKey} onUnlock={() => setAIBlogLocked(false)} />
      </motion.div>
      <motion.div
        initial={{ x: "600vw", opacity: 0 }}
        animate={aiServerControls}
        className="absolute top-0 left-0 w-full h-full bg-transparent"
        style={{ zIndex: 0 }}
      >
        <AIServerSection />
      </motion.div>
      <motion.div
        initial={{ x: "700vw", opacity: 0 }}
        animate={footerControls}
        className="absolute top-0 left-0 w-full h-full bg-transparent"
        style={{ zIndex: 10 }}
      >
        <FooterSection />
      </motion.div>
    </div>
  );
}
