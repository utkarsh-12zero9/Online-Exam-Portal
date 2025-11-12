import React from 'react';

const Button = ({ children, onClick, type = 'button', fullWidth, loading, variant = 'primary', disabled }) => {
  const baseStyle = 'px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 focus:ring-emerald-500',
    secondary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-500',
    outline: 'border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50 focus:ring-emerald-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} cursor-pointer`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
