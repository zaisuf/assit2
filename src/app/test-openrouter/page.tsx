"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../api/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Send, Mic, MicOff, Bot, Volume2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const MODEL_OPTIONS = [
  { value: "qwen/qwen3-32b", label: "qwen3-32b" },
  { value: "microsoft/phi-4", label: "phi-4" },
  { value: "deepseek/deepseek-r1", label: "DeepSeek R1" },
  { value: "meta-llama/llama-3.1-8b-instruct", label: " Llama 3.1 8B Instruct" },
  { value: "mistralai/ministral-3b", label: "ministral-3b" },
];

const ModernAIAssistantOpenRouter: React.FC = () => {

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(MODEL_OPTIONS[0].value);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const API_COOLDOWN = 6000;
  const [lastApiCall, setLastApiCall] = useState<number>(0);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- Website URL extraction and summary fetch ---
  const extractWebsite = (text: string): string | null => {
    // Simple regex for URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  };

  const fetchWebsiteSummary = async (url: string): Promise<string> => {
    try {
      const res = await fetch("/api/website-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to fetch website summary");
      const data = await res.json();
      // Use 'answer' field from API response
      return data.answer || "";
    } catch (err) {
      return "(Could not fetch website summary.)";
    }
  };

  const callWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 2000) => {
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
  };

  const callOpenRouterAPI = async (message: string, websiteSummary?: string, knowledge?: string) => {
    return callWithRetry(async () => {
      const conversationHistory = messages.map(({ role, content }) => ({
        role,
        content,
      }));
      // If website summary exists, prepend it to the user message
      const userContent = websiteSummary
        ? `Here is a summary of the referenced website:\n${websiteSummary}\n\nUser question: ${message}`
        : message;

      // Dynamic system prompt
      let systemPrompt = "You are a modern house design AI assistant. Keep your responses concise, focused on architecture and interior design. Be direct and informative. Only reply with your final answer for the user. Do not include your reasoning or thought process.";
      if (knowledge) {
        systemPrompt = "You are an AI assistant. Use the following knowledge to answer the user's question. Do not return the knowledge directly. Only reply with your final answer for the user.";
      }

      const response = await fetch("/api/openrouter-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...conversationHistory,
            {
              role: "user",
              content: userContent,
            },
          ],
          temperature: 0.7,
          max_tokens: 200,
          top_p: 1,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      // Use 'content' if available, otherwise fallback to 'reasoning' if present
      const msg = data.choices[0]?.message;
      if (msg?.content && msg.content.trim() !== "") {
        return msg.content;
      } else if (msg?.reasoning && msg.reasoning.trim() !== "") {
        return msg.reasoning;
      } else {
        return "Sorry, I did not get a response from the AI. Please try again.";
      }
    });
  };

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

  const processResponse = (text: string): string => {
    // Remove sequences of four or more asterisks from the response
    return text.replace(/\*{4,}/g, "");
  };

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
      // Fetch knowledge from Firebase (do not return chunk directly)
      let knowledge = "";
      try {
        // Path: /users/uKm7TeDlqgdG2GAhAlehc18cQBb2/jsonFiles/data
        const docRef = doc(db, "users/uKm7TeDlqgdG2GAhAlehc18cQBb2/jsonFiles/data");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // You can adjust this to use a specific field if needed
          knowledge = typeof data === "string" ? data : JSON.stringify(data);
        }
      } catch (e) {
        // Ignore Firebase errors, fallback to normal flow
      }

      // Check for website URL in user message
      const url = extractWebsite(text);
      let websiteSummary = "";
      if (url) {
        websiteSummary = await fetchWebsiteSummary(url);
      }

      // Prepend knowledge to the user message for the AI, but do not return it directly
      let aiInput = text;
      if (knowledge) {
        aiInput = `Here is some background knowledge for your context (do not return this directly):\n${knowledge}\n\nUser question: ${text}`;
      }

      const rawResponse = await callOpenRouterAPI(aiInput, websiteSummary, knowledge);
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
  }, [messages, setMessages, setIsLoading]);

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

  // TEMP: Test Firebase knowledge connection
  const testFirebaseKnowledge = async () => {
    try {
      const docRef = doc(db, "users/uKm7TeDlqgdG2GAhAlehc18cQBb2/jsonFiles/data");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Firebase knowledge:", docSnap.data());
        alert("Firebase knowledge fetched. Check console for details.");
      } else {
        alert("No Firebase knowledge found at the specified path.");
      }
    } catch (e) {
      alert("Error fetching Firebase knowledge. See console.");
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-xl overflow-hidden shadow-2xl border border-white/10">
      {/* Header */}
      {/* TEMP: Firebase knowledge test button */}
      <button onClick={testFirebaseKnowledge} className="absolute top-2 right-2 z-50 bg-yellow-400 text-black px-2 py-1 rounded text-xs">Test Firebase Knowledge</button>
      <div className="p-4 bg-black/20 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 p-[1px]">
            <div className="w-full h-full rounded-xl bg-black/30 backdrop-blur flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-white text-xl font-semibold">from OpenRouter</h3>
            <p className="text-white/60 text-sm">Your architectural companion</p>
          </div>
          <div className="ml-4">
            <select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              className="bg-black/40 text-white rounded-lg px-2 py-1 border border-white/20 focus:outline-none"
              title="Select model"
            >
              {MODEL_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-xl backdrop-blur-sm ${
                message.role === "user"
                  ? "bg-blue-500/20 border border-blue-500/30"
                  : "bg-white/10 border border-white/20"
              }`}
            >
              <p className="text-white">{message.content}</p>
              <div className="text-xs text-white/40 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/20 border-t border-white/10">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputText)}
            placeholder="Ask about modern house design..."
            className="flex-1 bg-white/10 text-white placeholder-white/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
          />
          <button
            onClick={() => (isListening ? stopListening() : startListening())}
            className={`p-2 rounded-lg ${
              isListening
                ? "bg-red-500/20 border border-red-500/30 hover:bg-red-500/30"
                : "bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30"
            } text-white transition-colors`}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={isLoading || !inputText.trim()}
            className={`p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-white transition-colors ${
              isLoading || !inputText.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-500/30"
            }`}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernAIAssistantOpenRouter;
