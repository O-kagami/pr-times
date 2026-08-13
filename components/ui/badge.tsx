"use client";

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "sky" | "amber" | "emerald";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-sky-600 text-white hover:bg-sky-700 border-transparent",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-transparent",
    destructive: "bg-red-100 text-red-700 hover:bg-red-200 border-transparent",
    outline: "text-gray-700 border border-gray-300 bg-white",
    sky: "bg-sky-50 text-sky-700 border border-sky-200",
    amber: "bg-amber-50 text-amber-800 border border-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };

  return (
    <div
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
