"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const MODEL_OPTIONS = [
  { label: "Llama-3 8B Instruct", value: "meta/meta-llama-3-8b-instruct" },
  { label: "DeepSeek R1", value: "deepseek-ai/deepseek-r1" },
  { label: "IBM Granite 3.0 2B Instruct", value: "ibm-granite/granite-3.0-2b-instruct" },
];

const TestReplicateChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(MODEL_OPTIONS[0].value);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
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
      const res = await fetch("/api/test-replicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, model: selectedModel }),
      });
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("Invalid JSON response from API");
      }
      if (!res.ok) {
        // Show backend error message in chat
        throw new Error(data?.error ? `${data.error}${data.details ? ": " + JSON.stringify(data.details) : ""}` : "API error");
      }
      const assistantMessage: Message = {
        role: "assistant",
        content: data.output || JSON.stringify(data),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err.message || "Unknown error",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-xl overflow-hidden shadow-2xl border border-white/10 max-w-2xl mx-auto mt-10">
      {/* Header */}
      <div className="p-4 bg-black/20 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 p-[1px]">
            <div className="w-full h-full rounded-xl bg-black/30 backdrop-blur flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-white text-xl font-semibold">Replicate Chatbot</h3>
            <p className="text-white/60 text-sm">Test Replicate API with chat UI</p>
          </div>
          <div>
            <select
              className="bg-white/10 text-white rounded-lg px-2 py-1 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              disabled={isLoading}
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
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
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
            placeholder="Ask anything..."
            className="flex-1 bg-white/10 text-white placeholder-white/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
          />
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

export default TestReplicateChat;
