import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  MessageSquare,
  Vote,
  Clock,
  Users,
  Star,
  Zap,
  Brain,
  Sparkles,
  Crown,
  Flame,
  Eye,
} from "lucide-react";
import {
  mockQuests,
  mockQuestRooms,
  mockProposals,
  mockUserProfile,
  mockLeaderboard,
  getRankByAura,
} from "@/data/mockData";
import { AuraRing } from "@/components/AuraRing";
import { useWallet } from "@/hooks/useWallet";
import { useContract } from "@/hooks/useContract";
import { useNavigate } from "react-router-dom";

export const HomePage: React.FC = () => {
  const { account } = useWallet();
  const { userAura } = useContract();
  const navigate = useNavigate();

  const activeQuests = mockQuests.filter((q) => q.isActive);
  const completedQuests = mockQuests.filter((q) => !q.isActive);
  const activeProposals = mockProposals.filter((p) => p.isActive);

  const formatTimeLeft = (endTime: number) => {
    const diff = endTime - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return "Ending soon";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "wisdom":
        return <Brain className="h-4 w-4" />;
      case "discovery":
        return <Eye className="h-4 w-4" />;
      case "mastery":
        return <Crown className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "wisdom":
        return "text-quest-wisdom border-quest-wisdom/30 bg-quest-wisdom/10";
      case "discovery":
        return "text-quest-discovery border-quest-discovery/30 bg-quest-discovery/10";
      case "mastery":
        return "text-quest-mastery border-quest-mastery/30 bg-quest-mastery/10";
      default:
        return "text-primary border-primary/30 bg-primary/10";
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section - Birthday Launch */}
      <div className="relative overflow-hidden rounded-3xl p-12 glass-card">
        <div className="dragon-particles" />
        <div className="absolute inset-0 bg-gradient-aura opacity-40" />
        <div className="relative z-10 text-center">
          <div className="floating-element mb-8">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-primary mr-4 animate-spin" />
              <h1 className="text-6xl font-mystic text-gradient-primary">
                VerseQuest
              </h1>
              <Flame className="h-8 w-8 text-radiant ml-4 aura-glow" />
            </div>
            <p className="text-2xl font-tech font-light text-gradient-radiant mb-2">
              The Mind of the 4lph4Verse
            </p>
            <p className="text-xl font-tech opacity-90 mb-4">
              Awaken the Mind. Reflect with the Verse.
            </p>
            <Badge className="text-lg px-6 py-2 bg-gradient-radiant text-radiant-foreground border-0 shadow-radiant">
              🎂 Birthday Launch — Nov 9, 2025
            </Badge>
          </div>

          {account ? (
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mt-12">
              <div className="floating-element">
                <AuraRing
                  aura={userAura || mockUserProfile.aura}
                  rank={mockUserProfile.rank}
                  size="xl"
                  showProgress={true}
                />
              </div>
              <div className="text-center lg:text-left space-y-4">
                <h3 className="text-3xl font-mystic text-gradient-primary">
                  Your Aura Shines{" "}
                  <span className="text-gradient-radiant">
                    {getRankByAura(userAura || mockUserProfile.aura).name}
                  </span>
                </h3>
                <div className="grid grid-cols-2 gap-6 text-lg font-tech">
                  <div className="glass-card p-4">
                    <span className="text-muted-foreground">
                      Dragon Streak:
                    </span>
                    <div className="font-bold text-2xl text-gradient-core">
                      {mockUserProfile.streak} days
                    </div>
                  </div>
                  <div className="glass-card p-4">
                    <span className="text-muted-foreground">Reflections:</span>
                    <div className="font-bold text-2xl text-gradient-primary">
                      {mockUserProfile.reflectionCount}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-12">
              <p className="text-xl mb-8 opacity-90 font-tech">
                Connect your wallet to begin your journey of reflection and
                growth in the 4lph4Verse
              </p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <Button
              onClick={() => navigate("/quests")}
              className="btn-aura gap-3 text-lg px-8 py-4 font-tech font-semibold"
            >
              <Trophy className="h-5 w-5" />
              Begin Genesis Quest
            </Button>
            <Button
              onClick={() => navigate("/rooms")}
              className="btn-core gap-3 text-lg px-8 py-4 font-tech font-semibold"
              variant="outline"
            >
              <MessageSquare className="h-5 w-5" />
              Enter Reflection Halls
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Active Quests",
            value: activeQuests.length,
            icon: Trophy,
            color: "core",
            gradient: "gradient-core",
          },
          {
            label: "Reflection Halls",
            value: mockQuestRooms.length,
            icon: MessageSquare,
            color: "primary",
            gradient: "gradient-primary",
          },
          {
            label: "Council Proposals",
            value: activeProposals.length,
            icon: Vote,
            color: "radiant",
            gradient: "gradient-radiant",
          },
          {
            label: "Awakened Minds",
            value: "2.8k",
            icon: Users,
            color: "primary",
            gradient: "gradient-aura",
          },
        ].map((stat, index) => (
          <Card key={index} className="glass-card aura-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-tech text-muted-foreground">
                    {stat.label}
                  </p>
                  <p
                    className={`text-3xl font-bold font-tech text-gradient-${
                      stat.color === "core"
                        ? "core"
                        : stat.color === "radiant"
                          ? "radiant"
                          : "primary"
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-2xl bg-${stat.gradient} shadow-${stat.color}`}
                >
                  <stat.icon
                    className={`h-8 w-8 text-${stat.color}-foreground`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Quests */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-mystic text-gradient-primary">
              Active Quests
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/quests")}
              className="border-primary/30 hover:bg-primary/10 font-tech"
            >
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>

          <div className="space-y-6">
            {activeQuests.map((quest) => (
              <Card key={quest.id} className="quest-card">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getCategoryIcon(quest.category)}
                        <Badge
                          variant="outline"
                          className={`text-sm capitalize font-tech ${getCategoryColor(
                            quest.category
                          )}`}
                        >
                          {quest.category}
                        </Badge>
                        {quest.id === "birthday-launch" && (
                          <Badge className="bg-gradient-radiant text-radiant-foreground border-0 animate-pulse">
                            🎂 Launch Special
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl font-tech font-bold">
                        {quest.title}
                      </CardTitle>
                      <CardDescription className="mt-3 text-base font-tech leading-relaxed">
                        {quest.description}
                      </CardDescription>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className="bg-gradient-core text-core-foreground font-tech font-semibold">
                        {quest.reward} CØRE
                      </Badge>
                      <div className="text-sm font-tech text-gradient-primary">
                        +{quest.auraReward} AURA
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground font-tech">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {quest.participantCount} minds
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {formatTimeLeft(quest.endTime)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="btn-aura gap-2 font-tech font-semibold"
                      onClick={() => navigate("/quests")}
                    >
                      <Zap className="h-4 w-4" />
                      Reflect Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Completed Quests Preview */}
            <div className="pt-6">
              <h3 className="text-xl font-tech font-semibold mb-4 text-muted-foreground">
                Recently Completed
              </h3>
              {completedQuests.slice(0, 2).map((quest) => (
                <Card
                  key={quest.id}
                  className="glass-card mb-4 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium font-tech">{quest.title}</h4>
                        <p className="text-sm text-muted-foreground font-tech">
                          {quest.participantCount} reflections submitted
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-core/30 text-core font-tech"
                      >
                        View Results
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-8">
          {/* Leaderboard */}
          <Card className="glass-card aura-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gradient-primary font-tech text-xl">
                <Star className="h-6 w-6" />
                Brightest Minds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockLeaderboard.slice(0, 5).map((entry, index) => (
                <div
                  key={entry.address}
                  className="flex items-center gap-4 p-3 rounded-xl glass-card"
                >
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-tech
                      ${
                        index === 0
                          ? "bg-gradient-radiant text-radiant-foreground"
                          : index === 1
                            ? "bg-gradient-core text-core-foreground"
                            : index === 2
                              ? "bg-gradient-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                      }
                    `}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium font-tech">
                      {entry.displayName ||
                        `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                    </div>
                    <div className="text-xs text-muted-foreground font-tech">
                      {entry.aura.toLocaleString()} AURA • {entry.rank.name}
                    </div>
                  </div>
                  <div className="text-xs font-tech text-gradient-core">
                    +{entry.weeklyGain}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quest Rooms */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-tech text-xl">
                <MessageSquare className="h-6 w-6 text-primary" />
                Reflection Halls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockQuestRooms.map((room) => (
                <div
                  key={room.id}
                  className="p-4 rounded-xl glass-card hover:shadow-glass transition-all cursor-pointer"
                >
                  <h4 className="font-medium text-sm font-tech mb-2">
                    {room.questTitle}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-tech">
                    <span>{room.reflectionCount} reflections</span>
                    <span className="text-gradient-core">
                      {room.totalTips} CØRE tips
                    </span>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 font-tech"
                onClick={() => navigate("/rooms")}
              >
                Enter Halls
              </Button>
            </CardContent>
          </Card>

          {/* Council Proposals */}
          <Card className="glass-card shadow-radiant">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gradient-radiant font-tech text-xl">
                <Vote className="h-6 w-6" />
                Council Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockProposals.slice(0, 2).map((proposal) => (
                <div
                  key={proposal.id}
                  className="p-4 rounded-xl bg-radiant/5 border border-radiant/20"
                >
                  <h4 className="font-medium text-sm font-tech mb-3">
                    {proposal.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs font-tech">
                    <span className="text-core">Yes: {proposal.yesVotes}</span>
                    <span className="text-destructive">
                      No: {proposal.noVotes}
                    </span>
                  </div>
                  <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-radiant transition-all duration-500"
                      style={{
                        width: `${
                          (parseFloat(proposal.yesVotes.replace(",", "")) /
                            (parseFloat(proposal.yesVotes.replace(",", "")) +
                              parseFloat(proposal.noVotes.replace(",", "")))) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 border-radiant/30 hover:bg-radiant/10 font-tech"
                onClick={() => navigate("/council")}
              >
                Join Council
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
