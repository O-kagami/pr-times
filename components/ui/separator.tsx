"use client";

import React from "react";

export function Separator({
  orientation = "horizontal",
  className = "",
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <div
      className={`shrink-0 bg-gray-200 ${
        orientation === "horizontal" ? "h-[1px] w-full my-4" : "h-full w-[1px] mx-4"
      } ${className}`}
    />
  );
}
