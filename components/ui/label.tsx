"use client";

import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`text-sm font-medium leading-none text-gray-700 select-none flex items-center gap-1 ${className}`}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 font-bold ml-0.5">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";
export default Label;
