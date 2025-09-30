"use client";

import React from "react";

const FooterSection: React.FC = () => {
  return (
    <footer className="relative min-h-[300px] w-full bg-gradient-to-r from-black via-gray-900 to-blue-950 flex flex-col items-center justify-center py-12 border-t border-white/10">
      <div className="container mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-start gap-2">
          <span className="text-3xl font-bold text-white bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">YourAICompany</span>
          <span className="text-gray-400 text-sm">Empowering your business with smart AI agents</span>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <a href="#" className="text-gray-300 hover:text-accent-gold transition-colors">Home</a>
          <a href="#" className="text-gray-300 hover:text-accent-gold transition-colors">Features</a>
          <a href="#" className="text-gray-300 hover:text-accent-gold transition-colors">Pricing</a>
          <a href="#" className="text-gray-300 hover:text-accent-gold transition-colors">Contact</a>
        </div>
        <div className="flex gap-4 items-center">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.56v14.91c0 .97-.79 1.76-1.76 1.76H1.76A1.76 1.76 0 010 19.47V4.56C0 3.59.79 2.8 1.76 2.8h20.47C23.21 2.8 24 3.59 24 4.56zM7.19 19.47V9.75H3.56v9.72h3.63zm-1.81-11.1c1.16 0 2.1-.94 2.1-2.1a2.1 2.1 0 10-4.2 0c0 1.16.94 2.1 2.1 2.1zm15.62 11.1v-5.4c0-2.89-1.54-4.23-3.6-4.23-1.66 0-2.41.91-2.83 1.55v-1.33h-3.63c.05.88 0 9.72 0 9.72h3.63v-5.43c0-.29.02-.58.11-.79.24-.58.78-1.18 1.69-1.18 1.19 0 1.67.89 1.67 2.19v5.21h3.63z"/></svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.56v14.91c0 .97-.79 1.76-1.76 1.76H1.76A1.76 1.76 0 010 19.47V4.56C0 3.59.79 2.8 1.76 2.8h20.47C23.21 2.8 24 3.59 24 4.56zM7.19 19.47V9.75H3.56v9.72h3.63zm-1.81-11.1c1.16 0 2.1-.94 2.1-2.1a2.1 2.1 0 10-4.2 0c0 1.16.94 2.1 2.1 2.1zm15.62 11.1v-5.4c0-2.89-1.54-4.23-3.6-4.23-1.66 0-2.41.91-2.83 1.55v-1.33h-3.63c.05.88 0 9.72 0 9.72h3.63v-5.43c0-.29.02-.58.11-.79.24-.58.78-1.18 1.69-1.18 1.19 0 1.67.89 1.67 2.19v5.21h3.63z"/></svg>
          </a>
        </div>
      </div>
      <div className="mt-8 text-gray-500 text-xs text-center w-full">&copy; {new Date().getFullYear()} YourAICompany. All rights reserved.</div>
    </footer>
  );
};

export default FooterSection;
