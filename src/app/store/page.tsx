"use client";


import React from "react";
import Link from "next/link";

// Format bytes as human-readable string
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


const NAV_LINKS_BASE = [
  { href: "/train-modal/Chatbot-info", label: "Chatbot-info" },
  { href: "/train-modal/site-all-pages", label: "Website Summary" },
  { href: "/train-modal/manual-chunk", label: "Manual Chunk" },
  { href: "/train-modal/text", label: "Train Data" },
];


const StorePage: React.FC = () => {
  const [showProductDetails, setShowProductDetails] = React.useState(false);
  const [navLinks, setNavLinks] = React.useState(NAV_LINKS_BASE);
  const [headerText, setHeaderText] = React.useState("Store");

  React.useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let uidesingId: string | null = null;
    const fetchCategoryAndProducts = async () => {
      try {
        const { getFirestore, collection, getDocs } = await import("firebase/firestore");
        const { auth } = await import("@/app/api/firebase/firebase");
        const db = getFirestore();
        const user = auth.currentUser;
        if (!user) {
          setShowProductDetails(false);
          setNavLinks(NAV_LINKS_BASE);
          setHeaderText("Store");
          return;
        }
        // Get all uidesing docs
        const uidesingCol = collection(db, `users/${user.uid}/uidesing`);
        const uidesingSnap = await getDocs(uidesingCol);
        if (uidesingSnap.empty) {
          setShowProductDetails(false);
          setNavLinks(NAV_LINKS_BASE);
          setHeaderText("Store");
          return;
        }
        // Check all uidesing docs for ecommerce category and products
        let foundEcommerceWithProducts = false;
        for (const uidesingDoc of uidesingSnap.docs) {
          const uidesingId = uidesingDoc.id;
          const uidesingData = uidesingDoc.data();
          const websiteCategory = uidesingData.websiteCategory;
          console.log('Checking uidesing:', { uidesingId, websiteCategory });
          if (websiteCategory === "ecommerce") {
            const productsCol = collection(db, `users/${user.uid}/uidesing/${uidesingId}/products`);
            const productsSnap = await getDocs(productsCol);
            console.log('Products found for ecommerce:', productsSnap.size);
            if (!productsSnap.empty) {
              foundEcommerceWithProducts = true;
              break;
            }
          }
        }
        if (foundEcommerceWithProducts) {
          setShowProductDetails(true);
          setNavLinks([
            { href: "/train-modal/Chatbot-info", label: "Chatbot-info" },
            { href: "/train-modal/product-details", label: "Product Details" },
            ...NAV_LINKS_BASE.slice(1)
          ]);
          setHeaderText("Store - Product Details");
        } else {
          setShowProductDetails(false);
          setNavLinks(NAV_LINKS_BASE);
          setHeaderText("Store");
        }
      } catch (e) {
        setShowProductDetails(false);
        setNavLinks(NAV_LINKS_BASE);
        setHeaderText("Store");
      }
    };
    fetchCategoryAndProducts();
    import("@/app/api/firebase/firebase").then(({ auth }) => {
      unsubscribe = auth.onAuthStateChanged(() => {
        fetchCategoryAndProducts();
      });
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-black via-blue-950 to-gray-900 flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full bg-gradient-to-r from-gray-800 to-gray-900 border-b border-[#BAFFF5]/20 px-8 py-4 flex gap-6 items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text font-orbitron mr-8">
          {headerText}
        </h1>
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-gray-200 hover:text-secondary-cyan font-semibold px-4 py-2 rounded transition-all${link.label === "Product Details" && !showProductDetails ? " hidden" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-white text-2xl font-bold opacity-60">Welcome to the Store page. Select a tool from the navigation bar above.</div>
      </div>
    </div>
  );
};

export default StorePage;
