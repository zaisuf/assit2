"use client";

import React from "react";
import Sidebar from "@/components/sidebar/page";
import HexagonGrid from "@/components/HexagonGrid";

export default function YourAgentPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900 flex">
      {/* Hexagon Pattern Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HexagonGrid />
      </div>
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-4 relative z-10">
        <div className="w-full max-w-2xl rounded-3xl shadow-2xl p-10 flex flex-col border border-white/20 text-white bg-white/5 backdrop-blur-md">
          <h1 className="text-4xl font-bold text-gradient-animated mb-6 text-center font-orbitron">Your Agent</h1>
          <p className="text-lg text-gray-300 font-space text-center mb-8">
            Welcome to your personal AI Agent dashboard. Here you can manage, customize, and interact with your own AI agents.
          </p>
          <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Agent Overview</h2>
              <p className="text-gray-100">See stats, recent activity, and manage your agent&apos;s capabilities.</p>
            </div>
            <div className="bg-gradient-to-r from-pink-400 to-yellow-400 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Customization</h2>
              <p className="text-gray-100">Personalize your agent&apos;s name, avatar, and behavior to fit your needs.</p>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-cyan-500 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Integrations</h2>
              <p className="text-gray-100">Connect your agent to external services and tools for enhanced productivity.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
