"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@verse/ui/components/ui/button";
import { Story } from "@verse/sdk/types";

interface FeaturedStoryCardProps {
  story: Story;
  onView: () => void;
}

export function FeaturedStoryCard({ story, onView }: FeaturedStoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="
        relative overflow-hidden rounded-3xl
        bg-linear-to-br from-black/60 via-purple-900/30 to-black/60
        border border-pink-500/20
        p-10 md:p-14
        backdrop-blur-md
      "
    >
      {/* Soft Glow */}
      <div className="absolute inset-0 bg-linear-to-r from-pink-500/10 via-transparent to-indigo-500/10 opacity-40" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.3em] text-pink-300/60 mb-4">
          {story.category} • {new Date(story.createdAt!).getFullYear()}
        </p>

        <h3 className="text-3xl md:text-4xl font-semibold text-white mb-6 leading-tight">
          {story.title}
        </h3>

        <p className="text-pink-200/80 text-lg mb-8 leading-relaxed">
          {story.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-pink-300/70">
            Written by <span className="text-pink-200">{story.author}</span>
          </div>

          <Button
            onClick={()=>{onView()}}
            className="
              bg-linear-to-r from-pink-500 to-purple-500
              hover:from-pink-600 hover:to-purple-600
              text-white font-medium px-6
            "
          >
            Enter Story
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
