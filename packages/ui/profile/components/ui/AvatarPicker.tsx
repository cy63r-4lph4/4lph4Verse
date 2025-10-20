"use client";

import React, { useRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import { SecondaryButton } from "./PrimaryButton";

type AvatarPickerProps = {
  value: string;
  onChange: (url: string) => void;
};

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-800/40 p-3 sm:p-4 text-center">
      <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-900">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="avatar" className="h-full w-full object-cover" />
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
        onChange={onSelectFile}
      />

      {value && (
        <div className="mt-2">
          <button
            className="text-xs text-gray-400 underline hover:text-white"
            onClick={() => onChange("")}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
