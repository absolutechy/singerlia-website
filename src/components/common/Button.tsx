import React from 'react';

export type ButtonVariant = 'default' | 'primary' | 'secondary';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'medium',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'cursor-pointer rounded-lg btn-text text-center transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';
  
  const variantStyles: Record<ButtonVariant, string> = {
    default: 'bg-primary-light border border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.3)] shadow-[0px_0px_14px_0px_inset_rgba(205,205,205,0.1)]',
    primary: 'bg-gradient-to-b from-secondary to-secondary-dark text-[#2e2e2e] hover:from-[#ffed4e] hover:to-[#d4a04a] shadow-md hover:shadow-lg',
    secondary: 'bg-primary text-white hover:bg-[#4a1f6b] border border-primary shadow-md hover:shadow-lg',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    small: 'px-4 py-2 text-xs h-10',
    medium: 'px-6 py-3.5 text-sm h-12',
    large: 'px-10 py-4 !text-lg h-14',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
