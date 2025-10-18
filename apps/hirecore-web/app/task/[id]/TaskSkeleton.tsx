"use client";

import { motion } from "framer-motion";

export default function TaskSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side (Header + Main) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Placeholder */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="h-6 w-1/3 bg-white/10 rounded mb-3"></div>
            <div className="h-4 w-2/3 bg-white/10 rounded"></div>
          </div>

          {/* Main Content Placeholder */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <div className="h-4 w-full bg-white/10 rounded"></div>
            <div className="h-4 w-5/6 bg-white/10 rounded"></div>
            <div className="h-4 w-2/3 bg-white/10 rounded"></div>
            <div className="h-64 w-full bg-white/10 rounded mt-6"></div>
          </div>
        </div>

        {/* Sidebar Placeholder */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="h-6 w-1/2 bg-white/10 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 w-5/6 bg-white/10 rounded"></div>
              <div className="h-4 w-2/3 bg-white/10 rounded"></div>
              <div className="h-4 w-3/4 bg-white/10 rounded"></div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <div className="h-10 w-full bg-white/10 rounded"></div>
            <div className="h-10 w-full bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
