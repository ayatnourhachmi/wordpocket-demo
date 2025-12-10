
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  loadingText,
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] rounded-full";
  
  const variants = {
    primary: "bg-brand-500 text-dark-900 hover:bg-brand-400 hover:shadow-glow shadow-md border border-transparent",
    secondary: "bg-white text-dark-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm focus:ring-brand-500",
    outline: "bg-transparent text-dark-900 border border-dark-200 hover:bg-gray-50 focus:ring-brand-500",
    dark: "bg-dark-900 text-white hover:bg-dark-800 shadow-md focus:ring-dark-500",
    ghost: "bg-transparent text-dark-600 hover:bg-dark-50 hover:text-dark-900 focus:ring-dark-500"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
    icon: "p-3"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="mr-2">
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {loadingText ? <span>{loadingText}</span> : null}
        </>
      ) : (
        children
      )}
    </button>
  );
};
