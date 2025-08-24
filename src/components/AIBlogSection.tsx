"use client";

import React, { useRef, forwardRef } from "react";
import { motion } from "framer-motion";

const sections = [
	{
		box: {
			icon: "📰",
			title: "Featured: AI in Modern Business",
			description:
				"Explore the latest trends, case studies, and expert opinions on how AI is shaping the future of work and innovation.",
			button: "Read More",
			bg: "/Assistloree.jpeg",
		},
		blogs: [
			{
				title: "How AI is Transforming Business",
				excerpt:
					"Discover how artificial intelligence is revolutionizing industries, automating workflows, and unlocking new opportunities for growth.",
			},
			{
				title: "The Future of AI Agents",
				excerpt:
					"AI agents are becoming smarter and more autonomous. Learn what this means for your company and how to leverage them effectively.",
			},
			{
				title: "Best Practices for AI Integration",
				excerpt:
					"Integrating AI into your business doesn't have to be hard. Explore our top tips for a smooth and successful transition.",
			},
		],
	},
	{
		box: {
			icon: "🤖",
			title: "Featured: AI for Everyday Life",
			description:
				"See how AI is making daily tasks easier, from smart assistants to personalized recommendations and beyond.",
			button: "Discover More",
			bg: "/Assistlore_new.jpeg",
		},
		blogs: [
			{
				title: "AI in Your Pocket",
				excerpt:
					"Mobile AI apps are changing how we interact with technology. Find out which apps are leading the way.",
			},
			{
				title: "Smart Homes, Smarter Living",
				excerpt:
					"From thermostats to security, AI is powering the next generation of smart homes.",
			},
			{
				title: "Personalized Experiences with AI",
				excerpt:
					"Learn how AI tailors content, shopping, and entertainment to your unique preferences.",
			},
		],
	},
	{
		box: {
			icon: "🌐",
			title: "Featured: AI & The Future of Society",
			description:
				"Uncover the societal impacts of AI, including ethics, jobs, and the global digital transformation.",
			button: "Learn More",
			bg: "/Assistlore_modern.png",
		},
		blogs: [
			{
				title: "AI and the Job Market",
				excerpt:
					"Will AI take your job or create new opportunities? We break down the facts and myths.",
			},
			{
				title: "Ethics in AI",
				excerpt:
					"Explore the ethical challenges and responsibilities that come with advanced AI systems.",
			},
			{
				title: "AI for Good",
				excerpt:
					"Discover inspiring stories of how AI is being used to solve real-world problems and improve lives.",
			},
		],
	},
];

// Add imperative handle to control from parent
interface AIBlogSectionProps {
	onUnlock?: () => void;
}
const AIBlogSection = forwardRef<HTMLDivElement, AIBlogSectionProps>(
	({ onUnlock }, ref) => {
		const [subIndex, setSubIndex] = React.useState(0); // 0, 1, 2
		const sectionRef = useRef<HTMLDivElement>(null);
		const isAnimatingRef = useRef(false);
		const subIndexRef = useRef(subIndex);
		const onUnlockRef = useRef(onUnlock);

		// Keep refs in sync
		React.useEffect(() => {
			subIndexRef.current = subIndex;
		}, [subIndex]);
		React.useEffect(() => {
			onUnlockRef.current = onUnlock;
		}, [onUnlock]);

		// Only reset animation lock on mount, do NOT reset subIndex here
		React.useEffect(() => {
			isAnimatingRef.current = false;
			const handleWheel = (e: WheelEvent) => {
				if (isAnimatingRef.current) {
					e.preventDefault();
					return;
				}
				isAnimatingRef.current = true; // lock immediately for both directions
				const idx = subIndexRef.current;
				if (e.deltaY > 0 && idx < 2) {
					setSubIndex((prev) => Math.min(prev + 1, 2));
					e.preventDefault();
				} else if (e.deltaY < 0 && idx > 0) {
					setSubIndex((prev) => Math.max(prev - 1, 0));
					e.preventDefault();
				} else if (e.deltaY > 0 && idx === 2) {
					if (onUnlockRef.current) onUnlockRef.current();
				} else if (e.deltaY < 0 && idx === 0) {
					if (onUnlockRef.current) onUnlockRef.current();
				} else {
					e.preventDefault();
				}
				setTimeout(() => {
					isAnimatingRef.current = false;
				}, 700);
			};
			const el = sectionRef.current;
			if (el) {
				el.addEventListener("wheel", handleWheel, { passive: false });
			}
			return () => {
				if (el) {
					el.removeEventListener("wheel", handleWheel);
				}
			};
		}, []);

		return (
			<div
				ref={sectionRef}
				className="relative w-full bg-transparent flex flex-col items-center justify-center min-h-screen"
				style={{ overflow: "hidden" }}
			>
				{[sections[subIndex]].map((section, idx) => {
					const isEven = subIndex % 2 === 1;
					return (
						<div
							key={subIndex}
							className={`container mx-auto px-8 flex flex-col md:flex-row ${
								isEven ? "md:flex-row-reverse" : ""
							} items-center gap-16 mb-24 min-h-screen`}
							style={{ scrollSnapAlign: "start" }}
						>
							{/* Blog Texts */}
							<motion.div
								initial={{ opacity: 0, x: isEven ? 80 : -80 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.7 }}
								className="flex-1 flex flex-col gap-8 max-w-lg"
							>
								{section.blogs.map((post, bidx) => (
									<div key={bidx} className="mb-6">
										<div className="text-base text-gray-200 font-normal mb-2">
											{post.title}
										</div>
										<div className="text-base text-gray-200 font-normal">
											{post.excerpt}
										</div>
									</div>
								))}
							</motion.div>
							{/* Big Box */}
							<motion.div
								initial={{ opacity: 0, x: isEven ? -80 : 80 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.7 }}
								className="flex-1 flex items-center justify-center"
							>
								<div
									className="w-[500px] h-[600px] rounded-2xl bg-gradient-to-br from-black/40 via-black/20 to-transparent backdrop-blur-lg p-8 border border-white/10 shadow-[0_0_15px_rgba(124,58,237,0.08)] flex flex-col items-center justify-center"
									style={{
										backgroundImage: `url(${section.box.bg})`,
										backgroundSize: "cover",
										backgroundPosition: "center",
										position: "relative",
									}}
								>
									<span className="text-6xl text-white/80 mb-6">
										{section.box.icon}
									</span>
									<h3 className="text-2xl font-bold text-white mb-2 text-center">
										{section.box.title}
									</h3>
									<p className="text-gray-300 text-center text-base mb-4">
										{section.box.description}
									</p>
									<button className="mt-4 px-8 py-3 rounded-lg bg-accent-gold text-black font-bold text-base shadow-md hover:bg-transparent hover:text-accent-gold hover:border-accent-gold border-2 border-transparent transition-all duration-200">
										{section.box.button}
									</button>
								</div>
							</motion.div>
						</div>
					);
				})}
			</div>
		);
	}
);
AIBlogSection.displayName = "AIBlogSection";

export default AIBlogSection;
