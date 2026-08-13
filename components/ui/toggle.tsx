"use client";

import * as React from "react";

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: "default" | "outline" | "amber";
  size?: "default" | "sm" | "lg";
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className = "",
      pressed = false,
      onPressedChange,
      variant = "default",
      size = "default",
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const isPressed = pressed;

    const baseStyles =
      "inline-flex items-center justify-center rounded-lg text-xs font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none gap-1.5";

    const variantStyles = {
      default: isPressed
        ? "bg-sky-600 text-white shadow-xs"
        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200",
      outline: isPressed
        ? "bg-amber-100 border-amber-400 text-amber-900 shadow-xs"
        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
      amber: isPressed
        ? "bg-amber-500 text-white shadow-sm ring-2 ring-amber-300"
        : "bg-amber-100/90 text-amber-900 hover:bg-amber-200 border border-amber-300",
    };

    const sizeStyles = {
      default: "h-9 px-3 py-1.5 min-w-9",
      sm: "h-7 px-2.5 py-1 min-w-7 text-[11px]",
      lg: "h-10 px-4 py-2 min-w-10 text-sm",
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        data-state={isPressed ? "on" : "off"}
        onClick={(e) => {
          onPressedChange?.(!isPressed);
          onClick?.(e);
        }}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Toggle.displayName = "Toggle";
