import React from 'react';

interface StepsFormatProps {
  content: string;
  textColor?: string;
}

const StepsFormat: React.FC<StepsFormatProps> = ({ content, textColor = 'inherit' }) => {
  const steps = content.split('\n')
    .filter(step => step.trim())
    .map(step => step.replace(/^\d+\.\s*/, ''));

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div 
          key={index}
          className="flex items-start group"
        >
          {/* Step content */}
          <div className="flex-1">
            {step.includes('\n') ? (
              <>
                <h3 
                  style={{ color: textColor }} 
                  className="text-lg font-bold mb-2"
                >
                  {step.split('\n')[0]}
                </h3>
                {step.split('\n').slice(1).map((line, i) => (
                  <p 
                    key={i} 
                    style={{ color: textColor }} 
                    className="leading-relaxed mt-2 opacity-90"
                  >
                    {line.trim()}
                  </p>
                ))}
              </>
            ) : (
              <p 
                style={{ color: textColor }} 
                className="leading-relaxed"
              >
                {step}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepsFormat;
