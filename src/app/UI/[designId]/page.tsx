"use client";
import React, { useState, useEffect } from 'react';
import RenderUiDesign from "@/components/RenderUiDesign";

// Define UIDesignPageProps type inline for dynamic route params (must be string)
type UIDesignPageProps = { params: { designId: string } };

type FetchedData = {
  content: string;
  intent?: string;
  url?: string;
};

export default function Page(props: UIDesignPageProps) {
  // Defensive: fallback for params if undefined (should not happen in client component)
  const designId = typeof props?.params?.designId === 'string' ? props.params.designId : "";
  const [fetchedData, setFetchedData] = useState<FetchedData | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ type: 'bot', content: 'Hello! How can I help you today?' }]);

  // Listen for a custom event dispatched with fetched content (from RenderUiDesign)
  useEffect(() => {
    const handler = (e: any) => {
      setFetchedData(e.detail);
    };
    window.addEventListener('fetched-content', handler);
    return () => window.removeEventListener('fetched-content', handler);
  }, []);

  const [lastApiCall, setLastApiCall] = useState<number>(0);
  const API_COOLDOWN = 6000;

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const callWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 2000): Promise<any> => {
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

  const callGroqAPI = async (text: string) => {
    return callWithRetry(async () => {
      const conversationHistory = chatMessages.map(msg => ({ 
        role: msg.type === 'user' ? 'user' : 'assistant', 
        content: msg.content 
      }));

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "You are a modern house design AI assistant. Keep your responses concise, focused on architecture and interior design. Be direct and informative.",
            },
            ...conversationHistory,
            { role: "user", content: text }
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
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, { type: 'user', content: message }]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await callGroqAPI(message);
      setChatMessages(prev => [...prev, { type: 'bot', content: response }]);
    } catch (error) {
      console.error("Error calling Groq API:", error);
      setChatMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'I apologize, but I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show background if running in the UI design page (not embedded/merchant)
  // Prevent background flash by defaulting to false, then enabling after check
  const [showBg, setShowBg] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // If embedded in iframe, don't show bg
      setShowBg(window.top === window.self);
    }
  }, []);

  const pageContent = (
    <>
      <RenderUiDesign designId={designId} onFetchedContent={setFetchedData} />
      {/* Fetched Content Display */}
      {fetchedData && fetchedData.content && (
        <div style={{position:'fixed',top:24,left:24,zIndex:1000,maxWidth:400,maxHeight:300,overflow:'auto',background:'#18181b',color:'#fff',borderRadius:12,padding:16,boxShadow:'0 2px 16px #0008',fontSize:13,whiteSpace:'pre-wrap'}}>
          <div style={{fontWeight:'bold',marginBottom:8}}>Fetched Page Context</div>
          {fetchedData.intent && (
            <div style={{marginBottom:4}}><b>Intent:</b> <span style={{color:'#38bdf8'}}>{fetchedData.intent}</span></div>
          )}
          {fetchedData.url && (
            <div style={{marginBottom:4}}><b>URL:</b> <a href={fetchedData.url} target="_blank" rel="noopener noreferrer" style={{color:'#60a5fa',textDecoration:'underline'}}>{fetchedData.url}</a></div>
          )}
          <div style={{marginTop:8}}>{fetchedData.content}</div>
        </div>
      )}
    </>
  );

  return showBg ? (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #18181b 0%, #2563eb 100%)',
      position: 'relative',
    }}>{pageContent}</div>
  ) : pageContent;
}
