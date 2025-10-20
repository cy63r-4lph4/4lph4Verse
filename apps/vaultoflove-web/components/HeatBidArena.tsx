"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Crown, Shield } from "lucide-react";
import { useToast } from "@verse/vaultoflove-web/components/toast";
import { Button } from "@verse/ui/components/ui/button";


/* ------------------------------------------------------------
 * Types
 * ------------------------------------------------------------ */
type Story = {
  id: string | number;
  title: string;
  author: string;
  tips: number;
  onAuction: boolean;
};

interface HeatBidArenaProps {
  stories: Story[];
  onBack?: () => void;
}

/* ------------------------------------------------------------
 * Component
 * ------------------------------------------------------------ */
export default function HeatBidArenaPage({
  stories = [],
  onBack,
}: HeatBidArenaProps) {
  const { toast } = useToast();

  const topStories = stories
    .filter((s) => s.onAuction)
    .sort((a, b) => b.tips - a.tips)
    .slice(0, 3);

  const handleClaimThrone = () => {
    toast({
      title: "👑 A New Legend is Born!",
      description:
        "The throne has been claimed! This story is now immortalized in the Vault of Love.",
      duration: 5000,
    });
  };

  const getCardStyle = (index: number) => {
    switch (index) {
      case 0:
        return "border-yellow-400/80 shadow-yellow-500/20 scale-105 z-10";
      case 1:
        return "border-gray-400/60 shadow-gray-500/20 lg:mt-8";
      case 2:
        return "border-orange-600/60 shadow-orange-500/20 lg:mt-8";
      default:
        return "border-red-500/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-black via-red-950/40 to-black text-white"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* ─────────────── Header Buttons ─────────────── */}
        <div className="flex items-center justify-between mb-12">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-pink-300 hover:text-pink-200 hover:bg-pink-500/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </div>

        {/* ─────────────── Page Header ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full border border-red-500/30 mb-6">
            <Flame className="w-12 h-12 text-red-400 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Heat Bid Arena
          </h1>
          <p className="text-xl text-orange-200/80 max-w-3xl mx-auto italic">
            "Only those baptized in love may enter the fire."
          </p>
        </motion.div>

        {/* ─────────────── Arena Leaderboard ─────────────── */}
        {topStories.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            {topStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                className={`relative bg-gradient-to-br from-black/60 to-purple-900/40 backdrop-blur-md border-2 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 ${getCardStyle(
                  index
                )}`}
              >
                {index === 0 && (
                  <Crown className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 text-yellow-400" />
                )}
                {index === 1 && (
                  <Shield className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-gray-400" />
                )}
                {index === 2 && (
                  <Shield className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-orange-600" />
                )}

                <h3 className="text-2xl font-bold text-white mb-2 mt-4">
                  {story.title}
                </h3>
                <p className="text-md text-pink-200/80 mb-6">
                  by {story.author}
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6">
                  {story.tips * 10 + 100} CØRE
                </p>

                <Button
                  onClick={handleClaimThrone}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold"
                >
                  {index === 0 ? "Claim the Throne" : "Challenge for Throne"}
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Flame className="w-16 h-16 text-red-400/50 mx-auto mb-4" />
            <p className="text-xl text-red-300/70">The arena is silent.</p>
            <p className="text-red-300/50 mt-2">
              Awaiting champions from the Heart Bid.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
