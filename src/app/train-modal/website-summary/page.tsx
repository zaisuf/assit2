"use client";

import React, { useState } from "react";
import HexagonGrid from "@/components/HexagonGrid";
import CustomSidebar from '@/components/sidebar/CustomSidebar';

function WebsiteSummaryPage() {
  const [url, setUrl] = useState("");
  const [chunks, setChunks] = useState<any[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  // Footer text state removed
  const [footerLinks, setFooterLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matchedSitemapUrls, setMatchedSitemapUrls] = useState<any[]>([]);
  // Removed saveStatus, saving, and handleSaveChunks as saving is not needed for this UI

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setChunks([]);
    setUrls([]);
    try {
      const res = await fetch(`/api/website-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to fetch website summary");
      const data = await res.json();
      setChunks(data.chunks || []);
      setUrls(data.urls || []);
      setMatchedSitemapUrls(data.matchedSitemapUrls || []);
      setFooterLinks(data.footerLinks || []);
    } catch (err: any) {
      setError(err.message || "Unknown error");

    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900 flex">
      <HexagonGrid />
      <CustomSidebar />
      <div className="min-h-screen text-white pt-12 font-sans relative">
        <div className="max-w-4xl mx-auto px-4 font-sans">
        <div className="mb-8 pl-72 font-sans">
          <h1 className="text-3xl font-bold mb-4 text-white font-sans">
            Website
          </h1>
          <p className="text-gray-300 text-sm font-sans">
            Paste your website URL to extract and summarize all pages linked in the footer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-8 pl-72 font-sans">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g. example.com)"
            className="px-4 py-2 bg-dark border border-[#BAFFF5]/20 rounded-lg text-gray-300 font-sans text-sm focus:outline-none focus:border-[#BAFFF5]/40 max-w-md"
            required
          />
          <button
            type="submit"
            disabled={loading || !url.trim()} 
            className="flex items-center whitespace-nowrap px-4 py-2 bg-gradient-to-r from-secondary-cyan to-accent-gold text-dark font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all font-sans min-w-fit"
          >
            {loading ? "Crawling & Summarizing..." : "Get Summary"}
          </button>
        </form>

        {error && <div className="text-red-400 mb-4 pl-72 font-space">{error}</div>}

        {footerLinks.length > 0 && (
          <div className="mb-6 pl-72">
            <h3 className="font-semibold text-lg text-secondary-cyan mb-2 font-space">Footer Links</h3>
            <ul className="list-disc pl-6 text-sm text-gray-300">
              {footerLinks.map((link, i) => (
                <li key={i} className="mb-2">
                  <span className="text-accent-gold font-mono">{link.text}</span>{' '}
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 underline ml-2">{link.href}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {matchedSitemapUrls.length > 0 && (
          <div className="mb-8 pl-72">
            <h3 className="font-semibold text-lg text-secondary-cyan mb-2 font-space">Footer URLs from Sitemap</h3>
            <div className="flex flex-col gap-2">
              {matchedSitemapUrls.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.url}
                    readOnly
                    className="flex-1 border border-[#BAFFF5]/20 rounded-lg px-2 py-1 text-xs bg-dark/40 text-gray-200 font-mono"
                  />
                  <button
                    type="button"
                    className="bg-gradient-to-r from-secondary-cyan to-accent-gold text-dark rounded px-2 py-1 text-xs font-semibold hover:opacity-90"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    {i + 1}
                  </button>
                  <span className="text-xs text-gray-400 font-space">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {chunks.length > 0 && (
          <div className="mb-8 pl-72">
            <h3 className="font-semibold text-lg text-secondary-cyan mb-2 font-space">Page Chunks</h3>
            <ul className="list-decimal pl-6">
              {chunks.map((item, i) => (
                <li key={item.id || i} className="mb-4">
                  <div className="text-xs text-gray-400 mb-1 font-space">ID: {item.id} | Intent: {item.intent} | <span className='text-accent-gold'>{item.footerName}</span></div>
                  <div className="whitespace-pre-wrap text-xs bg-dark/30 border border-[#BAFFF5]/10 rounded-lg p-3 font-mono text-gray-200">
                    {item.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default WebsiteSummaryPage;
