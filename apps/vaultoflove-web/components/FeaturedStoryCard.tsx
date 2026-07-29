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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="card-precious relative overflow-hidden p-10 md:p-14"
    >
      <div className="relative z-10 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.3em] text-accent-gold/80 mb-4">
          {story.category} · {new Date(story.createdAt!).getFullYear()}
        </p>

        <h3 className="font-voice text-3xl md:text-4xl font-semibold text-text-primary mb-5 leading-tight">
          {story.title}
        </h3>

        <p className="text-text-secondary text-base md:text-lg mb-8 leading-relaxed">
          {story.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-text-muted">
            Written by <span className="text-text-primary">{story.author}</span>
          </div>

          <Button onClick={onView} className="btn-gold rounded-lg px-6">
            Enter Story
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}