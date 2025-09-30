import React from 'react';

interface SectionLineProps {
  className?: string;
  variant?: 'horizontal' | 'vertical';
  width?: string;
}

const SectionLine: React.FC<SectionLineProps> = ({
  className = '',
  variant = 'horizontal',
  width = '100%'
}) => {
  const baseStyles = 'bg-[#BAFFF5] opacity-20 transition-opacity hover:opacity-40';
  
  const variantStyles = {
    horizontal: 'h-px',
    vertical: 'w-px'
  };

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ 
        width: variant === 'horizontal' ? width : '1px',
        height: variant === 'vertical' ? width : '1px'
      }}
    />
  );
};

export default SectionLine;
