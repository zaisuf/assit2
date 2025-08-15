"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/page";
import HexagonGrid from "@/components/HexagonGrid";
import { Pencil, Trash2, Copy } from "lucide-react";
import { db } from "@/app/api/firebase/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const YourAPIPage: React.FC = () => {
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [apiKeyName, setApiKeyName] = useState("");
  const [apiKeys, setApiKeys] = useState<{ name: string; key: string; created: string }[]>([]);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentDesc, setAgentDesc] = useState("");

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const snapshot = await getDocs(collection(db, "users", user.uid, "yourkay"));
        const keys = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            name: data.name || "",
            key: data.key || "",
            created: data.created || ""
          };
        });
        setApiKeys(keys);
      } catch (error) {
        console.error("Error fetching API keys:", error);
      }
    };
    fetchApiKeys();
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900 flex">
      {/* Hexagon Pattern Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HexagonGrid />
      </div>
      <Sidebar />
      {/* Create API Key Overlay styled like agent page */}
      {showCreateKey && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center">
          <div
            className="relative mb-16"
            style={{
              zIndex: 60,
              width: '40rem',
              height: '28rem',
              minWidth: '40rem',
              minHeight: '28rem',
              maxWidth: '40rem',
              maxHeight: '28rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'slideUpFromBottom 0.4s cubic-bezier(0.4,0,0.2,1)',
              boxSizing: 'border-box',
            }}
          >
            <div
              className="relative w-full h-full flex flex-col items-center justify-between p-4 shadow-2xl border border-white/20 font-sans"
              style={{
                borderRadius: '0px',
                background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)',
                boxShadow: '0 8px 40px 0 rgba(72,98,129,0.18)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '2px solid rgba(255,255,255,0.18)',
                overflow: 'hidden',
                boxSizing: 'border-box',
                fontFamily: 'sans-serif',
              }}
            >
              <h2 className="text-3xl font-bold text-white text-center w-full mt-2 mb-2 flex items-center justify-center gap-3 relative">
                <button
                  className="inline-block align-middle absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer bg-transparent border-0 p-0 m-0"
                  style={{ lineHeight: 0 }}
                  onClick={() => setShowCreateKey(false)}
                  aria-label="Close"
                  type="button"
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <span className="mx-auto">Create API Key</span>
              </h2>
              <div className="absolute left-0 right-0 border-t border-white/20" style={{top: 96}}></div>
              <div className="flex flex-col items-center justify-center w-full flex-1 pt-8">
                {!createdKey ? (
                  <>
                    <label className="block text-white/80 text-sm font-semibold mb-0.5" htmlFor="apiKeyName">API Key Name<span className="text-red-400 ml-1">*</span></label>
                    <input
                      id="apiKeyName"
                      type="text"
                      className="w-full px-2 py-1 border-2 border-white/30 rounded-none bg-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] mb-0.5 font-sans text-base"
                      placeholder="Enter API key name"
                      value={apiKeyName}
                      onChange={e => setApiKeyName(e.target.value)}
                      maxLength={32}
                      required
                    />
                    <p className="text-xs text-white/60 mt-2 text-center font-sans">When you create an API key, it is created in your TypeScript/Node.js backend for realtime use.</p>
                    <button
                      className="mt-4 w-40 h-11 border-2 border-white/30 rounded bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-base font-bold tracking-wide transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] flex items-center justify-center pointer-events-auto shadow-xl relative"
                      style={{ boxShadow: '0 4px 24px 0 rgba(72,98,129,0.22)' }}
                      type="button"
                      disabled={!apiKeyName}
                      onClick={async () => {
                        if (!apiKeyName) return;
                        const randomKey = 'sk_' + Array.from({length: 25}, () => Math.random().toString(36)[2]).join('');
                        const newKey = { name: apiKeyName, key: randomKey, created: new Date().toISOString().slice(0, 10) };
                        try {
                          const auth = getAuth();
                          const user = auth.currentUser;
                          if (!user) throw new Error("User not authenticated");
                          await addDoc(collection(db, "users", user.uid, "yourkay"), newKey);
                        } catch (error) {
                          console.error("Error saving API key to Firestore:", error);
                        }
                        setApiKeys(prev => [
                          ...prev,
                          newKey
                        ]);
                        setCreatedKey(randomKey);
                      }}
                    >
                      Submit
                    </button>
                  </>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center">
                    <span className="text-white text-base font-semibold mb-4 text-center">Your new API key has been created. Copy it now, as we will not display it again.</span>
                    <div className="flex items-center gap-2 w-full max-w-md mx-auto">
                      <input
                        type="text"
                        readOnly
                        value={createdKey}
                        className="w-full px-3 py-2 border border-white/20 rounded bg-black/30 text-white font-mono text-sm focus:outline-none"
                      />
                      <button
                        className="text-blue-400 hover:text-blue-600"
                        title="Copy API Key"
                        onClick={() => {
                          navigator.clipboard.writeText(createdKey);
                        }}
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                    <button
                      className="mt-6 px-5 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-none font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition-all border border-white/20"
                      type="button"
                      onClick={() => {
                        setApiKeyName("");
                        setCreatedKey(null);
                        setShowCreateKey(false);
                      }}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <style>{`
            @keyframes slideUpFromBottom {
              from { transform: translateY(120px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
      {/* Add Agent Overlay styled like agent page */}
      {showCreateAgent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center">
          <div className="relative mb-16" style={{ zIndex: 60, width: '32rem', height: '20rem', minWidth: '32rem', minHeight: '20rem', maxWidth: '32rem', maxHeight: '20rem', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'slideUpFromBottom 0.4s cubic-bezier(0.4,0,0.2,1)', boxSizing: 'border-box' }}>
            <div className="relative w-full h-full flex flex-col items-center justify-between p-4 shadow-2xl border border-white/20 font-sans" style={{ borderRadius: '0px', background: 'linear-gradient(135deg, rgba(30,30,40,0.72) 0%, rgba(40,50,70,0.60) 100%)', boxShadow: '0 8px 40px 0 rgba(72,98,129,0.18)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '2px solid rgba(255,255,255,0.18)', overflow: 'hidden', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
              <h2 className="text-2xl font-bold text-white text-center w-full mt-2 mb-2 flex items-center justify-center gap-3 relative">
                <button className="inline-block align-middle absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer bg-transparent border-0 p-0 m-0" style={{ lineHeight: 0 }} onClick={() => setShowCreateAgent(false)} aria-label="Close" type="button">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
                <span className="mx-auto">Add Agent</span>
              </h2>
              <div className="flex flex-col items-center justify-center w-full flex-1 pt-4">
                <label className="block text-white/80 text-sm font-semibold mb-0.5" htmlFor="agentName">Agent Name<span className="text-red-400 ml-1">*</span></label>
                <input
                  id="agentName"
                  type="text"
                  className="w-full px-2 py-1 border-2 border-white/30 rounded-none bg-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] mb-2 font-sans text-base"
                  placeholder="Enter agent name"
                  value={agentName}
                  onChange={e => setAgentName(e.target.value)}
                  maxLength={32}
                  required
                />
                <label className="block text-white/80 text-sm font-semibold mb-0.5" htmlFor="agentDesc">Description</label>
                <input
                  id="agentDesc"
                  type="text"
                  className="w-full px-2 py-1 border-2 border-white/30 rounded-none bg-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] mb-2 font-sans text-base"
                  placeholder="Enter agent description"
                  value={agentDesc}
                  onChange={e => setAgentDesc(e.target.value)}
                  maxLength={64}
                />
                <button
                  className="mt-4 w-32 h-10 border-2 border-white/30 rounded bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-base font-bold tracking-wide transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] flex items-center justify-center pointer-events-auto shadow-xl relative"
                  type="button"
                  disabled={!agentName}
                  onClick={async () => {
                    try {
                      const auth = getAuth();
                      const user = auth.currentUser;
                      if (!user) throw new Error("User not authenticated");
                      await addDoc(collection(db, "users", user.uid, "agent"), {
                        name: agentName,
                        description: agentDesc,
                        created: new Date().toISOString().slice(0, 10),
                      });
                      setAgentName("");
                      setAgentDesc("");
                      setShowCreateAgent(false);
                    } catch (error) {
                      console.error("Error saving agent to Firestore:", error);
                    }
                  }}
                >
                  Add Agent
                </button>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes slideUpFromBottom {
              from { transform: translateY(120px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
      {/* Main content box below the up sidebar */}
      <div className="pt-12">
        <main className="flex-1 flex flex-col items-center justify-center py-16 px-4 relative z-10 font-sans">
          <div className="flex flex-col h-[500px] w-[1300px] rounded-none overflow-hidden shadow-2xl border border-white/10" style={{ marginLeft: '13px' }}>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between rounded-none">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-none bg-gradient-to-br from-purple-400 to-blue-400 p-[1px]">
                  <div className="w-full h-full rounded-none bg-black/30 backdrop-blur flex items-center justify-center">
                    <span role="img" aria-label="API" className="text-white text-xl">🔗</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold">Api Kays</h3>
                  <p className="text-white/60 text-sm">Manage your API keys. Remember to keep your API keys safe to prevent unauthorized access.</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  className="px-5 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-none font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition-all border border-white/20"
                  type="button"
                  onClick={() => setShowCreateKey(true)}
                >
                  + Create API Key
                </button>
                <button
                  className="ml-4 px-5 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-none font-semibold shadow hover:from-green-600 hover:to-blue-600 transition-all border border-white/20"
                  type="button"
                  onClick={() => setShowCreateAgent(true)}
                >
                  + Add Agent
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div className="bg-black/20 p-4 rounded-none backdrop-blur-sm w-full h-full overflow-auto">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-2 px-4 font-semibold">Name</th>
                      <th className="py-2 px-4 font-semibold">Secret Key</th>
                      <th className="py-2 px-4 font-semibold">Created</th>
                      <th className="py-2 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.length === 0 ? (
                      <tr className="border-b border-white/10">
                        <td className="py-2 px-4">Demo Key</td>
                        <td className="py-2 px-4">sk_1234567890abcdef</td>
                        <td className="py-2 px-4">2025-07-11</td>
                        <td className="py-2 px-4 flex gap-3">
                          <button className="text-blue-400 hover:text-blue-600" title="Edit">
                            <Pencil size={18} />
                          </button>
                          <button className="text-red-400 hover:text-red-600" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ) : (
                      apiKeys.map((keyObj, idx) => (
                        <tr key={idx} className="border-b border-white/10">
                          <td className="py-2 px-4">{keyObj.name}</td>
                          <td className="py-2 px-4">{keyObj.key}</td>
                          <td className="py-2 px-4">{keyObj.created}</td>
                          <td className="py-2 px-4 flex gap-3">
                            <button className="text-blue-400 hover:text-blue-600" title="Edit">
                              <Pencil size={18} />
                            </button>
                            <button className="text-red-400 hover:text-red-600" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default YourAPIPage;
