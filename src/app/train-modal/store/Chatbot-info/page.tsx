"use client";

import React, { useState, useEffect } from "react";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/app/api/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import HexagonGrid from "@/components/HexagonGrid";
import CustomSidebar from '@/components/sidebar/CustomSidebar';

function PartnerGenerator() {
  const [companyName, setCompanyName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  // TODO: Set this from user context, query, or Firestore
  const [uidesingid, setUidesingid] = useState("");
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    // Only show fetched user
    if (!user) return;
    const uid = user.uid;
    // If uidesingid is not set, fetch the first available one
    if (!uidesingid) {
      try {
        const uidesingCol = collection(db, `users/${uid}/uidesing`);
        const uidesingDocs = await getDocs(uidesingCol);
        if (!uidesingDocs.empty) {
          const firstDoc = uidesingDocs.docs[0];
          setUidesingid(firstDoc.id);
        }
      } catch (err) {
        // Handle error (optional)
      }
      return;
    }
    // If uidesingid is set, fetch the document
    try {
      const docRef = doc(db, `users/${uid}/uidesing`, uidesingid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPartnerName(data.partnerName || "");
        setCompanyName(data.companyName || "");
        // If siteUrl exists, fetch full page text and generate description
        if (data.siteUrl) {
          try {
            setDescription("Loading summary...");
            // Step 1: Get full page text from new API
            const res = await fetch("/api/fetch-page-text", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: data.siteUrl })
            });
            let pageText = "";
            if (res.ok) {
              const result = await res.json();
              pageText = result.text || "";
              // No logging
            }
            // Step 2: Generate description using LLM (AI) from full page text
            let descriptionText = "";
            if (pageText) {
              setDescription("Loading summary...");
              const aiRes = await fetch("/api/openrouter-proxy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  model: "meta-llama/llama-3.1-8b-instruct",
                  messages: [
                    { role: "system", content: "You are a helpful assistant that summarizes website features and services for onboarding." },
                    { role: "user", content: `Summarize the main features, services, and value of this website for onboarding.\nWebsite text:\n${pageText}` }
                  ],
                  temperature: 0.5,
                  max_tokens: 120,
                  top_p: 1,
                  stream: false,
                })
              });
              if (aiRes.ok) {
                const aiData = await aiRes.json();
                // No logging
                descriptionText = (aiData.choices?.[0]?.message?.content || "").trim();
                // Remove unwanted intro phrase if present
                descriptionText = descriptionText.replace(/^Here'?s a summary of the main features, services, and value of [^:]+ for onboarding:\s*/i, "");
              }
            }
            setDescription(descriptionText || "No summary available for this website.");
          } catch (e) {
            setDescription("");
          }
        } else {
          setDescription("");
        }
      }
    } catch (err) {
      // Handle error (optional)
    }
  });
  return () => unsubscribe();
}, [uidesingid]);
  const [description, setDescription] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    // Build prompts for chatbot info and fallback info
    const chatbotPrompt = `Generate a chatbot agent info for the following business. Format output as JSON with keys 'intent' and 'text'. Always use 'chatbot_info' as the intent, do not use platform or company name with .support.\nBusiness/Company Name: ${companyName}\nPartner Name: ${partnerName}\nDescription: ${description}\n\nExample output:\n{\n  "intent": "chatbot_info",\n  "text": "Hello! I'm Hasu, your virtual fashion assistant at Hasutara. How can I help you today?"\n}`;
    const fallbackPrompt = `Generate fallback general chatbot info for the following business. Reply ONLY with a single valid JSON object with keys 'intent' and 'text'. Do not include any extra text, explanation, or markdown. Do not add any heading. Only output the JSON object.\nBusiness/Company Name: ${companyName}\nDescription: ${description}\n\nExample output:\n{\n  "intent": "fallback_general",\n  "text": "I'm your Hasutara Fashion Assistant. I'm here to help with anything fashion-related! I can assist you with browsing our collections, finding the perfect size, tracking orders, or getting style advice. What would you like to know?"\n}\nIMPORTANT: In the fallback text, clearly state that you cannot and will not provide details about other platforms, other websites, or products/services not related to this company. If asked about other companies, websites, or products, say you do not have that information and cannot assist with those requests. Also, mention any services that are NOT provided by the company or platform, based on the description.`;

    try {
      // Chatbot info
      const chatbotRes = await fetch("/api/openrouter-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct",
          messages: [
            { role: "system", content: "You are a helpful assistant that generates chatbot agent info for businesses. Always reply in the requested JSON format." },
            { role: "user", content: chatbotPrompt },
          ],
          temperature: 0.7,
          max_tokens: 120,
          top_p: 1,
          stream: false,
        }),
      });
      let chatbotOutput = "";
      if (chatbotRes.ok) {
        const chatbotData = await chatbotRes.json();
        chatbotOutput = chatbotData.choices?.[0]?.message?.content || "";
        let jsonMatch = chatbotOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) chatbotOutput = jsonMatch[0];
        // Ensure partner name and company name are always included in chatbot_info text
        try {
          const chatbotJson = JSON.parse(chatbotOutput);
          if (chatbotJson.intent === "chatbot_info") {
            let text = chatbotJson.text || "";
            // Check if partner name and company name are present, add if missing
            if (!text.toLowerCase().includes(partnerName.toLowerCase()) && partnerName) {
              text = `Hello! I'm ${partnerName}, your virtual assistant${companyName ? ` at ${companyName}` : ""}. ` + text;
            } else if (!text.toLowerCase().includes(companyName.toLowerCase()) && companyName) {
              text = `Hello! I'm your virtual assistant at ${companyName}. ` + text;
            }
            chatbotJson.text = text;
            chatbotOutput = JSON.stringify(chatbotJson, null, 2);
          }
        } catch (e) {
          // If parsing fails, fallback to original output
        }
      } else {
        chatbotOutput = "Error: Could not generate chatbot info.";
      }

      // Fallback info
      const fallbackRes = await fetch("/api/openrouter-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct",
          messages: [
            { role: "system", content: "You are a helpful assistant that generates fallback chatbot info for businesses. Always reply in the requested JSON format." },
            { role: "user", content: fallbackPrompt },
          ],
          temperature: 0.7,
          max_tokens: 120,
          top_p: 1,
          stream: false,
        }),
      });
      let fallbackOutput = "";
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        fallbackOutput = fallbackData.choices?.[0]?.message?.content || "";
        let jsonMatch = fallbackOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) fallbackOutput = jsonMatch[0];
      } else {
        fallbackOutput = "Error: Could not generate fallback info.";
      }

      // Custom fallback heading and text
      // Only show the JSON blocks, no extra headings or text
      setGeneratedText(`${chatbotOutput}\n\n${fallbackOutput}`);
    } catch (err) {
      setGeneratedText("Error: Could not generate chatbot or fallback info.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Only show fetched user
      if (!user) return;
      const uid = user.uid;
      setCurrentUserId(uid);
      // If uidesingid is not set, fetch the first available one
      if (!uidesingid) {
        try {
          const uidesingCol = collection(db, `users/${uid}/uidesing`);
          const uidesingDocs = await getDocs(uidesingCol);
          if (!uidesingDocs.empty) {
            const firstDoc = uidesingDocs.docs[0];
            setUidesingid(firstDoc.id);
          }
        } catch (err) {
          // Handle error (optional)
        }
        return;
      }
      // If uidesingid is set, fetch the document
      try {
        const docRef = doc(db, `users/${uid}/uidesing`, uidesingid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPartnerName(data.partnerName || "");
          setCompanyName(data.companyName || "");
          // If siteUrl exists, fetch full page text and generate description
          if (data.siteUrl) {
            try {
              setDescription("Loading summary...");
              // Step 1: Get full page text from new API
              const res = await fetch("/api/fetch-page-text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: data.siteUrl })
              });
              let pageText = "";
              if (res.ok) {
                const result = await res.json();
                pageText = result.text || "";
                // No logging
              }
              // Step 2: Generate description using LLM (AI) from full page text
              let descriptionText = "";
              if (pageText) {
                setDescription("Loading summary...");
                const aiRes = await fetch("/api/openrouter-proxy", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    model: "meta-llama/llama-3.1-8b-instruct",
                    messages: [
                      { role: "system", content: "You are a helpful assistant that summarizes website features and services for onboarding." },
                      { role: "user", content: `Summarize the main features, services, and value of this website for onboarding.\nWebsite text:\n${pageText}` }
                    ],
                    temperature: 0.5,
                    max_tokens: 120,
                    top_p: 1,
                    stream: false,
                  })
                });
                if (aiRes.ok) {
                  const aiData = await aiRes.json();
                  // No logging
                  descriptionText = (aiData.choices?.[0]?.message?.content || "").trim();
                  // Remove unwanted intro phrase if present
                  descriptionText = descriptionText.replace(/^Here'?s a summary of the main features, services, and value of [^:]+ for onboarding:\s*/i, "");
                }
              }
              setDescription(descriptionText || "No summary available for this website.");
            } catch (e) {
              setDescription("");
            }
          } else {
            setDescription("");
          }
        }
      } catch (err) {
        // Handle error (optional)
      }
    });
    return () => unsubscribe();
  }, [uidesingid]);
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900 flex">
      <HexagonGrid />
      <CustomSidebar />
      <div className="min-h-screen text-white pt-12 font-sans relative flex w-full pl-72">
        <div className="max-w-6xl w-full mx-auto px-4 flex gap-8">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-8 text-white font-sans">Partner Info</h1>
            <p className="mb-6 text-base text-gray-300 font-sans">Create your partner identity. Add a name, company, and description to generate a unique chatbot profile for your business.</p>
            <div className="bg-gradient-to-br from-white/5 via-blue-900/10 to-white/0 backdrop-blur-md border border-white/20 rounded-xl p-8 mb-8">
              <div className="mb-4">
                <label className="block text-sm text-secondary-cyan mb-2">Partner Name:</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={e => setPartnerName(e.target.value)}
                  placeholder="Enter partner name"
                  className="w-full px-4 py-2 bg-black/20 border border-[#BAFFF5]/20 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-[#BAFFF5]/40"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-secondary-cyan mb-2">Company Name:</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full px-4 py-2 bg-black/20 border border-[#BAFFF5]/20 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-[#BAFFF5]/40"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-secondary-cyan mb-2">Description:</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter description"
                  className="w-full px-4 py-3 min-h-[60px] bg-black/20 border border-[#BAFFF5]/20 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-[#BAFFF5]/40 resize-none scrollbar-thin scrollbar-thumb-[#222] scrollbar-track-transparent"
                />
                <p className="text-xs text-gray-400 mt-2">Please enter your website service or company service details for generating fallback knowledge training.</p>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading || !partnerName.trim() || !description.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-secondary-cyan to-accent-gold text-dark font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all text-base"
                >
                  {loading ? "Generating..." : "Generate"}
                </button>
                {generatedText && (
                  <button
                    type="button"
                    className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-700 text-white font-semibold rounded-lg hover:opacity-90 transition-all text-base"
                    onClick={async () => {
                      if (!currentUserId || !generatedText) return;
                      try {
                        // Extract both JSON blocks using match (compatible with all targets)
                        const jsonBlocks = generatedText.match(/\{[\s\S]*?\}/g) || [];
                        let chatbotIntent = "";
                        let chatbotText = "";
                        let fallbackIntent = "";
                        let fallbackText = "";
                        // Defensive: Try to fix malformed JSON blocks before parsing
                        const safeParseJsonBlock = (block: string) => {
                          if (!block) return null;
                          let fixed = block
                            .replace(/\,(\s*[}\]])/g, '$1')
                            .replace(/\r?\n/g, ' ')
                            .replace(/\s+/g, ' ')
                            .replace(/([\{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1 "$2":')
                            .replace(/\"\s*:\s*'/g, '": "')
                            .replace(/'/g, '"');
                          try {
                            return JSON.parse(fixed);
                          } catch {
                            try {
                              return JSON.parse(block);
                            } catch {
                              return null;
                            }
                          }
                        };
                        // Find the first two JSON blocks, even if extra text is present
                        let chatbotObj = null;
                        let fallbackObj = null;
                        for (let i = 0; i < jsonBlocks.length; i++) {
                          const obj = safeParseJsonBlock(jsonBlocks[i]);
                          if (obj && obj.intent && obj.intent.toLowerCase().includes('chatbot')) {
                            chatbotObj = obj;
                          } else if (obj && obj.intent && obj.intent.toLowerCase().includes('fallback')) {
                            fallbackObj = obj;
                          }
                        }
                        // Save whatever is found, even if incomplete, and merge with existing document
                        const { db } = await import("@/app/api/firebase/firebase");
                        const { doc, setDoc, getDoc } = await import("firebase/firestore");
                        const dataDoc = doc(db, `users/${currentUserId}/allPages/data`);
                        // Get existing data
                        let existingData = {};
                        try {
                          const existingSnap = await getDoc(dataDoc);
                          if (existingSnap.exists()) {
                            existingData = existingSnap.data();
                          }
                        } catch {}
                        await setDoc(dataDoc, {
                          ...existingData,
                          partnerName,
                          companyName,
                          chatbot: chatbotObj ? {
                            intent: chatbotObj.intent || '',
                            text: chatbotObj.text || '',
                          } : {},
                          fallback: fallbackObj ? {
                            intent: fallbackObj.intent || '',
                            text: fallbackObj.text || '',
                          } : {},
                          timestamp: new Date().toISOString(),
                        });
                    alert("Generated Output saved successfully!");
                    setTimeout(() => {
                      window.location.href = "/train-modal/store";
                    }, 2000);
                      } catch (err) {
                        alert("Error saving Generated Output: " + (typeof err === 'object' && err && 'message' in err ? err.message : String(err)));
                      }
                    }}
                  >
                    Store
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end pb-8">
            <div className="w-full h-[430px] rounded-xl bg-gradient-to-br from-white/5 via-blue-900/10 to-white/0 backdrop-blur-md border border-white/20 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#222] scrollbar-track-transparent mt-20">
              <h2 className="text-lg font-bold text-secondary-cyan mb-4">Generated Output</h2>
              {/* Render fallback heading and info with color */}
              <pre className="whitespace-pre-wrap text-gray-200 text-base font-mono">
                {/* Use dangerouslySetInnerHTML for styled fallback heading */}
                <span dangerouslySetInnerHTML={{ __html: generatedText || "Output will appear here..." }} />
              </pre>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        /* Custom scrollbar for output box and textarea */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #222 transparent;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

export default PartnerGenerator;
