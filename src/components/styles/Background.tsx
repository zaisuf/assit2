import React from 'react';

interface BackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'gradient';
}

const Background: React.FC<BackgroundProps> = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'from-transparent to-transparent',
    dark: 'from-transparent to-transparent',
    gradient: 'from-transparent via-transparent to-transparent'
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${variants[variant]} ${className}`}>
      <div className="relative">{children}</div>
    </div>
  );
};

export default Background;
