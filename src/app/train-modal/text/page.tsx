'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HexagonGrid from "@/components/HexagonGrid";
import CustomSidebar from '@/components/sidebar/CustomSidebar';
import Button from '@/components/styles/Button';
import { Clipboard, Check, Upload, Save } from 'lucide-react';
import { auth } from '@/app/api/firebase/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const TrainModal: React.FC = () => {
  const router = useRouter();
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [editedTemplate, setEditedTemplate] = useState('');
  const [fileName, setFileName] = useState('custom_intents.json');
  const [isSaving, setIsSaving] = useState(false);
  const referenceText = 'Please add your custom knowledge data here to train your partner .';
  const [showTextarea, setShowTextarea] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [promptUrl, setPromptUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Add web/company type and select function
  const [companyType, setCompanyType] = useState('fashion');
  const companyTypes = [
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'saas', label: 'SaaS' },
    { value: 'ai-tool', label: 'AI Tool' },
    { value: 'news', label: 'News' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'food', label: 'Food' },
    { value: 'services', label: 'Services' },
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'travel', label: 'Travel' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'media', label: 'Media' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'other', label: 'Other' }
  ];
  const handleCompanyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompanyType(e.target.value);
  };

  const processResponses = (responses: any) => {
    const formattedResponses: any = {};
    Object.entries(responses).forEach(([intent, responseList]: [string, any]) => {
      formattedResponses[intent] = responseList.map((text: string) => ({ text }));
    });
    return formattedResponses;
  };



  const handleSaveToFirebase = async (content?: string) => {
    if (!auth.currentUser) {
      toast.error('Please login to save JSON');
      return;
    }

    try {
      setIsSaving(true);
      const db = getFirestore();
      const userId = auth.currentUser.uid;
      
      const jsonContent = content || editedTemplate;
      let jsonData;
      
      try {
        // Attempt to parse as JSON, but if it fails, store as a string
        const parsed = JSON.parse(jsonContent);
        jsonData = {
          data: parsed,
          filename: fileName,
          timestamp: new Date().toISOString()
        };
      } catch {
        // If parsing fails, store the raw content
        jsonData = {
          data: { content: jsonContent },
          filename: fileName,
          timestamp: new Date().toISOString()
        };
      }

      const jsonRef = doc(db, `users/${userId}/jsonFiles/data`);
      await setDoc(jsonRef, jsonData);
      toast.success('File saved successfully');
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const content = event.target.result as string;
          setEditedTemplate(content);
          await handleSaveToFirebase(content);
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    // Wait for auth state before redirecting
    const waitForAuthAndLoad = () => {
      unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          router.push('/login');
          return;
        }
        try {
          const db = getFirestore();
          const jsonRef = doc(db, `users/${user.uid}/jsonFiles/data`);
          const jsonDoc = await getDoc(jsonRef);
          if (jsonDoc.exists() && jsonDoc.data().data?.responses) {
            const storedData = jsonDoc.data().data;
            setEditedTemplate(JSON.stringify(storedData, null, 2));
            setShowTextarea(true);
          } else {
            setEditedTemplate(referenceText);
            setShowTextarea(false);
          }
        } catch (error) {
          console.error('Error loading JSON:', error);
          setEditedTemplate(referenceText);
          setShowTextarea(false);
        }
      });
    };

    waitForAuthAndLoad();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900 flex">
      <HexagonGrid />
      <CustomSidebar />
      <div className="min-h-screen text-white pt-12 relative">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="pl-72">
            <h1 className="text-3xl font-sans mb-4 text-white">
              Text Training Data 
            </h1>
            <p className="text-gray-300 font-sans">
              Go to AI Chatbot Platform like GPT . CLAUD AI . DEEP AI and generate your context in intent and text structure, 
            </p>
          </div>


          {/* Actions Bar */}
          <div className="flex items-center gap-4 mb-6 pl-72"></div>

          {/* Big Textarea Box for Editing JSON */}
          <div className="pl-72 mt-0 mb-0">
            <div className="w-full max-w-6xl rounded-none shadow-2xl p-8 border border-white/20 bg-gradient-to-br from-white/5 via-blue-900/10 to-white/0">
              {/* Header inside the box */}
              <div className="mb-6 flex items-center gap-4 relative">
                {/* Centered file input */}
                <div className="flex-1 flex justify-center">
                  <div className="relative flex items-center gap-2">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload-header"
                    />
                    <label
                      htmlFor="file-upload-header"
                      className="flex items-center gap-2 px-2 py-1 bg-dark border border-[#BAFFF5]/20 rounded hover:border-[#BAFFF5]/40 cursor-pointer transition-all select-none"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-white text-xs font-semibold font-sans select-none">{fileName}</span>
                    </label>
                  </div>
                </div>
                {/* Web/Company Type Selector left aligned */}
                <div className="absolute left-0 flex items-center gap-2">
                  <select
                    id="company-type-select"
                    value={companyType}
                    onChange={handleCompanyTypeChange}
                    className="px-2 py-1 bg-dark border border-[#BAFFF5]/20 rounded-lg text-gray-300 font-space text-xs focus:outline-none focus:border-[#BAFFF5]/40"
                  >
                    {companyTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              {/* Save JSON button right aligned */}
                <div className="absolute right-0 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowOverlay(true)}
                    className="flex items-center gap-1"
                  >
                    Get Prompt
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSaveToFirebase()}
                    className="flex items-center gap-1"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save JSON'}
                  </Button>
                </div>
              </div>
              {!showTextarea && editedTemplate === referenceText ? (
                <div
                  className="w-[900px] h-[400px] bg-black/30 rounded-lg text-[#e5e5e5] font-sans text-base px-4 py-3 border border-white/20 flex items-center justify-center select-none cursor-text"
                  style={{ userSelect: 'none' }}
                  tabIndex={0}
                  onClick={() => { setShowTextarea(true); setEditedTemplate(''); }}
                  onPaste={e => {
                    const pasted = e.clipboardData.getData('text');
                    setShowTextarea(true);
                    setEditedTemplate(pasted);
                    e.preventDefault();
                  }}
                >
                  {referenceText}
                </div>
              ) : (
                <textarea
                  id="json-editor"
                  value={editedTemplate}
                  onChange={e => setEditedTemplate(e.target.value)}
                  rows={20}
                  className="w-[900px] h-[400px] bg-black/30 rounded-lg text-gray-200 font-mono text-base px-4 py-3 border border-white/20 focus:outline-none focus:border-[#BAFFF5]/40 resize-y shadow-lg"
                  spellCheck={false}
                  autoFocus
                />
              )}
            </div>
          </div>

          {/* Overlay for Get Prompt */}
          {showOverlay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-[#f5f6fa] rounded-lg shadow-lg p-8 min-w-[350px] flex flex-col items-center relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                  onClick={() => { setShowOverlay(false); setGenerateError(null); setIsGenerating(false); }}
                  aria-label="Close overlay"
                >
                  ×
                </button>
                <h2 className="text-lg font-bold mb-4 text-gray-900">Enter URL to get prompt</h2>
                <input
                  type="text"
                  value={promptUrl}
                  onChange={e => setPromptUrl(e.target.value)}
                  placeholder="Paste URL here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-900 bg-white mb-4"
                  disabled={isGenerating}
                />
                <button
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition-all disabled:opacity-60 mb-2"
                  onClick={async () => {
                    setIsGenerating(true);
                    setGenerateError(null);
                    setGeneratedPrompt(null);
                    setCopiedPrompt(false);
                    try {
                      if (!promptUrl.trim()) {
                        setGenerateError('Please enter a URL.');
                        setIsGenerating(false);
                        return;
                      }
                      // Extract domain from URL
                      let domain = promptUrl.trim();
                      try {
                        domain = new URL(domain).hostname.replace(/^www\./, '');
                      } catch {}
                      const prompt = `To create ${domain} all pages custom knowledge data in json format .`;
                      setGeneratedPrompt(prompt);
                    } catch (err: any) {
                      setGenerateError('Failed to generate prompt: ' + (err?.message || 'Unknown error'));
                    } finally {
                      setIsGenerating(false);
                    }
                  }}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Prompt'}
                </button>
                {generatedPrompt && (
                  <div className="w-full bg-white border border-gray-300 rounded p-4 mt-2 flex flex-col items-start">
                    <div className="w-full flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">Generated Prompt</span>
                      <button
                        className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                        onClick={async () => {
                          await navigator.clipboard.writeText(generatedPrompt);
                          setCopiedPrompt(true);
                          setTimeout(() => setCopiedPrompt(false), 1200);
                        }}
                      >
                        {copiedPrompt ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="w-full text-gray-900 break-words whitespace-pre-line text-sm select-text">{generatedPrompt}</div>
                    <button
                      className="mt-3 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded self-end"
                      onClick={() => {
                        setEditedTemplate(generatedPrompt);
                        setShowTextarea(true);
                        setShowOverlay(false);
                      }}
                    >
                      Use in Editor
                    </button>
                  </div>
                )}
                {generateError && <div className="text-red-600 text-sm mt-1 text-center">{generateError}</div>}
              </div>
            </div>
          )}
          {/* Editor removed as requested */}
        </div>
      </div>
    </div>
  );
};

export default TrainModal;