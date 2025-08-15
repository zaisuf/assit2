"use client";

import React, { useRef, useEffect } from "react";

const Bubble: React.FC<{ videoSrc: string; angle: number }> = ({ videoSrc, angle }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let playingForward = true;

    const onTimeUpdate = () => {
      if (!playingForward && video.currentTime <= 0) {
        playingForward = true;
        video.playbackRate = 0.5;
        video.currentTime = 0;
        video.play();
      }
    };

    const onEnded = () => {
      playingForward = !playingForward;
      if (playingForward) {
        video.currentTime = 0;
        video.playbackRate = 0.5;
        video.play();
      } else {
        video.currentTime = video.duration - 0.05;
        video.playbackRate = -0.5;
        video.play();
      }
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.playbackRate = 0.5;

    return () => {
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  return (
    <div
      className="relative w-40 h-40 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-80 transition-all duration-500 ease-in-out flex items-center justify-center"
      style={{ transform: `rotate(${angle}deg)`, overflow: "hidden", margin: 8 }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        style={{ width: "150%", height: "150%", objectFit: "cover", borderRadius: "9999px" }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "4px solid #3b82f6",
          pointerEvents: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};

const FortyBubblesSection: React.FC = () => {
  // For demo, use the same video for all bubbles
  const videoSrc = "/vn2.mp4";
  // Distribute angles for visual variety
  const bubbles = Array.from({ length: 21 }, (_, i) => ({
    videoSrc,
    angle: (i * 360) / 21,
  }));

  const customBubbles = [
    { videoSrc: "/bubble1 1884415283.mp4", angle: 0 },
    { videoSrc: "/bubble3.mp4", angle: 90 },
    { videoSrc: "/bubble4.mp4", angle: 180 },
    { videoSrc: "/bubble5.mp4", angle: 270 },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-wrap items-center justify-center gap-4 bg-gradient-to-r from-black via-blue-950 to-gray-900 py-16">
      {/* Custom bubbles from HeroSection */}
      {customBubbles.map((bubble, idx) => (
        <Bubble key={"custom-"+idx} videoSrc={bubble.videoSrc} angle={bubble.angle} />
      ))}
      {/* Original 21 demo bubbles */}
      {bubbles.map((bubble, idx) => (
        <Bubble key={idx} videoSrc={bubble.videoSrc} angle={bubble.angle} />
      ))}
    </div>
  );
};

export default FortyBubblesSection;
