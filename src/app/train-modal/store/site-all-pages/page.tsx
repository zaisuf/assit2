"use client";

import React, { useState } from "react";
import { auth } from '@/app/api/firebase/firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import HexagonGrid from "@/components/HexagonGrid";
import CustomSidebar from '@/components/sidebar/CustomSidebar';

// Helper to fetch all pages from a website (basic sitemap and anchor crawling)
async function fetchAllPages(url: string): Promise<{name: string, url: string}[]> {
  try {
    // Try to fetch sitemap.xml first
    let baseUrl = url;
    if (!/^https?:\/\//i.test(baseUrl)) baseUrl = 'https://' + baseUrl;
    let sitemapUrl = baseUrl.replace(/\/$/, '') + '/sitemap.xml';
    let res = await fetch(`/api/fetch-sitemap?url=${encodeURIComponent(sitemapUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.urls) && data.urls.length > 0) {
        return data.urls.map((u: string) => ({ name: u.split('/').filter(Boolean).pop() || u, url: u }));
      }
    }
    // Fallback: fetch homepage and extract anchor links
    res = await fetch(`/api/fetch-links?url=${encodeURIComponent(baseUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.links)) {
        return data.links.map((l: {href: string, text: string}) => ({ name: l.text || l.href, url: l.href }));
      }
    }
    return [];
  } catch {
    return [];
  }
}

function SiteAllPages() {
  const [inputUrl, setInputUrl] = useState("");
  const [pages, setPages] = useState<{name: string, url: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = typeof window !== "undefined" ? require('next/navigation').useRouter() : null;
  // Save all detected pages to Firebase and redirect after 2s
  const handleSaveToFirebase = async () => {
    if (!auth.currentUser) {
      toast.error('Please login to save pages');
      return;
    }
    try {
      setIsSaving(true);
      const db = getFirestore();
      const userId = auth.currentUser.uid;
      // Build array of { intent, url }
      const dataToSave = pages.map((item, i) => {
        let intent = item.name
          .replace(/[-_]+/g, ' ')
          .replace(/\.[a-zA-Z0-9]+$/, '')
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .trim()
          .replace(/\s+/g, '_')
          .toLowerCase() || `page_${i+1}`;
        return { intent, url: item.url };
      });
      const jsonRef = doc(db, `users/${userId}/allPages/data`);
      await setDoc(jsonRef, {
        pages: dataToSave,
        timestamp: new Date().toISOString(),
        sourceUrl: inputUrl.trim(),
      });
      toast.success('All pages saved successfully');
      // Wait 2 seconds then redirect to Chatbot-info
      setTimeout(() => {
        if (router) router.push('/train-modal/store/Chatbot-info');
      }, 2000);
    } catch (error) {
      console.error('Error saving pages:', error);
      toast.error('Failed to save pages');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPages([]);
    setLoading(true);
    try {
      const foundPages = await fetchAllPages(inputUrl.trim());
      if (foundPages.length === 0) setError("No pages found or site blocks crawling.");
      setPages(foundPages);
    } catch {
      setError("Failed to fetch pages.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900 flex">
      <HexagonGrid />
      <CustomSidebar />
      <div className="min-h-screen text-white pt-12 font-sans relative flex">
        <div className="flex-1 px-4 font-sans pl-72">
          <div className="mb-8 font-sans">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text font-sans">
              Website All Pages
            </h1>
            <p className="text-gray-300 font-sans">
              Enter your main website URL to detect and list all pages (via sitemap or homepage links).
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-8">
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              placeholder="Enter website URL (e.g. example.com)"
              className="px-4 py-2 bg-dark border border-[#BAFFF5]/20 rounded-lg text-gray-300 font-sans text-sm focus:outline-none focus:border-[#BAFFF5]/40 max-w-md"
              required
            />
            <button
              type="submit"
              disabled={loading || !inputUrl.trim()} 
              className="flex items-center whitespace-nowrap px-4 py-2 bg-gradient-to-r from-secondary-cyan to-accent-gold text-dark font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all font-sans min-w-fit"
            >
              {loading ? "Detecting..." : "Detect Pages"}
            </button>
          </form>
          {error && <div className="text-red-400 mb-4 font-space">{error}</div>}
          {pages.length > 0 && (
            <div className="w-full max-w-screen-xl rounded-none shadow-2xl p-8 flex flex-col border border-white/20 text-white h-[600px] bg-gradient-to-br from-white/5 via-blue-900/10 to-white/0 relative ml-0 mb-8">
              <div className="flex items-center mb-6 relative" style={{ minHeight: '2.5rem' }}>
                {/* Search icon at far left, smaller size */}
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() => setShowSearch(v => !v)}
                  className="mr-2 text-secondary-cyan hover:text-accent-gold focus:outline-none"
                  style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0 }}
                >
                  {/* Smaller magnifier SVG icon */}
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="12.5" y1="12.5" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                {/* Search input bar, shown right next to icon when active */}
                {showSearch && (
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Check your page"
                    className="px-3 py-1 bg-dark border border-[#BAFFF5]/20 rounded-lg text-gray-300 font-sans text-sm focus:outline-none focus:border-[#BAFFF5]/40 w-56 mr-4"
                    autoFocus
                    style={{ minWidth: '140px' }}
                  />
                )}
                {/* Centered header using absolute positioning, always centered */}
                <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
                  <h3 className="font-semibold text-2xl text-secondary-cyan pointer-events-auto" style={{ fontFamily: 'sans-serif' }}>Detected Pages</h3>
                </div>
                {/* Total pages count at right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
                  <div
                    className="px-3 py-1"
                    style={{
                      zIndex: 1,
                      borderRadius: 0,
                      borderStyle: 'solid',
                      borderColor: '#fff',
                      borderWidth: '1px',
                      display: 'inline-block',
                      minWidth: '110px',
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.25)',
                      color: '#fff',
                      fontFamily: 'sans-serif',
                      fontSize: '0.95rem',
                      fontWeight: 400
                    }}
                  >
                    Total pages <span style={{ color: '#FFD700', fontWeight: 500, fontSize: '1.05em' }}>
                      {pages.filter(item =>
                        !showSearch || !searchTerm.trim() ? true : (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.url.toLowerCase().includes(searchTerm.toLowerCase()))
                      ).length.toString().padStart(2, '0')}
                    </span>/unlimited
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveToFirebase}
                    disabled={isSaving || pages.length === 0}
                    className="flex items-center whitespace-nowrap px-4 py-2 bg-gradient-to-r from-secondary-cyan to-accent-gold text-dark font-semibold hover:opacity-90 disabled:opacity-50 transition-all font-sans text-sm min-w-fit"
                    style={{ marginLeft: '0', borderRadius: 0 }}
                  >
                    {isSaving ? 'Saving...' : 'Store'}
                  </button>
                </div>
              </div>
              {/* ...existing code... (search input now in header) */}
              <div className="border-t border-white/20 -mx-8 mb-8" style={{ width: 'calc(100% + 4rem)' }}></div>
              <div className="flex-1 overflow-y-auto" style={{ scrollbarColor: '#BAFFF5 #1e293b', scrollbarWidth: 'thin' }}>
                <ul className="list-decimal list-inside pl-0">
                  {pages
                    .filter(item =>
                      !showSearch || !searchTerm.trim() ? true : (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.url.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map((item, i) => {
                    // Generate intent name from URL slug or fallback
                    let intent = item.name
                      .replace(/[-_]+/g, ' ')
                      .replace(/\.[a-zA-Z0-9]+$/, '')
                      .replace(/[^a-zA-Z0-9 ]/g, '')
                      .trim()
                      .replace(/\s+/g, '_')
                      .toLowerCase() || `page_${i+1}`;
                    return (
                      <li key={item.url || i} className="mb-2">
                        <span className="text-accent-gold font-mono">{item.name}</span>{' '}
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 underline ml-2">{item.url}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
        
       
      </div>
    </div>
  );
}

export default SiteAllPages;
