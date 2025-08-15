"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, MicOff, Bot, Volume2 } from "lucide-react";

interface Message {
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
	audioUrl?: string;
}


const EMOTIONS = ["happy", "neutral", "sad", "angry", "excited", "calm"];
const VOICES = ["Friendly_Person", "Professional_Narrator", "Child", "Elderly", "Young_Adult"];
const LANGUAGES = ["English", "Chinese", "Spanish", "Hindi", "French", "German"];
const DEFAULT_DESCRIPTION = "A friendly assistant with a clear, natural voice.";

const MinimaxTTSChatbot: React.FC = () => {
	const [isListening, setIsListening] = useState(false);
	const [transcript, setTranscript] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [lastApiCall, setLastApiCall] = useState<number>(0);
	const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
	const [emotion, setEmotion] = useState("happy");
	const [voice, setVoice] = useState("Friendly_Person");
	const [languageBoost, setLanguageBoost] = useState("English");
	const messageEndRef = useRef<HTMLDivElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);

	const API_COOLDOWN = 6000;

	const scrollToBottom = () => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

	const callGroqAPI = async (message: string) => {
		return callWithRetry(async () => {
			const conversationHistory = messages.map(({ role, content }) => ({
				role,
				content,
			}));
			const response = await fetch("/api/groq", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [
						{
							role: "system",
							content:
								"You are a helpful AI assistant. Keep your responses concise and clear.",
						},
						...conversationHistory,
						{
							role: "user",
							content: message,
						},
					],
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(errorData?.error?.message || `Groq API error: ${response.statusText}`);
			}

			const data = await response.json();
			return data.choices[0].message.content;
		});
	};

	// Use Replicate Minimax TTS API
	const generateSpeech = async (text: string) => {
		return callWithRetry(async () => {
			const response = await fetch("/api/replicate-minimax-tts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					prompt: text,
					description,
					emotion,
					voice_id: voice,
					language_boost: languageBoost,
				}),
			});
			const data = await response.json();
			if (!data.audioUrl) throw new Error("No audioUrl returned from Replicate Minimax TTS");
			return data.audioUrl;
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
	}, []);

	const processResponse = (text: string): string => {
		const sentences = text.split(/[.!?]+/).filter(Boolean);
		const limitedSentences = sentences.slice(0, 3);
		return limitedSentences.map((s) => s.trim()).join(". ") + ".";
	};

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
			const rawResponse = await callGroqAPI(text);
			const processedResponse = processResponse(rawResponse);
			const audioUrl = await generateSpeech(processedResponse);

			const assistantMessage: Message = {
				role: "assistant",
				content: processedResponse,
				timestamp: new Date(),
				audioUrl,
			};
			setMessages((prev) => [...prev, assistantMessage]);

			if (audioRef.current && audioUrl) {
				audioRef.current.src = audioUrl;
				await audioRef.current.play();
			}
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
	};

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

		return (
			<div className="flex flex-col h-[600px] bg-gradient-to-r from-indigo-900 via-blue-900 to-cyan-900 rounded-xl overflow-hidden shadow-2xl border border-white/10">
				{/* Header */}
				<div className="p-4 bg-black/20 border-b border-white/10">
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-400 p-[1px]">
							<div className="w-full h-full rounded-xl bg-black/30 backdrop-blur flex items-center justify-center">
								<Bot size={20} className="text-white" />
							</div>
						</div>
						<div>
							<h3 className="text-white text-xl font-semibold">Minimax TTS Chatbot (Replicate)</h3>
							<p className="text-white/60 text-sm">Your AI voice assistant</p>
						</div>
					</div>
				</div>
				{/* TTS Controls */}
				<div className="p-4 bg-black/10 border-b border-white/10 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
					<div>
						<label className="text-white/80 text-xs font-semibold mr-1">Emotion:</label>
						<select
							value={emotion}
							onChange={e => setEmotion(e.target.value)}
							className="bg-indigo-900/60 text-indigo-100 px-2 py-1 rounded border border-indigo-500/30 text-xs"
						>
							{EMOTIONS.map(e => (
								<option key={e} value={e}>{e}</option>
							))}
						</select>
					</div>
					<div>
						<label className="text-white/80 text-xs font-semibold mr-1">Voice:</label>
						<select
							value={voice}
							onChange={e => setVoice(e.target.value)}
							className="bg-indigo-900/60 text-indigo-100 px-2 py-1 rounded border border-indigo-500/30 text-xs"
						>
							{VOICES.map(v => (
								<option key={v} value={v}>{v.replace(/_/g, " ")}</option>
							))}
						</select>
					</div>
					<div>
						<label className="text-white/80 text-xs font-semibold mr-1">Language:</label>
						<select
							value={languageBoost}
							onChange={e => setLanguageBoost(e.target.value)}
							className="bg-indigo-900/60 text-indigo-100 px-2 py-1 rounded border border-indigo-500/30 text-xs"
						>
							{LANGUAGES.map(l => (
								<option key={l} value={l}>{l}</option>
							))}
						</select>
					</div>
				</div>
				{/* Speaker Description */}
				<div className="p-4 bg-black/10 border-b border-white/10">
					<textarea
						className="w-full rounded-lg p-2 bg-white/10 text-white border border-white/20 focus:outline-none"
						rows={2}
						placeholder="Speaker description (optional)"
						value={description}
						onChange={e => setDescription(e.target.value)}
					/>
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
										? "bg-indigo-500/20 border border-indigo-500/30"
										: "bg-white/10 border border-white/20"
								}`}
							>
								<p className="text-white">{message.content}</p>
								{message.audioUrl && (
									<button
										onClick={() => {
											if (audioRef.current && message.audioUrl) {
												audioRef.current.src = message.audioUrl;
												audioRef.current.play();
											}
										}}
										className="mt-2 text-white/80 hover:text-white transition-colors"
									>
										<Volume2 size={16} />
									</button>
								)}
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
									<div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
									<div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
									<div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
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
							className="flex-1 bg-white/10 text-white placeholder-white/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-white/10"
						/>
						<button
							onClick={() => (isListening ? stopListening() : startListening())}
							className={`p-2 rounded-lg ${
								isListening
									? "bg-red-500/20 border border-red-500/30 hover:bg-red-500/30"
									: "bg-indigo-500/20 border border-indigo-500/30 hover:bg-indigo-500/30"
							} text-white transition-colors`}
						>
							{isListening ? <MicOff size={24} /> : <Mic size={24} />}
						</button>
						<button
							onClick={() => handleSendMessage(inputText)}
							disabled={isLoading || !inputText.trim()}
							className={`p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-white transition-colors ${
								isLoading || !inputText.trim()
									? "opacity-50 cursor-not-allowed"
									: "hover:bg-indigo-500/30"
							}`}
						>
							<Send size={24} />
						</button>
					</div>
				</div>

				{/* Hidden audio element */}
				<audio ref={audioRef} className="hidden" />
			</div>
		);
};

export default MinimaxTTSChatbot;
