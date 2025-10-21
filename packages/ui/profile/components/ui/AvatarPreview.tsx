"use client";

import React from "react";
import { Image as ImageIcon } from "lucide-react";

type AvatarPreviewProps = {
  value?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
};

export function AvatarPreview({
  value,
  label = "Profile Picture",
  size = "md",
}: AvatarPreviewProps) {
  const sizeClass = {
    sm: "h-20 w-20",
    md: "h-28 w-28",
    lg: "h-36 w-36",
  }[size];

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-800/40 p-4 text-center">
      <div
        className={`mx-auto mb-3 flex ${sizeClass} items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-900`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="h-8 w-8 text-gray-500" />
        )}
      </div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
