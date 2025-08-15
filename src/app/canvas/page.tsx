"use client";

import React from "react";
import HexagonGrid from "@/components/HexagonGrid";
import Sidebar from "@/components/sidebar/page";
import HomeSidebar from "../dashboard/homeSidebar";

export default function CanvasPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900 flex">
      {/* Hexagon Pattern Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HexagonGrid />
      </div>
      <Sidebar />
      <HomeSidebar selected="canvas" onSelect={() => {}} />
      <main className="ml-56 flex-1 flex flex-col items-center justify-center py-16 px-4 relative z-10">
        <h1 className="text-4xl font-syne bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text mb-8">Canvas Page</h1>
        <div className="w-full max-w-4xl h-[600px] bg-dark-lighter rounded-3xl border border-secondary-cyan/20 flex items-center justify-center">
          <span className="text-gray-400 font-syne text-xl">Your canvas content goes here.</span>
        </div>
      </main>
    </div>
  );
}
