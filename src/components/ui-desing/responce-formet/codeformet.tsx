import React from 'react';

interface CodeFormatProps {
  content: string;
  textColor?: string;
}

const CodeFormat: React.FC<CodeFormatProps> = ({ content, textColor = 'inherit' }) => {
  const parts = content.split('```');
  const explanation = parts[0].trim();
  const codeContent = parts.length > 1 ? parts[1].trim() : content;

  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="w-full pl-2">
      {explanation && (
        <p className="text-sm mb-3" style={{ color: textColor }}>
          {explanation}
        </p>
      )}
      <div className="relative group max-w-[50%]">
        <pre className="w-full bg-black/20 backdrop-blur-sm rounded-md overflow-x-auto text-sm font-mono border border-white/10">
          <div className="flex justify-between items-center px-4 py-2 border-b border-white/10">
            <div className="text-xs font-medium opacity-50" style={{ color: textColor }}>Code</div>
          </div>
          <code className="block px-3 py-3 overflow-x-auto text-xs" style={{ color: textColor }}>
            {codeContent}
          </code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-8 right-4 p-1.5 rounded-md bg-gray-800/80 hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0 translate-x-2"
          title="Copy code"
        >
          {isCopied ? (
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-emerald-400"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-gray-400 group-hover:text-gray-200"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeFormat;
