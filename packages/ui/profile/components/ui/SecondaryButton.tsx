"use client";

import React from "react";
import clsx from "clsx";

export function SecondaryButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium text-gray-200",
        "border border-white/15 hover:bg-white/10 transition",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
