"use client";

import React, { useRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import { SecondaryButton } from "./PrimaryButton";

type AvatarPickerProps = {
  preview?: string;
  onSelectFile: (file: File | null) => void;
};

export function AvatarPicker({ preview, onSelectFile }: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-800/40 p-3 sm:p-4 text-center">
      <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-900">
        {preview ? (
          <img
            src={preview}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="h-8 w-8 text-gray-500" />
        )}
      </div>

      <SecondaryButton onClick={() => inputRef.current?.click()}>
        Upload Avatar
      </SecondaryButton>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          onSelectFile(file);
        }}
      />

      {preview && (
        <div className="mt-2">
          <button
            className="text-xs text-gray-400 underline hover:text-white"
            onClick={() => onSelectFile(null)}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
