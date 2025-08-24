"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Send, ArrowUpRight, ArrowRight, Paperclip, SendHorizonal, Plus, ChevronDown } from 'lucide-react';

// Response Card Styles (with shape options)
type ResponseCardStyle = {
  name: string;
  className: string;
  bubbleClass: string;
  textClass: string;
  shape: string;
  templateName?: string;
  backgroundColor: string;
  customBackgroundColor: string;
};
const RESPONSE_CARD_STYLES: ResponseCardStyle[] = [
  {
    name: "Classic",
    className: "bg-white/10 border border-white/20 rounded-xl shadow-lg",
    bubbleClass: "",
    textClass: "text-white",
    shape: "rounded-xl",
    backgroundColor: "bg-white/10",
    customBackgroundColor: ""
  },
  {
    name: "Glassmorphism",
    className: "bg-white/10 border border-white/30 rounded-2xl shadow-xl backdrop-blur-md",
    bubbleClass: "",
    textClass: "text-white/90",
    shape: "rounded-2xl",
    backgroundColor: "bg-white/10",
    customBackgroundColor: ""
  },
  {
    name: "Minimal",
    className: "bg-transparent border-none rounded-none shadow-none",
    bubbleClass: "",
    textClass: "text-white/80",
    shape: "rounded-none",
    backgroundColor: "bg-transparent",
    customBackgroundColor: ""
  },
  {
    name: "Bubble",
    className: "bg-emerald-500/20 border border-emerald-500/30 rounded-full shadow-md",
    bubbleClass: "px-6 py-3",
    textClass: "text-emerald-100",
    shape: "rounded-full",
    backgroundColor: "bg-emerald-500/20",
    customBackgroundColor: ""
  },
  {
    name: "Card",
    className: "bg-gradient-to-br from-emerald-900 via-cyan-900 to-blue-900 border border-cyan-400/30 rounded-2xl shadow-2xl",
    bubbleClass: "px-6 py-4",
    textClass: "text-cyan-100",
    shape: "rounded-2xl",
    backgroundColor: "bg-gradient-to-br from-emerald-900 via-cyan-900 to-blue-900",
    customBackgroundColor: ""
  },
  {
    name: "Outline",
    className: "bg-transparent border-2 border-emerald-400 rounded-xl",
    bubbleClass: "",
    textClass: "text-emerald-400",
    shape: "rounded-xl",
    backgroundColor: "bg-transparent",
    customBackgroundColor: ""
  },
  {
    name: "Shadowed",
    className: "bg-white/10 border border-white/20 rounded-xl shadow-2xl",
    bubbleClass: "",
    textClass: "text-white/90",
    shape: "rounded-xl",
    backgroundColor: "bg-white/10",
    customBackgroundColor: ""
  },
  {
    name: "Elevated",
    className: "bg-white/20 border border-white/30 rounded-xl shadow-lg scale-105",
    bubbleClass: "",
    textClass: "text-white/90",
    shape: "rounded-xl",
    backgroundColor: "bg-white/20",
    customBackgroundColor: ""
  },
  {
    name: "Gradient",
    className: "bg-gradient-to-r from-emerald-400 to-cyan-400 border-none rounded-xl",
    bubbleClass: "",
    textClass: "text-white",
    shape: "rounded-xl",
    backgroundColor: "bg-gradient-to-r from-emerald-400 to-cyan-400",
    customBackgroundColor: ""
  },
  {
    name: "Neumorphism",
    className: "bg-[#1a2a2a] border border-[#223] rounded-[30px] shadow-[8px_8px_16px_#0e1a1a,_-8px_-8px_16px_#223]",
    bubbleClass: "",
    textClass: "text-emerald-200",
    shape: "rounded-[30px]",
    backgroundColor: "bg-[#1a2a2a]",
    customBackgroundColor: ""
  },
  {
    name: "Squircle",
    className: "bg-gradient-to-br from-emerald-900 to-cyan-900 border border-cyan-400/30 [border-radius:30%] shadow-xl",
    bubbleClass: "px-6 py-4",
    textClass: "text-cyan-100",
    shape: "[border-radius:30%]",
    backgroundColor: "bg-gradient-to-br from-emerald-900 to-cyan-900",
    customBackgroundColor: ""
  },
  {
    name: "Square",
    className: "bg-white/10 border border-white/20 rounded-none shadow-lg",
    bubbleClass: "",
    textClass: "text-white",
    shape: "rounded-none",
    backgroundColor: "bg-white/10",
    customBackgroundColor: ""
  },
];
// Loading animation components
type LoadingAnimationProps = {
  color?: string;
};
type LoadingAnimationName = 'Blue Dots' | 'Typing' | 'Wave';
const LoadingAnimations: Record<LoadingAnimationName, React.FC<LoadingAnimationProps>> = {
  'Blue Dots': ({ color = '#10b981' }) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-gray-700 mb-1">Loading...</span>
      <div className="flex gap-1 items-center mt-1">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color, animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color, animationDelay: '300ms' }}></span>
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color, animationDelay: '600ms' }}></span>
      </div>
    </div>
  ),
  'Typing': ({ color = '#10b981' }) => (
    <div className="flex gap-1 items-center mt-1">
      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: color, animationDelay: '0ms' }}></span>
      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: color, animationDelay: '200ms' }}></span>
      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: color, animationDelay: '400ms' }}></span>
    </div>
  ),
  'Wave': ({ color = '#10b981' }) => (
    <div className="flex gap-1 items-center mt-1">
      {[0,1,2,3,4].map(i => (
        <span key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: color, animationDelay: `${i*120}ms` }}></span>
      ))}
    </div>
  ),
};
// Add getTextStyleClass helper
function getTextStyleClass(style: string) {
  switch (style) {
    case "Bold":
      return "font-bold";
    case "Italic":
      return "italic";
    case "Underline":
      return "underline";
    case "Strikethrough":
      return "line-through";
    case "Monospace":
      return "font-mono";
    case "Serif":
      return "font-serif";
    case "Sans-serif":
      return "font-sans";
    case "Uppercase":
      return "uppercase";
    case "Lowercase":
      return "lowercase";
    case "Capitalize":
      return "capitalize";
    case "Shadow":
      return "drop-shadow-md";
    case "Outline":
      return "outline outline-2 outline-white";
    case "Gradient":
      return "bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent";
    case "Highlight":
      return "bg-yellow-200 text-black px-1 rounded";
    case "Small Caps":
      return "[font-variant:small-caps]";
    default:
      return "";
  }
}

// Define constants for button and icon styles
const SEND_BUTTON_STYLES = [
  'Emerald Solid',
  'Outline',
  'Gradient',
  'Minimal',
  'Glass'
] as const;

// New Chat Icon Styles
const NEW_CHAT_ICONS = [
  { name: "New", icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>) },
  { name: "Chat", icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m4-4H8"/></svg>) },
  { name: "Conversation", icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8m4-4H8"/></svg>) },
  { name: "Triangle", icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12,2 22,22 2,22"/><path d="M12 8v8m4-4H8"/></svg>) },
  { name: "Circle", icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12,2 22,22 2,22"/><circle cx="12" cy="12" r="4"/></svg>) },
  { name: "Square", icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="3"/><path d="M12 8v8"/></svg>) },
  { name: "Ellipse", icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="6"/><path d="M12 8v8"/></svg>) },
  { name: "Rounded Square", icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8"/><path d="M12 8v8"/></svg>) },
  { name: "Diamond", icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="2,12 12,2 22,12 12,22"/><path d="M12 8v8"/></svg>) },
  { name: "Gray Square", icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M12 8v8"/></svg>) },
  { name: "Conversation Square", icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><rect x="8" y="8" width="8" height="8" rx="2"/></svg>) },
  { name: "Black Triangle", icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12,2 22,22 2,22"/><circle cx="12" cy="12" r="3"/></svg>) },
];

// Down Arrow Icon Styles (12 variants)
const DOWN_ARROW_ICONS = [
  {
    name: 'Classic',
    icon: (
      <svg width={32} height={32} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Chevron',
    icon: (
      <svg width={32} height={32} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="6 8 10 12 14 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Double',
    icon: (
      <svg width={32} height={32} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 8l3 3 3-3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 12l3 3 3-3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Circle',
    icon: (
      <svg width={32} height={32} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Filled',
    icon: (
      <svg width={32} height={32} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 8l5 5 5-5" />
      </svg>
    )
  },
  {
    name: 'Thin',
    icon: (
      <svg width={32} height={32} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Bold',
    icon: (
      <svg width={32} height={32} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Arrowhead',
    icon: (
      <svg width={32} height={32} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="10,15 5,8 15,8" fill="currentColor" />
      </svg>
    )
  },
  {
    name: 'Minimal',
    icon: (
      <svg width={32} height={32} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="8" x2="10" y2="14" stroke="currentColor" strokeWidth="2.2" />
        <polyline points="6 12 10 16 14 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Square',
    icon: (
      <svg width={32} height={32} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Dashed',
    icon: (
      <svg width={32} height={32} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2.2" strokeDasharray="4 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Shadow',
    icon: (
      <svg width={32} height={32} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#shadow)" />
        <defs>
          <filter id="shadow" x="0" y="0" width="20" height="20">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>
      </svg>
    )
  }
];

const SEND_ICONS = [
  'Send (Default)',
  'Arrow Up Right',
  'Arrow Right',
  'Paperclip',
  'Send Horizontal'
] as const;

export default function RenderChat({ designId }: { designId: string }) {
  // List of all possible Tailwind background classes used in config
  const tailwindBgClasses = [
    'bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900',
    'bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-800',
    'bg-gradient-to-r from-purple-900 via-fuchsia-800 to-pink-900',
    'bg-gradient-to-r from-orange-900 via-yellow-800 to-amber-900',
    'bg-gradient-to-r from-gray-900 via-slate-800 to-gray-700',
    'bg-gradient-to-r from-green-900 via-lime-800 to-emerald-800',
    'bg-gradient-to-r from-red-900 via-rose-800 to-pink-900',
    'bg-gradient-to-r from-teal-900 via-cyan-800 to-blue-900',
    'bg-gradient-to-r from-indigo-900 via-blue-900 to-violet-900',
    'bg-gradient-to-r from-pink-900 via-fuchsia-800 to-rose-900',
    // Add any other classes you use in config
  ];
  // Helper to get response card style class from RESPONSE_CARD_STYLES
  function getResponseCardStyleClass(configStyle: any) {
    if (!configStyle) return '';
    if (typeof configStyle === 'string') {
      const found = RESPONSE_CARD_STYLES.find(s => s.name === configStyle);
      return found ? found.className : '';
    }
    if (typeof configStyle === 'object') {
      if (configStyle.className) return configStyle.className;
      if (configStyle.name) {
        const found = RESPONSE_CARD_STYLES.find(s => s.name === configStyle.name);
        return found ? found.className : '';
      }
    }
    return '';
  }

  // Helper to get response card background color from RESPONSE_CARD_STYLES
  function getResponseCardBgColor(configStyle: any) {
    if (!configStyle) return undefined;
    if (typeof configStyle === 'object') {
      if (configStyle.customBackgroundColor) return configStyle.customBackgroundColor;
      if (configStyle.backgroundColor) return configStyle.backgroundColor;
      if (configStyle.name) {
        const found = RESPONSE_CARD_STYLES.find(s => s.name === configStyle.name);
        return found ? found.backgroundColor : undefined;
      }
    }
    if (typeof configStyle === 'string') {
      const found = RESPONSE_CARD_STYLES.find(s => s.name === configStyle);
      return found ? found.backgroundColor : undefined;
    }
    return undefined;
  }

  // Helper to get response card style and background color from config

  // Map named input bar styles to Tailwind classes
  const inputBarStyleMap: Record<string, string> = {
    'Classic': 'rounded-lg border border-white/10 bg-white/10',
    'Modern': 'rounded-full border-2 border-emerald-400 bg-white/5',
    'Squircle': '[border-radius:30%] border border-cyan-400 bg-white/10',
    'Minimal': 'rounded-none border-b-2 border-emerald-400 bg-transparent',
    'Shadowed': 'rounded-xl shadow-lg border-none bg-white/10',
    'Glass': 'backdrop-blur-sm bg-white/10 border border-white/20',
    'Clean': 'bg-white/5 border-none',
    'Solid': 'bg-gray-800 border-none',
  };
    // Map named send button styles to Tailwind classes
    const sendButtonStyleMap: Record<string, string> = {
      'Emerald Solid': 'bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow',
      'Outline': 'border-2 border-emerald-400 text-emerald-400 bg-transparent rounded-lg hover:bg-emerald-400/10',
      'Gradient': 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-white rounded-full shadow-lg',
      'Minimal': 'bg-transparent text-white border-none rounded-none hover:bg-white/10',
      'Glass': 'bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl hover:bg-white/20',
    };
  // Fetch chatBotBox config from API (like RenderUiDesign)
  const [config, setConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setLoadingConfig(true);
      try {
        const res = await fetch(`/api/get-chatui?designId=${designId}`);
        const data = await res.json();
        setConfig(data.config || null);
        // Debug logs for response card style and colors
        console.log('Chat config loaded:', {
          config: data.config,
          selectedResponseCardStyle: data.config?.selectedResponseCardStyle,
          responseCardBackgroundColor: data.config?.responseCardBackgroundColor,
          responseCardCustomBackgroundColor: data.config?.responseCardCustomBackgroundColor,
          selectedFooterColor: data.config?.selectedFooterColor,
          customFooterColor: data.config?.customFooterColor,
          footerStyle: data.config?.selectedFooterStyle
        });
      } catch (err) {
        setConfig(null);
      } finally {
        setLoadingConfig(false);
      }
    };
    if (designId) fetchConfig();
  }, [designId]);

  // Helper to get animation component by name from LOADING_ANIMATIONS
  const LOADING_ANIMATIONS = [
    {
      name: "Blue Dots",
      component: LoadingAnimations['Blue Dots'],
    },
    {
      name: "Typing",
      component: LoadingAnimations['Typing'],
    },
    {
      name: "Wave",
      component: LoadingAnimations['Wave'],
    },
    {
      name: "Spinner",
      component: ({ color = '#10b981' }) => (
        <div className="w-7 h-7 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${color} transparent transparent ${color}` }}></div>
      ),
    },
    {
      name: "Three Dots",
      component: ({ color = '#10b981' }) => (
        <div className="flex space-x-1">
          <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ background: color }}></span>
          <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ background: color }}></span>
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: color }}></span>
        </div>
      ),
    },
    {
      name: "Pulse",
      component: ({ color = '#10b981' }) => (
        <div className="w-5 h-5 rounded-full animate-pulse" style={{ background: color }}></div>
      ),
    },
    {
      name: "Bar",
      component: ({ color = '#10b981' }) => (
        <div className="flex space-x-1 h-4 items-end">
          <div className="w-1 h-2 animate-[bar1_1s_infinite]" style={{ background: color, animationDelay: '0s' }}></div>
          <div className="w-1 h-3 animate-[bar2_1s_infinite]" style={{ background: color, animationDelay: '0.2s' }}></div>
          <div className="w-1 h-4 animate-[bar3_1s_infinite]" style={{ background: color, animationDelay: '0.4s' }}></div>
          <style>{`@keyframes bar1{0%,100%{height:0.5rem}50%{height:1rem}}@keyframes bar2{0%,100%{height:0.75rem}50%{height:1.5rem}}@keyframes bar3{0%,100%{height:1rem}50%{height:2rem}}`}</style>
        </div>
      ),
    },
    {
      name: "Ellipsis",
      component: ({ color = '#10b981' }) => (
        <div className="flex space-x-1">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }}></span>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color, animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color, animationDelay: '0.4s' }}></span>
        </div>
      ),
    },
    {
      name: "Circle Scale",
      component: ({ color = '#10b981' }) => (
        <div className="flex space-x-2">
          <span className="w-3 h-3 rounded-full animate-pulse" style={{ background: color, animationDelay: "0s" }}></span>
          <span className="w-3 h-3 rounded-full animate-pulse" style={{ background: color, animationDelay: "0.2s" }}></span>
          <span className="w-3 h-3 rounded-full animate-pulse" style={{ background: color, animationDelay: "0.4s" }}></span>
        </div>
      ),
    },
    {
      name: "Growing Bar",
      component: ({ color = '#10b981' }) => (
        <div className="w-16 h-2 rounded animate-pulse" style={{ background: color }}></div>
      ),
    },
    {
      name: "Rotating Square",
      component: ({ color = '#10b981' }) => (
        <div className="w-6 h-6 border-4 border-t-transparent border-b-transparent animate-spin rounded" 
             style={{ borderColor: `${color} transparent transparent ${color}` }}></div>
      ),
    },
    {
      name: "Zigzag",
      component: ({ color = '#10b981' }) => (
        <div className="flex space-x-1">
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: color, animationDelay: '0s' }}></span>
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: color, animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: color, animationDelay: '0.4s' }}></span>
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: color, animationDelay: '0.6s' }}></span>
        </div>
      ),
    },
    {
      name: "Fade In Out",
      component: ({ color = '#10b981' }) => (
        <div className="flex space-x-1">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color, animationDelay: '0s' }}></span>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color, animationDelay: '0.3s' }}></span>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color, animationDelay: '0.6s' }}></span>
        </div>
      ),
    },
  ];

  function getLoadingAnimationComponent(name: string) {
    if (!name) return LOADING_ANIMATIONS[0].component;
    const normalized = name.toString().trim().toLowerCase().replace(/\s+/g, ' ');
    const found = LOADING_ANIMATIONS.find((anim: { name: string; component: React.FC }) => anim.name.trim().toLowerCase() === normalized);
    return found ? found.component : LOADING_ANIMATIONS[0].component;
  }
  // Removed auto-scroll behavior

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userMessage = inputText;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/botmodal-responce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          designId: designId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: "assistant", content: "I apologize, but I'm having trouble responding right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingConfig) return <div className="text-white text-xl p-12">Loading...</div>;
  if (!config) return <div className="text-white text-xl p-12">Chatbot config not found.</div>;

  // Debug log to check the shape value
  console.log('RenderChat config shape:', {
    selectedUiShape: config?.selectedUiShape,
    allConfig: config
  });

  // Use config for UI (match Firestore keys and use all relevant style fields)
  // Prioritize customBgColor if present
  let bgValue = config?.customBgColor || config?.selectedBgColor;
  let isTailwindBg = false;
  if (typeof bgValue === 'string') {
    // If it's a gradient stop, prepend bg-gradient-to-r
    if (/^(from-|via-|to-)/.test(bgValue)) {
      bgValue = `bg-gradient-to-r ${bgValue}`;
      isTailwindBg = true;
    } else if (/bg-|from-|to-|via-/.test(bgValue)) {
      // Already a full Tailwind class
      isTailwindBg = true;
    } else if (/^#|^rgb|^hsl|^rgba|^hsla/.test(bgValue) || /^[a-zA-Z]+$/.test(bgValue)) {
      // Solid color (hex, rgb, hsl, or named color)
      isTailwindBg = false;
    }
  }
  // UI shape is handled directly in the className
  const boxShadow = config?.boxShadow || '0 2px 24px rgba(0,0,0,0.10)';
  // Always use customHeaderColor if present, else fallback to selectedHeaderColor
  const headerBg = config?.customHeaderColor !== undefined && config?.customHeaderColor !== ''
    ? config.customHeaderColor
    : (config?.selectedHeaderColor || '#2563eb');
  const headerText = config?.assistantBotText || 'Chatbot';
  const headerLogo = config?.customHeaderLogo || '';
  
  // Handle footer background with proper precedence
  let footerBg;
  let isTailwindFooter = false;

  if (config?.selectedFooterColor === 'custom' && config?.customFooterColor) {
    // If selected type is custom and we have a custom color, use it
    footerBg = config.customFooterColor;
  } else if (config?.selectedFooterColor && config?.selectedFooterColor !== 'custom') {
    // Check if selected color is a Tailwind class
    if (/^(bg-|from-|via-|to-)/.test(config.selectedFooterColor)) {
      isTailwindFooter = true;
      // If it's a gradient component, make sure it has the full gradient class
      footerBg = /^(from-|via-|to-)/.test(config.selectedFooterColor) 
        ? `bg-gradient-to-r ${config.selectedFooterColor}`
        : config.selectedFooterColor;
    } else {
      footerBg = config.selectedFooterColor;
    }
  } else {
    // Fallback to default
    footerBg = '#f3f4f6';
  }
  
  console.log('Computed footerBg:', {
    selectedFooterColor: config?.selectedFooterColor,
    customFooterColor: config?.customFooterColor,
    isTailwindFooter,
    finalFooterBg: footerBg
  });
  
  const footerRadius = config?.selectedFooterStyle || 10;
  // Handle input bar color with proper precedence
  let inputBarColor: string = '#ffffff';  // Set a default color
  if (config?.selectedInputBarColor === 'custom' && config?.customInputBarColor) {
    // If selected type is custom and we have a custom color, use it
    inputBarColor = config.customInputBarColor;
  } else if (config?.selectedInputBarColor) {
    // Use the selected color directly
    inputBarColor = config.selectedInputBarColor;
  } else {
    // Fallback to default
    inputBarColor = '#2563eb';
  }
  console.log('Computed inputBarColor:', {
    selectedInputBarColor: config?.selectedInputBarColor,
    customInputBarColor: config?.customInputBarColor,
    finalInputBarColor: inputBarColor,
    isTailwind: /^(bg-|from-|via-|to-)/.test(inputBarColor)
  });

  // Handle input bar style with proper logging
  const selectedStyle = config?.selectedInputBarStyle?.name || config?.selectedInputBarStyle;
  console.log('Input Bar Style:', {
    rawStyle: config?.selectedInputBarStyle,
    selectedStyle,
    mappedClass: inputBarStyleMap[selectedStyle]
  });

  const inputBarRadius = (() => {
    switch(selectedStyle) {
      case 'Classic': return 10;
      case 'Modern': return 20;
      case 'Squircle': return 30;
      case 'Minimal': return 0;
      case 'Shadowed': return 12;
      case 'Glass': return 8;
      case 'Clean': return 6;
      case 'Solid': return 8;
      default: return 10;
    }
  })();

  const inputBarPlaceholder = config?.inputPlaceholder || 'Type your message...';
  const titleColor = config?.selectedTextColor === 'custom' ? (config?.customTextColor || '#fff') : '#fff';

  // Debug logging for text style configuration
  console.log('Text Style Config:', {
    rawTextStyle: config?.selectedTextStyle,
    customTextStyle: config?.customTextStyle,
    selectedTextColor: config?.selectedTextColor,
    customTextColor: config?.customTextColor
  });

  // Handle close button click
  const handleClose = () => {
    window.parent.postMessage({
      source: 'assistlore-chat',
      action: 'closeChat'
    }, '*');
  };

  // Always use Tailwind class for text style
  // Use getTextStyleClass to map selectedTextStyle to Tailwind class
  const textStyleClass = (() => {
    let styleValue = '';
    let rawStyle = config?.selectedTextStyle;
    
    // Handle different types of text style values
    if (typeof rawStyle === 'string') {
      styleValue = rawStyle;
    } else if (rawStyle?.name) {
      styleValue = rawStyle.name;
    } else if (config?.customTextStyle) {
      styleValue = config.customTextStyle;
    }
    
    console.log('Raw Text Style:', rawStyle);
    console.log('Text Style Value:', styleValue);
    
    // Get mapped Tailwind class
    const mapped = getTextStyleClass(styleValue);
    console.log('Mapped Text Style:', mapped);
    
    // Return combination of mapped class and raw style
    return `${mapped || ''} ${styleValue || ''} ${rawStyle || ''}`.trim() || 'font-semibold';
  })();
  
  // Send button style logic
  let sendButtonClass = '';
  let sendButtonStyle: React.CSSProperties = {};
  if (config?.selectedSendButtonStyle && sendButtonStyleMap[config.selectedSendButtonStyle]) {
    sendButtonClass = sendButtonStyleMap[config.selectedSendButtonStyle];
  } else if (typeof config?.selectedSendButtonStyle === 'string') {
    sendButtonClass = config.selectedSendButtonStyle;
  }
  // Custom color override
  if (config?.customSendButtonColor) {
    sendButtonStyle.background = config.customSendButtonColor;
    sendButtonStyle.color = '#fff';
  }

  // Map send icons based on SEND_ICONS array from ui232-3/page.tsx
  const iconComponents = {
    'Send (Default)': Send,
    'Arrow Up Right': ArrowUpRight,
    'Arrow Right': ArrowRight,
    'Paperclip': Paperclip,
    'Send Horizontal': SendHorizonal
  } as const;

  // Send icon logic with proper mapping to match ui232-3/page.tsx SEND_ICONS
  let SendIcon: React.ReactNode = <Send size={20} />; // Default icon
  
  if (config?.selectedSendIcon) {
    console.log('Selected icon from Firebase:', config.selectedSendIcon); // Debug log
    
    let iconName = typeof config.selectedSendIcon === 'object' 
      ? config.selectedSendIcon.name || 'Send (Default)'
      : config.selectedSendIcon;
    
    console.log('Processing icon name:', iconName); // Debug log
    
    // Get the icon component using type-safe switch statement
    switch(iconName) {
      case 'Send (Default)':
        SendIcon = <Send size={20} />;
        break;
      case 'Arrow Up Right':
        SendIcon = <ArrowUpRight size={20} />;
        break;
      case 'Arrow Right':
        SendIcon = <ArrowRight size={20} />;
        break;
      case 'Paperclip':
        SendIcon = <Paperclip size={20} />;
        break;
      case 'Send Horizontal':
        SendIcon = <SendHorizonal size={20} />;
        break;
      default:
        SendIcon = <Send size={20} />;
    }
  }

  return (
    <>
      {/* Down Arrow Button */}
      <button 
        className="absolute left-2 top-10 p-1.5 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors duration-200 scale-90"
        onClick={handleClose}
        title="Close chat"
      >
        {config?.downArrowIconStyle ? 
          React.cloneElement(
            DOWN_ARROW_ICONS.find(i => i.name === config.downArrowIconStyle)?.icon || 
            DOWN_ARROW_ICONS[0].icon,
            { style: { color: titleColor } }
          )
          : DOWN_ARROW_ICONS[0].icon
        }
      </button>

      {/* Hidden div to ensure Tailwind generates all possible background classes */}
      <div className="hidden">
        {tailwindBgClasses.map(cls => <div key={cls} className={cls} />)}
      </div>
      <div
        className={`${isTailwindBg ? bgValue : ''} flex flex-col border border-gray-200 overflow-hidden !${config?.selectedUiShape || 'rounded-xl'}`}
        style={{
          ...(isTailwindBg ? {} : (bgValue ? { background: bgValue } : {})),
          width: config?.chatbotBoxWidth ? `${config.chatbotBoxWidth}px` : '420px',
          height: config?.chatbotBoxHeight ? `${config.chatbotBoxHeight}px` : '520px',
          maxWidth: '100%',
          boxShadow,
          // Move box up if height is 620
          margin: config?.chatbotBoxHeight === 620 ? '5px 16px 40px auto' : (isTailwindBg ? '40px 16px 40px auto' : '40px 20px 40px auto'),
        }}
      >
        {/* Header */}
        <div
          className={`py-0.5 px-2 border-b border-white/10 flex items-center justify-between ${config.selectedHeaderStyle || ''} ${config.selectedHeaderColor || ''}`}
          style={config.customHeaderColor ? { background: config.customHeaderColor } : {}}
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 p-0.5 bg-black/30 backdrop-blur flex items-center justify-center rounded-full overflow-hidden">
              {config?.assistantBotLogo ? (
                <Image 
                  src={config.assistantBotLogo}
                  alt={headerText}
                  width={32}
                  height={32}
                  className="w-full h-full rounded-full object-cover"
                  unoptimized={typeof config.assistantBotLogo === 'string' && config.assistantBotLogo.startsWith('http')}
                />
              ) : config?.customHeaderLogo ? (
                <Image 
                  src={config.customHeaderLogo}
                  alt={headerText}
                  width={32}
                  height={32}
                  className="w-full h-full rounded-full object-cover"
                  unoptimized={typeof config.customHeaderLogo === 'string' && config.customHeaderLogo.startsWith('http')}
                />
              ) : (
                <span className="text-white text-xs">AI</span>
              )}
            </div>
            <span 
              className={`${config.selectedTextStyle ? getTextStyleClass(config.selectedTextStyle) : ''}`}
              style={{ 
                color: titleColor, 
                fontSize: 14,
                fontWeight: config.selectedTextStyle === "Bold" ? "bold" : "normal",
                textTransform: config.selectedTextStyle === "Uppercase" ? "uppercase" : "none"
              }}
            >{headerText}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="New chat"
            >
              {config?.newChatIconStyle ? 
                React.cloneElement(
                  NEW_CHAT_ICONS.find(i => i.name === config.newChatIconStyle)?.icon || 
                  <Plus size={20} />,
                  { style: { color: titleColor } }
                )
              : <Plus size={20} color={titleColor} />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          padding: '24px',
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          msOverflowStyle: 'none',
          scrollbarWidth: 'thin',
        }}>
          {isLoading && (
            <div className="flex items-center gap-3 p-3 pl-0" style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
              <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur flex items-center justify-center">
                {config?.assistantBotLogo ? (
                  <Image src={config.assistantBotLogo} alt={headerText} width={24} height={24} className="w-6 h-6 object-contain" unoptimized={typeof config.assistantBotLogo === 'string' && config.assistantBotLogo.startsWith('http')} />
                ) : config?.customHeaderLogo ? (
                  <Image src={config.customHeaderLogo} alt={headerText} width={24} height={24} className="w-6 h-6 object-contain" unoptimized={typeof config.customHeaderLogo === 'string' && config.customHeaderLogo.startsWith('http')} />
                ) : (
                  <span className="text-white text-sm">AI</span>
                )}
              </div>
              {/* Dynamically render selected loading animation from Firebase config */}
              {(() => {
                const rawAnim = config?.selectedLoadingAnimation?.name || config?.selectedLoadingAnimation || '';
                console.log('Selected Loading Animation from Firebase:', rawAnim);
                const AnimationComp = getLoadingAnimationComponent(rawAnim);
                // Use custom loading color if set, otherwise use selected color, with fallback
                const loadingColor = config?.customLoadingColor || config?.selectedLoadingColor || '#10b981';
                console.log('Loading Animation Color:', loadingColor);
                return <AnimationComp color={loadingColor} />;
              })()}
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`
                ${config?.selectedResponseCardStyle ? getResponseCardStyleClass(config.selectedResponseCardStyle) : ''}
                ${config?.selectedTextStyle ? getTextStyleClass(config.selectedTextStyle) : ''}
              `.trim()}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                ...(msg.role === 'user'
                  ? {
                      // For user messages, use the same style system as assistant messages
                      background: (() => {
                        // First try the user-specific colors
                        if (config?.userQueryCardCustomColor) {
                          return config.userQueryCardCustomColor;
                        }
                        if (config?.userQueryCardBackgroundColor) {
                          return config.userQueryCardBackgroundColor;
                        }
                        
                        // Then use the response card style system
                        if (config?.selectedResponseCardStyle) {
                          const style = config.selectedResponseCardStyle;
                          if (typeof style === 'object') {
                            if (style.customBackgroundColor) {
                              return style.customBackgroundColor;
                            }
                            if (style.backgroundColor) {
                              return style.backgroundColor;
                            }
                            if (style.name) {
                              const found = RESPONSE_CARD_STYLES.find(s => s.name === style.name);
                              if (found?.backgroundColor) return found.backgroundColor;
                            }
                          } else if (typeof style === 'string') {
                            const found = RESPONSE_CARD_STYLES.find(s => s.name === style);
                            if (found?.backgroundColor) return found.backgroundColor;
                          }
                        }
                        
                        // Fallback to input bar color or default
                        return inputBarColor || 'bg-white/10';
                      })(),
                      // Apply text color based on Firebase config
                      color: (() => {
                        // First check for custom text color
                        if (config?.selectedTextColor === 'custom' && config?.customTextColor) {
                          return config.customTextColor;
                        }
                        // Then check for selected text color class
                        if (config?.selectedTextColor) {
                          if (typeof config.selectedTextColor === 'string') {
                            // Handle Tailwind text color classes
                            if (config.selectedTextColor.startsWith('text-')) {
                              return `var(--${config.selectedTextColor.substring(5)})`;
                            }
                            return config.selectedTextColor;
                          }
                        }
                        // Then check response card style's text class
                        if (config?.selectedResponseCardStyle) {
                          const style = config.selectedResponseCardStyle;
                          if (typeof style === 'object' && style.textClass) {
                            if (style.textClass.startsWith('text-')) {
                              return `var(--${style.textClass.substring(5)})`;
                            }
                          }
                        }
                        // Default fallback
                        return '#fff';
                      })(),
                    }
                  : {
                      // Priority: custom background > selected style background > fallback
                      background: (() => {
                        console.log('Response Card Background Config:', {
                          customBg: config?.responseCardCustomBackgroundColor,
                          selectedStyle: config?.selectedResponseCardStyle,
                          backgroundFromStyle: typeof config?.selectedResponseCardStyle === 'object' 
                            ? config.selectedResponseCardStyle.backgroundColor 
                            : undefined
                        });

                        // First priority: Custom background color from Firebase
                        if (config?.responseCardCustomBackgroundColor) {
                          return config.responseCardCustomBackgroundColor;
                        }
                        
                        // Second priority: Selected style's background
                        if (config?.selectedResponseCardStyle) {
                          const style = config.selectedResponseCardStyle;
                          
                          // Handle object style
                          if (typeof style === 'object') {
                            if (style.backgroundColor) {
                              // If style has a direct backgroundColor, use it
                              return style.backgroundColor;
                            } else if (style.name) {
                              // Look up the style in RESPONSE_CARD_STYLES by name
                              const found = RESPONSE_CARD_STYLES.find(s => s.name === style.name);
                              if (found?.backgroundColor) return found.backgroundColor;
                            }
                          } 
                          // Handle string style name
                          else if (typeof style === 'string') {
                            const found = RESPONSE_CARD_STYLES.find(s => s.name === style);
                            if (found?.backgroundColor) return found.backgroundColor;
                            
                            // Special case for Glassmorphism
                            if (style === 'Glassmorphism') {
                              return 'rgba(255,255,255,0.1)';
                            }
                          }
                        }
                        
                        // Default fallback
                        return '#fff';
                      })(),
                      // Apply text color based on Firebase config for assistant messages
                      color: (() => {
                        // First check for custom text color
                        if (config?.selectedTextColor === 'custom' && config?.customTextColor) {
                          return config.customTextColor;
                        }
                        // Then check for selected text color class
                        if (config?.selectedTextColor) {
                          if (typeof config.selectedTextColor === 'string') {
                            // Handle Tailwind text color classes
                            if (config.selectedTextColor.startsWith('text-')) {
                              return `var(--${config.selectedTextColor.substring(5)})`;
                            }
                            return config.selectedTextColor;
                          }
                        }
                        // Then check response card style's text class
                        if (config?.selectedResponseCardStyle) {
                          const style = config.selectedResponseCardStyle;
                          if (typeof style === 'object' && style.textClass) {
                            if (style.textClass.startsWith('text-')) {
                              return `var(--${style.textClass.substring(5)})`;
                            }
                            return style.textClass;
                          }
                        }
                        // Default fallback
                        return '#222';
                      })(),
                    }),
                padding: '12px 16px',
                maxWidth: '80%',
                fontSize: 14,
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                ...(!getResponseCardStyleClass(config?.selectedResponseCardStyle) && {
                  borderRadius: '12px', // Fixed border radius for input area
                  boxShadow: msg.role === 'assistant' ? '0 1px 6px rgba(0,0,0,0.04)' : undefined,
                }),
              }}
            >
              {msg.role === 'assistant' && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 rounded-full bg-black/30 backdrop-blur flex items-center justify-center overflow-hidden ml-[-6px] mt-1">
                      {config?.assistantBotLogo ? (
                        <Image
                          src={config.assistantBotLogo}
                          alt={headerText}
                          width={10}
                          height={10}
                          className="w-2.5 h-2.5 object-cover"
                          unoptimized={typeof config.assistantBotLogo === 'string' && config.assistantBotLogo.startsWith('http')}
                        />
                      ) : config?.customHeaderLogo ? (
                        <Image
                          src={config.customHeaderLogo}
                          alt={headerText}
                          width={10}
                          height={10}
                          className="w-2.5 h-2.5 object-cover"
                          unoptimized={typeof config.customHeaderLogo === 'string' && config.customHeaderLogo.startsWith('http')}
                        />
                      ) : (
                        <span className="text-white text-xs">AI</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="message-content">{msg.content}</div>
                  </div>
                </div>
              )}
              {msg.role === 'user' && msg.content}
            </div>
          ))}
        </div>
        {/* Footer/Input */}
        <div
          className={`p-1 flex items-center gap-1.5 border-t border-white/10 ${config.selectedFooterStyle || ''} ${isTailwindFooter ? footerBg : ''}`}
          style={{
            ...(!isTailwindFooter ? { background: footerBg } : {}),
            borderRadius: `${footerRadius}px`
          }}
        >
          <input
            type="text"
            className={`flex-1 px-2.5 py-1 text-white outline-none ${
              inputBarStyleMap[selectedStyle] || 
              (typeof selectedStyle === 'string' ? selectedStyle : '')
            } ${
              config?.selectedInputBarColor && /^(bg-|from-|via-|to-)/.test(config.selectedInputBarColor) 
                ? (/^(from-|via-|to-)/.test(config.selectedInputBarColor) 
                  ? `bg-gradient-to-r ${config.selectedInputBarColor}` 
                  : config.selectedInputBarColor)
                : ''
            } ${config.selectedTextStyle ? getTextStyleClass(config.selectedTextStyle) : ''}`}
            style={{
              background: 
                config?.selectedInputBarColor === 'custom' && config?.customInputBarColor
                  ? config.customInputBarColor
                  : !(/^(bg-|from-|via-|to-)/.test(config?.selectedInputBarColor || ''))
                    ? (config?.selectedInputBarColor || inputBarColor)
                    : undefined,
              borderRadius: `${inputBarRadius}px`
            }}
            placeholder={config.inputPlaceholder || 'Type here...'}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
          <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className={sendButtonClass || ''}
              style={{
                background: sendButtonStyle.background ?? inputBarColor,
                color: sendButtonStyle.color ?? '#fff',
                border: sendButtonClass.includes('border') ? undefined : 'none',
                borderRadius: config?.selectedSendButtonStyle === 'Minimal' ? 0 : 
                            sendButtonClass.includes('[border-radius:30%]') ? '30%' :
                            sendButtonClass.match(/rounded-(lg|xl|full)/) ? undefined : 10,
                padding: '4px 12px',
                fontWeight: 'bold',
                fontSize: 14,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? '...' : SendIcon ? SendIcon : 'Send'}
          </button>
        </div>
      </div>
  </>);
}
