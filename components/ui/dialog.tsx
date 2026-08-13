"use client";

import React, { useEffect } from "react";

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl animate-in fade-in-0 zoom-in-95">
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`flex flex-col space-y-1.5 text-center sm:text-left mb-4 ${className}`}>{children}</div>;
}

export function DialogTitle({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={`text-xl font-bold tracking-tight text-gray-900 ${className}`}>{children}</h2>;
}

export function DialogDescription({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
}

export function DialogFooter({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 ${className}`}>{children}</div>;
}
