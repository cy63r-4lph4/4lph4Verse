"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Coins,
  Eye,
  Calendar,
  User,
  Tag,
  Gift,
  Share2,
  Bookmark,
  Book,
  GitFork,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@verse/ui/components/ui/button";

/* ------------------------------------------------------------
 * Types
 * ------------------------------------------------------------ */
export interface Story {
  id: string | number;
  title: string;
  author: string;
  category: string;
  tags?: string[];
  createdAt: string;
  content?: string;
  interactiveContent?: Record<
    string,
    { text: string; choices: { text: string; nextNodeId: string }[] }
  >;
  views: number;
  likes: number;
  tips: number;
  isInteractive?: boolean;
}

interface StoryReaderProps {
  story: Story;
  onBack: () => void;
  onLike: () => void;
  onTip: (amount: number) => void;
  userTokens: number;
  handleFollowAuthor: (author: string) => void;
  followedAuthors: string[];
}

/* ------------------------------------------------------------
 * Sub-components
 * ------------------------------------------------------------ */
const ClassicReader: React.FC<{
  story: Story;
  onLike: () => void;
  onTip: (amount: number) => void;
  userTokens: number;
  isLiked: boolean;
  handleLike: () => void;
  handleShare: () => void;
  handleBookmark: () => void;
  formatDate: (date: string) => string;
  handleFollowAuthor: (author: string) => void;
  followedAuthors: string[];
}> = ({
  story,
  onTip,
  userTokens,
  isLiked,
  handleLike,
  handleShare,
  handleBookmark,
  formatDate,
  handleFollowAuthor,
  followedAuthors,
}) => {
  const [showTipOptions, setShowTipOptions] = useState(false);
  const isFollowing = followedAuthors.includes(story.author);

  const handleTip = (amount: number) => {
    onTip(amount);
    setShowTipOptions(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* ─────────────── Header ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
          {story.title}
        </h1>

        {/* Author & Stats */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-pink-200/80 mb-8">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-pink-400" />
            <span>{story.author}</span>
            {story.author !== "You" && (
              <Button
                onClick={() => handleFollowAuthor(story.author)}
                size="sm"
                variant="ghost"
                className={`ml-2 text-sm rounded-full px-3 py-1 ${
                  isFollowing
                    ? "text-cyan-300 bg-cyan-500/20"
                    : "text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200"
                }`}
              >
                {isFollowing ? (
                  <UserCheck className="w-4 h-4 mr-1.5" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-1.5" />
                )}
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span>{formatDate(story.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <span>{story.views} views</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <span className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-full text-sm font-semibold text-pink-300 uppercase tracking-wide">
            {story.category}
          </span>
          {story.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-sm text-indigo-300 flex items-center space-x-1"
            >
              <Tag className="w-3 h-3" />
              <span>#{tag}</span>
            </span>
          ))}
        </div>

        {/* Likes & Tips */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          <div className="flex items-center space-x-2 text-pink-300">
            <Heart className="w-5 h-5" />
            <span>{story.likes} likes</span>
          </div>
          <div className="flex items-center space-x-2 text-yellow-300">
            <Coins className="w-5 h-5" />
            <span>{story.tips} CØRE tips</span>
          </div>
        </div>
      </motion.div>

      {/* ─────────────── Story Body ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="prose prose-lg prose-invert max-w-none mb-12"
      >
        <div className="bg-gradient-to-br from-black/20 to-purple-900/20 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-8 md:p-12">
          <p className="text-xl leading-relaxed text-pink-100/90 whitespace-pre-wrap">
            {story.content}
          </p>
        </div>
      </motion.div>

      {/* ─────────────── Action Buttons ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        {/* Like */}
        <Button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            isLiked
              ? "bg-gradient-to-r from-pink-500 to-red-500 text-white"
              : "bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/30 text-pink-300 hover:from-pink-500 hover:to-red-500 hover:text-white"
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
          <span>{isLiked ? "Liked!" : "Like Story"}</span>
        </Button>

        {/* Tip */}
        <div className="relative">
          <Button
            onClick={() => setShowTipOptions((p) => !p)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 hover:from-yellow-500 hover:to-orange-500 hover:text-black rounded-full font-semibold transition-all duration-300"
          >
            <Gift className="w-5 h-5" />
            <span>Tip Author</span>
          </Button>

          <AnimatePresence>
            {showTipOptions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-black/80 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4 z-10"
              >
                <p className="text-sm text-yellow-300 mb-3 text-center">
                  Choose tip amount:
                </p>
                <div className="flex space-x-2">
                  {[5, 10, 25, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => handleTip(amount)}
                      disabled={userTokens < amount}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-yellow-300/60 mt-2 text-center">
                  Your balance: {userTokens} CØRE
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------
 * Interactive Reader
 * ------------------------------------------------------------ */
const InteractiveReader: React.FC<{
  story: Story;
  onLike: () => void;
  handleLike: () => void;
  isLiked: boolean;
}> = ({ story, handleLike, isLiked }) => {
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const currentNode = story.interactiveContent?.[currentNodeId];

  const handleChoice = (nextNodeId: string) => {
    setCurrentNodeId(nextNodeId);
    if (!isLiked) handleLike();
  };

  if (!currentNode)
    return (
      <p className="text-center text-pink-300 mt-20">
        Interactive content not available.
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNodeId}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="bg-gradient-to-br from-black/20 to-purple-900/20 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-8 md:p-12 text-center">
            <p className="text-xl leading-relaxed text-pink-100/90 whitespace-pre-wrap mb-8">
              {currentNode.text}
            </p>
            {currentNode.choices.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {currentNode.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoice(choice.nextNodeId)}
                    className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ------------------------------------------------------------
 * Main Reader Wrapper
 * ------------------------------------------------------------ */
export const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  onBack,
  onLike,
  onTip,
  userTokens,
  handleFollowAuthor,
  followedAuthors,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [mode, setMode] = useState<"classic" | "interactive" | null>(null);

  // Mode initialization
  useEffect(() => {
    setMode(story.isInteractive ? null : "classic");
  }, [story]);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };
    if (mode === "classic") {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mode]);

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      onLike();
    }
  };

  const handleShare = () =>
    toast(
      <>
      <span className="font-semibold text-lg">
        "🚧 Sharing Coming Soon!"
      </span>
      <span>
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
      </span>
      </>
    );

  const handleBookmark = () =>
    toast(
      <>
      <span className="font-semibold text-lg">
        "🚧 Bookmarks Coming Soon!"
      </span>
      <span>
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
      </span>
      </>
    );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const renderContent = () => {
    if (mode === "classic")
      return (
        <ClassicReader
          story={story}
          onLike={onLike}
          onTip={onTip}
          userTokens={userTokens}
          isLiked={isLiked}
          handleLike={handleLike}
          handleShare={handleShare}
          handleBookmark={handleBookmark}
          formatDate={formatDate}
          handleFollowAuthor={handleFollowAuthor}
          followedAuthors={followedAuthors}
        />
      );
    if (mode === "interactive")
      return (
        <InteractiveReader
          story={story}
          onLike={onLike}
          handleLike={handleLike}
          isLiked={isLiked}
        />
      );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center px-6"
      >
        <h2 className="text-4xl font-bold mb-4 text-white">
          Choose Your Experience
        </h2>
        <p className="text-pink-200/80 mb-8 max-w-lg">
          This story is interactive. You can read it as a classic story or
          immerse yourself in a choice-driven narrative.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Button
            onClick={() => setMode("classic")}
            className="px-8 py-6 text-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 hover:from-pink-500 hover:to-purple-500 hover:text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-3"
          >
            <Book className="w-6 h-6" />
            <span>Classic Reading</span>
          </Button>
          <Button
            onClick={() => setMode("interactive")}
            className="px-8 py-6 text-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 hover:from-cyan-500 hover:to-blue-500 hover:text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-3"
          >
            <GitFork className="w-6 h-6" />
            <span>Interactive Mode</span>
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900"
    >
      {/* Progress Bar */}
      {mode === "classic" && (
        <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-400 to-purple-400"
            style={{ width: `${readingProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}

      {/* Top Bar */}
      <div className="sticky top-0 bg-black/40 backdrop-blur-sm border-b border-pink-500/20 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-pink-300 hover:text-pink-200 hover:bg-pink-500/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Stories
          </Button>

          <div className="flex items-center space-x-4">
            <Button
              onClick={handleShare}
              variant="ghost"
              size="icon"
              className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/20"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleBookmark}
              variant="ghost"
              size="icon"
              className="text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/20"
            >
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {renderContent()}
    </motion.div>
  );
};
