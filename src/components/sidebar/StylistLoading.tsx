import React from 'react';

const StylistLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[120px] w-full animate-pulse">
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-secondary-cyan to-accent-gold mb-4" />
      <div className="h-4 w-32 bg-dark/30 rounded mb-2" />
      <div className="h-4 w-24 bg-dark/20 rounded" />
    </div>
  );
};

export default StylistLoading;
