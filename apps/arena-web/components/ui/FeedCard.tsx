import ArenaAvatar from "./ArenaAvatar";
import FeedReactions from "./FeedReactions";
import FeedComments from "./FeedComments";
import NeonButton from "./NeonButton";
import Badge from "./ArenaBadge";
import { Swords, Zap, Brain, Trophy, Megaphone, Clock, ChevronRight, Lightbulb, HelpCircle } from "lucide-react";
import { cn } from "@verse/ui";

interface BaseFeedItem {
  id: string;
  time: string;
  reactions?: Record<string, number>;
  comments?: Array<{ id: string; user: string; avatar: string; text: string; time: string }>;
}

interface BattleResultItem extends BaseFeedItem {
  type: "battle";
  winner: { name: string; avatar: string; score: number };
  loser: { name: string; avatar: string; score: number };
  quizName: string;
}

interface ChallengeItem extends BaseFeedItem {
  type: "challenge";
  challenger: { name: string; avatar: string };
  expiresIn: string;
  isForYou?: boolean;
}

interface NewQuizItem extends BaseFeedItem {
  type: "quiz";
  quizName: string;
  difficulty: "easy" | "medium" | "hard";
  instructor: { name: string; avatar: string };
}

interface RankChangeItem extends BaseFeedItem {
  type: "rank";
  user: { name: string; avatar: string };
  newRank: string;
  direction: "up" | "down";
}

interface AnnouncementItem extends BaseFeedItem {
  type: "announcement";
  instructor: { name: string; avatar: string };
  title: string;
  content: string;
  pinned?: boolean;
}

interface UserPostItem extends BaseFeedItem {
  type: "post";
  author: { name: string; avatar: string };
  postType: "thought" | "question" | "announcement";
  content: string;
}

export type FeedItemType = BattleResultItem | ChallengeItem | NewQuizItem | RankChangeItem | AnnouncementItem | UserPostItem;

interface FeedCardProps {
  item: FeedItemType;
  onAcceptChallenge?: () => void;
  onDeclineChallenge?: () => void;
  onEnterBattle?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const FeedCard = ({ item, onAcceptChallenge, onDeclineChallenge, onEnterBattle, className, style }: FeedCardProps) => {
  const renderIcon = () => {
    switch (item.type) {
      case "battle": return <Swords className="text-arena-flame" size={18} />;
      case "challenge": return <Zap className="text-secondary" size={18} />;
      case "quiz": return <Brain className="text-primary" size={18} />;
      case "rank": return <Trophy className="text-arena-gold" size={18} />;
      case "announcement": return <Megaphone className="text-arena-gold" size={18} />;
      case "post": 
        if (item.postType === "question") return <HelpCircle className="text-secondary" size={18} />;
        if (item.postType === "announcement") return <Megaphone className="text-primary" size={18} />;
        return <Lightbulb className="text-arena-gold" size={18} />;
    }
  };

  const renderContent = () => {
    switch (item.type) {
      case "battle":
        return (
          <div className="space-y-3">
            {/* Battle Header */}
            <div className="flex items-center gap-2">
              {renderIcon()}
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
            
            {/* VS Display */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-linear-to-r from-arena-success/10 via-transparent to-arena-danger/10">
              <div className="flex items-center gap-2">
                <ArenaAvatar src={item.winner.avatar} alt={item.winner.name} size="md" glowColor="success" />
                <div>
                  <p className="font-semibold text-foreground text-sm">{item.winner.name}</p>
                  <p className="text-xs text-arena-success font-mono">{item.winner.score}</p>
                </div>
              </div>
              
              <div className="text-xs font-display text-muted-foreground">defeated</div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="font-semibold text-foreground text-sm">{item.loser.name}</p>
                  <p className="text-xs text-arena-danger font-mono">{item.loser.score}</p>
                </div>
                <ArenaAvatar src={item.loser.avatar} alt={item.loser.name} size="md" glowColor="danger" />
              </div>
            </div>
            
            {/* Quiz Info */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Quiz: {item.quizName}</span>
              <button className="text-xs text-primary flex items-center gap-1 hover:underline">
                View Battle <ChevronRight size={12} />
              </button>
            </div>
          </div>
        );

      case "challenge":
        return (
          <div className="space-y-3">
            {/* Challenge Header */}
            <div className="flex items-center gap-3">
              <ArenaAvatar src={item.challenger.avatar} alt={item.challenger.name} size="md" glowColor="warning" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {renderIcon()}
                  <span className="text-sm">
                    {item.isForYou ? (
                      <><span className="font-semibold text-secondary">You</span> were challenged by </>
                    ) : (
                      <span className="font-semibold text-foreground">{item.challenger.name}</span>
                    )}
                    {!item.isForYou && " issued a challenge"}
                  </span>
                </div>
                {item.isForYou && (
                  <p className="font-semibold text-foreground text-sm">{item.challenger.name}</p>
                )}
              </div>
            </div>
            
            {/* Expiry */}
            <div className="flex items-center gap-1 text-xs text-arena-warning">
              <Clock size={12} />
              <span>Expires in {item.expiresIn}</span>
            </div>
            
            {/* Actions for personal challenges */}
            {item.isForYou && (
              <div className="flex items-center gap-2">
                <NeonButton size="sm" onClick={onAcceptChallenge} className="flex-1">
                  Accept
                </NeonButton>
                <button 
                  onClick={onDeclineChallenge}
                  className="flex-1 px-4 py-2 rounded-lg border border-arena-border text-muted-foreground hover:bg-muted/50 text-sm transition-colors"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        );

      case "quiz":
        return (
          <div className="space-y-3">
            {/* Quiz Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                {renderIcon()}
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">New quiz unlocked:</span>
                </p>
                <p className="font-semibold text-foreground">{item.quizName}</p>
              </div>
              <Badge variant={item.difficulty}>{item.difficulty}</Badge>
            </div>
            
            {/* Instructor & Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ArenaAvatar src={item.instructor.avatar} alt={item.instructor.name} size="xs" />
                <span>by {item.instructor.name}</span>
                <span>•</span>
                <span>{item.time}</span>
              </div>
              <NeonButton size="sm" onClick={onEnterBattle}>
                Enter Battle
              </NeonButton>
            </div>
          </div>
        );

      case "rank":
        return (
          <div className="space-y-3">
            {/* Rank Header */}
            <div className="flex items-center gap-3">
              <ArenaAvatar src={item.user.avatar} alt={item.user.name} size="md" glowColor={item.direction === "up" ? "success" : "danger"} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {renderIcon()}
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
                <p className="text-sm">
                  <span className="font-semibold text-foreground">{item.user.name}</span>
                  {" "}ranked {item.direction} to
                </p>
              </div>
            </div>
            
            {/* Rank Badge */}
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display font-bold text-sm",
              item.direction === "up" 
                ? "bg-linear-to-r from-arena-gold/20 to-arena-gold/10 text-arena-gold" 
                : "bg-arena-danger/20 text-arena-danger"
            )}>
              <Trophy size={16} />
              {item.newRank}
            </div>
          </div>
        );

      case "announcement":
        return (
          <div className="space-y-3">
            {/* Announcement Header */}
            <div className="flex items-center gap-3">
              <ArenaAvatar src={item.instructor.avatar} alt={item.instructor.name} size="md" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {renderIcon()}
                  {item.pinned && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-arena-gold/20 text-arena-gold font-medium">
                      PINNED
                    </span>
                  )}
                </div>
                <p className="font-semibold text-foreground text-sm">{item.instructor.name}</p>
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
            
            {/* Content */}
            <div className="pl-12">
              <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.content}</p>
            </div>
          </div>
        );

      case "post":
        const postTypeLabel = item.postType === "question" ? "asked a question" : 
                              item.postType === "announcement" ? "announced" : "shared a thought";
        return (
          <div className="space-y-3">
            {/* Post Header */}
            <div className="flex items-center gap-3">
              <ArenaAvatar src={item.author.avatar} alt={item.author.name} size="md" glowColor="primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {renderIcon()}
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
                <p className="text-sm">
                  <span className="font-semibold text-foreground">{item.author.name}</span>
                  {" "}<span className="text-muted-foreground">{postTypeLabel}</span>
                </p>
              </div>
            </div>
            
            {/* Content */}
            <div className="pl-12">
              <p className="text-sm text-foreground whitespace-pre-wrap">{item.content}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-xl p-4 transition-all duration-300",
        "bg-arena-card/80 backdrop-blur-sm border border-arena-border/50",
        "hover:border-arena-border hover:bg-arena-card",
        item.type === "announcement" && "border-l-2 border-l-arena-gold",
        item.type === "challenge" && item.isForYou && "ring-1 ring-secondary/30 animate-pulse-glow",
        className
      )}
      style={style}
    >
      {renderContent()}
      
      {/* Reactions & Comments */}
      {item.type !== "challenge" || !item.isForYou ? (
        <div className="mt-4 space-y-2">
          <FeedReactions initialReactions={item.reactions} />
          {item.comments && item.comments.length > 0 && (
            <FeedComments comments={item.comments} />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default FeedCard;
