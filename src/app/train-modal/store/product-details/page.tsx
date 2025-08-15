"use client";

import React, { useState } from "react";
import { auth } from '@/app/api/firebase/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import HexagonGrid from "@/components/HexagonGrid";
import CustomSidebar from '@/components/sidebar/CustomSidebar';

function ProductDetails() {
  // Fetch all products from a single array document
  const fetchAllProducts = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('Please login to view products');
      return;
    }
    const db = getFirestore();
    const userId = currentUser.uid;
    const docRef = doc(db, `users/${userId}/allproduct/data`);
    const { getDoc } = await import('firebase/firestore');
    const snap = await getDoc(docRef);
    const products: Array<{ name: string; images: string[]; source?: string }> = [];
    if (snap.exists() && Array.isArray(snap.data().products)) {
      snap.data().products.forEach((d: any) => {
        // Extract only the product name from intent (remove 'product-info' and extra text)
        let rawName = d.intent || d.intentJson || '';
        let productName = rawName;
        if (typeof rawName === 'string' && rawName.includes('product-info')) {
          productName = rawName.split('product-info')[0].trim();
        }
        products.push({
          name: productName,
          images: [],
          source: d.source || '',
        });
      });
    }
    setOverlayProducts(products.reverse());
    setShowOverlay(true);
  };
  const [productDetails, setProductDetails] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [overlayProducts, setOverlayProducts] = useState<Array<{ name: string; images: string[]; source?: string }>>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editIntentJson, setEditIntentJson] = useState<string>("");
  const [editProductIndex, setEditProductIndex] = useState<number | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      if (productImages.length + newFiles.length > 2) {
        toast.error('Maximum 2 images allowed');
        return;
      }
      
      const newImages = [...productImages, ...newFiles];
      setProductImages(newImages);
      
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = productImages.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setProductImages(newImages);
    setPreviewUrls(newUrls);
  };

  const handleSaveToFirebase = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('Please login to save product details');
      return;
    }
    if (!productDetails.trim()) {
      toast.error('Please add some product details first');
      return;
    }

    try {
      setIsSaving(true);
      const db = getFirestore();
      const userId = currentUser.uid;
      const docRef = doc(db, `users/${userId}/allproduct/data`);
      // Parse the generated intent JSON
      let parsedIntent: any = {};
      let jsonStr = productDetails.trim();
      // Remove markdown code block if present
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim();
      }
      try {
        parsedIntent = JSON.parse(jsonStr);
      } catch (err) {
        toast.error('Intent JSON is not valid. Not saving.');
        setIsSaving(false);
        return;
      }

      // Upload images to Firebase Storage and get URLs
      const imageUrls: string[] = [];
      if (productImages.length > 0) {
        const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
        const storage = getStorage();
        for (const img of productImages) {
          const storageRef = ref(storage, `users/${userId}/products/${img.name}`);
          await uploadBytes(storageRef, img);
          const url = await getDownloadURL(storageRef);
          imageUrls.push(url);
        }
      }
      parsedIntent["product image"] = imageUrls;
      parsedIntent.timestamp = new Date().toISOString();

      // Read existing products array
      const { getDoc, setDoc } = await import('firebase/firestore');
      let productsArr: any[] = [];
      const existing = await getDoc(docRef);
      if (existing.exists() && Array.isArray(existing.data().products)) {
        productsArr = existing.data().products;
      }
      productsArr.push(parsedIntent);
      await setDoc(docRef, { products: productsArr });

      // Fetch all products for overlay
      const updatedDoc = await getDoc(docRef);
      const products: Array<{ name: string; images: string[]; source?: string }> = [];
      if (updatedDoc.exists() && Array.isArray(updatedDoc.data().products)) {
        updatedDoc.data().products.forEach((d: any) => {
          const validImages = Array.isArray(d["product image"]) ? d["product image"] : [];
          products.push({
            name: d.intent || d.intentJson || '',
            images: validImages,
            source: d.source || '',
          });
        });
      }
      setOverlayProducts(products.reverse());
      setShowOverlay(true);

      setProductImages([]);
      setPreviewUrls([]);

      toast.success('Intent JSON saved to database');
    } catch (error) {
      console.error('Error saving intent JSON:', error);
      toast.error('Failed to save intent JSON');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900 flex">
      <HexagonGrid />
      <CustomSidebar />
      <div className="min-h-screen text-white pt-12 font-sans relative">
        {/* Small box in top right corner */}
        {/* Product box button moved next to Save to Database button */}
        {/* Side Overlay */}
        {showOverlay && (
          <div className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 shadow-2xl z-50 flex flex-col p-6 animate-slideIn">
            <button
              className="self-end mb-4 px-3 py-1 bg-gradient-to-r from-secondary-cyan to-accent-gold rounded text-dark font-bold text-xs"
              onClick={() => setShowOverlay(false)}
            >
              Close
            </button>
            <div className="flex-1 flex flex-col items-start justify-start overflow-y-auto">
              {/* <h2 className="text-lg font-bold text-secondary-cyan mb-2">Product Overlay</h2> */}
              {overlayProducts.length > 0 ? (
                overlayProducts.map((prod, idx) => {
                  let displayName = prod.name;
                  if (typeof displayName === 'string' && displayName.includes('product-info')) {
                    displayName = displayName.split('product-info')[0].trim();
                  }
                  // Get the product URL from prod.source if available
                  let productUrl = '';
                  if (prod && prod.source) {
                    productUrl = prod.source;
                  }
                  return (
                    <div key={prod.name + idx} className="mb-2 w-full flex flex-col items-start">
                      <div className="flex items-center w-full">
                        <p className="text-white text-xs font-thin mb-1 flex-1">{idx + 1}. {displayName}</p>
                        <button
                          className="ml-2 p-1 hover:bg-gray-700 rounded"
                          title="Edit"
                          onClick={async () => {
                            // Fetch all products from Firestore
                            const currentUser = auth.currentUser;
                            if (!currentUser) {
                              toast.error('Please login to edit products');
                              return;
                            }
                            const db = getFirestore();
                            const userId = currentUser.uid;
                            const docRef = doc(db, `users/${userId}/allproduct/data`);
                            const { getDoc } = await import('firebase/firestore');
                            const snap = await getDoc(docRef);
                            if (snap.exists() && Array.isArray(snap.data().products)) {
                              // Find the correct product by index in the reversed array
                              const allProducts = [...snap.data().products].reverse();
                              const product = allProducts[idx];
                              setEditIntentJson(JSON.stringify(product, null, 2));
                              setEditProductIndex(idx);
                              setEditModalOpen(true);
                            } else {
                              toast.error('No product data found');
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-secondary-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.75 18.963l-4.182 1.045a.75.75 0 01-.91-.91l1.045-4.182 12.159-12.429z" />
                          </svg>
                        </button>
      {/* Edit Intent JSON Modal */}
      {editModalOpen && (() => {
        // Parse the JSON for field-level editing
        let parsed: any = {};
        try {
          parsed = JSON.parse(editIntentJson);
        } catch {
          parsed = {};
        }
        const intent = parsed && typeof parsed === 'object' && 'intent' in parsed ? parsed.intent : '';
        const text = parsed && typeof parsed === 'object' && 'text' in parsed ? parsed.text : '';
        const source = parsed && typeof parsed === 'object' && 'source' in parsed ? parsed.source : '';
        const images = parsed && typeof parsed === 'object' && Array.isArray(parsed["product image"]) ? parsed["product image"] : [];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
              <button
                className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-secondary-cyan to-accent-gold rounded text-dark font-bold text-xs"
                onClick={() => setEditModalOpen(false)}
              >
                Close
              </button>
              <h2 className="text-lg font-bold text-secondary-cyan mb-4">Edit Product Intent JSON</h2>
              <div className="mb-3">
                <label className="block text-xs text-secondary-cyan mb-1">Product Name (intent)</label>
                <input
                  className="w-full px-3 py-2 bg-black/20 border border-[#BAFFF5]/20 rounded text-gray-300 text-sm focus:outline-none"
                  value={intent}
                  onChange={e => {
                    let obj = {};
                    try { obj = JSON.parse(editIntentJson); } catch { obj = {}; }
                    (obj as any).intent = e.target.value;
                    setEditIntentJson(JSON.stringify(obj, null, 2));
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="block text-xs text-secondary-cyan mb-1">Text</label>
                <input
                  className="w-full px-3 py-2 bg-black/20 border border-[#BAFFF5]/20 rounded text-gray-300 text-sm focus:outline-none"
                  value={text}
                  onChange={e => {
                    let obj = {};
                    try { obj = JSON.parse(editIntentJson); } catch { obj = {}; }
                    (obj as any).text = e.target.value;
                    setEditIntentJson(JSON.stringify(obj, null, 2));
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="block text-xs text-secondary-cyan mb-1">Source</label>
                <input
                  className="w-full px-3 py-2 bg-black/20 border border-[#BAFFF5]/20 rounded text-gray-300 text-sm focus:outline-none"
                  value={source}
                  onChange={e => {
                    let obj = {};
                    try { obj = JSON.parse(editIntentJson); } catch { obj = {}; }
                    (obj as any).source = e.target.value;
                    setEditIntentJson(JSON.stringify(obj, null, 2));
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="block text-xs text-secondary-cyan mb-1">Product Images</label>
                <div className="flex flex-wrap gap-2">
                  {images.length > 0 ? images.map((img: string, i: number) => (
                    <img key={img + i} src={img} alt={"Product image " + (i+1)} className="w-16 h-16 object-cover rounded border border-[#BAFFF5]/20" />
                  )) : <span className="text-gray-400 text-xs">No images</span>}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-xs text-secondary-cyan mb-1">Full JSON (advanced)</label>
                <textarea
                  className="w-full h-40 bg-black/20 border border-[#BAFFF5]/20 rounded-lg text-gray-300 text-sm p-3 focus:outline-none"
                  value={editIntentJson}
                  onChange={e => setEditIntentJson(e.target.value)}
                  spellCheck={false}
                />
              </div>
              <button
                className="mt-4 px-4 py-2 bg-gradient-to-r from-secondary-cyan to-accent-gold text-dark font-semibold rounded-lg hover:opacity-90 transition-all text-sm"
                onClick={async () => {
                  try {
                    const currentUser = auth.currentUser;
                    if (!currentUser) {
                      toast.error('Please login to save changes');
                      return;
                    }
                    let updatedObj;
                    try {
                      updatedObj = JSON.parse(editIntentJson);
                    } catch {
                      toast.error('Invalid JSON. Please fix before saving.');
                      return;
                    }
                    const db = getFirestore();
                    const userId = currentUser.uid;
                    const docRef = doc(db, `users/${userId}/allproduct/data`);
                    const { getDoc, setDoc } = await import('firebase/firestore');
                    const snap = await getDoc(docRef);
                    if (snap.exists() && Array.isArray(snap.data().products)) {
                      // Reverse to match overlay order
                      const allProducts = [...snap.data().products].reverse();
                      if (editProductIndex !== null && editProductIndex >= 0 && editProductIndex < allProducts.length) {
                        allProducts[editProductIndex] = updatedObj;
                        // Save back in original order
                        const toSave = [...allProducts].reverse();
                        await setDoc(docRef, { products: toSave });
                        toast.success('Product updated!');
                        setEditModalOpen(false);
                        // Refresh overlay
                        fetchAllProducts();
                      } else {
                        toast.error('Product index invalid');
                      }
                    } else {
                      toast.error('No product data found');
                    }
                  } catch (err) {
                    toast.error('Failed to save changes');
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        );
      })()}
                        <button
                          className="ml-1 p-1 hover:bg-gray-700 rounded"
                          title="Delete"
                          onClick={async () => {
                            if (!window.confirm('Are you sure you want to delete this product?')) return;
                            try {
                              const currentUser = auth.currentUser;
                              if (!currentUser) {
                                toast.error('Please login to delete products');
                                return;
                              }
                              const db = getFirestore();
                              const userId = currentUser.uid;
                              const docRef = doc(db, `users/${userId}/allproduct/data`);
                              const { getDoc, setDoc } = await import('firebase/firestore');
                              const snap = await getDoc(docRef);
                              if (snap.exists() && Array.isArray(snap.data().products)) {
                                const productsArr = [...snap.data().products];
                                if (idx >= 0 && idx < productsArr.length) {
                                  productsArr.splice(idx, 1);
                                  await setDoc(docRef, { products: productsArr });
                                  toast.success('Product deleted!');
                                  fetchAllProducts();
                                } else {
                                  toast.error('Product index invalid');
                                }
                              } else {
                                toast.error('No product data found');
                              }
                            } catch (err) {
                              toast.error('Failed to delete product');
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {productUrl ? (
                          <a
                            href={productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-xs text-accent-gold cursor-pointer hover:underline"
                          >
                            view
                          </a>
                        ) : (
                          <span className="ml-1 text-xs text-accent-gold opacity-50 cursor-not-allowed">view</span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-sm">No product info available.</p>
              )}
            </div>
          </div>
        )}
        <div className="max-w-6xl mx-auto px-4 font-sans pl-72">
          <div className="mb-8 font-sans">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text font-sans">
              Product Details
            </h1>
            <p className="text-gray-300 font-sans mb-8">
              Add your product details here to train the AI on your product information.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <button
                  className="w-32 h-8 bg-gradient-to-br from-secondary-cyan to-accent-gold rounded-lg shadow-lg flex items-center justify-center text-dark font-bold text-xs border border-white/30 focus:outline-none"
                  onClick={fetchAllProducts}
                >
                  <svg className="w-4 h-8 mr-2 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  product 00
                </button>
                <button
                  onClick={handleSaveToFirebase}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gradient-to-r from-secondary-cyan to-accent-gold text-dark font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all text-sm"
                >
                  {isSaving ? 'Saving...' : 'store'}
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white font-semibold rounded-lg shadow hover:opacity-90 transition-all text-sm border border-white/20"
                  onClick={async () => {
                    setIsGenerating(true);
                    try {
                      // Use UI state for intent generation
                      if (!productDetails.trim()) {
                        toast.error('Please add some product details first');
                        setIsGenerating(false);
                        return;
                      }
                      const llmPayload = {
                        productName: productDetails.split(' ')[0] || 'Product',
                        details: productDetails,
                        productUrl: productUrl,
                        imageNames: productImages.map(img => img.name),
                      };
                      // Only use uploaded image names in the prompt
                      const prompt = `Generate ONLY a JSON object with this exact structure and nothing else:\n\n{\n  "intent": "(product name) product-info",\n  "text": "(product name, price, colour, fabric, material, product description, , etc.)",\n  "product image": [${llmPayload.imageNames.map(name => `\"${name}\"`).join(', ')}],\n  "source": "${llmPayload.productUrl}"\n}\n\nFor the 'product image' field, use ONLY the uploaded image file names provided below. Ignore any image names that may be present in the pasted product details.\nUploaded product images: ${llmPayload.imageNames.join(', ')}\nDo not add any extra fields, nesting, or explanation. Only return the JSON object in this format.\nProduct details: ${llmPayload.details}`;
                      // Call LLM endpoint
                      const response = await fetch('/api/openrouter-proxy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          messages: [
                            { role: 'system', content: 'You are an assistant that generates product intent JSON.' },
                            { role: 'user', content: prompt }
                          ],
                          model: 'mistralai/ministral-3b',
                        }),
                      });
                      const result = await response.json();
                      let intentJson = '';
                      if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
                        intentJson = result.choices[0].message.content;
                      } else {
                        intentJson = 'Failed to generate intent.';
                      }
                      setProductDetails(intentJson);
                      setProductImages([]);
                      setPreviewUrls([]);
                    } catch (err) {
                      toast.error('Error generating intent');
                    } finally {
                      setIsGenerating(false);
                    }
                  }}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Intent'}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* First Box */}
              <div className="bg-gradient-to-br from-white/5 via-blue-900/10 to-white/0 backdrop-blur-md border border-white/20 rounded-none p-6">
                <p className="text-gray-300 text-sm mb-4">
                  Go to your product pages or database, copy product details and paste here.
                </p>
                {/* URL Input */}
                <div className="mb-4">
                  <label className="block text-sm text-secondary-cyan mb-2">Product URL:</label>
                  <input
                    type="url"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://example.com/product"
                    className="w-full px-4 py-2 bg-black/20 border border-[#BAFFF5]/20 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-[#BAFFF5]/40"
                  />
                </div>
                {/* Product Details Textarea */}
                <div className="w-full h-[200px] rounded-lg border border-[#BAFFF5]/20 bg-black/20 p-4">
                  <textarea 
                    value={productDetails}
                    onChange={(e) => setProductDetails(e.target.value)}
                    className="w-full h-full bg-transparent text-gray-300 text-sm resize-none focus:outline-none scrollbar-thin scrollbar-thumb-[#BAFFF5]/20 scrollbar-track-transparent"
                    placeholder="Paste your product details here..."
                  />
                </div>
              </div>

              {/* Second Box - Image Gallery */}
              <div className="bg-gradient-to-br from-white/5 via-blue-900/10 to-white/0 backdrop-blur-md border border-white/20 rounded-none p-6">
                <p className="text-gray-300 text-sm mb-4">
                  Upload and manage product images
                </p>
                <div className="space-y-4">
                  {/* Image Upload Area */}
                  <div>
                    <label className="block text-sm text-secondary-cyan mb-2">Upload Product Images:</label>
                    <label className="flex items-center justify-center w-90 h-20 px-4 transition bg-black/20 border-2 border-[#BAFFF5]/20 border-dashed rounded-lg appearance-none cursor-pointer hover:border-[#BAFFF5]/40 focus:outline-none">
                      <div className="flex flex-col items-center space-y-2">
                        <svg className="w-8 h-8 text-secondary-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-xs text-gray-300">Drag and drop images here</span>
                        <span className="text-xs text-gray-400">or click to browse</span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                        multiple
                      />
                    </label>
                  </div>
                  
                  {/* Image Preview Grid */}
                  <div className="mt-6">
                    <label className="block text-sm text-secondary-cyan mb-2">Uploaded Images:</label>
                    <div className="grid grid-cols-2 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={url} className="relative group">
                          <img
                            src={url}
                            alt={`Product preview ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border border-[#BAFFF5]/20"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button 
                              onClick={() => removeImage(index)}
                              className="p-2 bg-red-500/80 rounded-full hover:bg-red-600/80 transition-colors"
                            >
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                          <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                            Image {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
