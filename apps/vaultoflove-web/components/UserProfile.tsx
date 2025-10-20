"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  BookOpen,
  Coins,
  Heart,
  Trophy,
  Edit,
  ShieldCheck,
  Bookmark,
  Activity,
  DollarSign,
  Sparkles,
  Gavel,
  UserPlus,
} from "lucide-react";
import { Button } from "@verse/ui/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@verse/ui/components/ui/tabs";
import { Progress } from "@verse/ui/components/ui/progress";
import { useToast } from "@verse/vaultoflove-web/components/toast";

/* ------------------------------------------------------------
 * Types
 * ------------------------------------------------------------ */
interface Story {
  id: string | number;
  title: string;
  excerpt: string;
  likes: number;
  tips: number;
  isNftEligible?: boolean;
  isMinted?: boolean;
  onAuction?: boolean;
}

interface Author {
  name: string;
  followers: number;
}

interface UserProfileProps {
  stories: Story[];
  userTokens: number;
  onBack: () => void;
  onMintNFT: (id: string | number) => void;
  onListForBid: (id: string | number) => void;
  authors: Author[];
  followedAuthors: string[];
}

/* ------------------------------------------------------------
 * Component
 * ------------------------------------------------------------ */
export const UserProfile: React.FC<UserProfileProps> = ({
  stories,
  userTokens,
  onBack,
  onMintNFT,
  onListForBid,
  authors,
  followedAuthors,
}) => {
  const { toast } = useToast();

  const totalLikes = stories.reduce((sum, story) => sum + story.likes, 0);
  const totalTips = stories.reduce((sum, story) => sum + story.tips, 0);
  const reputation = Math.min(
    Math.floor((stories.length * 50 + totalLikes * 0.1 + totalTips * 1) / 10),
    100
  );
  const userAuthorProfile = authors.find((a) => a.name === "You");
  const userFollowers = userAuthorProfile?.followers ?? 0;

  const recentActivities = [
    { id: 1, type: "like", content: 'You liked "The Digital Heart".', time: "2h ago" },
    { id: 2, type: "tip", content: 'You tipped 25 CØRE to "Letters to Tomorrow".', time: "1d ago" },
    { id: 3, type: "publish", content: 'You published "The Last Dance".', time: "3d ago" },
  ];

  const handleEditProfile = () =>
    toast({
      title: "🚧 Profile Editing Coming Soon!",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 4000,
    });

  const handleBookmarkClick = () =>
    toast({
      title: "🚧 Saved Stories Coming Soon!",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 4000,
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
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
            onClick={handleEditProfile}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar — Profile Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            {/* Profile Card */}
            <div className="text-center p-8 bg-black/30 backdrop-blur-sm border border-pink-500/20 rounded-2xl">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-4xl text-white shadow-2xl">
                  <User className="w-16 h-16" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white">You</h1>
              <p className="text-pink-300/70">@vault_lover</p>
              <div className="mt-4 flex items-center justify-center space-x-2 text-cyan-300">
                <UserPlus className="w-5 h-5" />
                <span>{userFollowers} Followers</span>
              </div>
            </div>

            {/* Reputation */}
            <div className="p-6 bg-black/30 backdrop-blur-sm border border-pink-500/20 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-cyan-400" /> 4lph4 Verse Reputation
              </h3>
              <div className="flex items-center space-x-4">
                <Progress value={reputation} className="w-full" />
                <span className="font-bold text-cyan-300">{reputation}%</span>
              </div>
              <p className="text-xs text-pink-300/60 mt-2">
                Your standing in the community based on contributions.
              </p>
            </div>

            {/* Earnings */}
            <div className="p-6 bg-black/30 backdrop-blur-sm border border-pink-500/20 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-yellow-400" /> Earnings
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-pink-300/80">Total Tips Received</span>
                  <span className="font-bold text-yellow-300 flex items-center">
                    <Coins className="w-4 h-4 mr-1" /> {totalTips}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pink-300/80">CØRE Balance</span>
                  <span className="font-bold text-yellow-300 flex items-center">
                    <Coins className="w-4 h-4 mr-1" /> {userTokens}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="stories" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="stories">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Your Stories
                </TabsTrigger>
                <TabsTrigger value="following">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Following
                </TabsTrigger>
                <TabsTrigger value="saved" onClick={handleBookmarkClick}>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Saved
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Activity className="w-4 h-4 mr-2" />
                  Activity
                </TabsTrigger>
              </TabsList>

              {/* Stories Tab */}
              <TabsContent value="stories" className="mt-6 space-y-6">
                {stories.length > 0 ? (
                  stories.map((story) => (
                    <div
                      key={story.id}
                      className="bg-black/30 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6"
                    >
                      <h4 className="text-lg font-bold text-white">{story.title}</h4>
                      <p className="text-sm text-pink-300/70 mt-1 mb-4 line-clamp-2">
                        {story.excerpt}
                      </p>

                      <div className="flex items-center space-x-6 text-sm text-pink-300/80 mb-4">
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1.5 text-pink-400" /> {story.likes} Likes
                        </span>
                        <span className="flex items-center">
                          <Coins className="w-4 h-4 mr-1.5 text-yellow-400" /> {story.tips} Tips
                        </span>
                        <span className="flex items-center">
                          <Trophy className="w-4 h-4 mr-1.5 text-purple-400" />{" "}
                          {story.isNftEligible ? "Eligible" : "Not Eligible"}
                        </span>
                      </div>

                      {story.isNftEligible && (
                        <div className="border-t border-pink-500/20 pt-4 mt-4 flex items-center gap-4">
                          {!story.isMinted ? (
                            <Button
                              onClick={() => onMintNFT(story.id)}
                              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold"
                            >
                              <Sparkles className="w-4 h-4 mr-2" /> Mint NFT
                            </Button>
                          ) : !story.onAuction ? (
                            <Button
                              onClick={() => onListForBid(story.id)}
                              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold"
                            >
                              <Gavel className="w-4 h-4 mr-2" /> List for Heart Bid
                            </Button>
                          ) : (
                            <div className="flex items-center text-sm font-semibold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full">
                              <Gavel className="w-4 h-4 mr-2" /> On Auction
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <BookOpen className="w-16 h-16 text-pink-400/50 mx-auto mb-4" />
                    <p className="text-xl text-pink-300/70">
                      You haven’t written any stories yet.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Following Tab */}
              <TabsContent value="following" className="mt-6 space-y-4">
                {followedAuthors.length > 0 ? (
                  followedAuthors.map((author) => (
                    <div
                      key={author}
                      className="flex items-center justify-between p-4 bg-black/20 rounded-lg"
                    >
                      <p className="font-semibold text-pink-200">{author}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        Unfollow
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <UserPlus className="w-16 h-16 text-pink-400/50 mx-auto mb-4" />
                    <p className="text-xl text-pink-300/70">
                      You are not following any authors yet.
                    </p>
                    <p className="text-pink-300/50 mt-2">
                      Follow authors to see them here.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Saved Tab */}
              <TabsContent value="saved" className="text-center py-16">
                <Bookmark className="w-16 h-16 text-pink-400/50 mx-auto mb-4" />
                <p className="text-xl text-pink-300/70">
                  Saved stories will appear here.
                </p>
                <p className="text-pink-300/50 mt-2">
                  Bookmark stories you love to read later.
                </p>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="mt-6 space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-black/20 rounded-lg"
                  >
                    <p className="text-pink-200">{activity.content}</p>
                    <span className="text-xs text-pink-300/60">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
