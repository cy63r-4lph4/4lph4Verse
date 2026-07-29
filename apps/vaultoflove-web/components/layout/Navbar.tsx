"use client";

import { motion } from "framer-motion";
import { Heart, Flame, Gavel, Users, PenTool, Coins } from "lucide-react";
import { Button } from "@verse/ui/components/ui/button";

type View = "home" | "profile" | "write" | "reader" | "heartbid" | "heatbid";

type NavbarProps = {
  userTokens: number;
  onNavigate: (view: View) => void;
};

export function Navbar({ userTokens, onNavigate }: NavbarProps) {
  return (
    <nav className="relative z-20 border-b border-white/5 bg-vault-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* ─── Logo — the one place the signature gradient lives in chrome ─── */}
        <motion.button
          type="button"
          className="flex items-center gap-2.5"
          onClick={() => onNavigate("home")}
          whileTap={{ scale: 0.97 }}
        >
          <Heart className="w-6 h-6 text-accent-rose" fill="currentColor" />
          <span className="font-display text-xl font-semibold text-love-gradient">
            Vault of Love
          </span>
        </motion.button>

        {/* ─── Nav links — solid semantic colors, no competing animation ─── */}
        <div className="hidden md:flex items-center gap-1">
          <Button
            onClick={() => onNavigate("heatbid")}
            variant="ghost"
            className="text-accent-ember hover:text-accent-ember hover:bg-accent-ember/10"
          >
            <Flame className="w-4 h-4" />
            Heat Bid
          </Button>
          <Button
            onClick={() => onNavigate("heartbid")}
            variant="ghost"
            className="text-accent-gold hover:text-accent-gold hover:bg-accent-gold/10"
          >
            <Gavel className="w-4 h-4" />
            Heart Bid
          </Button>
          <Button
            onClick={() => onNavigate("profile")}
            variant="ghost"
            className="text-text-secondary hover:text-text-primary hover:bg-white/5"
          >
            <Users className="w-4 h-4" />
            Profile
          </Button>
        </div>

        {/* ─── Balance + primary action ─── */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-accent-gold/25 bg-accent-gold/10 px-3.5 py-1.5">
            <Coins className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-semibold text-accent-gold">
              {userTokens.toLocaleString()} CØRE
            </span>
          </div>
          <Button
            onClick={() => onNavigate("write")}
            size="lg"
            className="btn-love rounded-full"
          >
            <PenTool className="w-4 h-4" />
            Write
          </Button>
        </div>
      </div>
    </nav>
  );
}