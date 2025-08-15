'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

interface Message {
  text: string;
  isAI: boolean;
  timestamp: Date;
}

const AIFeaturesSection2 = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Welcome to the second AI Features Section!", isAI: true, timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Parallax refs
  const boxRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [hovered, setHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [videoPushed, setVideoPushed] = useState(false);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // State for card parallax
  const [cardParallax, setCardParallax] = useState({ x: 0, y: 0 });

  // State for box 2 video zoom animation
  const [videoZoomed, setVideoZoomed] = useState(false);
  const [videoZoomTimeout, setVideoZoomTimeout] = useState<NodeJS.Timeout | null>(null);

  // New state for box 2 question hover
  const [box2BgIndex, setBox2BgIndex] = useState<number | null>(null);

  useEffect(() => {
    // Parallax floating animation removed; boxes remain fixed in place
    // (No scroll event listener)
  }, []);

  useEffect(() => {
    if (hovered && activeIndex !== null) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        videoRef.current.playbackRate = 1;
      }
      setVideoZoomed(true);
      if (videoZoomTimeout) clearTimeout(videoZoomTimeout);
      const timeout = setTimeout(() => {
        setVideoZoomed(false);
        // Only pause, do not reset currentTime, so video 'pushes' (plays) for 1s
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }, 1000);
      setVideoZoomTimeout(timeout);
      return () => clearTimeout(timeout);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setVideoZoomed(false);
      if (videoZoomTimeout) clearTimeout(videoZoomTimeout);
    }
  }, [hovered, activeIndex, videoZoomTimeout]);

  // Handler for mouse movement over cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setCardParallax({ x, y });
  };
  const handleCardMouseLeave = () => {
    setCardParallax({ x: 0, y: 0 });
  };

  return (
    <div ref={sectionRef} className="relative min-h-screen w-full overflow-hidden bg-transparent">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 50 + 20}px`,
                height: `${Math.random() * 50 + 20}px`,
                background: `linear-gradient(${Math.random() * 360}deg, rgba(79, 70, 229, 0.2), rgba(124, 58, 237, 0.2))`,
                borderRadius: '50%',
                filter: 'blur(8px)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Custom content here, no AI chat or voice assistant */}
      <div className="container mx-auto flex flex-col items-start justify-end h-screen px-12 pb-12">
        <motion.div
          className="w-[780px] h-[110px] rounded-2xl p-8 flex items-center justify-between text-white text-5xl font-bold select-none mb-[-8rem] ml-20 relative overflow-hidden border-none bg-transparent backdrop-blur-0"
          ref={boxRefs[0]}
          initial={{ opacity: 0, x: 120 }}
          animate={isInView ? { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, delay: 0.1 } } : {}}
        >
          <Image
            src="/text inputchatbto/WhatsApp I-.jpg"
            alt="Background"
            fill
            className="absolute inset-0 w-full h-full object-cover opacity-70 z-0 brightness-90 scale-90 -translate-x-10"
          />
          <div className="relative z-8 flex items-center gap-4 w-full h-full">
            <span className="font-sans text-white/70 text-[13px] md:text-[11px] font-extrabold drop-shadow-lg select-text ml-36 mt-2">
              What&apos;s up, what can I help you?
            </span>
            <div className="flex flex-col items-end ml-48 mr-2">
              <span className="font-sans text-accent-gold text-base md:text-lg font-extrabold select-text">Voice Chat</span>
              <span className="font-sans text-white text-xs md:text-xs font-semibold select-text leading-tight text-right">
                Lorem ipsum dolor<br />
                <span className="block">sit amet ectetur</span>
              </span>
            </div>
            {/* You can add any foreground content here if needed */}
          </div>
        </motion.div>
        <div className="flex flex-row gap-8 ml-20">
          <motion.div
            className={`w-[400px] h-[400px] bg-black/40 rounded-2xl p-8 shadow-xl border border-white/10 backdrop-blur-lg flex flex-col items-center justify-start text-white text-5xl font-bold select-none mt-36 relative overflow-hidden transition-transform duration-300`}
            ref={boxRefs[1]}
            initial={false}
            animate={{ }}
            onMouseEnter={() => {
              setHovered(true);
              setVideoPlayed(false);
              if (videoRef.current) {
                videoRef.current.play();
                videoRef.current.playbackRate = 1;
              }
            }}
            onMouseLeave={() => {
              setHovered(false);
              setActiveIndex(null);
              setVideoPlayed(false);
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
                videoRef.current.playbackRate = 1;
              }
            }}
          >
            {/* Tagline at top of box 2 */}
            <div className="w-full flex flex-col items-center justify-center mb-2 mt-[-1.5rem] z-20">
              <span className="font-sans text-accent-gold text-base md:text-lg font-extrabold select-text drop-shadow-lg text-center">
                 Redirect Funtion
              </span>
              <span className="font-sans text-white text-xs md:text-xs font-semibold select-text leading-tight text-center mt-1">
                <span className="block">Auto Redirect capacity</span>
                <span className="block">everywhere in website</span>
              </span>
            </div>
            {/* Video background */}
            <motion.video
              ref={videoRef}
              src="/text inputchatbto/lv_0_20250628151613.mp4"
              autoPlay={false}
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-70 z-0 brightness-90"
              animate={{
                scale: videoZoomed ? 1.18 : 1,
                transition: { duration: 1, type: 'tween' }
              }}
            />
            {/* Voice sound wave circles overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="relative flex items-center justify-center">
                {/* Outer wave */}
                <span
                  className={`absolute w-40 h-40 rounded-full border border-white opacity-70 ${videoZoomed ? 'animate-pulse-wave' : 'animate-pulse-slow2'}`}
                  style={videoZoomed ? { animationDelay: '0s', animationDuration: '0.7s' } : { animationDelay: '0s' }}
                ></span>
                {/* Middle wave */}
                <span
                  className={`absolute w-28 h-28 rounded-full border border-white opacity-60 ${videoZoomed ? 'animate-pulse-wave' : 'animate-pulse-slow2'}`}
                  style={videoZoomed ? { animationDelay: '0.2s', animationDuration: '0.7s' } : { animationDelay: '0.2s' }}
                ></span>
                {/* Inner wave */}
                <span
                  className={`absolute w-16 h-16 rounded-full border border-white opacity-50 ${videoZoomed ? 'animate-pulse-wave' : 'animate-pulse-slow2'}`}
                  style={videoZoomed ? { animationDelay: '0.4s', animationDuration: '0.7s' } : { animationDelay: '0.4s' }}
                ></span>
                {/* Center dot */}
                <span className="relative w-8 h-8 rounded-full bg-white border-2 border-white/60 shadow-lg"></span>
              </div>
            </div>
            <div className="relative z-10 w-full h-full flex flex-col justify-center px-4 gap-1">
              {/* Q&A pairs: question right, response left below */}
              <div className="flex flex-col w-full gap-2">
                {/* 1st Q&A */}
                <div className="flex flex-col w-full"
                  onMouseEnter={() => {
                    setActiveIndex(0);
                    setBox2BgIndex(0);
                    if (!videoPlayed && videoRef.current) {
                      videoRef.current.playbackRate = 1;
                      videoRef.current.play();
                      setVideoPlayed(true);
                    }
                  }}
                  onMouseLeave={() => {
                    setActiveIndex(null);
                    setBox2BgIndex(null);
                  }}
                >
                  <div className="flex w-full justify-end items-center gap-1"
                    style={{ marginLeft: hovered && activeIndex === 0 ? '40px' : '140px', transition: 'margin-left 0.3s' }}>
                    <span className="font-sans text-[#e0e0e0] text-xs md:text-sm font-semibold select-text leading-tight text-right rounded-lg p-1 shadow-md bg-gradient-to-br from-purple-700/40 to-purple-900/50 backdrop-blur-md border border-purple-800/30">
                      How do I reset my account password?
                    </span>
                    <span className="ml-1 flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-purple-900 to-purple-700 text-[10px] font-bold text-white border border-purple-900 shadow">You</span>
                  </div>
                  <div className="flex w-full justify-start items-center gap-1"
                    style={{ marginLeft: hovered && activeIndex === 0 ? '-40px' : '-200px', transition: 'margin-left 0.3s' }}>
                    <span className="mr-1 flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-[10px] font-bold text-white border border-sky-400 shadow">AI</span>
                    <span className="font-sans text-[#e0e0e0] text-xs md:text-sm font-semibold select-text leading-tight text-left rounded-lg p-1 shadow-md bg-gradient-to-br from-gray-700/40 to-gray-900/50 backdrop-blur-md border border-gray-700/30">
                      I’ve taken you to the Password Reset page. Scroll down for detailed steps and a link to reset it securely  
                    </span>
                  </div>
                </div>
                {/* 2nd Q&A */}
                <div className="flex flex-col w-full"
                  onMouseEnter={() => {
                    setActiveIndex(1);
                    setBox2BgIndex(1);
                    if (!videoPlayed && videoRef.current) {
                      videoRef.current.playbackRate = 1;
                      videoRef.current.play();
                      setVideoPlayed(true);
                    }
                  }}
                  onMouseLeave={() => {
                    setActiveIndex(null);
                    setBox2BgIndex(null);
                  }}
                >
                  <div className="flex w-full justify-end items-center gap-1"
                    style={{ marginLeft: hovered && activeIndex === 1 ? '40px' : '140px', transition: 'margin-left 0.3s' }}>
                    <span className="font-sans text-[#e0e0e0] text-xs md:text-sm font-semibold select-text leading-tight text-right rounded-lg p-1 shadow-md bg-gradient-to-br from-purple-700/40 to-purple-900/50 backdrop-blur-md border border-purple-800/30">
                      Why is the app crashing when I open it?
                    </span>
                    <span className="ml-1 flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-purple-900 to-purple-700 text-[10px] font-bold text-white border border-purple-900 shadow">You</span>
                  </div>
                  <div className="flex w-full justify-start items-center gap-1"
                    style={{ marginLeft: hovered && activeIndex === 1 ? '-40px' : '-200px', transition: 'margin-left 0.3s' }}>
                    <span className="mr-1 flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-[10px] font-bold text-white border border-sky-400 shadow">AI</span>
                    <span className="font-sans text-[#e0e0e0] text-xs md:text-sm font-semibold select-text leading-tight text-left rounded-lg p-1 shadow-md bg-gradient-to-br from-gray-700/40 to-gray-900/50 backdrop-blur-md border border-gray-700/30">
                      Welcome to the App Troubleshooting page! Based on your issue, try clearing the app cache or updating to the latest version
                    </span>
                  </div>
                </div>
                {/* 3rd Q&A */}
                <div className="flex flex-col w-full"
                  onMouseEnter={() => {
                    setActiveIndex(2);
                    setBox2BgIndex(2);
                    if (!videoPlayed && videoRef.current) {
                      videoRef.current.playbackRate = 1;
                      videoRef.current.play();
                      setVideoPlayed(true);
                    }
                  }}
                  onMouseLeave={() => {
                    setActiveIndex(null);
                    setBox2BgIndex(null);
                  }}
                >
                  <div className="flex w-full justify-end items-center gap-1"
                    style={{ marginLeft: hovered && activeIndex === 2 ? '40px' : '140px', transition: 'margin-left 0.3s' }}>
                    <span className="font-sans text-[#e0e0e0] text-xs md:text-sm font-semibold select-text leading-tight text-right rounded-lg p-1 shadow-md bg-gradient-to-br from-purple-700/40 to-purple-900/50 backdrop-blur-md border border-purple-800/30">
                      How do I book a video consultation?
                    </span>
                    <span className="ml-1 flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-purple-900 to-purple-700 text-[10px] font-bold text-white border border-purple-900 shadow">You</span>
                  </div>
                  <div className="flex w-full justify-start items-center gap-1"
                    style={{ marginLeft: hovered && activeIndex === 2 ? '-40px' : '-200px', transition: 'margin-left 0.3s' }}>
                    <span className="mr-1 flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-[10px] font-bold text-white border border-sky-400 shadow">AI</span>
                    <span className="font-sans text-[#e0e0e0] text-xs md:text-sm font-semibold select-text leading-tight text-left rounded-lg p-1 shadow-md bg-gradient-to-br from-gray-700/40 to-gray-900/50 backdrop-blur-md border border-gray-700/30">
                      You&apos;re now on the Appointment Help page. To book a video consultation, choose a doctor, pick a time, and click &apos;Confirm
                    </span>
                  </div>
                </div>
                {/* Removed 4th and 5th Q&A pairs */}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="w-[270px] h-[400px] bg-black/40 rounded-2xl p-8 shadow-xl border border-white/10 backdrop-blur-lg flex items-center justify-center text-white text-5xl font-bold select-none mt-36 relative overflow-visible"
            ref={boxRefs[2]}
            initial={{ opacity: 0, x: 120 }}
            animate={isInView ? { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, delay: 0.1 } } : {}}
          >
            {/* Background image for box 3, only changes on card hover, not box 2 hover */}
            <Image
              src={
                activeIndex === 0 ? "/modernhoues_creative Large.jpeg" :
                activeIndex === 1 ? "/modern_houes_japanees.jpeg" :
                activeIndex === 2 ? "/Assistlore_bedroom_style.jpeg" :
                activeIndex === 3 ? "/Assistlore_new.jpeg" :
                "/Assistlore_arabic.jpeg"
              }
              alt="Box 3 Background"
              fill
              className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 transition-all duration-300"
              draggable="false"
            />
            {/* Tagline for box 3 */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full flex justify-center pointer-events-none">
              <span className="font-sans text-accent-gold text-base md:text-lg font-extrabold select-text drop-shadow-lg text-center px-4 py-1 rounded-xl">
                Get Unlimited Edit Chatbot Template
              </span>
            </div>
            {/* Fanned Stacked 4 Images Cards (smaller cards) */}
            <div
              className="absolute left-[60%] top-1/2 -translate-x-1/2 -translate-y-[2%] w-48 h-56 flex items-center justify-center z-10 overflow-visible pointer-events-auto"
              style={{ pointerEvents: 'auto' }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              {/* Card 1 (leftmost, bottom) */}
              <motion.div
                className="absolute left-0 top-10 w-32 h-44 rounded-xl shadow-2xl bg-white/10 overflow-hidden z-0 rotate-[-18deg] border border-white/20 transition-transform duration-300"
                style={{
                  transform: `rotate(-18deg) translateX(${cardParallax.x * 10}px) translateY(${cardParallax.y * 8}px)`
                }}
                onMouseEnter={() => setActiveIndex(0)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <Image
                  src="/modernhoues_creative Large.jpeg"
                  alt="Card 1"
                  width={128}
                  height={176}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {/* Card 2 (middle) */}
              <motion.div
                className="absolute left-6 top-3 w-32 h-44 rounded-xl shadow-xl bg-white/20 overflow-hidden z-10 rotate-[-6deg] border border-white/30 transition-transform duration-300"
                style={{
                  transform: `rotate(-6deg) translateX(${cardParallax.x * 16}px) translateY(${cardParallax.y * 12}px)`
                }}
                onMouseEnter={() => setActiveIndex(1)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <Image
                  src="/modern_houes_japanees.jpeg"
                  alt="Card 2"
                  width={128}
                  height={176}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {/* Card 3 (rightmost, top) */}
              <motion.div
                className="absolute left-12 top-0 w-32 h-44 rounded-xl shadow-2xl bg-white/30 overflow-hidden z-20 rotate-[8deg] border border-white/40 transition-transform duration-300"
                style={{
                  transform: `rotate(8deg) translateX(${cardParallax.x * 22}px) translateY(${cardParallax.y * 16}px)`
                }}
                onMouseEnter={() => setActiveIndex(2)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <Image
                  src="/Assistlore_bedroom_style.jpeg"
                  alt="Card 3"
                  width={128}
                  height={176}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {/* Card 4 (new, far right/top) */}
              <motion.div
                className="absolute left-20 top-[-8px] w-32 h-44 rounded-xl shadow-2xl bg-white/40 overflow-hidden z-30 rotate-[20deg] border border-white/50 transition-transform duration-300"
                style={{
                  transform: `rotate(20deg) translateX(${cardParallax.x * 28}px) translateY(${cardParallax.y * 20}px)`
                }}
                onMouseEnter={() => setActiveIndex(3)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <Image
                  src="/Assistlore_new.jpeg"
                  alt="Card 4"
                  width={128}
                  height={176}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            className="w-[400px] h-[250px] bg-black/40 rounded-2xl p-8 shadow-xl border border-white/10 backdrop-blur-lg flex items-center justify-center text-white text-5xl font-bold select-none mt-72"
            ref={boxRefs[3]}
            initial={{ opacity: 0, x: 120 }}
            animate={isInView ? { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, delay: 0.1 } } : {}}
          >
            4
          </motion.div>
          <motion.div
            className="w-[400px] h-[250px] bg-black/40 rounded-2xl p-8 shadow-xl border border-white/10 backdrop-blur-lg flex items-center justify-center text-white text-5xl font-bold select-none self-start mt-5 ml-[-27rem]"
            ref={boxRefs[4]}
            initial={{ opacity: 0, x: 120 }}
            animate={isInView ? { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, delay: 0.1 } } : {}}
          >
            5
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIFeaturesSection2;

/* Add this to your global CSS (e.g., styles/globals.css or tailwind.config.js) if not present:
@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.15); opacity: 0.2; }
}
.animate-pulse-slow {
  animation: pulse-slow 2.2s cubic-bezier(0.4,0,0.6,1) infinite;
}
@keyframes pulse-slow2 {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.25); opacity: 0.15; }
}
.animate-pulse-slow2 {
  animation: pulse-slow2 1.4s cubic-bezier(0.4,0,0.6,1) infinite;
}
@keyframes pulse-wave {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  20% { transform: scale(1.18) skewX(2deg); opacity: 0.5; }
  40% { transform: scale(1.25) skewX(-2deg); opacity: 0.2; }
  60% { transform: scale(1.18) skewX(2deg); opacity: 0.5; }
  80% { transform: scale(1.1) skewX(-2deg); opacity: 0.6; }
}
.animate-pulse-wave {
  animation: pulse-wave 0.7s cubic-bezier(0.4,0,0.6,1) infinite;
}
*/
