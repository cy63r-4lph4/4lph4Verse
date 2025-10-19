"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Gavel, Heart, Clock, Coins, Flame } from "lucide-react";
import { Button } from "@verse/ui/button";
import { useToast } from "@verse/ui/use-toast";

type Story = {
  id: string | number;
  title: string;
  author: string;
  tips: number;
  onAuction: boolean;
};

interface HeartBidProps {
  stories: Story[];
  onBack?: () => void;
  onNavigateToHeatBid?: () => void;
}

export default function HeartBidPage({
  stories = [],
  onBack,
  onNavigateToHeatBid,
}: HeartBidProps) {
  const { toast } = useToast();
  const auctionStories = stories.filter((s) => s.onAuction);

  const handleBid = () => {
    toast({
      title: "🚧 Bidding Feature Coming Soon!",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 4000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-black via-purple-950/50 to-black text-white"
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
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

          <Button
            onClick={onNavigateToHeatBid}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold animate-pulse shadow-lg hover:shadow-red-500/30"
          >
            <Flame className="w-5 h-5 mr-2" /> To the Heat Bid Arena!
          </Button>
        </div>

        {/* ─────────────── Page Header ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full border border-pink-500/30 mb-6">
            <Heart className="w-12 h-12 text-pink-400 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Heart Bid
          </h1>
          <p className="text-xl text-pink-200/80 max-w-3xl mx-auto">
            The exclusive auction event where legacy stories find new guardians.
            Place your bid and own a piece of love's history.
          </p>
        </motion.div>

        {/* ─────────────── Auction Cards ─────────────── */}
        {auctionStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctionStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group relative bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10"
              >
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                  {story.title}
                </h3>
                <p className="text-sm text-yellow-200/80 mb-4">
                  by {story.author}
                </p>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-300/70">Current Bid</span>
                    <span className="font-bold text-yellow-300 flex items-center">
                      <Coins className="w-4 h-4 mr-1" /> {story.tips * 10 + 100}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-300/70">Time Left</span>
                    <span className="font-bold text-yellow-300 flex items-center">
                      <Clock className="w-4 h-4 mr-1" /> 23:15:40
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleBid}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold"
                >
                  <Gavel className="w-4 h-4 mr-2" />
                  Place Bid
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
            <Clock className="w-16 h-16 text-pink-400/50 mx-auto mb-4" />
            <p className="text-xl text-pink-300/70">
              The Heart Bid event is not live yet.
            </p>
            <p className="text-pink-300/50 mt-2">
              Check back soon for story auctions!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
