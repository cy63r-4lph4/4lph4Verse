"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, BookOpen, Trophy, Search, Filter } from "lucide-react";
import { StoryCard } from "@verse/vaultoflove-web/components/StoryCard";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@verse/ui/components/ui/select";
import {Input} from "@verse/ui/components/ui/input"


/* ------------------------------------------------------------
 * Types
 * ------------------------------------------------------------ */
type Story = {
  id: string | number;
  title: string;
  author: string;
  excerpt: string;
  category: string;
  likes: number;
  tips: number;
  isNftEligible?: boolean;
};

/* ------------------------------------------------------------
 * Component
 * ------------------------------------------------------------ */
export default function HomeViewPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Demo data for now — you’ll replace this with your SDK fetch later
  const stories: Story[] = [
    {
      id: 1,
      title: "Eternal Ember",
      author: "Lyra",
      excerpt: "In the ashes of heartbreak, she found the spark of rebirth...",
      category: "romance",
      likes: 42,
      tips: 3,
      isNftEligible: true,
    },
    {
      id: 2,
      title: "Crimson Echoes",
      author: "Aiden",
      excerpt: "Each note of the song reminded him of her laughter fading away.",
      category: "drama",
      likes: 29,
      tips: 2,
      isNftEligible: false,
    },
    {
      id: 3,
      title: "Cosmic Threads",
      author: "Nova",
      excerpt: "Two souls collided across galaxies, rewriting destiny itself.",
      category: "sci-fi",
      likes: 51,
      tips: 5,
      isNftEligible: true,
    },
  ];

  /* ------------------------------------------------------------
   * Logic
   * ------------------------------------------------------------ */
  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || story.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  /* ------------------------------------------------------------
   * Handlers
   * ------------------------------------------------------------ */
  const handleLike = (id: number | string) => {
    console.log("Liked story:", id);
  };

  const handleTip = (id: number | string, amount: number) => {
    console.log(`Tipped ${amount} CØRE to story:`, id);
  };

  const handleView = (id: number | string) => {
    console.log("View story details:", id);
  };

  /* ------------------------------------------------------------
   * UI
   * ------------------------------------------------------------ */
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      {/* ─────────────── Hero Section ─────────────── */}
      <div className="text-center mb-16">
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Stories of Love
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-pink-200 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Where every heartbreak becomes wisdom, every loss becomes strength, and
          every story becomes a legacy. In the Vault of Love, pain transforms into
          the most beautiful kind of love.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-8 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-center space-x-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-6 py-3 rounded-full border border-pink-500/30">
            <BookOpen className="w-6 h-6 text-pink-400" />
            <span className="text-pink-200 font-semibold">{stories.length} Stories</span>
          </div>
          <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 px-6 py-3 rounded-full border border-purple-500/30">
            <Trophy className="w-6 h-6 text-purple-400" />
            <span className="text-purple-200 font-semibold">
              {stories.filter((s) => s.isNftEligible).length} NFT Eligible
            </span>
          </div>
          <div className="flex items-center space-x-3 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 px-6 py-3 rounded-full border border-indigo-500/30">
            <Heart className="w-6 h-6 text-indigo-400" />
            <span className="text-indigo-200 font-semibold">
              {stories.reduce((sum, s) => sum + s.likes, 0)} Total Likes
            </span>
          </div>
        </motion.div>
      </div>

      {/* ─────────────── Search + Filter ─────────────── */}
      <motion.div
        className="flex flex-col md:flex-row gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
          <Input
            type="text"
            placeholder="Search stories, authors, or themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-black/30 border border-pink-500/30 rounded-full text-white placeholder-pink-300/60 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 backdrop-blur-sm"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="pl-12 pr-8 py-3 bg-black/30 border border-purple-500/30 rounded-full text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm cursor-pointer">
              <SelectValue placeholder="Filter category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="romance">Romance</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="sci-fi">Sci-Fi</SelectItem>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="mystery">Mystery</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* ─────────────── Stories Grid ─────────────── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        {filteredStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
          >
            <StoryCard
              story={story}
              onLike={() => handleLike(story.id)}
              onTip={(amount) => handleTip(story.id, amount)}
              onView={() => handleView(story.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ─────────────── Empty State ─────────────── */}
      {filteredStories.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Heart className="w-16 h-16 text-pink-400/50 mx-auto mb-4" />
          <p className="text-xl text-pink-300/70">
            No stories found matching your search.
          </p>
          <p className="text-pink-300/50 mt-2">
            Try adjusting your filters or search terms.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
