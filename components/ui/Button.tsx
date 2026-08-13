"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variants: Record<string, string> = {
      default: "bg-sky-600 text-white shadow-xs hover:bg-sky-700 active:bg-sky-800",
      destructive: "bg-red-600 text-white shadow-xs hover:bg-red-700 active:bg-red-800",
      outline: "border border-gray-300 bg-white text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-900",
      secondary: "bg-gray-100 text-gray-900 shadow-xs hover:bg-gray-200",
      ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
      link: "text-sky-600 underline-offset-4 hover:underline p-0 h-auto font-normal",
      accent: "bg-amber-400 text-gray-900 font-semibold shadow-xs hover:bg-amber-300 active:bg-amber-500",
    };

    const sizes: Record<string, string> = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8 text-base",
      icon: "h-9 w-9 p-0",
    };

    const combinedClasses = `${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`;

    return <button ref={ref} className={combinedClasses} {...props} />;
  }
);

Button.displayName = "Button";
export default Button;
