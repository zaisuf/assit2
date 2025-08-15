"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const boxData = [
	{ title: "", desc: "", img: "/twitter-card.png" },
	{ title: "", desc: "", img: "/backgraund/bg2.jpg" },
	{ title: "", desc: "", img: "/backgraund/bg3.jpg" },
	{ title: "", desc: "", img: "/backgraund/bg4.jpg" },
	{ title: "", desc: "", img: "/backgraund/bg5.jpg" },
	{ title: "", desc: "", img: "/backgraund/bg6.jpg" },
];

const BOXES_VISIBLE = 2;

const getBoxPairs = (data: typeof boxData) => {
  const pairs = [];
  for (let i = 0; i < data.length; i += 2) {
    pairs.push([data[i], data[i + 1]].filter(Boolean));
  }
  return pairs;
};

const boxPairs = getBoxPairs(boxData);

const AIFeaturesSixBoxSection: React.FC = () => {
	const [pairIdx, setPairIdx] = useState(0);
	const [direction, setDirection] = useState(0); // -1 for left, 1 for right

	// 3D tilt state for each box
	const [tilt, setTilt] = useState<{ [key: string]: { x: number; y: number } }>({});

	const handleMouseMove = (e: React.MouseEvent, key: string) => {
		const card = e.currentTarget as HTMLDivElement;
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		const rotateX = ((y - centerY) / centerY) * 10; // max 10deg
		const rotateY = ((x - centerX) / centerX) * 10;
		setTilt((prev) => ({ ...prev, [key]: { x: rotateX, y: rotateY } }));
	};

	const handleMouseLeave = (key: string) => {
		setTilt((prev) => ({ ...prev, [key]: { x: 0, y: 0 } }));
	};

	const handleLeft = () => {
		if (pairIdx > 0) {
			setDirection(-1);
			setPairIdx(pairIdx - 1);
		}
	};
	const handleRight = () => {
		if (pairIdx < boxPairs.length - 1) {
			setDirection(1);
			setPairIdx(pairIdx + 1);
		}
	};

	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-transparent py-20 flex items-center justify-center">
			{/* Animated floating elements */}
			<div className="absolute inset-0 opacity-30 pointer-events-none z-0">
				{Array.from({ length: 16 }).map((_, i) => (
					<div
						key={i}
						className="absolute animate-float"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 5}s`,
							width: `${Math.random() * 40 + 20}px`,
							height: `${Math.random() * 40 + 20}px`,
							background: `linear-gradient(${Math.random() * 360}deg, rgba(79, 70, 229, 0.18), rgba(124, 58, 237, 0.18))`,
							borderRadius: "50%",
							filter: "blur(8px)",
						}}
					/>
				))}
			</div>
			<div className="container mx-auto px-8 relative z-10 flex flex-col items-start justify-center mt-8">
				<h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-left bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mt-[-32px] ml-24">
					Discover Our AI Features
				</h2>
				<p className="text-sm text-left text-white/80 mb-8 max-w-2xl ml-24">
					Unlock the power of advanced AI to enhance your workflow and creativity.<br/>
					Seamlessly integrate intelligent features into your daily tasks.<br/>
					Experience innovation, efficiency, and smarter solutions with our platform.
				</p>
				<div className="flex flex-row items-center justify-center w-full mt-32">
					<button
						className="group relative text-white text-4xl font-bold px-4 py-2 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full shadow-lg hover:from-[#7C3AED] hover:to-[#4F46E5] transition-all duration-300 mx-4 border-2 border-white/20 focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/40"
						onClick={handleLeft}
						disabled={pairIdx === 0}
						aria-label="Scroll Left"
						style={{ zIndex: 2 }}
					>
						<span className="inline-block group-hover:-translate-x-1 transition-transform duration-300">&lt;</span>
					</button>
					<div className="relative w-[1140px] flex items-center justify-center overflow-hidden">
						<div style={{ width: '100%', display: 'flex', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)', transform: `translateX(-${pairIdx * 100}%)` }}>
							{boxPairs.map((pair, idx) => (
								<div key={idx} className="flex flex-row gap-10 justify-center items-center w-full flex-shrink-0" style={{ width: '100%' }}>
									{pair.map((box, bidx) => {
										const key = box.title + box.img;
										const tiltVal = tilt[key] || { x: 0, y: 0 };
										return (
											<div
												key={key}
												className="bg-gradient-to-br from-black/40 via-black/20 to-transparent backdrop-blur-lg p-16 border border-white/10 flex flex-col items-center hover:scale-105 transition-transform duration-300 min-h-[320px] min-w-[520px] max-w-[540px] w-[540px] relative overflow-hidden"
												style={{ borderRadius: 0 }}
											>
												<motion.div
													style={{
														perspective: 1000,
														width: '100%',
														height: '100%',
														position: 'absolute',
														top: 0,
														left: 0,
														zIndex: 0,
														willChange: 'transform',
													}}
													animate={{
														rotateX: tiltVal.x,
														rotateY: tiltVal.y,
														transition: { type: 'spring', stiffness: 200, damping: 20 },
													}}
													onMouseMove={(e) => handleMouseMove(e, key)}
													onMouseLeave={() => handleMouseLeave(key)}
												>
													<img
														src={box.img}
														alt={box.title || `AI Feature ${idx * 2 + bidx + 1}`}
														className="w-full h-full object-cover opacity-40"
														style={{ pointerEvents: 'none', borderRadius: 0 }}
													/>
												</motion.div>
												{box.title && (
													<h3 className="text-2xl font-semibold text-white mb-3 text-center z-10 relative">
														{box.title}
													</h3>
												)}
												{box.desc && (
													<p className="text-gray-300 text-center text-lg z-10 relative">
														{box.desc}
													</p>
												)}
											</div>
										);
									})}
								</div>
							))}
						</div>
					</div>
					<button
						className="group relative text-white text-4xl font-bold px-4 py-2 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full shadow-lg hover:from-[#7C3AED] hover:to-[#4F46E5] transition-all duration-300 mx-4 border-2 border-white/20 focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/40"
						onClick={handleRight}
						disabled={pairIdx >= boxPairs.length - 1}
						aria-label="Scroll Right"
						style={{ zIndex: 2 }}
					>
						<span className="inline-block group-hover:translate-x-1 transition-transform duration-300">&gt;</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default AIFeaturesSixBoxSection;
