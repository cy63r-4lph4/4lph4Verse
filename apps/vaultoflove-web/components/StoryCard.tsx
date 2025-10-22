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

/* ------------------------------------------------------------
 * Component
 * ------------------------------------------------------------ */
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
    <motion.div
      className="group relative bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10"
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* ─────────────── Status Badges ─────────────── */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <AnimatePresence>
          {story.isInteractive && (
            <motion.div
              key="interactive"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: 0.2,
              }}
              title="Interactive Story"
            >
              <GitFork className="w-3 h-3" />
            </motion.div>
          )}
          {story.isNftEligible && (
            <motion.div
              key="nft"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              title="NFT Ready"
            >
              <Trophy className="w-3 h-3" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─────────────── Header ─────────────── */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-full text-xs font-semibold text-pink-300 uppercase tracking-wide">
          {story.category}
        </span>
        <span className="text-xs text-pink-300/60">
          {formatDate(story.createdAt)}
        </span>
      </div>

      {/* ─────────────── Content ─────────────── */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors duration-300">
          {story.title}
        </h3>
        <p className="text-sm text-pink-200/80 mb-3">by {story.author}</p>
        <p className="text-pink-100/70 text-sm leading-relaxed line-clamp-3">
          {story.excerpt}
        </p>
      </div>

      {/* ─────────────── Tags ─────────────── */}
      {story.tags && story.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {story.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-md text-xs text-indigo-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ─────────────── Stats ─────────────── */}
      <div className="flex items-center justify-between mb-6 text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-pink-300">
            <Heart className="w-4 h-4" />
            <span>{story.likes}</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-300">
            <Eye className="w-4 h-4" />
            <span>{story.views}</span>
          </div>
          <div className="flex items-center space-x-1 text-yellow-300">
            <Coins className="w-4 h-4" />
            <span>{story.tips}</span>
          </div>
        </div>
      </div>

      {/* ─────────────── Actions ─────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Like Button */}
          <Button
            onClick={handleLike}
            variant="ghost"
            size="sm"
            className={`text-pink-300 hover:text-pink-200 hover:bg-pink-500/20 transition-all duration-300 ${
              isLiked ? "text-pink-400 bg-pink-500/20" : ""
            }`}
          >
            <Heart
              className={`w-4 h-4 mr-1 ${isLiked ? "fill-pink-400" : ""}`}
            />
            Like
          </Button>

          {/* Tip Dropdown */}
          <div className="relative">
            <Button
              onClick={() => setShowTipOptions((prev) => !prev)}
              variant="ghost"
              size="sm"
              className="text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/20"
            >
              <Gift className="w-4 h-4 mr-1" />
              Tip
            </Button>

            <AnimatePresence>
              {showTipOptions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  className="absolute bottom-full left-0 mb-2 bg-black/80 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-3 flex space-x-2 z-10"
                >
                  {[5, 10, 25, 50].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => handleTip(amount)}
                      size="sm"
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold px-3 py-1 text-xs"
                    >
                      {amount}
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Read Button */}
        <Button
          onClick={onView}
          size="sm"
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold"
        >
          Read
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}
