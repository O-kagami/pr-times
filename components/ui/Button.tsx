"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "accent";
};

export function Button({ variant = "default", className = "", ...props }: Props) {
  const base = "inline-flex items-center rounded-md text-sm font-medium transition-colors focus:outline-none";
  const variants: Record<string, string> = {
    default: "bg-sky-600 text-white px-3 py-1.5 hover:bg-sky-700",
    ghost: "bg-transparent text-gray-800 px-2 py-1 hover:bg-gray-100",
    accent: "bg-yellow-400 text-black px-3 py-1.5 hover:bg-yellow-300",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export default Button;
