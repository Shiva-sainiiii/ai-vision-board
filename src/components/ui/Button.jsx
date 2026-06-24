// src/components/ui/Button.jsx
import React from "react";

const variants = {
  primary:
    "bg-gradient-to-r from-brand-600 to-glow text-white hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-brand-900/40",
  secondary:
    "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20",
  ghost: "text-white/70 hover:text-white hover:bg-white/10",
  danger: "bg-red-600 text-white hover:bg-red-500",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-3.5 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-grotesk font-medium rounded-xl
        transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
