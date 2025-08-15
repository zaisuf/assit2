"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Globe, FileText, Database, MessageSquare, Mic, LineChart } from 'lucide-react';

const sidebarLinks = [
  // Store Section
  { href: "/train-modal/store", label: "Store", icon: <Database size={18} className="mr-2" />, section: "store" },
  // Training Tools Section
  { href: "/train-modal/store/site-all-pages", label: "Website Summary", icon: <Globe size={18} className="mr-2" />, section: "training" },
  { href: "/train-modal/text", label: "Text", icon: <FileText size={18} className="mr-2" />, section: "training" },
  // Agent UI Section
  { href: "/agent/ui232-3", label: "Chat Agent UI", icon: <MessageSquare size={18} className="mr-2" />, section: "agents" },
  { href: "/agent/wedgetui1", label: "Voice Agent UI", icon: <Mic size={18} className="mr-2" />, section: "agents" },
];

const CustomSidebar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const uiId = searchParams ? searchParams.get('uiId') : null;
  const router = useRouter();

  return (
    <aside className="fixed top-0 left-0 h-full w-56 bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm border-r border-[#BAFFF5]/20 flex flex-col py-8 z-30 shadow-xl">
      <div className="px-6 mb-8">
        <h2 className="text-xl font-orbitron bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text mb-4">Tools</h2>
      </div>
      <nav className="flex-1 flex flex-col gap-2 px-6">
        {/* Store Section */}
        <div className="mb-4">
          <Link
            href="/train-modal/store"
            className={`py-2 px-3 rounded-lg font-space hover:bg-[#BAFFF5]/10 transition-all flex items-center ${pathname === "/train-modal/store" ? 'bg-[#BAFFF5]/20 text-white font-semibold' : 'text-gray-200'}`}
            prefetch={false}
          >
            <Database size={18} className="mr-2" />
            Store
          </Link>
        </div>
        {/* Divider */}
        <div className="flex items-center gap-2 my-3">
          <div className="flex-1 h-[1px] bg-[#BAFFF5]/10"></div>
          <LineChart size={14} className="text-[#BAFFF5]/30" />
          <div className="flex-1 h-[1px] bg-[#BAFFF5]/10"></div>
        </div>
        {/* Other Links */}
        {sidebarLinks.filter(link => link.section !== "store").map((link, index, arr) => {
          // Make Voice Agent UI link dynamic if on /agent/ui232-3 and uiId exists
          if (link.href === "/agent/wedgetui1" && pathname === "/agent/ui232-3" && uiId) {
            return (
              <React.Fragment key={link.href}>
                {index > 0 && arr[index].section !== arr[index - 1].section && (
                  <div className="flex items-center gap-2 my-3">
                    <div className="flex-1 h-[1px] bg-[#BAFFF5]/10"></div>
                    <LineChart size={14} className="text-[#BAFFF5]/30" />
                    <div className="flex-1 h-[1px] bg-[#BAFFF5]/10"></div>
                  </div>
                )}
                <button
                  onClick={() => router.push(`/agent/wedgetui1?uiId=${uiId}`)}
                  className={"py-2 px-3 rounded-lg font-space hover:bg-[#BAFFF5]/10 transition-all flex items-center text-gray-200"}
                  style={{ textAlign: 'left', width: '100%' }}
                >
                  {link.icon}
                  {link.label}
                </button>
              </React.Fragment>
            );
          }
          // Make Chat Agent UI link dynamic if on /agent/wedgetui1 and uiId exists
          if (link.href === "/agent/ui232-3" && pathname === "/agent/wedgetui1" && uiId) {
            return (
              <React.Fragment key={link.href}>
                {index > 0 && arr[index].section !== arr[index - 1].section && (
                  <div className="flex items-center gap-2 my-3">
                    <div className="flex-1 h-[1px] bg-[#BAFFF5]/10"></div>
                    <LineChart size={14} className="text-[#BAFFF5]/30" />
                    <div className="flex-1 h-[1px] bg-[#BAFFF5]/10"></div>
                  </div>
                )}
                <button
                  onClick={() => router.push(`/agent/ui232-3?uiId=${uiId}`)}
                  className={"py-2 px-3 rounded-lg font-space hover:bg-[#BAFFF5]/10 transition-all flex items-center text-gray-200"}
                  style={{ textAlign: 'left', width: '100%' }}
                >
                  {link.icon}
                  {link.label}
                </button>
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={link.href}>
              {index > 0 && arr[index].section !== arr[index - 1].section && (
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-[1px] bg-[#BAFFF5]/10"></div>
                  <LineChart size={14} className="text-[#BAFFF5]/30" />
                  <div className="flex-1 h-[1px] bg-[#BAFFF5]/10"></div>
                </div>
              )}
              <Link
                href={link.href}
                className={`py-2 px-3 rounded-lg font-space hover:bg-[#BAFFF5]/10 transition-all flex items-center
                  ${pathname === link.href 
                    ? 'bg-[#BAFFF5]/20 text-white font-semibold' 
                    : 'text-gray-200'
                  }`}
                prefetch={false}
              >
                {link.icon}
                {link.label}
              </Link>
            </React.Fragment>
          );
        })}
      </nav>
    </aside>
  );
};

export default CustomSidebar;
