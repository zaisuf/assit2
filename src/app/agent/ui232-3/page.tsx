"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { EditUIButton } from '@/components/EditUIButton';
import { withUiIdGuard } from '@/components/withUiIdGuard';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from "react-markdown";
import CustomSidebar from "@/components/sidebar/CustomSidebar";
import { Send, Mic, MicOff, Bot, ArrowUpRight, ArrowRight, Paperclip, SendHorizonal, Layout, Image as LucideImage, Brush, Type, PaintBucket, Heading, Square, AlignLeft, CornerDownLeft, Loader, CreditCard } from "lucide-react";
import DottedGrid from "@/components/dottedgrid";
import { db, auth } from '@/app/api/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pl", name: "Polish" },
  { code: "uk", name: "Ukrainian" },
  { code: "nl", name: "Dutch" },
  { code: "ro", name: "Romanian" },
  { code: "hu", name: "Hungarian" },
  { code: "el", name: "Greek" },
  { code: "cs", name: "Czech" },
  { code: "sv", name: "Swedish" },
  { code: "pt", name: "Portuguese" },
  { code: "hr", name: "Croatian" },
  { code: "bg", name: "Bulgarian" },
  { code: "da", name: "Danish" },
  { code: "sk", name: "Slovak" },
  { code: "fi", name: "Finnish" },
  { code: "lt", name: "Lithuanian" },
  { code: "sl", name: "Slovenian" },
  { code: "lv", name: "Latvian" },
  { code: "et", name: "Estonian" },
  { code: "ga", name: "Irish" },
  { code: "mt", name: "Maltese" },
];

const BACKGROUND_COLORS = [
  { name: "Emerald", class: "from-emerald-900 via-teal-900 to-cyan-900", swatch: "bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900" },
  { name: "Blue", class: "from-blue-900 via-blue-700 to-cyan-800", swatch: "bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-800" },
  { name: "Purple", class: "from-purple-900 via-fuchsia-800 to-pink-900", swatch: "bg-gradient-to-r from-purple-900 via-fuchsia-800 to-pink-900" },
  { name: "Orange", class: "from-orange-900 via-yellow-800 to-amber-900", swatch: "bg-gradient-to-r from-orange-900 via-yellow-800 to-amber-900" },
  { name: "Gray", class: "from-gray-900 via-slate-800 to-gray-700", swatch: "bg-gradient-to-r from-gray-900 via-slate-800 to-gray-700" },
  { name: "Green", class: "from-green-900 via-lime-800 to-emerald-800", swatch: "bg-gradient-to-r from-green-900 via-lime-800 to-emerald-800" },
  { name: "Red", class: "from-red-900 via-rose-800 to-pink-900", swatch: "bg-gradient-to-r from-red-900 via-rose-800 to-pink-900" },
  { name: "Teal", class: "from-teal-900 via-cyan-800 to-blue-900", swatch: "bg-gradient-to-r from-teal-900 via-cyan-800 to-blue-900" },
  { name: "Indigo", class: "from-indigo-900 via-blue-900 to-violet-900", swatch: "bg-gradient-to-r from-indigo-900 via-blue-900 to-violet-900" },
  { name: "Pink", class: "from-pink-900 via-fuchsia-800 to-rose-900", swatch: "bg-gradient-to-r from-pink-900 via-fuchsia-800 to-rose-900" },
];

const HEADER_STYLES = [
  { name: "Square", class: "rounded-none" },
  { name: "Squircle", class: "[border-radius:30%]" },
  { name: "Rounded", class: "rounded-xl" },
  { name: "Circle", class: "rounded-full" },
  { name: "Minimal", class: "hidden" },
  { name: "Hide", class: "hidden" },
];
const HEADER_COLORS = [
  { name: "Emerald", class: "bg-gradient-to-br from-emerald-400 to-cyan-400" },
  { name: "Blue", class: "bg-gradient-to-br from-blue-500 to-cyan-400" },
  { name: "Purple", class: "bg-gradient-to-br from-purple-500 to-pink-400" },
  { name: "Orange", class: "bg-gradient-to-br from-orange-400 to-amber-300" },
  { name: "Gray", class: "bg-gradient-to-br from-gray-700 to-slate-400" },
  { name: "Green", class: "bg-gradient-to-br from-green-500 to-lime-300" },
  { name: "Red", class: "bg-gradient-to-br from-red-500 to-rose-400" },
  { name: "Teal", class: "bg-gradient-to-br from-teal-500 to-cyan-300" },
  { name: "Indigo", class: "bg-gradient-to-br from-indigo-500 to-violet-400" },
  { name: "Pink", class: "bg-gradient-to-br from-pink-500 to-fuchsia-400" },
];

const FOOTER_STYLES = [
  { name: "Square", class: "rounded-none" },
  { name: "Squircle", class: "[border-radius:30%]" },
  { name: "Rounded", class: "rounded-xl" },
  { name: "Circle", class: "rounded-full" },
  { name: "Minimal", class: "hidden" },
  { name: "Hide", class: "hidden" },
];
const FOOTER_COLORS = [
  { name: "Emerald", class: "bg-gradient-to-br from-emerald-400 to-cyan-400" },
  { name: "Blue", class: "bg-gradient-to-br from-blue-500 to-cyan-400" },
  { name: "Purple", class: "bg-gradient-to-br from-purple-500 to-pink-400" },
  { name: "Orange", class: "bg-gradient-to-br from-orange-400 to-amber-300" },
  { name: "Gray", class: "bg-gradient-to-br from-gray-700 to-slate-400" },
  { name: "Green", class: "bg-gradient-to-br from-green-500 to-lime-300" },
  { name: "Red", class: "bg-gradient-to-br from-red-500 to-rose-400" },
  { name: "Teal", class: "bg-gradient-to-br from-teal-500 to-cyan-300" },
  { name: "Indigo", class: "bg-gradient-to-br from-indigo-500 to-violet-400" },
  { name: "Pink", class: "bg-gradient-to-br from-pink-500 to-fuchsia-400" },
];

const INPUT_BAR_STYLES = [
  { name: "Classic", class: "rounded-lg border border-white/10 bg-white/10", showButtonsInside: false },
  { name: "Modern", class: "rounded-full border-2 border-emerald-400 bg-white/5", showButtonsInside: true },
  { name: "Squircle", class: "[border-radius:30%] border border-cyan-400 bg-white/10", showButtonsInside: true },
  { name: "Minimal", class: "rounded-none border-b-2 border-emerald-400 bg-transparent", showButtonsInside: false },
  { name: "Shadowed", class: "rounded-xl shadow-lg border-none bg-white/10", showButtonsInside: true },
];
const INPUT_BAR_COLORS = [
  { name: "Emerald", class: "bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900" },
  { name: "Blue", class: "bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-800" },
  { name: "Purple", class: "bg-gradient-to-r from-purple-900 via-fuchsia-800 to-pink-900" },
  { name: "Gray", class: "bg-gradient-to-r from-gray-900 via-slate-800 to-gray-700" },
  { name: "White", class: "bg-white/10" },
];

const SEND_BUTTON_STYLES = [
  { name: "Emerald Solid", class: "bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow" },
  { name: "Outline", class: "border-2 border-emerald-400 text-emerald-400 bg-transparent rounded-lg hover:bg-emerald-400/10" },
  { name: "Gradient", class: "bg-gradient-to-r from-emerald-400 to-cyan-400 text-white rounded-full shadow-lg" },
  { name: "Minimal", class: "bg-transparent text-white border-none rounded-none hover:bg-white/10" },
  { name: "Glass", class: "bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl hover:bg-white/20" },
];
const SEND_ICONS = [
  { name: "Send (Default)", icon: Send },
  { name: "Arrow Up Right", icon: ArrowUpRight },
  { name: "Arrow Right", icon: ArrowRight },
  { name: "Paperclip", icon: Paperclip },
  { name: "Send Horizontal", icon: SendHorizonal },
];
const TEXT_COLORS = [
  { name: "White", class: "text-white" },
  { name: "Emerald", class: "text-emerald-400" },
  { name: "Cyan", class: "text-cyan-400" },
  { name: "Blue", class: "text-blue-400" },
  { name: "Pink", class: "text-pink-400" },
  { name: "Orange", class: "text-orange-400" },
  { name: "Yellow", class: "text-yellow-300" },
  { name: "Gray", class: "text-gray-300" },
  { name: "Custom", class: "custom" },
];

// Response Card Styles (with shape options)
type ResponseCardStyle = {
  name: string;
  className: string;
  bubbleClass: string;
  textClass: string;
  shape: string;
  templateName?: string;
};
const RESPONSE_CARD_STYLES: ResponseCardStyle[] = [
  {
    name: "Classic",
    className: "bg-white/10 border border-white/20 rounded-xl shadow-lg",
    bubbleClass: "",
    textClass: "text-white",
    shape: "rounded-xl"
  },
  {
    name: "Glassmorphism",
    className: "bg-white/10 border border-white/30 rounded-2xl shadow-xl backdrop-blur-md",
    bubbleClass: "",
    textClass: "text-white/90",
    shape: "rounded-2xl"
  },
  {
    name: "Minimal",
    className: "bg-transparent border-none rounded-none shadow-none",
    bubbleClass: "",
    textClass: "text-white/80",
    shape: "rounded-none"
  },
  {
    name: "Bubble",
    className: "bg-emerald-500/20 border border-emerald-500/30 rounded-full shadow-md",
    bubbleClass: "px-6 py-3",
    textClass: "text-emerald-100",
    shape: "rounded-full"
  },
  {
    name: "Card",
    className: "bg-gradient-to-br from-emerald-900 via-cyan-900 to-blue-900 border border-cyan-400/30 rounded-2xl shadow-2xl",
    bubbleClass: "px-6 py-4",
    textClass: "text-cyan-100",
    shape: "rounded-2xl"
  },
  {
    name: "Outline",
    className: "bg-transparent border-2 border-emerald-400 rounded-xl",
    bubbleClass: "",
    textClass: "text-emerald-400",
    shape: "rounded-xl"
  },
  {
    name: "Shadowed",
    className: "bg-white/10 border border-white/20 rounded-xl shadow-2xl",
    bubbleClass: "",
    textClass: "text-white/90",
    shape: "rounded-xl"
  },
  {
    name: "Elevated",
    className: "bg-white/20 border border-white/30 rounded-xl shadow-lg scale-105",
    bubbleClass: "",
    textClass: "text-white/90",
    shape: "rounded-xl"
  },
  {
    name: "Gradient",
    className: "bg-gradient-to-r from-emerald-400 to-cyan-400 border-none rounded-xl",
    bubbleClass: "",
    textClass: "text-white",
    shape: "rounded-xl"
  },
  {
    name: "Neumorphism",
    className: "bg-[#1a2a2a] border border-[#223] rounded-[30px] shadow-[8px_8px_16px_#0e1a1a,_-8px_-8px_16px_#223]",
    bubbleClass: "",
    textClass: "text-emerald-200",
    shape: "rounded-[30px]"
  },
  {
    name: "Squircle",
    className: "bg-gradient-to-br from-emerald-900 to-cyan-900 border border-cyan-400/30 [border-radius:30%] shadow-xl",
    bubbleClass: "px-6 py-4",
    textClass: "text-cyan-100",
    shape: "[border-radius:30%]"
  },
  {
    name: "Square",
    className: "bg-white/10 border border-white/20 rounded-none shadow-lg",
    bubbleClass: "",
    textClass: "text-white",
    shape: "rounded-none"
  },
];

// Chatbot UI Template Styles
const CHATBOT_UI_TEMPLATES = [
  {
    name: "Emerald Glass",
    description: "Glassmorphism, emerald gradients, modern rounded corners, fade-in animation.",
    bg: "bg-gradient-to-br from-emerald-900 via-cyan-900 to-blue-900",
    card: "bg-white/10 border border-white/30 rounded-2xl shadow-xl backdrop-blur-md animate-fadeIn",
    text: "text-emerald-200 font-semibold",
    anim: "animate-fadeIn",
  },
  {
    name: "Minimalist Light",
    description: "Minimal, white background, subtle shadow, sans-serif, fade-in-up.",
    bg: "bg-white",
    card: "bg-white border border-gray-200 rounded-lg shadow-md animate-fadeInUp",
    text: "text-gray-900 font-sans",
    anim: "animate-fadeInUp",
    header: "bg-black",
    footer: "bg-black"
  },
  {
    name: "Neon Night",
    description: "Dark background, neon border, glowing text, pulse animation.",
    bg: "bg-gradient-to-br from-black via-blue-950 to-gray-900",
    card: "bg-black border-2 border-cyan-400 rounded-xl shadow-lg animate-pulse",
    text: "text-cyan-400 font-mono drop-shadow-lg",
    anim: "animate-pulse",
  },
  {
    name: "Retro Terminal",
    description: "Terminal green text, black bg, monospace, typewriter effect.",
    bg: "bg-black",
    card: "bg-black border border-green-700 rounded-none shadow-none animate-typewriter",
    text: "text-green-400 font-mono",
    anim: "animate-typewriter",
  },
  {
    name: "Sunset Gradient",
    description: "Warm gradient, rounded-full cards, bold text, bounce animation.",
    bg: "bg-gradient-to-br from-orange-400 via-pink-500 to-yellow-300",
    card: "bg-gradient-to-r from-orange-400 to-pink-500 rounded-full shadow-xl animate-bounce",
    text: "text-white font-bold",
    anim: "animate-bounce",
  },
  {
    name: "Frosted Blue",
    description: "Frosted glass, blue gradients, soft shadow, fade-in.",
    bg: "bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-800",
    card: "bg-white/20 backdrop-blur-md border border-blue-200/30 rounded-2xl shadow-2xl animate-fadeIn",
    text: "text-blue-100 font-sans",
    anim: "animate-fadeIn",
  },
  {
    name: "Purple Dream",
    description: "Purple-pink gradient, squircle cards, glowing text, pulse.",
    bg: "bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-900",
    card: "bg-gradient-to-br from-purple-700 to-pink-600 [border-radius:30%] shadow-xl animate-pulse",
    text: "text-pink-200 font-semibold drop-shadow-md",
    anim: "animate-pulse",
  },
  {
    name: "Classic Paper",
    description: "Paper white, subtle border, serif font, fade-in.",
    bg: "bg-gradient-to-br from-gray-100 to-white",
    card: "bg-white border border-gray-300 rounded-lg shadow animate-fadeIn",
    text: "text-gray-800 font-serif",
    anim: "animate-fadeIn",
  },
  {
    name: "Emerald Bubble",
    description: "Emerald bubble cards, dark bg, rounded-full, bounce.",
    bg: "bg-gradient-to-br from-emerald-900 to-cyan-900",
    card: "bg-emerald-500/20 border border-emerald-500/30 rounded-full shadow-md animate-bounce",
    text: "text-emerald-100 font-bold",
    anim: "animate-bounce",
  },
  {
    name: "Indigo Glass",
    description: "Indigo gradient, glassmorphism, shadow, fade-in.",
    bg: "bg-gradient-to-br from-indigo-900 via-blue-900 to-violet-900",
    card: "bg-white/10 border border-white/30 rounded-2xl shadow-xl backdrop-blur-md animate-fadeIn",
    text: "text-indigo-200 font-semibold",
    anim: "animate-fadeIn",
  },
  {
    name: "Orange Pop",
    description: "Orange-yellow gradient, squircle cards, bold text, bounce.",
    bg: "bg-gradient-to-br from-orange-900 via-yellow-800 to-amber-900",
    card: "bg-gradient-to-r from-orange-400 to-amber-400 [border-radius:30%] shadow-xl animate-bounce",
    text: "text-yellow-100 font-bold",
    anim: "animate-bounce",
  },
  {
    name: "Teal Modern",
    description: "Teal-cyan gradient, modern rounded cards, fade-in.",
    bg: "bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900",
    card: "bg-white/10 border border-cyan-400/30 rounded-xl shadow-xl animate-fadeIn",
    text: "text-cyan-100 font-sans",
    anim: "animate-fadeIn",
  },
  {
    name: "Pink Glass",
    description: "Pink-fuchsia gradient, glassmorphism, shadow, fade-in.",
    bg: "bg-gradient-to-br from-pink-900 via-fuchsia-800 to-rose-900",
    card: "bg-white/10 border border-white/30 rounded-2xl shadow-xl backdrop-blur-md animate-fadeIn",
    text: "text-pink-200 font-semibold",
    anim: "animate-fadeIn",
  },
  {
    name: "Gray Minimal",
    description: "Gray gradient, minimal cards, sans-serif, fade-in.",
    bg: "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-700",
    card: "bg-gray-800 border border-gray-700 rounded-lg shadow animate-fadeIn",
    text: "text-gray-200 font-sans",
    anim: "animate-fadeIn",
  },
  {
    name: "Lime Shadow",
    description: "Lime-green gradient, shadowed cards, bold text, fade-in.",
    bg: "bg-gradient-to-br from-green-900 via-lime-800 to-emerald-800",
    card: "bg-lime-400/20 border border-lime-400/30 rounded-xl shadow-2xl animate-fadeIn",
    text: "text-lime-200 font-bold",
    anim: "animate-fadeIn",
  },
];



const ModernAIAssistantElevenLabs: React.FC = () => {
  // State declarations (move above callWithRetry)
  // ...existing code...
    // State declarations (move above callGroqAPI)
    const [messages, setMessages] = useState<Message[]>([]);
  // Move callGroqAPI and processResponse above all hooks that reference them
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const callWithRetry = React.useCallback(async (fn: () => Promise<any>, retries = 3, delay = 2000) => {
    try {
      const timeSinceLastCall = Date.now() - lastApiCall;
      if (timeSinceLastCall < API_COOLDOWN) {
        await wait(API_COOLDOWN - timeSinceLastCall);
      }
      const result = await fn();
      setLastApiCall(Date.now());
      return result;
    } catch (error) {
      if (retries > 0) {
        await wait(delay);
        return callWithRetry(fn, retries - 1, delay * 1.5);
      }
      throw error;
    }
  }, [lastApiCall]);

  const callGroqAPI = React.useCallback(async (message: string) => {
    return callWithRetry(async () => {
      const conversationHistory = messages.map(({ role, content }) => ({
        role,
        content,
      }));
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are a modern house design AI assistant. Keep your responses concise, focused on architecture and interior design. Be direct and informative.",
            },
            ...conversationHistory,
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
          max_tokens: 100,
          top_p: 1,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    });
  }, [messages, callWithRetry]);

  const processResponse = React.useCallback((text: string): string => {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const limitedSentences = sentences.slice(0, 3);
    return limitedSentences.map((s) => s.trim()).join(". ") + ".";
  }, []);
  // Move handleSendMessage above useEffect hooks to avoid ReferenceError
  // ...existing code...

    const handleSendMessage = React.useCallback(async (text: string) => {
      if (!text.trim()) return;

      const userMessage: Message = {
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      setIsLoading(true);

      try {
        const rawResponse = await callGroqAPI(text);
        const processedResponse = processResponse(rawResponse);
        const assistantMessage: Message = {
          role: "assistant",
          content: processedResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error in handleSendMessage:", error);
        const fallbackResponse =
          "I apologize, but I'm having trouble right now. Please try asking your question again.";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: fallbackResponse,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }, [callGroqAPI, processResponse]);

  // Get uiId from URL (e.g. ?uiId=ui_kydoz3t1domdy3yicz)
  // uiId state already declared above, remove duplicate declarations below
  // Move handleSendMessage above useEffect hooks
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const param = searchParams.get('uiId');
      if (param) setUiId(param);
    }
  }, [handleSendMessage]);
  // State for editable Assistant Bot text
  const [assistantBotText, setAssistantBotText] = useState('Assistant Bot');
  // Use uiId for all design operations (fallback to userId or default if not present)
  // Example usage: const designId = uiId || userId || 'default';
  // Responsive UI element sizes based on box width/height
  function getResponsiveSize(base: number) {
    // Use width and height to scale elements
    // 350px = small, 450px = medium, 600px = large
    if (chatbotBoxWidth <= 350 || chatbotBoxHeight <= 350) return base * 0.8;
    if (chatbotBoxWidth >= 600 || chatbotBoxHeight >= 650) return base * 1.15;
    return base;
  }
  // Add state for dynamic chatbot box width and height
  const [chatbotBoxWidth, setChatbotBoxWidth] = useState(450);
  const [chatbotBoxHeight, setChatbotBoxHeight] = useState(500);
  // UI Shape state for chat box
  const [selectedUiShape, setSelectedUiShape] = useState('rounded-xl');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  // ...existing code...
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastApiCall, setLastApiCall] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [showUiOverlay, setShowUiOverlay] = useState(false);
  const [sidebarOverlay, setSidebarOverlay] = useState<string | null>(null);
  const [selectedTextStyle, setSelectedTextStyle] = useState<string>("");
  const [selectedBgColor, setSelectedBgColor] = useState<string>(BACKGROUND_COLORS[0].class); // default bg color
  const [selectedHeaderStyle, setSelectedHeaderStyle] = useState<string>(HEADER_STYLES[2].class); // default rounded-xl
  // New Chat Icon Styles
  const [customNewChatIconColor, setCustomNewChatIconColor] = useState<string>("");
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
  const [selectedNewChatIcon, setSelectedNewChatIcon] = useState(NEW_CHAT_ICONS[0]);
  const [selectedHeaderColor, setSelectedHeaderColor] = useState<string>(HEADER_COLORS[0].class); // default emerald
  const [selectedFooterStyle, setSelectedFooterStyle] = useState<string>(FOOTER_STYLES[2].class); // default rounded-xl
  const [selectedFooterColor, setSelectedFooterColor] = useState<string>(FOOTER_COLORS[0].class); // default emerald
  const [selectedInputBarStyle, setSelectedInputBarStyle] = useState(INPUT_BAR_STYLES[0]);
  const [selectedInputBarColor, setSelectedInputBarColor] = useState(INPUT_BAR_COLORS[0].class);
  const [selectedSendButtonStyle, setSelectedSendButtonStyle] = useState(SEND_BUTTON_STYLES[0]);
  const [selectedSendIcon, setSelectedSendIcon] = useState(SEND_ICONS[0]);
  const [inputPlaceholder, setInputPlaceholder] = useState("Ask about modern house design...");
  const [customSendButtonColor, setCustomSendButtonColor] = useState<string>("");
  const [customBgColor, setCustomBgColor] = useState<string>("");
  const [customHeaderColor, setCustomHeaderColor] = useState<string>("");
  // Add state for custom header logo image
  const [customHeaderLogo, setCustomHeaderLogo] = useState<string>("");
  // Add state for custom response card logo image
  const [customResponseLogo, setCustomResponseLogo] = useState<string>("");
  // Add state for showing/hiding response logo
  const [showResponseLogo, setShowResponseLogo] = useState<boolean>(true);
  const [customFooterColor, setCustomFooterColor] = useState<string>("");
  const [customInputBarColor, setCustomInputBarColor] = useState<string>("");
  const [selectedTextColor, setSelectedTextColor] = useState<string>(TEXT_COLORS[0].class);
  const [customTextColor, setCustomTextColor] = useState<string>("");
  const [selectedLoadingAnimation, setSelectedLoadingAnimation] = useState(LOADING_ANIMATIONS[0]);
  const [selectedResponseCardStyle, setSelectedResponseCardStyle] = useState(RESPONSE_CARD_STYLES[0]);
  const [selectedUiTemplate, setSelectedUiTemplate] = useState(CHATBOT_UI_TEMPLATES[0]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Get uiId from query string
  const [uiId, setUiId] = useState<string | null>(null);
  // Add state for audio, transcript, and userId
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [savedTranscript, setSavedTranscript] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get uiId from query string and load saved UI config if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("uiId");
      if (id) setUiId(id);
    }
    // Get userId from Firebase Auth if available
    if (typeof window !== "undefined" && auth) {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        onAuthStateChanged(auth, (user) => {
          if (user) setCurrentUserId(user.uid);
          else setCurrentUserId('test-user-id');
        });
      });
    }
  }, [handleSendMessage]);

  // Load saved UI design and extra states from Firestore when uiId is set
  useEffect(() => {
    const fetchUiConfig = async () => {
      if (!uiId) return;
      try {
        const userId = currentUserId || 'test-user-id';
        const docRef = doc(db, `users/${userId}/uidesing/${uiId}`);
        const snap = await import('firebase/firestore').then(m => m.getDoc(docRef));
        if (snap.exists()) {
          const data = snap.data();
          // Set all relevant states from loaded config
          if (data.selectedUiTemplate) {
            const tpl = CHATBOT_UI_TEMPLATES.find(t => t.name === data.selectedUiTemplate);
            if (tpl) setSelectedUiTemplate(tpl);
          }
          if (data.selectedBgColor) setSelectedBgColor(data.selectedBgColor);
          if (data.customBgColor) setCustomBgColor(data.customBgColor);
          if (data.selectedHeaderStyle) setSelectedHeaderStyle(data.selectedHeaderStyle);
          if (data.selectedHeaderColor) setSelectedHeaderColor(data.selectedHeaderColor);
          if (data.customHeaderColor) setCustomHeaderColor(data.customHeaderColor);
          if (data.selectedFooterStyle) setSelectedFooterStyle(data.selectedFooterStyle);
          if (data.selectedFooterColor) setSelectedFooterColor(data.selectedFooterColor);
          if (data.customFooterColor) setCustomFooterColor(data.customFooterColor);
          if (data.selectedInputBarStyle) {
            const style = INPUT_BAR_STYLES.find(s => s.name === data.selectedInputBarStyle);
            if (style) setSelectedInputBarStyle(style);
          }
          if (data.selectedInputBarColor) setSelectedInputBarColor(data.selectedInputBarColor);
          if (data.customInputBarColor) setCustomInputBarColor(data.customInputBarColor);
          if (data.inputPlaceholder) setInputPlaceholder(data.inputPlaceholder);
          if (data.selectedSendButtonStyle) {
            const style = SEND_BUTTON_STYLES.find(s => s.name === data.selectedSendButtonStyle);
            if (style) setSelectedSendButtonStyle(style);
          }
          if (data.customSendButtonColor) setCustomSendButtonColor(data.customSendButtonColor);
          if (data.selectedSendIcon) {
            const icon = SEND_ICONS.find(i => i.name === data.selectedSendIcon);
            if (icon) setSelectedSendIcon(icon);
          }
          if (data.selectedTextStyle) setSelectedTextStyle(data.selectedTextStyle);
          if (data.selectedTextColor) setSelectedTextColor(data.selectedTextColor);
          if (data.customTextColor) setCustomTextColor(data.customTextColor);
          if (data.selectedLanguage) setSelectedLanguage(data.selectedLanguage);
          if (data.selectedLoadingAnimation) {
            const anim = LOADING_ANIMATIONS.find(a => a.name === data.selectedLoadingAnimation);
            if (anim) setSelectedLoadingAnimation(anim);
          }
          if (data.selectedResponseCardStyle) {
            const style = RESPONSE_CARD_STYLES.find(s => s.name === data.selectedResponseCardStyle);
            if (style) setSelectedResponseCardStyle(style);
          }
          // Restore extra states
          if (data.messages) setMessages(data.messages);
          if (data.customHeaderLogo) setCustomHeaderLogo(data.customHeaderLogo);
          if (data.customResponseLogo) setCustomResponseLogo(data.customResponseLogo);
          if (typeof data.showResponseLogo === 'boolean') setShowResponseLogo(data.showResponseLogo);
          if (data.selectedNewChatIcon) {
            const icon = NEW_CHAT_ICONS.find(i => i.name === data.selectedNewChatIcon);
            if (icon) setSelectedNewChatIcon(icon);
          }
          if (data.audioUrl) setAudioUrl(data.audioUrl);
          if (data.savedTranscript) setSavedTranscript(data.savedTranscript);
          if (data.sidebarOverlay) setSidebarOverlay(data.sidebarOverlay);
          if (typeof data.isLoading === 'boolean') setIsLoading(data.isLoading);
        }
      } catch (err) {
        // Ignore errors, fallback to defaults
      }
    };
    fetchUiConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiId, currentUserId]);

  const API_COOLDOWN = 6000;

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = async (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("");
          setTranscript(transcript);
          if (event.results[0].isFinal) {
            await handleSendMessage(transcript);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        (window as any).recognition = recognition;
      }
    }
  }, [handleSendMessage]);


  // Removed duplicate startListening function to fix redeclaration error


  // Remove the useEffect that forcibly sets style states when a template is selected
  // Instead, when a template is selected, set style states only if the user hasn't customized them
  useEffect(() => {
    if (selectedUiTemplate) {
      setTemplateActive(true);
      // Only set as default if user hasn't changed from previous template
      setSelectedResponseCardStyle((prev) => {
        if (!prev || prev.name === prev.templateName) {
          return {
            name: selectedUiTemplate.name,
            className: selectedUiTemplate.card,
            bubbleClass: "",
            textClass: selectedUiTemplate.text,
            shape: selectedUiTemplate.card.match(/rounded-[^\s]+|\[border-radius:[^\]]+\]/)?.[0] || "rounded-xl",
            templateName: selectedUiTemplate.name,
          };
        }
        return prev;
      });
      // Only set text style if user hasn't picked one
      setSelectedTextStyle((prev) => {
        if (!prev || prev === "") {
          // Try to extract a style from the template text class
          const tplText = selectedUiTemplate.text.split(" ").find((c) => c.startsWith("font-")) || "";
          return tplText;
        }
        return prev;
      });
      // Do NOT setSelectedBgColor here, so page bg stays global
    }
  }, [selectedUiTemplate]);

  // ...existing code...

  // ...existing code...

  const startListening = () => {
    setIsListening(true);
    setTranscript("");
    if ((window as any).recognition) {
      (window as any).recognition.start();
    }
  };

  const stopListening = () => {
    if ((window as any).recognition) {
      (window as any).recognition.stop();
    }
  };

  // Add state to control if template is active and custom sidebar
  const [templateActive, setTemplateActive] = useState(false);
  const [showCustomSidebar, setShowCustomSidebar] = useState(false);

  // Remove the useEffect that forcibly sets style states when a template is selected
  // Instead, when a template is selected, set style states only if the user hasn't customized them
  useEffect(() => {
    if (selectedUiTemplate) {
      setTemplateActive(true);
      // Only set as default if user hasn't changed from previous template
      setSelectedResponseCardStyle((prev) => {
        if (!prev || prev.name === prev.templateName) {
          return {
            name: selectedUiTemplate.name,
            className: selectedUiTemplate.card,
            bubbleClass: "",
            textClass: selectedUiTemplate.text,
            shape: selectedUiTemplate.card.match(/rounded-[^\s]+|\[border-radius:[^\]]+\]/)?.[0] || "rounded-xl",
            templateName: selectedUiTemplate.name,
          };
        }
        return prev;
      });
      // Only set text style if user hasn't picked one
      setSelectedTextStyle((prev) => {
        if (!prev || prev === "") {
          // Try to extract a style from the template text class
          const tplText = selectedUiTemplate.text.split(" ").find((c) => c.startsWith("font-")) || "";
          return tplText;
        }
        return prev;
      });
      // Do NOT setSelectedBgColor here, so page bg stays global
    }
  }, [selectedUiTemplate]);

  // Helper: get the effective style (user override > template > fallback)
  function getEffectiveStyle(
    userValue: string,
    templateValue: string,
    fallback: string
  ): string {
    return userValue !== undefined && userValue !== null && userValue !== '' ? userValue : (templateActive ? templateValue : fallback);
  }

  // Save handler (save to users/{userId}/agent/chatbotUI)
  // ...existing code...
// Down Arrow Icon Styles (12 variants)
const DOWN_ARROW_ICONS = [
  {
    name: 'Classic',
    icon: (
      <svg width={22} height={22} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Chevron',
    icon: (
      <svg width={22} height={22} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="6 8 10 12 14 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Double',
    icon: (
      <svg width={22} height={22} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 8l3 3 3-3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 12l3 3 3-3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Circle',
    icon: (
      <svg width={22} height={22} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Filled',
    icon: (
      <svg width={22} height={22} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 8l5 5 5-5" />
      </svg>
    )
  },
  {
    name: 'Thin',
    icon: (
      <svg width={22} height={22} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Bold',
    icon: (
      <svg width={22} height={22} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Arrowhead',
    icon: (
      <svg width={22} height={22} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="10,15 5,8 15,8" fill="currentColor" />
      </svg>
    )
  },
  {
    name: 'Minimal',
    icon: (
      <svg width={22} height={22} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="8" x2="10" y2="14" stroke="currentColor" strokeWidth="2.2" />
        <polyline points="6 12 10 16 14 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Square',
    icon: (
      <svg width={22} height={22} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Dashed',
    icon: (
      <svg width={22} height={22} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2.2" strokeDasharray="4 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Shadow',
    icon: (
      <svg width={22} height={22} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// State for selected down arrow icon
const [selectedDownArrowIcon, setSelectedDownArrowIcon] = useState(DOWN_ARROW_ICONS[0]);

  // Add save handler (now saves extra states)
  const handleSaveUiConfig = async () => {
    if (!uiId) {
      alert("No UI ID found. Please create a UI from the agent page first.");
      return;
    }
    const designConfig = {
      selectedUiTemplate: selectedUiTemplate?.name,
      selectedBgColor,
      customBgColor,
      selectedHeaderStyle,
      selectedHeaderColor,
      customHeaderColor,
      selectedFooterStyle,
      selectedFooterColor,
      customFooterColor,
      selectedInputBarStyle: selectedInputBarStyle?.name,
      selectedInputBarColor,
      customInputBarColor,
      inputPlaceholder,
      selectedSendButtonStyle: selectedSendButtonStyle?.name,
      customSendButtonColor,
      selectedSendIcon: selectedSendIcon?.name,
      selectedTextStyle,
      selectedTextColor,
      customTextColor,
      selectedLanguage,
      selectedLoadingAnimation: selectedLoadingAnimation?.name,
      selectedResponseCardStyle: selectedResponseCardStyle?.name,
      // Extra states to save
      messages,
      customHeaderLogo,
      customResponseLogo,
      showResponseLogo,
      selectedNewChatIcon: selectedNewChatIcon?.name,
      audioUrl,
      savedTranscript: transcript,
      sidebarOverlay,
      isLoading,
      assistantBotText, // Save the editable header text
    };
    try {
      const userId = 'test-user-id';
      await setDoc(doc(db, `users/${userId}/uidesing/${uiId}`), {
        ...designConfig,
        designId: uiId,
        userId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      window.prompt("Your design is saved! Share this URL:", `${window.location.origin}/ui/${uiId}`);
    } catch (err) {
      alert("Failed to save design. Please try again.");
    }
  };
  // Handler to clear chat and start fresh
  const handleNewChat = () => {
    setMessages([]);
    setInputText("");
    // Optionally reset other states if needed
  };
  return (
    <div className={
      // Always use the default/global background for the page, never the template bg
      `relative min-h-screen w-full flex flex-row items-center justify-start overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900`
    }>
      {showCustomSidebar && <CustomSidebar />}
      <div className={`fixed top-80 ${showCustomSidebar ? 'left-[235px]' : 'left-32'} z-50 flex gap-2 transition-all duration-300`}>
        <button 
          className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
          onClick={() => setShowCustomSidebar(!showCustomSidebar)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4L6 20" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8h8M12 12h8M12 16h8" />
          </svg>
        </button>
      </div>
      {/* Remove top right Save button */}
      {/* UI Overlay Modal */}
      {showUiOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" style={{ fontFamily: 'sans-serif' }}>
          <div
            className="bg-gradient-to-br from-white/5 via-blue-900/10 to-white/0 backdrop-blur-md bg-opacity-10 border border-white/20 shadow-2xl p-4 max-w-4xl w-[900px] min-h-[150px] rounded-xl relative flex flex-col items-center justify-center gap-8"
            style={{
              backgroundColor: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 4px 32px 0 rgba(30,64,175,0.08)',
              borderRadius: 18,
              backdropFilter: 'blur(8px)',
              fontFamily: 'sans-serif',
              minHeight: 150
            }}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl font-bold bg-transparent border-none outline-none"
              onClick={() => setShowUiOverlay(false)}
              aria-label="Close UI Overlay"
              style={{lineHeight: 1}}
            >
              &times;
            </button>
            <h2 className="text-4xl font-bold text-white tracking-wide font-sans mb-1">UI Template Overlay</h2>
            <p className="text-white/80 text-lg mb-4">Choose a chatbot UI template. Each template has unique features, colors, text, and animation.</p>
            <div className="grid grid-cols-2 gap-6 mt-4 overflow-y-auto scrollbar-none" style={{maxHeight: '420px', width: '100%', msOverflowStyle: 'none', scrollbarWidth: 'none'}}>
              {CHATBOT_UI_TEMPLATES.map((tpl, idx) => (
                <button
                  key={tpl.name}
                  className={`flex flex-col items-center w-[200px] h-[180px] p-4 border-2 rounded-xl shadow-lg transition-all duration-200 cursor-pointer ${selectedUiTemplate.name === tpl.name ? 'border-emerald-400 scale-105' : 'border-white/20 hover:border-emerald-400'}`}
                  style={{ background: tpl.bg.includes('gradient') ? undefined : tpl.bg }}
                  onClick={() => setSelectedUiTemplate(tpl)}
                  type="button"
                >
                  <div className={`w-full h-12 mb-2 ${tpl.card} flex items-center justify-center ${tpl.anim}`}>
                    <span className={`text-base ${tpl.text}`}>{tpl.name}</span>
                  </div>
                  <span className="text-xs text-white/80 text-center mt-2">{tpl.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* DottedGrid Pattern Background */}
      <div className="fixed inset-0 z-0">
        <DottedGrid />
      </div>
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-[650px] min-h-[520px] w-[120px] z-20 border border-white/20 shadow-xl rounded-none ml-0.8 mr-4 flex flex-col items-center p-3 gap-4 bg-gradient-to-br from-white/5 via-blue-900/10 to-white/0 backdrop-blur-md bg-opacity-10" style={{backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 32px 0 rgba(30,64,175,0.08)', backdropFilter: 'blur(8px)', borderRadius: 0}}>
        <div className="flex flex-col items-center gap-2 w-full flex-1">
          {[
            { label: 'UI Size', icon: <Layout size={18} className="mr-2" /> },
            { label: 'Logos', icon: <LucideImage size={18} className="mr-2" /> },
            { label: 'Style', icon: <Brush size={18} className="mr-2" /> },
            { label: 'Text', icon: <Type size={18} className="mr-2" /> },
            { label: 'Background', icon: <PaintBucket size={18} className="mr-2" /> },
            { label: 'Header', icon: <Heading size={18} className="mr-2" /> },
            { label: 'Footer', icon: <Square size={18} className="mr-2" /> },
            { label: 'Input Bar', icon: <AlignLeft size={18} className="mr-2" /> },
            { label: 'Send', icon: <CornerDownLeft size={18} className="mr-2" /> },
            { label: 'responce loding ', icon: <Loader size={18} className="mr-2" /> },
            { label: 'responce card', icon: <CreditCard size={18} className="mr-2" /> },
          ].map(({ label, icon }) => (
            <button
              key={label}
              className="text-white w-full text-left flex items-center py-1.5 rounded-lg hover:bg-white/10 transition font-semibold focus:outline-none mt-2 text-sm"
              style={{ fontSize: label === 'Style' ? '1rem' : '0.92rem', fontWeight: label === 'Style' ? 700 : 500 }}
              onClick={() => setSidebarOverlay(label)}
              type="button"
            >
              {icon}{label}
            </button>
          ))}
        </div>
        {/* Move Save and UI Template buttons to bottom of sidebar, Save left of UI Template */}
        <div className="w-full flex flex-row gap-2 mt-2">
          <button
            className="flex-1 px-3 py-2 h-10 rounded-none text-white font-normal shadow-lg hover:scale-105 transition-all text-sm -mt-12 border border-white/70"
            style={{ fontFamily: "sans-serif", letterSpacing: "0.04em", minHeight: '2.5rem', height: '2.5rem', paddingTop: '0rem', paddingBottom: '0.7rem', paddingLeft: '0.75rem', paddingRight: '0.75rem', borderRadius: 0, background: 'linear-gradient(90deg, #444444 0%, #888888 100%)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.7)' }}
            type="button"
            onClick={() => setShowUiOverlay(true)}
          >
            UI Template
          </button>
          <button
            className="flex-1 px-3 py-2 h-10 rounded-none text-white font-normal shadow-lg hover:scale-105 transition-all text-base ml-8 -mt-12 border border-white/70"
            style={{ fontFamily: "sans-serif", letterSpacing: "0.04em", minHeight: '2.5rem', height: '2.5rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '0.75rem', paddingRight: '0.75rem', borderRadius: 0, background: 'linear-gradient(90deg, #444444 0%, #888888 100%)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.7)' }}
            type="button"
            onClick={handleSaveUiConfig}
          >
            Save
          </button>
        </div>
      </aside>
      {/* Sidebar Overlay */}
      {sidebarOverlay && (
        <div className="fixed top-0 left-[120px] h-[650px] min-h-[500px] w-[180px] z-30 border border-white/20 shadow-xl rounded-none flex flex-col items-center p-3 gap-4 bg-gradient-to-br from-white/10 via-blue-900/20 to-white/0 backdrop-blur-md bg-opacity-20" style={{backgroundColor: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 4px 32px 0 rgba(30,64,175,0.12)', backdropFilter: 'blur(10px)', borderRadius: 0, fontFamily: 'sans-serif'}}>
          <button
            className="absolute top-2 right-2 text-white/70 hover:text-white text-2xl font-bold bg-transparent border-none outline-none"
            onClick={() => setSidebarOverlay(null)}
            aria-label="Close Sidebar Overlay"
            style={{lineHeight: 1}}
          >
            &times;
          </button>
          <span className="text-white text-lg font-bold tracking-wide font-sans mt-8">{sidebarOverlay} Overlay</span>
          <div className="flex-1 w-full overflow-y-auto scrollbar-none pr-1" style={{maxHeight: '520px', msOverflowStyle: 'none', scrollbarWidth: 'none'}}>
            {/* Overlay content below is now scrollable */}
            {sidebarOverlay === 'UI Size' ? (
        <div className="flex flex-col items-center mt-4 w-full gap-2">
          <span className="text-white/80 text-xs mb-2 block">Width</span>
          <div className="flex gap-2 w-full mb-4">
            <button className="w-full py-2 rounded bg-white/10 text-white text-sm font-semibold hover:bg-emerald-500/30" onClick={() => setChatbotBoxWidth(350)}>Small</button>
            <button className="w-full py-2 rounded bg-white/10 text-white text-sm font-semibold hover:bg-emerald-500/30" onClick={() => setChatbotBoxWidth(450)}>Medium</button>
            <button className="w-full py-2 rounded bg-white/10 text-white text-sm font-semibold hover:bg-emerald-500/30" onClick={() => setChatbotBoxWidth(600)}>Large</button>
          </div>
          <span className="text-white/80 text-xs mb-2 block">Height</span>
          <div className="flex gap-2 w-full">
            <button className="w-full py-2 rounded bg-white/10 text-white text-sm font-semibold hover:bg-emerald-500/30" onClick={() => setChatbotBoxHeight(350)}>Short</button>
            <button className="w-full py-2 rounded bg-white/10 text-white text-sm font-semibold hover:bg-emerald-500/30" onClick={() => setChatbotBoxHeight(500)}>Medium</button>
            <button className="w-full py-2 rounded bg-white/10 text-white text-sm font-semibold hover:bg-emerald-500/30" onClick={() => setChatbotBoxHeight(620)}>Tall</button>
          </div>
          {/* UI Shape Selector */}
          <span className="text-white/80 text-xs mb-2 block mt-4">Shape</span>
          <div className="grid grid-cols-2 gap-2 w-full mb-2">
            {[
              { label: 'Square', value: 'rounded-none', preview: 'rounded-none border border-white/40' },
              { label: 'Circle', value: 'rounded-full', preview: 'rounded-full border border-white/40 w-10 h-10' },
              { label: 'Rounded', value: 'rounded-xl', preview: 'rounded-xl border border-white/40' },
              { label: 'Pill', value: 'rounded-full', preview: 'rounded-full border border-white/40 w-16 h-6' },
              { label: 'Hexigrid', value: 'hexigrid-shape', preview: 'hexigrid-preview border border-emerald-400 w-12 h-12' }
            ].map(shape => (
              <button
                key={shape.value}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-xs ${selectedUiShape === shape.value ? 'bg-emerald-500/30 font-bold' : ''}`}
                type="button"
                onClick={() => setSelectedUiShape(shape.value)}
              >
                <div className={`w-10 h-6 mb-1 bg-white/10 ${shape.preview}`}></div>
                {shape.label}
              </button>
            ))}
          </div>
              </div>
            ) : sidebarOverlay === 'Style' ? (
              <div className="flex flex-col items-center mt-4 w-full gap-4">
                <span className="text-white/80 text-base mt-6 mb-2">New Chat Icon Styles</span>
                <div className="grid grid-cols-2 gap-4 w-full justify-center items-center">
                  {NEW_CHAT_ICONS.map((iconObj, idx) => (
                    <button
                      key={iconObj.name}
                      className={`inline-block p-2 rounded flex flex-col items-center justify-center border border-white/20 cursor-pointer ${selectedNewChatIcon.name === iconObj.name ? 'bg-emerald-500/30 font-bold' : 'bg-white/10 text-white'}`}
                      onClick={() => setSelectedNewChatIcon(iconObj)}
                      type="button"
                    >
                      <span className="w-7 h-7 flex items-center justify-center">
                        {/* Icon with custom color if set */}
                        {React.cloneElement(iconObj.icon, customNewChatIconColor ? { style: { color: customNewChatIconColor } } : {})}
                      </span>
                      <span className="text-xs mt-1">{iconObj.name}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="color"
                    value={customNewChatIconColor || "#10b981"}
                    onChange={e => setCustomNewChatIconColor(e.target.value)}
                    className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                  />
                  <span className="text-white/80 text-xs">Custom Icon Color</span>
                </div>
                <span className="text-white/80 text-base mt-6 mb-2">Down Arrow Icon Styles</span>
                <div className="grid grid-cols-3 gap-3 w-full justify-center items-center">
                  {DOWN_ARROW_ICONS.map((iconObj, idx) => (
                    <button
                      key={iconObj.name}
                      className={`inline-block p-2 rounded flex flex-col items-center justify-center border border-white/20 cursor-pointer ${selectedDownArrowIcon.name === iconObj.name ? 'bg-emerald-500/30 font-bold' : 'bg-white/10 text-white'}`}
                      onClick={() => setSelectedDownArrowIcon(iconObj)}
                      type="button"
                    >
                      <span className="w-7 h-7 flex items-center justify-center">
                        {React.cloneElement(iconObj.icon, customNewChatIconColor ? { style: { color: customNewChatIconColor } } : {})}
                      </span>
                      <span className="text-xs mt-1">{iconObj.name}</span>
                    </button>
                  ))}
                </div>
                <span className="text-white/80 text-xs mt-2">Pick a down arrow style for the header</span>
              </div>
            ) : sidebarOverlay === 'Text' ? (
              <div className="flex flex-col items-center mt-4 w-full gap-2">
                {["Bold", "Italic", "Underline", "Strikethrough", "Monospace", "Serif", "Sans-serif", "Uppercase", "Lowercase", "Capitalize", "Shadow", "Outline", "Gradient", "Highlight", "Small Caps"].map((style) => (
                  <button
                    key={style}
                    className={`text-white/90 text-sm w-full text-center py-1 rounded hover:bg-white/10 cursor-pointer ${selectedTextStyle === style ? 'bg-emerald-500/30 font-bold' : ''}`}
                    onClick={() => setSelectedTextStyle(style)}
                    type="button"
                  >
                    <span
                      style={{
                        fontWeight: style === 'Bold' ? 700 : 400,
                        fontStyle: style === 'Italic' ? 'italic' : undefined,
                        textDecoration:
                          style === 'Underline' ? 'underline' :
                          style === 'Strikethrough' ? 'line-through' : undefined,
                        fontFamily:
                          style === 'Monospace' ? 'monospace' :
                          style === 'Serif' ? 'serif' :
                          style === 'Sans-serif' ? 'sans-serif' : undefined,
                        textTransform:
                          style === 'Uppercase' ? 'uppercase' :
                          style === 'Lowercase' ? 'lowercase' :
                          style === 'Capitalize' ? 'capitalize' : undefined,
                        textShadow: style === 'Shadow' ? '2px 2px 4px #00000055' : undefined,
                        WebkitTextStroke: style === 'Outline' ? '1px white' : undefined,
                        background: style === 'Gradient' ? 'linear-gradient(90deg, #10b981, #3b82f6)' :
                          style === 'Highlight' ? '#fde68a' : undefined,
                        WebkitBackgroundClip: style === 'Gradient' ? 'text' : undefined,
                        WebkitTextFillColor: style === 'Gradient' ? 'transparent' : undefined,
                        color: style === 'Highlight' ? '#222' : undefined,
                        fontVariant: style === 'Small Caps' ? 'small-caps' : undefined,
                        letterSpacing: style === 'Small Caps' ? '0.08em' : undefined,
                        fontSize: style === 'Small Caps' ? '0.95em' : undefined
                      }}
                    >
                      {style}
                    </span>
                  </button>
                ))}
                <div className="mt-4 w-full">
                  <span className="text-white/80 text-xs mb-1 block">Text Color</span>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="color"
                        value={customTextColor || "#ffffff"}
                        onChange={e => { setCustomTextColor(e.target.value); setSelectedTextColor('custom'); }}
                        className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                      />
                      <span className="text-white/80 text-xs">Custom Color</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : sidebarOverlay === 'Background' ? (
              <div className="flex flex-col items-center mt-4 w-full gap-2">
                {BACKGROUND_COLORS.map((color) => (
                  <button
                    key={color.name}
                    className={`flex items-center w-full gap-3 py-1 px-2 rounded hover:bg-white/10 cursor-pointer ${selectedBgColor === color.class ? 'bg-emerald-500/30 font-bold' : ''}`}
                    onClick={() => setSelectedBgColor(color.class)}
                    type="button"
                  >
                    <span className={`inline-block w-6 h-6 rounded ${color.swatch} border border-white/20`}></span>
                    <span className="text-white/90 text-sm">{color.name}</span>
                  </button>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="color"
                    value={customBgColor || "#0f766e"}
                    onChange={e => { setCustomBgColor(e.target.value); setSelectedBgColor(e.target.value); }}
                    className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                  />
                  <span className="text-white/80 text-xs">Custom Color</span>
                </div>
                {/* Upload Image for Background */}
                <div className="flex flex-col items-center gap-2 mt-4 w-full">
                  <label className="text-white/80 text-xs mb-1">Upload Background Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs text-white bg-white/10 rounded border border-white/20 cursor-pointer"
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const url = ev.target?.result as string;
                          setCustomBgColor(''); // Remove color if image is set
                          setSelectedBgColor(url); // Use data URL as bg
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {selectedBgColor && selectedBgColor.startsWith('data:image') && (
                    <div className="w-full mt-2 flex flex-col items-center">
                      <span className="text-white/70 text-xs mb-1">Preview:</span>
                      <div className="w-24 h-16 rounded border border-white/20 overflow-hidden bg-white/10">
                        <Image src={selectedBgColor} alt="Background Preview" className="object-cover w-full h-full" fill />
                      </div>
                      <button
                        className="mt-2 px-2 py-1 text-xs rounded bg-red-500/70 text-white hover:bg-red-600"
                        onClick={() => setSelectedBgColor(BACKGROUND_COLORS[0].class)}
                        type="button"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : sidebarOverlay === 'Header' ? (
              <div className="flex flex-col items-center mt-4 w-full gap-4">
                {/* Upload Logo for Header - moved to top */}
                <div className="w-full mb-2 flex flex-col items-center gap-2">
                  <label className="text-white/80 text-xs mb-1">Upload Header Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs text-white bg-white/10 rounded border border-white/20 cursor-pointer"
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const url = ev.target?.result as string;
                          setCustomHeaderLogo(url);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {customHeaderLogo && (
                    <div className="w-full mt-2 flex flex-col items-center">
                      <span className="text-white/70 text-xs mb-1">Preview:</span>
                      <div className="w-16 h-16 rounded-full border border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
                        <Image src={customHeaderLogo} alt="Header Logo Preview" className="object-cover w-full h-full rounded-full" fill />
                      </div>
                      <button
                        className="mt-2 px-2 py-1 text-xs rounded bg-red-500/70 text-white hover:bg-red-600"
                        onClick={() => setCustomHeaderLogo("")}
                        type="button"
                      >
                        Remove Logo
                      </button>
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <span className="text-white/80 text-xs mb-1 block">Header Shape</span>
                  <div className="flex flex-col gap-2">
                    {HEADER_STYLES.map((style) => (
                      <button
                        key={style.name}
                        className={`w-full py-1 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-sm flex items-center gap-2 ${selectedHeaderStyle === style.class ? 'bg-emerald-500/30 font-bold' : ''}`}
                        onClick={() => setSelectedHeaderStyle(style.class)}
                        type="button"
                      >
                        <span className={`inline-block w-7 h-7 bg-white/10 border border-white/20 ${style.class}`}></span>
                        {style.name}
                      </button>
                    ))}
                  </div>
                  {/* Editable Assistant Bot text */}
                  <div className="mt-4">
                    <span className="text-white/80 text-xs mb-1 block">Header Title</span>
                    <input
                      type="text"
                      value={assistantBotText}
                      onChange={e => setAssistantBotText(e.target.value)}
                      className="w-full bg-white/10 text-white rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="Edit Assistant Bot text..."
                    />
                  </div>
                </div>
                <div className="w-full mt-2">
                  <span className="text-white/80 text-xs mb-1 block">Header Background</span>
                  <div className="flex flex-col gap-2">
                    {HEADER_COLORS.map((color) => (
                      <button
                        key={color.name}
                        className={`w-full py-1 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-sm flex items-center gap-2 ${selectedHeaderColor === color.class ? 'bg-emerald-500/30 font-bold' : ''}`}
                        onClick={() => setSelectedHeaderColor(color.class)}
                        type="button"
                      >
                        <span className={`inline-block w-7 h-7 ${color.class} border border-white/20 rounded`}></span>
                        {color.name}
                      </button>
                    ))}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="color"
                        value={customHeaderColor || "#10b981"}
                        onChange={e => { setCustomHeaderColor(e.target.value); setSelectedHeaderColor(e.target.value); }}
                        className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                      />
                      <span className="text-white/80 text-xs">Custom Color</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : sidebarOverlay === 'Footer' ? (
              <div className="flex flex-col items-center mt-4 w-full gap-4">
                <div className="w-full">
                  <span className="text-white/80 text-xs mb-1 block">Footer Shape</span>
                  <div className="flex flex-col gap-2">
                    {FOOTER_STYLES.map((style) => (
                      <button
                        key={style.name}
                        className={`w-full py-1 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-sm flex items-center gap-2 ${selectedFooterStyle === style.class ? 'bg-emerald-500/30 font-bold' : ''}`}
                        onClick={() => setSelectedFooterStyle(style.class)}
                        type="button"
                      >
                        <span className={`inline-block w-7 h-7 bg-white/10 border border-white/20 ${style.class}`}></span>
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-full mt-2">
                  <span className="text-white/80 text-xs mb-1 block">Footer Background</span>
                  <div className="flex flex-col gap-2">
                    {FOOTER_COLORS.map((color) => (
                      <button
                        key={color.name}
                        className={`w-full py-1 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-sm flex items-center gap-2 ${selectedFooterColor === color.class ? 'bg-emerald-500/30 font-bold' : ''}`}
                        onClick={() => setSelectedFooterColor(color.class)}
                        type="button"
                      >
                        <span className={`inline-block w-7 h-7 ${color.class} border border-white/20 rounded`}></span>
                        {color.name}
                      </button>
                    ))}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="color"
                        value={customFooterColor || "#10b981"}
                        onChange={e => { setCustomFooterColor(e.target.value); setSelectedFooterColor(e.target.value); }}
                        className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                      />
                      <span className="text-white/80 text-xs">Custom Color</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : sidebarOverlay === 'Input Bar' ? (
              <div className="flex flex-col items-center mt-4 w-full gap-4">
                <div className="w-full">
                  <span className="text-white/80 text-xs mb-1 block">Input Bar Shape & Style</span>
                  <div className="flex flex-col gap-2">
                    {INPUT_BAR_STYLES.map((style) => (
                      <button
                        key={style.name}
                        className={`w-full py-1 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-sm flex items-center gap-2 ${selectedInputBarStyle.name === style.name ? 'bg-emerald-500/30 font-bold' : ''}`}
                        onClick={() => setSelectedInputBarStyle(style)}
                        type="button"
                      >
                        <span className={`inline-block w-7 h-7 bg-white/10 border border-white/20 ${style.class}`}></span>
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-full mt-2">
                  <span className="text-white/80 text-xs mb-1 block">Input Bar Background</span>
                  <div className="flex flex-col gap-2">
                    {INPUT_BAR_COLORS.map((color) => (
                      <button
                        key={color.name}
                        className={`w-full py-1 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-sm flex items-center gap-2 ${selectedInputBarColor === color.class ? 'bg-emerald-500/30 font-bold' : ''}`}
                        onClick={() => setSelectedInputBarColor(color.class)}
                        type="button"
                      >
                        <span className={`inline-block w-7 h-7 ${color.class} border border-white/20 rounded`}></span>
                        {color.name}
                      </button>
                    ))}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="color"
                        value={customInputBarColor || "#0e7490"}
                        onChange={e => { setCustomInputBarColor(e.target.value); setSelectedInputBarColor(e.target.value); }}
                        className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                      />
                      <span className="text-white/80 text-xs">Custom Color</span>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-2">
                  <span className="text-white/80 text-xs mb-1 block">Input Placeholder</span>
                  <input
                    type="text"
                    value={inputPlaceholder}
                    onChange={e => setInputPlaceholder(e.target.value)}
                    className="w-full bg-white/10 text-white rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    placeholder="Edit placeholder..."
                  />
                </div>
              </div>
            ) : sidebarOverlay === 'Send' ? (
              <div className="flex flex-col items-center mt-4 w-full gap-4">
                <div className="w-full">
                  <span className="text-white/80 text-xs mb-1 block">Send Button Style</span>
                  <div className="flex flex-col gap-2">
                    {SEND_BUTTON_STYLES.map((style) => (
                      <button
                        key={style.name}
                        className={`w-full py-1 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-sm flex items-center gap-2 ${selectedSendButtonStyle.name === style.name ? 'bg-emerald-500/30 font-bold' : ''}`}
                        onClick={() => setSelectedSendButtonStyle(style)}
                        type="button"
                      >
                        <span className={`inline-block w-7 h-7 ${style.class}`}></span>
                        {style.name}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <span className="text-white/80 text-xs mb-1 block">Custom Color</span>
                    <input
                      type="color"
                      value={customSendButtonColor || "#10b981"}
                      onChange={e => setCustomSendButtonColor(e.target.value)}
                      className="w-10 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                      style={{ padding: 0 }}
                    />
                    <span className="ml-2 text-white/80 text-xs">Pick a custom color</span>
                  </div>
                </div>
                <div className="w-full mt-2">
                  <span className="text-white/80 text-xs mb-1 block">Send Icon Style</span>
                  <div className="flex flex-col gap-2">
                    {SEND_ICONS.map((iconObj) => (
                      <button
                        key={iconObj.name}
                        className={`w-full py-1 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-sm flex items-center gap-2 ${selectedSendIcon.name === iconObj.name ? 'bg-emerald-500/30 font-bold' : ''}`}
                        onClick={() => setSelectedSendIcon(iconObj)}
                        type="button"
                      >
                        <span className="inline-block w-7 h-7 flex items-center justify-center">
                          <iconObj.icon size={22} />
                        </span>
                        {iconObj.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : sidebarOverlay === 'responce loding ' ? (
              <div className="flex flex-col items-center mt-4 w-full gap-4">
                <span className="text-white/80 text-xs mb-1 block">Select Loading Animation</span>
                <div className="flex flex-col gap-2 w-full">
                  {LOADING_ANIMATIONS.map((anim) => (
                    <button
                      key={anim.name}
                      className={`w-full py-2 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-sm flex items-center gap-3 ${selectedLoadingAnimation && selectedLoadingAnimation.name === anim.name ? 'bg-emerald-500/30 font-bold' : ''}`}
                      onClick={() => setSelectedLoadingAnimation(anim)}
                      type="button"
                    >
                      <span className="inline-block">{anim.component ? anim.component() : null}</span>
                      {anim.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : sidebarOverlay === 'responce card' ? (
              <div className="flex flex-col items-center mt-4 w-full gap-4">
                {/* Upload Logo for Response Card - top */}
                <div className="w-full mb-2 flex flex-col items-center gap-2">
                  <label className="text-white/80 text-xs mb-1">Upload Response Card Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs text-white bg-white/10 rounded border border-white/20 cursor-pointer"
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const url = ev.target?.result as string;
                          setCustomResponseLogo(url);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {customResponseLogo && (
                    <div className="w-full mt-2 flex flex-col items-center">
                      <span className="text-white/70 text-xs mb-1">Preview:</span>
                      <div className="w-12 h-12 rounded-full border border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
                        <Image src={customResponseLogo} alt="Response Logo Preview" className="object-cover w-full h-full rounded-full" fill />
                      </div>
                      <button
                        className="mt-2 px-2 py-1 text-xs rounded bg-red-500/70 text-white hover:bg-red-600"
                        onClick={() => setCustomResponseLogo("")}
                        type="button"
                      >
                        Remove Logo
                      </button>
                    </div>
                  )}
                </div>
                {/* Minimize logo text with click box */}
                <div className="w-full flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="showResponseLogo"
                    checked={showResponseLogo}
                    onChange={e => setShowResponseLogo(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4"
                  />
                  <label htmlFor="showResponseLogo" className="text-white/80 text-xs cursor-pointer">Minimize logo text</label>
                </div>
                <span className="text-white/80 text-xs mb-1 block">Select Response Card Style</span>
                <div className="flex flex-col gap-2 w-full">
                  {RESPONSE_CARD_STYLES.map((style) => (
                    <button
                      key={style.name}
                      className={`w-full py-2 px-2 rounded hover:bg-white/10 cursor-pointer text-white/90 text-sm flex items-center gap-3 ${selectedResponseCardStyle.name === style.name ? 'bg-emerald-500/30 font-bold' : ''}`}
                      onClick={() => setSelectedResponseCardStyle(style)}
                      type="button"
                    >
                      <span className={`inline-block w-7 h-7 bg-white/10 border border-white/20 ${style.shape}`}></span>
                      <span className="inline-block font-semibold">{style.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-white/80 text-base mt-4">This is the {sidebarOverlay} overlay content.</span>
            )}
          </div>
        </div>
      )}
      {/* Centered Chat Box */}
      <div className="flex-1 flex justify-center items-center">
        <div
          className={`relative z-10 flex flex-col overflow-hidden shadow-2xl border border-gray-200
            ${selectedUiShape === 'hexigrid-shape' ? 'hexigrid-shape' : selectedUiShape || 'rounded-xl'}
            ${selectedBgColor && selectedBgColor.includes('gradient') ? selectedBgColor : ''}
            ${selectedBgColor && selectedBgColor.startsWith('data:image')
              ? ''
              : selectedBgColor && selectedBgColor.startsWith('#')
                ? ''
                : customBgColor && selectedBgColor === customBgColor
                  ? ''
                  : (!selectedBgColor || selectedBgColor === '') ? 'bg-white' : ''}
            ${templateActive ? `${selectedUiTemplate.card} ${selectedUiTemplate.text} ${selectedUiTemplate.anim}` : ''}
          `}

          style={{
            width: chatbotBoxWidth,
            height: chatbotBoxHeight,
            marginLeft:
              chatbotBoxWidth <= 350
                ? '1000px'
                : chatbotBoxWidth >= 600
                  ? '750px'
                  : '900px',
            marginTop:
              chatbotBoxHeight >= 600
                ? '0px'
                : '-60px',
            ...(selectedBgColor && selectedBgColor.startsWith('data:image')
              ? {}
              : selectedBgColor && selectedBgColor.startsWith('#')
                ? { background: selectedBgColor }
                : customBgColor && selectedBgColor === customBgColor
                  ? { background: customBgColor }
                  : {})
          }}
        >
          {/* Priority: image > custom color > gradient class/template */}
          {selectedBgColor && selectedBgColor.startsWith('data:image') ? (
            <div
              className="absolute inset-0 -z-10 bg-cover bg-center"
              style={{ backgroundImage: `url('${selectedBgColor}')` }}
            />
          ) : selectedBgColor && selectedBgColor.startsWith('#') ? (
            <div
              className="absolute inset-0 -z-10"
              style={{ background: selectedBgColor }}
            />
          ) : customBgColor && selectedBgColor === customBgColor ? (
            <div
              className="absolute inset-0 -z-10"
              style={{ background: customBgColor }}
            />
          ) : (() => {
            // Find the swatch for the selectedBgColor
            const bgObj = BACKGROUND_COLORS.find(c => c.class === selectedBgColor);
            if (bgObj) {
              return <div className={`absolute inset-0 -z-10 ${bgObj.swatch}`} />;
            }
            // Fallback for other Tailwind classes
            if (selectedBgColor && selectedBgColor.startsWith('bg-')) {
              return <div className={`absolute inset-0 -z-10 ${selectedBgColor}`} />;
            }
            if (selectedBgColor && selectedBgColor !== '') {
              return <div className={`absolute inset-0 -z-10 ${selectedBgColor}`} />;
            }
            return <div className="absolute inset-0 -z-10 bg-white" />;
          })()}
          {/* Header */}
          {selectedHeaderStyle !== "hidden" && (
            <div
              className={`p-1 flex items-center justify-between ${selectedHeaderStyle} ${
                selectedHeaderColor && (selectedHeaderColor.includes('gradient') || selectedHeaderColor.startsWith('bg-') || selectedHeaderColor === 'bg-white')
                  ? selectedHeaderColor
                  : ''
              }`}
              style={{
                background:
                  customHeaderColor && selectedHeaderColor === customHeaderColor
                    ? customHeaderColor
                    : selectedHeaderColor && selectedHeaderColor.startsWith('#')
                      ? selectedHeaderColor
                      : undefined,
                height: getResponsiveSize(48)
              }}
            >
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center bg-black/30 backdrop-blur ${selectedHeaderStyle}`}
                  style={{
                    width: getResponsiveSize(40),
                    height: getResponsiveSize(40),
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Logo only, no icon here */}
                  {customHeaderLogo ? (
                    <Image src={customHeaderLogo} alt="Header Logo" style={{objectFit: 'cover', borderRadius: '50%', display: 'block'}} width={40} height={40} />
                  ) : (
                    <Image src="/favicon.png" alt="Header Logo" style={{objectFit: 'cover', borderRadius: '50%', display: 'block'}} width={40} height={40} />
                  )}
                </div>
                <span
                  className={`text-white ${getTextStyleClass(selectedTextStyle)} ${selectedTextColor !== "custom" ? selectedTextColor : ""}
                    ${selectedTextStyle === "Bold" ? "font-bold" : ""}
                    ${selectedTextStyle === "Italic" ? "italic" : ""}
                    ${selectedTextStyle === "Underline" ? "underline" : ""}
                    ${selectedTextStyle === "Strikethrough" ? "line-through" : ""}
                    ${selectedTextStyle === "Monospace" ? "font-mono" : ""}
                    ${selectedTextStyle === "Serif" ? "font-serif" : ""}
                    ${selectedTextStyle === "Sans-serif" ? "font-sans" : ""}
                    ${selectedTextStyle === "Uppercase" ? "uppercase" : ""}
                    ${selectedTextStyle === "Lowercase" ? "lowercase" : ""}
                    ${selectedTextStyle === "Capitalize" ? "capitalize" : ""}
                    ${selectedTextStyle === "Shadow" ? "drop-shadow-md" : ""}
                    ${selectedTextStyle === "Outline" ? "outline outline-2 outline-white" : ""}
                    ${selectedTextStyle === "Gradient" ? "bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text" : ""}
                    ${selectedTextStyle === "Highlight" ? "bg-yellow-200 text-black" : ""}
                    ${selectedTextStyle === "Small Caps" ? "font-sans text-xs uppercase tracking-widest" : ""}
                  `}
                  style={{
                    fontWeight: selectedTextStyle === "Bold" ? 700 : 300,
                    fontStyle: selectedTextStyle === "Italic" ? "italic" : undefined,
                    textDecoration: selectedTextStyle === "Underline" ? "underline" : selectedTextStyle === "Strikethrough" ? "line-through" : undefined,
                    fontFamily:
                      selectedTextStyle === "Monospace" ? "monospace" :
                      selectedTextStyle === "Serif" ? "serif" :
                      selectedTextStyle === "Sans-serif" ? "sans-serif" :
                      "Arial Narrow, Arial, sans-serif",
                    textTransform:
                      selectedTextStyle === "Uppercase" ? "uppercase" :
                      selectedTextStyle === "Lowercase" ? "lowercase" :
                      selectedTextStyle === "Capitalize" ? "capitalize" : undefined,
                    fontSize: selectedTextStyle === "Small Caps" ? getResponsiveSize(11) : getResponsiveSize(20),
                    lineHeight: 1.25,
                    margin: 0,
                    padding: 0,
                    whiteSpace: 'pre-line',
                    color: selectedTextColor === "custom" && customTextColor ? customTextColor : undefined,
                    background: selectedTextStyle === "Highlight" ? "#fde68a" : undefined,
                    WebkitBackgroundClip: selectedTextStyle === "Gradient" ? "text" : undefined,
                    WebkitTextFillColor: selectedTextStyle === "Gradient" ? "transparent" : undefined,
                    marginLeft: '20px'
                  }}
                >{assistantBotText}</span>
              </div>
              <div className="flex items-center pr-2 gap-2">
                {/* Show selected New Chat Icon Style to the left, now clickable */}
                <button
                  type="button"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 4, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  onClick={handleNewChat}
                  aria-label="New Chat"
                >
                  {(() => {
                    function NewChatIconWithTooltip() {
                      const [showTooltip, setShowTooltip] = useState(false);
                      return (
                        <span
                          style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flexDirection: 'column' }}
                          onMouseEnter={() => setShowTooltip(true)}
                          onMouseLeave={() => setShowTooltip(false)}
                        >
                          <span style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {React.cloneElement(selectedNewChatIcon.icon, customNewChatIconColor ? { style: { color: customNewChatIconColor, width: 22, height: 22 } } : { style: { width: 22, height: 22 } })}
                          </span>
                          {showTooltip && (
                            <span
                              style={{
                                position: 'absolute',
                                left: '50%',
                                top: '36px',
                                transform: 'translateX(-50%)',
                                fontSize: selectedTextStyle === "Small Caps" ? getResponsiveSize(11) : getResponsiveSize(13),
                                fontWeight: selectedTextStyle === "Bold" ? 700 : 500,
                                color: selectedTextColor === "custom" && customTextColor ? customTextColor : '#fff',
                                whiteSpace: 'nowrap',
                                zIndex: 100,
                                fontStyle: selectedTextStyle === "Italic" ? "italic" : undefined,
                                textDecoration: selectedTextStyle === "Underline" ? "underline" : selectedTextStyle === "Strikethrough" ? "line-through" : undefined,
                                fontFamily:
                                  selectedTextStyle === "Monospace" ? "monospace" :
                                  selectedTextStyle === "Serif" ? "serif" :
                                  selectedTextStyle === "Sans-serif" ? "sans-serif" :
                                  "Arial Narrow, Arial, sans-serif",
                                textTransform:
                                  selectedTextStyle === "Uppercase" ? "uppercase" :
                                  selectedTextStyle === "Lowercase" ? "lowercase" :
                                  selectedTextStyle === "Capitalize" ? "capitalize" : undefined,
                                background: selectedTextStyle === "Highlight" ? "#fde68a" : undefined,
                                WebkitBackgroundClip: selectedTextStyle === "Gradient" ? "text" : undefined,
                                WebkitTextFillColor: selectedTextStyle === "Gradient" ? "transparent" : undefined
                              }}
                            >
                              New Chat
                            </span>
                          )}
                        </span>
                      );
                    }
                    return <NewChatIconWithTooltip />;
                  })()}
                </button>
                {/* Down arrow icon (SVG) on the right, now clickable */}
                <button
                  type="button"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  onClick={() => {/* TODO: Add down arrow icon click logic here */}}
                  aria-label="Down Arrow"
                >
                  {React.cloneElement(selectedDownArrowIcon.icon, customNewChatIconColor ? { style: { color: customNewChatIconColor } } : {})}
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ fontSize: getResponsiveSize(16) }}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Show logo left of assistant response card, not inside bubble */}
                {message.role === "assistant" && showResponseLogo && (
                  <div style={{ display: 'flex', alignItems: 'center', marginRight: 6 }}>
                    {customResponseLogo ? (
                      <Image src={customResponseLogo} alt="Response Logo" style={{objectFit: 'cover', borderRadius: '50%'}} width={24} height={24} />
                    ) : (
                      <Image src="/modal logo/chatbot1.jpg" alt="Response Logo" style={{objectFit: 'contain', borderRadius: 3}} width={16} height={16} />
                    )}
                  </div>
                )}
                <div
                  className={`
                    max-w-[80%]
                    ${selectedResponseCardStyle.className}
                    ${selectedResponseCardStyle.bubbleClass}
                    ${selectedResponseCardStyle.shape}
                    ${message.role === "user" ? "ml-auto" : ""}
                  `}
                  style={{
                    color:
                      selectedTextColor === "custom" && customTextColor
                        ? customTextColor
                        : undefined,
                  }}
                >
                  {message.role === "assistant" ? (
                    <div
                      className={`flex items-center gap-2 ${getTextStyleClass(selectedTextStyle)}
                        ${selectedTextColor !== "custom" ? selectedTextColor : ""}
                        ${selectedTextStyle === "Bold" ? "font-bold" : ""}
                        ${selectedTextStyle === "Italic" ? "italic" : ""}
                        ${selectedTextStyle === "Underline" ? "underline" : ""}
                        ${selectedTextStyle === "Strikethrough" ? "line-through" : ""}
                        ${selectedTextStyle === "Monospace" ? "font-mono" : ""}
                        ${selectedTextStyle === "Serif" ? "font-serif" : ""}
                        ${selectedTextStyle === "Sans-serif" ? "font-sans" : ""}
                        ${selectedTextStyle === "Uppercase" ? "uppercase" : ""}
                        ${selectedTextStyle === "Lowercase" ? "lowercase" : ""}
                        ${selectedTextStyle === "Capitalize" ? "capitalize" : ""}
                        ${selectedTextStyle === "Shadow" ? "drop-shadow-md" : ""}
                        ${selectedTextStyle === "Outline" ? "outline outline-2 outline-white" : ""}
                        ${selectedTextStyle === "Gradient" ? "bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text" : ""}
                        ${selectedTextStyle === "Highlight" ? "bg-yellow-200 text-black" : ""}
                        ${selectedTextStyle === "Small Caps" ? "font-sans text-xs uppercase tracking-widest" : ""}
                      `}
                      style={{
                        fontWeight: selectedTextStyle === "Bold" ? 700 : 300,
                        fontStyle: selectedTextStyle === "Italic" ? "italic" : undefined,
                        textDecoration: selectedTextStyle === "Underline" ? "underline" : selectedTextStyle === "Strikethrough" ? "line-through" : undefined,
                        fontFamily:
                          selectedTextStyle === "Monospace" ? "monospace" :
                          selectedTextStyle === "Serif" ? "serif" :
                          selectedTextStyle === "Sans-serif" ? "sans-serif" :
                          "Arial Narrow, Arial, sans-serif",
                        textTransform:
                          selectedTextStyle === "Uppercase" ? "uppercase" :
                          selectedTextStyle === "Lowercase" ? "lowercase" :
                          selectedTextStyle === "Capitalize" ? "capitalize" : undefined,
                        fontSize: selectedTextStyle === "Small Caps" ? getResponsiveSize(11) : getResponsiveSize(13),
                        lineHeight: 1.25,
                        margin: 0,
                        padding: 0,
                        whiteSpace: 'pre-line',
                        color: selectedTextColor === "custom" && customTextColor ? customTextColor : undefined,
                        background: selectedTextStyle === "Highlight" ? "#fde68a" : undefined,
                        WebkitBackgroundClip: selectedTextStyle === "Gradient" ? "text" : undefined,
                        WebkitTextFillColor: selectedTextStyle === "Gradient" ? "transparent" : undefined
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <ReactMarkdown
                          components={{
                            h1: ({node, ...props}) => <h1 style={{fontWeight:700, fontSize:getResponsiveSize(13), marginBottom:4}} {...props} />,
                            h2: ({node, ...props}) => <h2 style={{fontWeight:700, fontSize:getResponsiveSize(13), marginBottom:3}} {...props} />,
                            h3: ({node, ...props}) => <h3 style={{fontWeight:600, fontSize:getResponsiveSize(13), marginBottom:2}} {...props} />,
                            p: ({node, ...props}) => <p style={{fontWeight:300, fontSize:getResponsiveSize(13), marginBottom:2}} {...props} />,
                            ul: ({node, ...props}) => <ul style={{marginLeft:16, marginBottom:2, fontSize:getResponsiveSize(13)}} {...props} />,
                            ol: ({node, ...props}) => <ol style={{marginLeft:16, marginBottom:2, fontSize:getResponsiveSize(13)}} {...props} />,
                            li: ({node, ...props}) => <li style={{marginBottom:1, fontSize:getResponsiveSize(13)}} {...props} />,
                            table: ({node, ...props}) => <table style={{borderCollapse:'collapse', width:'100%', marginBottom:4, fontSize:getResponsiveSize(13)}} {...props} />,
                            th: ({node, ...props}) => <th style={{border:'1px solid #ccc', padding:'4px', background:'#222', color:'#fff', fontSize:getResponsiveSize(13)}} {...props} />,
                            td: ({node, ...props}) => <td style={{border:'1px solid #ccc', padding:'4px', fontSize:getResponsiveSize(13)}} {...props} />,
                            strong: ({node, ...props}) => <strong style={{fontWeight:700, fontSize:getResponsiveSize(13)}} {...props} />,
                            em: ({node, ...props}) => <em style={{fontStyle:'italic', fontSize:getResponsiveSize(13)}} {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <span
                      className={`
                        ${selectedResponseCardStyle.textClass}
                        ${getTextStyleClass(selectedTextStyle)}
                        ${selectedTextColor !== "custom" ? selectedTextColor : ""}
                        ${selectedTextStyle === "Bold" ? "font-bold" : ""}
                        ${selectedTextStyle === "Italic" ? "italic" : ""}
                        ${selectedTextStyle === "Underline" ? "underline" : ""}
                        ${selectedTextStyle === "Strikethrough" ? "line-through" : ""}
                        ${selectedTextStyle === "Monospace" ? "font-mono" : ""}
                        ${selectedTextStyle === "Serif" ? "font-serif" : ""}
                        ${selectedTextStyle === "Sans-serif" ? "font-sans" : ""}
                        ${selectedTextStyle === "Uppercase" ? "uppercase" : ""}
                        ${selectedTextStyle === "Lowercase" ? "lowercase" : ""}
                        ${selectedTextStyle === "Capitalize" ? "capitalize" : ""}
                        ${selectedTextStyle === "Shadow" ? "drop-shadow-md" : ""}
                        ${selectedTextStyle === "Outline" ? "outline outline-2 outline-white" : ""}
                        ${selectedTextStyle === "Gradient" ? "bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text" : ""}
                        ${selectedTextStyle === "Highlight" ? "bg-yellow-200 text-black" : ""}
                        ${selectedTextStyle === "Small Caps" ? "font-sans text-xs uppercase tracking-widest" : ""}
                      `}
                      style={{
                        fontWeight: selectedTextStyle === "Bold" ? 700 : 300,
                        fontStyle: selectedTextStyle === "Italic" ? "italic" : undefined,
                        textDecoration: selectedTextStyle === "Underline" ? "underline" : selectedTextStyle === "Strikethrough" ? "line-through" : undefined,
                        fontFamily:
                          selectedTextStyle === "Monospace" ? "monospace" :
                          selectedTextStyle === "Serif" ? "serif" :
                          selectedTextStyle === "Sans-serif" ? "sans-serif" :
                          "Arial Narrow, Arial, sans-serif",
                        textTransform:
                          selectedTextStyle === "Uppercase" ? "uppercase" :
                          selectedTextStyle === "Lowercase" ? "lowercase" :
                          selectedTextStyle === "Capitalize" ? "capitalize" : undefined,
                        fontSize: selectedTextStyle === "Small Caps" ? getResponsiveSize(11) : getResponsiveSize(13),
                        lineHeight: 1.25,
                        display: 'block',
                        margin: 0,
                        padding: 0,
                        whiteSpace: 'pre-line',
                        color: selectedTextColor === "custom" && customTextColor ? customTextColor : undefined,
                        background: selectedTextStyle === "Highlight" ? "#fde68a" : undefined,
                        WebkitBackgroundClip: selectedTextStyle === "Gradient" ? "text" : undefined,
                        WebkitTextFillColor: selectedTextStyle === "Gradient" ? "transparent" : undefined
                      }}
                    >
                      {message.content}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`max-w-[80%] ${selectedResponseCardStyle.className} ${selectedResponseCardStyle.bubbleClass} ${selectedResponseCardStyle.shape}`}>
                  {selectedLoadingAnimation && selectedLoadingAnimation.component
                    ? selectedLoadingAnimation.component()
                    : "Loading..."}
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
          {/* + New Chat Button above footer */}
          {/* ...removed New Chat button from above footer... */}
          {/* Input Bar */}
          <form
            className={`p-1 flex items-center gap-2 border-t border-gray-200 ${selectedFooterStyle} ${
              selectedFooterColor && (selectedFooterColor.includes('gradient') || selectedFooterColor.startsWith('bg-') || selectedFooterColor === 'bg-white')
                ? selectedFooterColor
                : ''
            }`}
            style={{
              background:
                customFooterColor && selectedFooterColor === customFooterColor
                  ? customFooterColor
                  : selectedFooterColor && selectedFooterColor.startsWith('#')
                    ? selectedFooterColor
                    : undefined,
              height: getResponsiveSize(48)
            }}
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
          >
            <input
              type="text"
              className={`flex-1 bg-transparent outline-none ${selectedInputBarStyle.class} ${selectedInputBarColor} ${getTextStyleClass(selectedTextStyle)} ${selectedTextColor !== "custom" ? selectedTextColor : ""}
                ${selectedTextStyle === "Bold" ? "font-bold" : ""}
                ${selectedTextStyle === "Italic" ? "italic" : ""}
                ${selectedTextStyle === "Underline" ? "underline" : ""}
                ${selectedTextStyle === "Strikethrough" ? "line-through" : ""}
                ${selectedTextStyle === "Monospace" ? "font-mono" : ""}
                ${selectedTextStyle === "Serif" ? "font-serif" : ""}
                ${selectedTextStyle === "Sans-serif" ? "font-sans" : ""}
                ${selectedTextStyle === "Uppercase" ? "uppercase" : ""}
                ${selectedTextStyle === "Lowercase" ? "lowercase" : ""}
                ${selectedTextStyle === "Capitalize" ? "capitalize" : ""}
                ${selectedTextStyle === "Shadow" ? "drop-shadow-md" : ""}
                ${selectedTextStyle === "Outline" ? "outline outline-2 outline-white" : ""}
                ${selectedTextStyle === "Gradient" ? "bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text" : ""}
                ${selectedTextStyle === "Highlight" ? "bg-yellow-200 text-black" : ""}
                ${selectedTextStyle === "Small Caps" ? "font-sans text-xs uppercase tracking-widest" : ""}
              `}
              style={{
                ...(customInputBarColor && selectedInputBarColor === customInputBarColor
                  ? { background: customInputBarColor }
                  : {}),
                fontWeight: selectedTextStyle === "Bold" ? 700 : 300,
                fontStyle: selectedTextStyle === "Italic" ? "italic" : undefined,
                textDecoration: selectedTextStyle === "Underline" ? "underline" : selectedTextStyle === "Strikethrough" ? "line-through" : undefined,
                fontFamily:
                  selectedTextStyle === "Monospace" ? "monospace" :
                  selectedTextStyle === "Serif" ? "serif" :
                  selectedTextStyle === "Sans-serif" ? "sans-serif" :
                  "Arial Narrow, Arial, sans-serif",
                textTransform:
                  selectedTextStyle === "Uppercase" ? "uppercase" :
                  selectedTextStyle === "Lowercase" ? "lowercase" :
                  selectedTextStyle === "Capitalize" ? "capitalize" : undefined,
                fontSize: selectedTextStyle === "Small Caps" ? getResponsiveSize(11) : getResponsiveSize(16),
                paddingLeft: getResponsiveSize(16),
                paddingRight: getResponsiveSize(16),
                paddingTop: getResponsiveSize(8),
                paddingBottom: getResponsiveSize(8),
                color: selectedTextColor === "custom" && customTextColor ? customTextColor : undefined,
                background: selectedTextStyle === "Highlight" ? "#fde68a" : undefined,
                WebkitBackgroundClip: selectedTextStyle === "Gradient" ? "text" : undefined,
                WebkitTextFillColor: selectedTextStyle === "Gradient" ? "transparent" : undefined
              }}
              placeholder={inputPlaceholder}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`${selectedSendButtonStyle.class}`}
              style={{
                ...(customSendButtonColor
                  ? { background: customSendButtonColor, borderColor: customSendButtonColor }
                  : {}),
                fontSize: getResponsiveSize(16),
                width: getResponsiveSize(40),
                height: getResponsiveSize(40)
              }}
              disabled={isLoading || !inputText.trim()}
            >
              {React.createElement(selectedSendIcon.icon, { size: getResponsiveSize(24) })}
            </button>
            {/* Mic icon button removed as requested */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default withUiIdGuard(ModernAIAssistantElevenLabs);

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

// Add getBgColorClass helper
function getBgColorClass(bg: string) {
  switch (bg) {
    case "emerald-900":
      return "bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900";
    case "teal-900":
      return "bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900";
    case "cyan-900":
      return "bg-gradient-to-r from-cyan-900 via-cyan-800 to-cyan-600";
    case "blue-900":
      return "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600";
    case "slate-800":
      return "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900";
    case "indigo-900":
      return "bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-600";
    case "rose-900":
      return "bg-gradient-to-r from-rose-900 via-rose-800 to-rose-600";
    case "amber-900":
      return "bg-gradient-to-r from-amber-900 via-amber-800 to-amber-600";
    case "white":
      return "bg-white";
    case "black":
      return "bg-black";
    case "gray-900":
      return "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700";
    case "fuchsia-900":
      return "bg-gradient-to-r from-fuchsia-900 via-fuchsia-800 to-fuchsia-600";
    case "lime-900":
      return "bg-gradient-to-r from-lime-900 via-lime-800 to-lime-600";
    case "orange-900":
      return "bg-gradient-to-r from-orange-900 via-orange-800 to-orange-600";
    default:
      return "bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900";
  }
}

// Loading Animations
const LOADING_ANIMATIONS = [
  {
    name: "Spinner",
    component: () => (
      <div className="w-7 h-7 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
    ),
  },
  {
    name: "Three Dots",
    component: () => (
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
      </div>
    ),
  },
  {
    name: "Pulse",
    component: () => (
      <div className="w-5 h-5 bg-emerald-400 rounded-full animate-pulse"></div>
    ),
  },
  {
    name: "Bar",
    component: () => (
      <div className="flex space-x-1 h-4 items-end">
        <div className="w-1 h-2 bg-emerald-400 animate-[bar1_1s_infinite]" style={{animationDelay:'0s'}}></div>
        <div className="w-1 h-3 bg-emerald-400 animate-[bar2_1s_infinite]" style={{animationDelay:'0.2s'}}></div>
        <div className="w-1 h-4 bg-emerald-400 animate-[bar3_1s_infinite]" style={{animationDelay:'0.4s'}}></div>
        <style>{`@keyframes bar1{0%,100%{height:0.5rem}50%{height:1rem}}@keyframes bar2{0%,100%{height:0.75rem}50%{height:1.5rem}}@keyframes bar3{0%,100%{height:1rem}50%{height:2rem}}`}</style>
      </div>
    ),
  },
  {
    name: "Wave",
    component: () => (
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay:'0s'}}></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay:'0.3s'}}></span>
      </div>
    ),
  },
  {
    name: "Ellipsis",
    component: () => (
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay:'0.2s'}}></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay:'0.4s'}}></span>
      </div>
    ),
  },
  {
    name: "Typing",
    component: () => (
      <div className="flex space-x-1">
        <span className="w-1.5 h-4 bg-emerald-400 rounded animate-bounce" style={{animationDelay:'0s'}}></span>
        <span className="w-1.5 h-4 bg-emerald-400 rounded animate-bounce" style={{animationDelay:'0.1s'}}></span>
        <span className="w-1.5 h-4 bg-emerald-400 rounded animate-bounce" style={{animationDelay:'0.2s'}}></span>
      </div>
    ),
  },
  {
    name: "Circle Scale",
    component: () => (
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: "0s" }}></span>
        <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></span>
        <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></span>
      </div>
    ),
  },
  {
    name: "Growing Bar",
    component: () => (
      <div className="w-16 h-2 bg-emerald-400 rounded animate-pulse"></div>
    ),
  },
  {
    name: "Rotating Square",
    component: () => (
      <div className="w-6 h-6 border-4 border-emerald-400 border-t-transparent border-b-transparent animate-spin rounded"></div>
    ),
  },
  {
    name: "Zigzag",
    component: () => (
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay:'0s'}}></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay:'0.6s'}}></span>
      </div>
    ),
  },
  {
    name: "Fade In Out",
    component: () => (
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay:'0s'}}></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay:'0.3s'}}></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay:'0.6s'}}></span>
      </div>
    ),
  },
];
