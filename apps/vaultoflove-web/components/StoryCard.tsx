"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Eye,
  Coins,
  Trophy,
  ArrowRight,
  Gift,
  GitFork,
} from "lucide-react";
import { Button } from "@verse/ui/components/ui/button";
import { Story } from "@verse/sdk/types";

interface StoryCardProps {
  story: Story;
  onLike: () => void;
  onTip: (amount: number) => void;
  onView: () => void;
}

export function StoryCard({ story, onLike, onTip, onView }: StoryCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showTipOptions, setShowTipOptions] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      onLike();
    }
  };

  const handleTip = (amount: number) => {
    onTip(amount);
    setShowTipOptions(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="card-love group relative p-6">
      {/* ─────────────── Status Badges ─────────────── */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <AnimatePresence>
          {story.isInteractive && (
            <motion.div
              key="interactive"
              className="bg-accent-violet/15 border border-accent-violet/30 text-accent-violet w-6 h-6 rounded-md flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              title="Interactive Story"
            >
              <GitFork className="w-3.5 h-3.5" />
            </motion.div>
          )}
          {story.isNftEligible && (
            <motion.div
              key="nft"
              className="bg-accent-gold/15 border border-accent-gold/30 text-accent-gold w-6 h-6 rounded-md flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              title="NFT Ready"
            >
              <Trophy className="w-3.5 h-3.5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─────────────── Header ─────────────── */}
      <div className="flex items-center justify-between mb-4 pr-16">
        <span className="text-xs font-medium text-accent-rose uppercase tracking-wide">
          {story.category}
        </span>
        <span className="text-xs text-text-muted">
          {formatDate(story.createdAt)}
        </span>
      </div>

      {/* ─────────────── Content ─────────────── */}
      <div className="mb-5">
        <h3 className="font-voice text-lg font-semibold text-text-primary mb-1.5 group-hover:text-accent-rose transition-colors duration-200">
          {story.title}
        </h3>
        <p className="text-sm text-text-muted mb-2.5">by {story.author}</p>
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {story.excerpt}
        </p>
      </div>

      {/* ─────────────── Tags ─────────────── */}
      {story.tags && story.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {story.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-white/5 rounded text-xs text-text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ─────────────── Stats ─────────────── */}
      <div className="flex items-center gap-4 mb-5 text-sm border-t border-white/5 pt-4">
        <div className="flex items-center gap-1.5 text-accent-rose">
          <Heart className="w-3.5 h-3.5" />
          <span>{story.likes}</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted">
          <Eye className="w-3.5 h-3.5" />
          <span>{story.views}</span>
        </div>
        <div className="flex items-center gap-1.5 text-accent-gold">
          <Coins className="w-3.5 h-3.5" />
          <span>{story.tips}</span>
        </div>
      </div>

      {/* ─────────────── Actions ─────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            onClick={handleLike}
            variant="ghost"
            size="sm"
            className={`text-text-secondary hover:text-accent-rose hover:bg-accent-rose/10 transition-colors duration-200 ${
              isLiked ? "text-accent-rose bg-accent-rose/10" : ""
            }`}
          >
            <Heart className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
            Like
          </Button>

          <div className="relative">
            <Button
              onClick={() => setShowTipOptions((prev) => !prev)}
              variant="ghost"
              size="sm"
              className="text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10"
            >
              <Gift className="w-4 h-4 mr-1" />
              Tip
            </Button>

            <AnimatePresence>
              {showTipOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-0 mb-2 bg-vault-surface-raised border border-accent-gold/25 rounded-lg p-2.5 flex gap-1.5 z-10"
                >
                  {[5, 10, 25, 50].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleTip(amount)}
                      className="btn-gold rounded-md px-2.5 py-1 text-xs"
                    >
                      {amount}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Button
          onClick={onView}
          size="sm"
          className="btn-solid rounded-lg"
        >
          Read
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}