"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomSidebar from '@/components/sidebar/CustomSidebar';
import Sidebar from '@/components/sidebar/page';
import HexagonGrid from "@/components/HexagonGrid";

// Format bytes as human-readable string
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const StorePage: React.FC = () => {
  const [showSourcesOverlay, setShowSourcesOverlay] = React.useState(false);
  const [totalPages, setTotalPages] = React.useState<number | null>(null);
  const [sourceUrl, setSourceUrl] = React.useState<string>("");
  const [intent, setIntent] = React.useState<string>("");
  const [khowladge, setKhowladge] = React.useState<string>("");
  const [chatbot, setChatbot] = React.useState<any>(null);
  const [fallback, setFallback] = React.useState<any>(null);
  const [totalTextSize, setTotalTextSize] = React.useState<number | null>(null);
  const [showTrainNow, setShowTrainNow] = React.useState(false);
  const [showProductDetails, setShowProductDetails] = React.useState(false);
  const [mainUrl, setMainUrl] = React.useState<string>("");
  const [totalUrls, setTotalUrls] = React.useState<number | null>(null);
  React.useEffect(() => {
    const fetchPagesInfo = async () => {
      try {
        const { getFirestore, doc, getDoc, collection, getDocs } = await import("firebase/firestore");
        const { auth } = await import("@/app/api/firebase/firebase");
        const db = getFirestore();
        const user = auth.currentUser;
        if (!user) {
          setTotalPages(null);
          setSourceUrl("");
          setIntent("");
          setKhowladge("");
          setChatbot(null);
          setFallback(null);
          setShowProductDetails(false);
          return;
        }
        // Check all uidesing docs for ecommerce category and products
        const uidesingCol = collection(db, `users/${user.uid}/uidesing`);
        const uidesingSnap = await getDocs(uidesingCol);
        let foundEcommerceWithProducts = false;
        for (const uidesingDoc of uidesingSnap.docs) {
          const uidesingId = uidesingDoc.id;
          const uidesingData = uidesingDoc.data();
          const websiteCategory = uidesingData.websiteCategory;
          if (websiteCategory === "ecommerce") {
            const productsCol = collection(db, `users/${user.uid}/uidesing/${uidesingId}/products`);
            const productsSnap = await getDocs(productsCol);
            if (!productsSnap.empty) {
              foundEcommerceWithProducts = true;
              break;
            }
          }
        }
        setShowProductDetails(foundEcommerceWithProducts);
        // Continue with original logic
        const ref = doc(db, `users/${user.uid}/allPages/data`);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          console.log('[StorePage] Firestore data:', data); // Debug log
          setTotalPages(Array.isArray(data.pages) ? data.pages.length : null);
          setSourceUrl(data.sourceUrl || "");
          setIntent(data.intent || "");
          setKhowladge(data.khowladge || data.sourceUrl || "");
          setChatbot(data.chatbot || null);
          setFallback(data.fallback || null);
          setMainUrl(data.sourceUrl || "");
          setTotalUrls(Array.isArray(data.pages) ? data.pages.length : null);
          // Calculate total context size by summing all string field lengths
          let totalSize = 0;
          const countStringBytes = (val: any): number => {
            if (typeof val === 'string') return new TextEncoder().encode(val).length;
            if (Array.isArray(val)) return val.reduce((acc: number, v) => acc + countStringBytes(v), 0);
            if (val && typeof val === 'object') return Object.values(val).reduce((acc: number, v) => acc + countStringBytes(v), 0);
            return 0;
          };
          totalSize = countStringBytes(data);
          setTotalTextSize(totalSize);
        } else {
          console.log('[StorePage] Firestore document does not exist.');
          setTotalPages(null);
          setSourceUrl("");
          setIntent("");
          setKhowladge("");
          setChatbot(null);
          setFallback(null);
          setTotalTextSize(null);
          setMainUrl("");
          setTotalUrls(null);
        }
      } catch (e) {
        console.error('[StorePage] Error fetching Firestore data:', e);
        setTotalPages(null);
        setSourceUrl("");
        setIntent("");
        setKhowladge("");
        setChatbot(null);
        setFallback(null);
        setShowProductDetails(false);
      }
    };
    fetchPagesInfo();
    // Listen for auth state changes to re-fetch info after refresh or navigation
    let unsubscribe: (() => void) | undefined;
    import("@/app/api/firebase/firebase").then(({ auth }) => {
      unsubscribe = auth.onAuthStateChanged(() => {
        fetchPagesInfo();
      });
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);
  // Ref for chatbot/fallback info block
  const router = useRouter();
  const infoRef = React.useRef<HTMLDivElement>(null);
  const handleHeaderClick = () => {
    router.push("/train-modal/store/Chatbot-info");
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-black via-blue-950 to-gray-900 flex relative overflow-visible">
      {/* HexagonGrid background */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <HexagonGrid />
      </div>
      {/* Top Sidebar Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Sidebar />
      </div>
      <CustomSidebar />
      <div className="flex-1 flex flex-col">
        {/* Navigation Bar - moved down with margin */}
        <nav className="w-full flex gap-6 items-center pl-72 mt-8">
          {/* Navigation links moved to box header below */}
        </nav>
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-6xl rounded-none shadow-2xl p-8 flex flex-col border border-white/20 text-white h-[600px] bg-gradient-to-br from-white/5 via-blue-900/10 to-white/0 relative ml-48">
            {/* Info layer moved left side, no background */}
            <div ref={infoRef} className="absolute top-32 left-8 min-h-20 flex flex-col justify-center items-start z-40 pointer-events-none">
              <pre className="text-white text-base font-mono bg-transparent p-0 m-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{
                JSON.stringify({
                  "Main URL": mainUrl || "-",
                  "Total URLs": totalUrls !== null ? totalUrls : "-",
                  "khowladge sources": khowladge ? `${khowladge} {with ${totalPages !== null ? totalPages : "-"} pages}` : "-",
                  ...(chatbot && chatbot.intent && chatbot.text ? { chatbot } : {}),
                  ...(fallback && fallback.intent && fallback.text ? { fallback } : {})
                }, null, 2)
              }</pre>
            </div>
            <div className="flex gap-6 items-center justify-center mb-6">
              <Link
                href={totalPages && totalPages > 0 ? "/train-modal/store/site-all-pages" : "#"}
                className={
                  `text-base font-semibold text-gradient-animated font-sans underline hover:text-secondary-cyan select-none ${totalPages && totalPages > 0 ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`
                }
                title={totalPages && totalPages > 0 ? 'View Website Summary' : 'No pages detected'}
                style={{ pointerEvents: totalPages && totalPages > 0 ? 'auto' : 'none', opacity: totalPages && totalPages > 0 ? 1 : 0.5 }}
              >
                Website Summary
              </Link>
              <span className="mx-2 text-lg font-bold text-white">→</span>
              <span className="flex items-center">
                {(chatbot && chatbot.intent && chatbot.text) || (fallback && fallback.intent && fallback.text) ? (
                  <span
                    className="text-base font-semibold text-gradient-animated font-sans underline cursor-pointer select-none hover:text-secondary-cyan transition-colors"
                    onClick={handleHeaderClick}
                    title="Show Chatbot/Fallback Info"
                  >
                    Chatbot-info
                  </span>
                ) : (
                  <span className="text-base font-semibold text-gradient-animated font-sans cursor-not-allowed opacity-50 select-none">Chatbot-info</span>
                )}
                <span className="mx-2 text-lg font-bold text-white">→</span>
                {showProductDetails ? (
                  <span className="text-base font-semibold text-gradient-animated font-sans select-none ml-4">Product Details</span>
                ) : null}
              </span>
              <span
                className="flex items-center ml-64 mr-2 cursor-pointer select-none relative"
                onMouseEnter={() => setShowSourcesOverlay(true)}
                onMouseLeave={() => setShowSourcesOverlay(false)}
              >
                <svg className="w-5 h-5 text-white mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/></svg>
                <span className="text-base font-semibold text-white mr-1 font-sans">Sources</span>
                {showSourcesOverlay ? (
                  // Up arrow
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 15l-7-7-7 7"/></svg>
                ) : (
                  // Down arrow
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                )}
                {showSourcesOverlay && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-56 min-h-24 bg-black/80 border border-white/30 rounded-lg shadow-2xl z-[999] flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-sm">
                    <div className="w-full bg-white/10 border border-white/20 rounded-none p-2 flex flex-col items-center">
                      <span className="text-white/60 text-xs font-sans">
                        User Context Size:
                        {totalTextSize !== null ? (
                          <span className="text-white text-xs font-bold ml-1">
                            {formatBytes(totalTextSize)}
                          </span>
                        ) : (
                          <span className="text-white text-xs font-bold ml-1">-</span>
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 border border-white/20 rounded-none p-2 flex flex-col items-center">
                      <span className="text-white/60 text-xs font-sans">
                        Total Pages:
                        {totalPages !== null ? (
                          <span className="text-white text-xs font-bold ml-1">
                            {totalPages}
                          </span>
                        ) : (
                          <span className="text-white text-xs font-bold ml-1">-</span>
                        )}
                      </span>
                    </div>
                    {sourceUrl && (
                      <div className="w-full bg-white/10 border border-white/20 rounded-none p-2 flex flex-col items-center">
                        <span className="text-white/60 text-xs font-sans">Source URL:
                          <span className="text-white text-xs font-bold ml-1">{sourceUrl}</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </span>
            <button
              className="ml-0 px-5 py-2 bg-secondary-cyan text-white rounded font-semibold shadow hover:bg-cyan-700 transition-all text-sm font-sans"
              onClick={() => router.push('/train-modal/store/site-all-pages')}
            >
              Let's Train Partner
            </button>
            </div>
            <div className="border-t border-white/20 -mx-8 mb-8" style={{ width: 'calc(100% + 4rem)' }}></div>
            <div className="flex-1 flex items-center justify-center bg-black/30 rounded-lg">
              {/* Removed 'Let's Train Partner' button as requested */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
