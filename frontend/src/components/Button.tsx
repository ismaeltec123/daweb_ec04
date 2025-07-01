import React, { ReactNode } from 'react';

type ButtonProps = {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  children: ReactNode;
};

export default function Button({ onClick, type = 'button', className = '', disabled = false, children }: ButtonProps) {
  return (
    <button
      type={type}
      className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
