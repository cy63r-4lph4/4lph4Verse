"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  PenTool,
  Coins,
  Users,
  Gavel,
  Sparkles,
  Flame,
} from "lucide-react";

import { StoryReader } from "@verse/vaultoflove-web/components/StoryReader";
import { UserProfile } from "@verse/vaultoflove-web/components/UserProfile";
import HeartBidPage from "@verse/vaultoflove-web/components/HeartBid";
import HeatBidArenaPage from "@verse/vaultoflove-web/components/HeatBidArena";
import HomeViewPage from "@verse/vaultoflove-web/components/HomeView";
import useStoryVault from "@verse/vaultoflove-web/hooks/useStoryVault";
import { Button } from "@verse/ui/components/ui/button";


export default function VaultOfLoveApp() {
  const [currentView, setCurrentView] = useState<"home" | "reader" | "profile" | "heartbid" | "heatbid" | "write">("home");
  const [selectedStory, setSelectedStory] = useState<any>(null);

  const {
    stories,
    userTokens,
    handleLikeStory,
    handleTipAuthor,
    handleAddStory,
    handleViewStory,
    handleMintNFT,
    handleListForBid,
    authors,
    followedAuthors,
    handleFollowAuthor,
  } = useStoryVault();

  const onAddStory = (newStory: any) => {
    handleAddStory(newStory);
    setCurrentView("home");
  };

  const onViewStory = (storyId: string | number) => {
    const story = handleViewStory(storyId);
    setSelectedStory(story);
    setCurrentView("reader");
  };

  const onBack = () => {
    setSelectedStory(null);
    setCurrentView("home");
  };

  const renderView = () => {
    switch (currentView) {
      case "reader":
        return (
          selectedStory && (
            <StoryReader
              story={selectedStory}
              onBack={onBack}
              onLike={() => handleLikeStory(selectedStory.id)}
              onTip={(amount) => handleTipAuthor(selectedStory.id, amount)}
              userTokens={userTokens}
              handleFollowAuthor={handleFollowAuthor}
              followedAuthors={followedAuthors}
            />
          )
        );
      case "profile":
        return (
          <UserProfile
            stories={stories.filter((s) => s.author === "You")}
            userTokens={userTokens}
            onBack={onBack}
            onMintNFT={handleMintNFT}
            onListForBid={handleListForBid}
            authors={authors}
            followedAuthors={followedAuthors}
          />
        );
      case "heartbid":
        return (
          <HeartBidPage
            stories={stories}
            onBack={onBack}
            onNavigateToHeatBid={() => setCurrentView("heatbid")}
          />
        );
      case "heatbid":
        return <HeatBidArenaPage stories={stories} onBack={() => setCurrentView("home")} />;
      case "write":
        return <WriteStoryModal onBack={onBack} onSubmit={onAddStory} />;
      default:
        return (
          <HomeViewPage
            stories={stories}
            onLike={handleLikeStory}
            onTip={handleTipAuthor}
            onView={onViewStory}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 text-white overflow-x-hidden">

      {/* Background Animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,182,193,0.1),transparent_50%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-pink-500/5 via-purple-500/5 to-indigo-500/5 rounded-full blur-3xl animate-spin"
          style={{ animationDuration: "60s" }}
        ></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-20 p-6 backdrop-blur-sm bg-black/20 border-b border-pink-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setCurrentView("home")}
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              onClick={() => setCurrentView("heatbid")}
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 animate-pulse"
            >
              <Flame className="w-5 h-5" />
              Heat Bid
            </Button>
            <Button
              onClick={() => setCurrentView("heartbid")}
              variant="ghost"
              className="text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/20"
            >
              <Gavel className="w-5 h-5" />
              Heart Bid
            </Button>
            <Button
              onClick={() => setCurrentView("profile")}
              variant="ghost"
              className="text-pink-300 hover:text-pink-200 hover:bg-pink-500/20"
            >
              <Users className="w-5 h-5 " />
              Profile
            </Button>
          </div>

          {/* Token Display + Write */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-yellow-500/30">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-yellow-300">{userTokens} CØRE</span>
            </div>
            <Button
              onClick={() => setCurrentView("write")}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-6 py-5 rounded-full shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
            >
              <PenTool className="size-5" />
              Write
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">{renderView()}</AnimatePresence>
      </main>

    </div>
  );
}
