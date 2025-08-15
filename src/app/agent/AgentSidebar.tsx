"use client";

import React, { useState } from "react";
import { IconUser, IconSettings, IconMessage, IconBolt, IconWand } from "@tabler/icons-react";
import Sidebar from "@/components/sidebar/page";

const agentNav = [
	{ name: "Overview", icon: <IconBolt size={22} />, id: "overview" },
	{ name: "My Partner", icon: <IconWand size={22} />, id: "design" },
];

export default function AgentSidebar({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
	// Sidebar always expanded
	return (
		<>
			<Sidebar />
			<aside
				className={"fixed top-0 left-0 h-screen bg-gradient-to-br from-white/5 via-blue-900/10 to-white/0 backdrop-blur-md bg-opacity-10 z-40 flex flex-col py-8 border border-white/20 transition-all duration-300 w-56 px-4"}
				style={{backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 32px 0 rgba(30,64,175,0.08)', backdropFilter: 'blur(8px)', borderRadius: 0}}
			>
				<div className="mb-10 flex items-center gap-3">
					<span className="w-8 h-8 bg-gradient-to-r from-secondary-cyan to-accent-gold rounded-lg flex items-center justify-center text-lg font-sans text-dark transition-all duration-300">
                        
					</span>
					<span style={{ fontFamily: 'sans-serif' }} className="text-white text-xl font-bold transition-all duration-300 opacity-100 ml-2">Agents</span>
				</div>
				<nav className="flex-1">
					<ul className="space-y-2">
						{agentNav.map((item) => (
							<li key={item.id} className="relative group">
								<button
									className={`w-full flex items-center px-2 py-3 rounded-xl transition-all duration-300 font-medium text-sm relative ${selected === item.id ? 'text-accent-gold bg-dark/50' : 'text-gray-300 hover:text-white hover:bg-dark/30'}`}
									onClick={() => onSelect(item.id)}
								>
									<div className="w-6 h-6 flex items-center justify-center transition-transform group-hover:scale-110">{item.icon}</div>
									<span style={{ fontFamily: 'sans-serif' }} className="ml-2 text-xs transition-all duration-300 whitespace-nowrap opacity-100">{item.name}</span>
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
