"use client";
import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Background from '@/components/ui/backgrund';
import AgentSidebar from '@/components/sidebar/page';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/app/api/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { downloadFolder } from '@/utils/downloadUtils';

// Download icon component
const DownloadIcon = () => (
  <svg 
    className="w-5 h-5" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

// Code templates for different languages and frameworks
interface TemplateFile {
  filename: string;
  content: string;
}

interface TemplateResponse {
  files: TemplateFile[];
}

type LanguageKey = 'javascript' | 'react' | 'vue' | 'angular' | 'html' | 'python';

const codeTemplates: Record<LanguageKey, string> = {
  javascript: `
// JavaScript
<script>
  const iframe = document.createElement('iframe');
  iframe.src = 'https://your-assistlore-endpoint.com/widget';
  iframe.width = '400';
  iframe.height = '600';
  iframe.style.position = 'fixed';
  iframe.style.right = '20px';
  iframe.style.bottom = height === 500 ? '100px' : height === 350 ? '150px' : '20px';
  iframe.height = height === 500 ? '540' : height === 350 ? '390' : height;
  iframe.width = width === 450 ? '520' : width;
  iframe.style.right = width === 450 ? '-20px' : '20px';
  iframe.style.border = 'none';
  iframe.style.zIndex = '9999';
  document.body.appendChild(iframe);
</script>`,

  react: `
// React Component
import React from 'react';

const AssistloreChat = () => {
  return (
    <iframe
      src="https://your-assistlore-endpoint.com/widget"
      width={width === 450 ? 520 : 400}
      height={height === 500 ? 540 : height === 350 ? 390 : 600}
      style={{
        position: 'fixed',
        right: width === 450 ? '-20px' : '20px',
        bottom: height === 500 ? '100px' : height === 350 ? '150px' : '20px',
        border: 'none',
        zIndex: 9999
      }}
    />
  );
};

export default AssistloreChat;`,

  vue: `
<!-- Vue Component -->
<template>
  <iframe
    :src="chatWidgetUrl"
    :width="width"
    :height="height"
    :style="iframeStyles"
  />
</template>

<script>
export default {
  data() {
    return {
      chatWidgetUrl: 'https://your-assistlore-endpoint.com/widget',
      width: 400,
      height: 600,
      iframeStyles: {
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        border: 'none',
        zIndex: 9999
      }
    }
  }
}
</script>`,

  angular: `
// Angular Component
import { Component } from '@angular/core';

@Component({
  selector: 'app-assistlore-chat',
  template: \`
    <iframe
      [src]="chatWidgetUrl"
      [width]="width"
      [height]="height"
      [style]="iframeStyles"
    ></iframe>
  \`
})
export class AssistloreChatComponent {
  chatWidgetUrl = 'https://your-assistlore-endpoint.com/widget';
  width = 400;
  height = 600;
  iframeStyles = {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    border: 'none',
    zIndex: 9999
  };
}`,

  html: `
<!-- HTML -->
<iframe
  src="https://your-assistlore-endpoint.com/widget"
  width="400"
  height="600"
  style="position: fixed; right: 20px; bottom: 20px; border: none; z-index: 9999;"
></iframe>`,

  python: `
# Python (Flask)
from flask import Flask, render_template_string

app = Flask(__name__)

@app.route('/')
def index():
    return render_template_string('''
        <iframe
            src="https://your-assistlore-endpoint.com/widget"
            width="400"
            height="600"
            style="position: fixed; right: 20px; bottom: 20px; border: none; z-index: 9999;"
        ></iframe>
    ''')

if __name__ == '__main__':
    app.run()`
};

export default function SdkPage() {
  const [selectedLang, setSelectedLang] = useState<LanguageKey>('javascript');
  const [userId, setUserId] = useState<string | null>(null);
  const [uiId, setUiId] = useState<string | null>(null);
  const [savedDimensions, setSavedDimensions] = useState({
    chatbotBoxWidth: 0,
    chatbotBoxHeight: 0
  });
  const [isLoadingDimensions, setIsLoadingDimensions] = useState(true);
  const [dimensionsError, setDimensionsError] = useState('');
  
  // Get uiId from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uiIdParam = params.get('uiId');
    if (uiIdParam) {
      setUiId(uiIdParam);
    }
  }, []);
  const [customization, setCustomization] = useState({
    width: 400,
    height: 600,
    theme: 'light'
  });

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch saved dimensions from Firebase when user is authenticated and uiId is available
  useEffect(() => {
    const fetchSavedDimensions = async () => {
      setIsLoadingDimensions(true);
      setDimensionsError('');
      try {
        if (!userId || !uiId) {
          setIsLoadingDimensions(false);
          return;
        }
 // Access the uidesing document with the specific uiId using test-user-id
        const docRef = doc(db, 'users', 'test-user-id', 'uidesing', uiId);
        console.log('Fetching dimensions from path:', docRef.path);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Firebase document data:', data);
          // Update saved dimensions
          setSavedDimensions({
            chatbotBoxWidth: data.chatbotBoxWidth || 0,
            chatbotBoxHeight: data.chatbotBoxHeight || 0
          });
          console.log('Set dimensions:', {
            width: data.chatbotBoxWidth || 0,
            height: data.chatbotBoxHeight || 0
          });
          // Also update the customization with saved values
          setCustomization(prev => ({
            ...prev,
            width: data.chatbotBoxWidth || prev.width,
            height: data.chatbotBoxHeight || prev.height
          }));
        } else {
          setDimensionsError('No saved dimensions found');
        }
      } catch (error) {
        console.error('Error fetching saved dimensions:', error);
        setDimensionsError('Failed to load saved dimensions');
      } finally {
        setIsLoadingDimensions(false);
      }
    };

    fetchSavedDimensions();
  }, [userId, uiId]);

  // Function to get live preview URL
  const getLivePreviewUrl = () => {
    if (!uiId) return '';
    return `https://your-assistlore-endpoint.com/widget/${uiId}`;
  };

  // Function to update code based on customization
  const getCustomizedCode = (template: string) => {
    let bottomPosition = '20px';
    let heightValue = customization.height;
    let widthValue = customization.width;
    let rightPosition = '20px';
    
    if (customization.height === 350) {
      bottomPosition = '150px';
      heightValue = 390;
    } else if (customization.height === 500) {
      bottomPosition = '100px';
      heightValue = 540;
    }

    if (customization.width === 450) {
      widthValue = 520;
      rightPosition = '-20px';
    }
    
    if (customization.height === 620) {
      heightValue = 650;
      rightPosition = '-15px';
      bottomPosition = '-12px';
    } 

    if (customization.width === 350) {
      widthValue = 420;
      rightPosition = '-16px';
      bottomPosition = '100px';
    }
    if (customization.width === 600) {
      widthValue = 670;
      rightPosition = '-15px';
      bottomPosition = '40px';
    }  
  

    let modifiedTemplate = template
      .replace('400', widthValue.toString())
      .replace('600', heightValue.toString())
      .replace('bottom: \'20px\'', `bottom: '${bottomPosition}'`)
      .replace('bottom: 20px', `bottom: ${bottomPosition}`)
      .replace('right: \'20px\'', `right: '${rightPosition}'`)
      .replace('right: 20px', `right: ${rightPosition}`);
    
    return modifiedTemplate;
  };

  // Function to handle code or template download
  const handleDownload = async () => {
    try {
      if (selectedLang === 'javascript' || selectedLang === 'react') {
        const response = await fetch(`/api/templates/${selectedLang}`);
        const templateData = await response.json() as TemplateResponse;
        
        // Download all files in the folder
        await downloadFolder(templateData.files);
      } else {
        // For other languages, download single file
        const code = getCustomizedCode(codeTemplates[selectedLang]);
        const getExtension = (lang: LanguageKey): string => {
          switch(lang) {
            case 'html': return 'html';
            case 'python': return 'py';
            case 'javascript': return 'js';
            case 'react': return 'jsx';
            case 'vue': return 'vue';
            case 'angular': return 'ts';
            default: return 'txt';
          }
        };
        
        const filename = `assistlore-widget.${getExtension(selectedLang)}`;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-black via-blue-950 to-gray-900 flex">
      <AgentSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Assistlore SDK Integration</h1>

        {/* Language Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Your Platform</h2>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(codeTemplates) as LanguageKey[]).map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedLang === lang 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Customization Options */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Customize Widget</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Width (px)</label>
              <input
                type="number"
                value={customization.width}
                onChange={(e) => setCustomization({
                  ...customization,
                  width: parseInt(e.target.value) || 400
                })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Height (px)</label>
              <input
                type="number"
                value={customization.height}
                onChange={(e) => setCustomization({
                  ...customization,
                  height: parseInt(e.target.value) || 600
                })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                value={customization.theme}
                onChange={(e) => setCustomization({
                  ...customization,
                  theme: e.target.value
                })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Saved Width</label>
              <div className="w-full px-3 py-2 bg-gray-800 rounded-lg text-gray-300 relative">
                {isLoadingDimensions ? (
                  <span className="text-blue-400">Loading...</span>
                ) : dimensionsError ? (
                  <span className="text-red-400">{dimensionsError}</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-medium text-lg">{savedDimensions.chatbotBoxWidth}</span>
                    {savedDimensions.chatbotBoxWidth > 0 && (
                      <span className="text-green-400 text-sm ml-2">✓ Firebase</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Saved Height</label>
              <div className="w-full px-3 py-2 bg-gray-800 rounded-lg text-gray-300 relative">
                {isLoadingDimensions ? (
                  <span className="text-blue-400">Loading...</span>
                ) : dimensionsError ? (
                  <span className="text-red-400">{dimensionsError}</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-medium text-lg">{savedDimensions.chatbotBoxHeight}</span>
                    {savedDimensions.chatbotBoxHeight > 0 && (
                      <span className="text-green-400 text-sm ml-2">✓ Firebase</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Code Display */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Integration Code</h2>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              title="Download Code"
            >
              <DownloadIcon />
              <span>Download</span>
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 relative group">
            <SyntaxHighlighter
              language={selectedLang === 'html' ? 'markup' : selectedLang}
              style={atomDark}
              className="rounded-lg"
            >
              {getCustomizedCode(codeTemplates[selectedLang])}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Live Preview */}
        {uiId && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <iframe
                src={getLivePreviewUrl()}
                width={customization.width === 450 ? 520 : customization.width}
                height={customization.height === 350 ? 390 : 
                       customization.height === 500 ? 540 : customization.height}
                style={{
                  marginRight: customization.width === 450 ? '-40px' : '0',
                  marginBottom: customization.height === 500 ? '100px' : 
                              customization.height === 350 ? '150px' : '20px'
                }}
                className="rounded-lg border-0"
              />
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
