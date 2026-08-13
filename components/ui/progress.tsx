"use client";

import React from "react";

export function Progress({
  value = 0,
  max = 100,
  className = "",
  barClassName = "",
}: {
  value?: number;
  max?: number;
  className?: string;
  barClassName?: string;
}) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  return (
    <div className={`relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}>
      <div
        className={`h-full w-full flex-1 bg-sky-600 transition-all duration-300 ${barClassName}`}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
