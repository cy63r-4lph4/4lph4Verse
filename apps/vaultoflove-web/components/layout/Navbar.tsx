"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Gavel,
  Flame,
  Sparkles,
  PenTool,
  Coins,
} from "lucide-react";
import { Button } from "@verse/ui/components/ui/button";

type NavbarProps = {
  userTokens: number;
  onNavigate: (view: string) => void;
};

export function Navbar({ userTokens, onNavigate }: NavbarProps) {
  return (
    <nav className="relative z-20 p-6 backdrop-blur-sm bg-black/20 border-b border-pink-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* ─── Logo Section ─── */}
        <motion.div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => onNavigate("home")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <Heart className="w-8 h-8 text-pink-400 fill-pink-400" />
            <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            VaultofLove
          </span>
        </motion.div>

        {/* ─── Desktop Nav Buttons ─── */}
        <div className="hidden md:flex items-center space-x-2">
          <Button
            onClick={() => onNavigate("heatbid")}
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 animate-pulse"
          >
            <Flame className="w-5 h-5" />
            Heat Bid
          </Button>
          <Button
            onClick={() => onNavigate("heartbid")}
            variant="ghost"
            className="text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/20"
          >
            <Gavel className="w-5 h-5" />
            Heart Bid
          </Button>
          <Button
            onClick={() => onNavigate("profile")}
            variant="ghost"
            className="text-pink-300 hover:text-pink-200 hover:bg-pink-500/20"
          >
            <Users className="w-5 h-5" />
            Profile
          </Button>
        </div>

        {/* ─── Tokens + Write Button ─── */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-yellow-500/30">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-yellow-300">
              {userTokens} CØRE
            </span>
          </div>
          <Button variant="love" size="lg" className="rounded-full">
            <PenTool className="w-5 h-5" /> Write
          </Button>
        </div>
      </div>
    </nav>
  );
}
