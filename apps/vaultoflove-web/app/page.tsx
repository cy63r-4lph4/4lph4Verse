"use client";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import useStoryVault from "@verse/vaultoflove-web/hooks/useStoryVault";
import { Navbar } from "@verse/vaultoflove-web/components/layout/Navbar";
import { BackgroundAnimation } from "@verse/vaultoflove-web/components/layout/BackgroundAnimation";

import { StoryReader } from "@verse/vaultoflove-web/components/StoryReader";
import { UserProfile } from "@verse/vaultoflove-web/components/UserProfile";
import HeartBidPage from "@verse/vaultoflove-web/components/HeartBid";
import HeatBidArenaPage from "@verse/vaultoflove-web/components/HeatBidArena";
import HomeViewPage from "@verse/vaultoflove-web/components/HomeView";
import { WriteStoryView } from "@verse/vaultoflove-web/components/WriteStoryModal";
import { ViewWrapper } from "@verse/vaultoflove-web/components/layout/ViewWrapper";

export default function VaultOfLoveApp() {
  const [currentView, setCurrentView] = useState("home");
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const vault = useStoryVault();

  const handleBack = () => {
    setSelectedStory(null);
    setCurrentView("home");
  };

  const renderView = () => {
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
    } = vault;

    switch (currentView) {
      case "reader":
        return (
          selectedStory && (
            <StoryReader
              story={selectedStory}
              onBack={handleBack}
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
            onBack={handleBack}
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
            onBack={handleBack}
            onNavigateToHeatBid={() => setCurrentView("heatbid")}
          />
        );
      case "heatbid":
        return <HeatBidArenaPage stories={stories} onBack={handleBack} />;
      case "write":
        return (
          <WriteStoryView
            onBack={handleBack}
            onSubmit={(story) => {
              vault.handleAddStory(story);
              setCurrentView("home");
            }}
          />
        );
      default:
        return (
          <HomeViewPage
            stories={stories}
            onLike={handleLikeStory}
            onTip={handleTipAuthor}
            onView={(id: string) => {
              const story = handleViewStory(id);
              setSelectedStory(story);
              setCurrentView("reader");
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 text-white overflow-x-hidden">
      <BackgroundAnimation />
      <Navbar userTokens={vault.userTokens} onNavigate={setCurrentView} />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <ViewWrapper>{renderView()}</ViewWrapper>
        </AnimatePresence>
      </main>
    </div>
  );
}
