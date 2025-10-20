"use client";

import React from "react";

export function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-2xl p-5 sm:p-6">
      {children}
    </div>
  );
}
