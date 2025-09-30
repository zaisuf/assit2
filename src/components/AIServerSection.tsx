"use client";

import React from "react";
import { motion } from "framer-motion";

const serverTexts = [
	{
		title: "Modern Web Server Solutions",
		excerpt:
			"Leverage scalable, secure, and high-performance web servers to power your business applications and digital experiences.",
	},
	{
		title: "Cloud & Edge Deployment",
		excerpt:
			"Deploy your website and AI agents globally with cloud and edge technologies for ultra-fast response times and reliability.",
	},
	{
		title: "Server Monitoring & Analytics",
		excerpt:
			"Gain real-time insights into your server health, traffic, and performance with advanced monitoring tools and dashboards.",
	},
];

const AIServerSection: React.FC = () => {
	return (
		<div className="relative min-h-screen w-full overflow-hidden py-20 flex items-center justify-center">
			<div className="container mx-auto px-8 flex flex-row items-center gap-16">
				{/* Left: Server Texts */}
				<div className="flex-1 flex flex-col gap-8 max-w-lg">
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
						Website & Server
					</h2>
					{serverTexts.map((item, idx) => (
						<div key={idx} className="mb-6">
							<h3 className="text-2xl font-semibold text-white mb-2">
								{item.title}
							</h3>
							<p className="text-gray-300 text-base">{item.excerpt}</p>
						</div>
					))}
				</div>
				{/* Right: Big Box */}
				<motion.div
					initial={{ opacity: 0, x: 80 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.7 }}
					viewport={{ once: true }}
					className="flex-1 flex items-center justify-center"
				>
					<div className="w-[500px] h-[600px] rounded-2xl bg-gradient-to-br from-black/40 via-black/20 to-transparent backdrop-blur-lg p-8 border border-white/10 shadow-[0_0_15px_rgba(124,58,237,0.08)] flex flex-col items-center justify-center">
						<span className="text-6xl text-white/80 mb-6">🖥️</span>
						<h3 className="text-2xl font-bold text-white mb-2 text-center">
							Featured: Next-Gen Server Tech
						</h3>
						<p className="text-gray-300 text-center text-base mb-4">
							Explore the latest in web server technology, cloud hosting, and how
							to keep your digital infrastructure secure and lightning fast.
						</p>
						<button className="mt-4 px-8 py-3 rounded-lg bg-accent-gold text-black font-bold text-base shadow-md hover:bg-transparent hover:text-accent-gold hover:border-accent-gold border-2 border-transparent transition-all duration-200">
							Learn More
						</button>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default AIServerSection;
