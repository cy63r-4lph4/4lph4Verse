"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, BookOpen, Trophy, Search, Filter } from "lucide-react";
import { StoryCard } from "@verse/vaultoflove-web/components/StoryCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@verse/ui/components/ui/select";
import { Input } from "@verse/ui/components/ui/input";
import { Story } from "@verse/sdk/types";
import { FeaturedStoryCard } from "@verse/vaultoflove-web/components/FeaturedStoryCard";

interface HomeViewPageProps {
  stories: Story[];
  onLike: (storyId: string | number) => void;
  onTip: (storyId: string | number, amount: number) => void;
  onView: (id: string | number) => void;
}

export default function HomeViewPage({
  stories,
  onLike,
  onTip,
  onView,
}: HomeViewPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const featuredStory = {
    id: 2,
    title: "Crimson Echoes",
    author: "Aiden",
    excerpt: "Each note of the song reminded him of her laughter fading away.",
    content: "Full story content goes here...",
    category: "drama",
    likes: 29,
    views: 95,
    tips: 2,
    tags: ["music", "memory"],
    isNftEligible: false,
    isMinted: false,
    onAuction: false,
    isInteractive: false,
    createdAt: new Date().toISOString(),
  };

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || story.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
        <motion.p
          className="text-xs uppercase tracking-[0.35em] text-text-muted mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          A living archive of human love
        </motion.p>

        {/* Reserved gradient moment: the hero title, and only the hero title */}
        <motion.h1
          className="font-display text-6xl md:text-7xl font-semibold mb-6 text-love-gradient"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Stories of Love
        </motion.h1>

        <motion.p
          className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          Where every heartbreak becomes wisdom, every loss becomes strength,
          and every story becomes a legacy.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <div className="flex items-center gap-2 rounded-full border border-accent-violet/25 bg-accent-violet/10 px-4 py-2">
            <BookOpen className="w-4 h-4 text-accent-violet" />
            <span className="text-sm font-medium text-accent-violet">
              {stories.length} Stories
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-accent-gold/25 bg-accent-gold/10 px-4 py-2">
            <Trophy className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-medium text-accent-gold">
              {stories.filter((s) => s.isNftEligible).length} NFT Eligible
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-accent-rose/25 bg-accent-rose/10 px-4 py-2">
            <Heart className="w-4 h-4 text-accent-rose" />
            <span className="text-sm font-medium text-accent-rose">
              {stories.reduce(
                (sum, s) => sum + (typeof s.likes === "number" ? s.likes : 0),
                0
              )}{" "}
              Total Likes
            </span>
          </div>
        </motion.div>
      </div>

      {/* ─────────────── Featured ─────────────── */}
      <section className="mb-20">
        <p className="text-xs uppercase tracking-[0.3em] text-accent-gold/80 mb-3">
          Featured Memory
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-8">
          A story held by the Vault
        </h2>

        <FeaturedStoryCard
          story={featuredStory}
          onView={() => onView(featuredStory.id)}
        />

        <div className="h-px bg-white/5 mt-20" />
      </section>

      {/* ─────────────── Search + Filter ─────────────── */}
      <motion.div
        className="flex flex-col md:flex-row gap-3 mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="relative flex-1">
          <Search className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            type="text"
            placeholder="Search stories, authors, or themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-vault-surface border border-white/10 rounded-xl text-text-primary placeholder-text-muted focus-love"
          />
        </div>

        <div className="relative">
          <Filter className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="pl-11 pr-8 h-11 bg-vault-surface border border-white/10 rounded-xl text-text-primary focus-love cursor-pointer">
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {filteredStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.06 }}
          >
            <StoryCard
              story={story}
              onLike={() => onLike(story.id!)}
              onTip={(amount) => onTip(story.id!, amount)}
              onView={() => onView(story.id!)}
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
          transition={{ duration: 0.6 }}
        >
          <Heart className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-lg text-text-secondary">
            Some stories reveal themselves only when the heart is quiet.
          </p>
          <p className="text-text-muted mt-1 text-sm">
            Try adjusting your filters or search terms.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}