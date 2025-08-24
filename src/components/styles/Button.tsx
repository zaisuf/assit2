import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300';
  
  const variants = {
    primary: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-yellow-500/25',
    secondary: 'bg-dark-lighter border-2 border-yellow-400/50 text-yellow-400 hover:border-yellow-400 hover:bg-yellow-400/10',
    outline: 'bg-transparent border-2 border-yellow-400/30 text-yellow-400 hover:border-yellow-400/60'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:-translate-y-0.5 active:translate-y-0'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
