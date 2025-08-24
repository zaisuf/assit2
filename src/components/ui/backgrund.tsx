import React from 'react';

interface BackgroundProps {
  children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black via-blue-950 to-gray-900" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Background;
