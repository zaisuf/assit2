"use client";

import React, { useState } from "react";
import { IconUser, IconSettings, IconMessage, IconBolt, IconWand } from "@tabler/icons-react";
import Sidebar from "@/components/sidebar/page";

const agentNav = [
	{ name: "Design Assistant", icon: <IconWand size={22} />, id: "design" },
	{ name: "Voice Agent", icon: <IconMessage size={22} />, id: "voice" },
	{ name: "AI Chatbot", icon: <IconUser size={22} />, id: "chatbot" },
	{ name: "Train Modal", icon: <IconBolt size={22} />, id: "trainmodal" },
	{ name: "Settings", icon: <IconSettings size={22} />, id: "settings" },
];

export default function AgentSidebar({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
	const [isExpanded, setIsExpanded] = useState(false);

	const handleMouseEnter = () => setIsExpanded(true);
	const handleMouseLeave = () => setIsExpanded(false);

	return (
		<>
			<Sidebar />
			<aside
				className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl z-40 flex flex-col py-8 border border-white/20 rounded-2xl transition-all duration-300 ${isExpanded ? 'w-56 px-4' : 'w-16 px-2'}`}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{/* Removed logo and homeSidebars text */}
				<nav className="flex-1 mt-2">
					<ul className="space-y-2">
						{agentNav.map((item) => (
							<li key={item.id} className="relative group">
								<button
									className={`w-full flex items-center px-2 py-3 rounded-xl transition-all duration-300 font-medium text-sm relative ${selected === item.id ? 'text-accent-gold bg-dark/50' : 'text-gray-300 hover:text-white hover:bg-dark/30'}`}
									onClick={() => onSelect(item.id)}
								>
									<div className="w-6 h-6 flex items-center justify-center transition-transform group-hover:scale-110">{item.icon}</div>
									<span className={`ml-2 text-xs transition-all duration-300 whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{item.name}</span>
									{/* Selection/hover indicator */}
									{(selected === item.id) && (
										<div className="absolute left-0 top-2 bottom-2 w-1 rounded bg-gradient-to-b from-secondary-cyan to-accent-gold"></div>
									)}
								</button>
							</li>
						))}
					</ul>
				</nav>
			</aside>
		</>
	);
}
