import React from 'react';

interface ExplanationFormatProps {
  content: string;
  textColor?: string;
}

const ExplanationFormat: React.FC<ExplanationFormatProps> = ({ content, textColor = 'inherit' }) => {
  const formatExplanation = (text: string) => {
    text = text.replace(/^Heading:\s*/i, '# ');
    const parts = text.split('\n');
    let currentList: string[] = [];
    const formattedParts: React.ReactElement[] = [];
    let key = 0;

    const renderList = () => {
      if (currentList.length > 0) {
        formattedParts.push(
          <ul key={key++} className="list-none space-y-1.5 ml-6 my-3">
            {currentList.map((item, i) => (
              <li key={i} className="flex items-start group">
                <span 
                  className="mr-2 mt-1.5 h-1 w-1 rounded-full transition-colors" 
                  style={{ backgroundColor: textColor }}
                />
                <span style={{ color: textColor }} className="flex-1 transition-colors text-xs">
                  {item.replace(/^- /, '')}
                </span>
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    parts.forEach(part => {
      const trimmedPart = part.trim();
      if (!trimmedPart) {
        renderList();
        formattedParts.push(<div key={key++} className="h-4" />);
      } else if (trimmedPart.startsWith('#')) {
        renderList();
        const matches = trimmedPart.match(/^(#+)\s(.+)/);
        if (matches) {
          const level = Math.min(matches[1].length, 6);
          const title = matches[2];
          const headingClasses = {
            1: `text-xs font-medium mb-2 opacity-85`,
            2: `text-xs font-medium mb-2 opacity-85`,
            3: `text-xs font-medium mb-1.5 opacity-85`,
            4: `text-xs font-medium mb-1.5 opacity-85`
          }[level] || "text-xs font-normal mb-1 opacity-85";
          
          formattedParts.push(
            <h1 key={key++} className={headingClasses}>
              {title}
            </h1>
          );
        }
      } else if (trimmedPart.startsWith('- ')) {
        currentList.push(trimmedPart);
      } else {
        renderList();
        formattedParts.push(
          <div key={key++} className="flex flex-col space-y-1.5">
            {trimmedPart.includes(':') ? (
              <>
                <div className="flex items-start -ml-2">
                  <span 
                    className="mr-2 mt-2 h-2 w-2 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: textColor }} 
                  />
                  <h3 
                    style={{ color: textColor }} 
                    className="text-xs font-medium leading-relaxed opacity-85"
                  >
                    {trimmedPart.split(':')[0]}
                  </h3>
                </div>
                <p 
                  style={{ color: textColor }} 
                  className="ml-6 text-[13px] leading-relaxed opacity-85"
                >
                  {trimmedPart.split(':')[1]}
                </p>
              </>
            ) : (
              <div className="flex items-start -ml-2">
                <span 
                  className="mr-2 mt-2 h-2 w-2 rounded-full flex-shrink-0 opacity-0" 
                  style={{ backgroundColor: textColor }} 
                />
                <p style={{ color: textColor }} className="text-[13px] leading-relaxed transition-colors opacity-85">
                  {trimmedPart}
                </p>
              </div>
            )}
          </div>
        );
      }
    });

    renderList();
    return (
      <div className="space-y-4" style={{ color: textColor }}>
        {formattedParts}
      </div>
    );
  };

  return formatExplanation(content);
};

export default ExplanationFormat;
