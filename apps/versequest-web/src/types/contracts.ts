export interface Quest {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  reflectionQuestion: string;
  correctAnswer: string;
  reward: string;
  auraReward: number;
  endTime: number;
  isActive: boolean;
  creator: string;
  participantCount: number;
  category: 'growth' | 'wisdom' | 'discovery' | 'mastery';
}

export interface QuestResult {
  questId: string;
  winners: string[];
  correctAnswers: string[];
  totalParticipants: number;
  topReflections: Reflection[];
}

export interface Reflection {
  id: string;
  questId: string;
  author: string;
  content: string;
  timestamp: number;
  coreReceived: string;
  isWinner: boolean;
  auraEarned: number;
  quality: 'dim' | 'kindled' | 'radiant' | 'luminous' | 'ascendant';
}

export interface QuestRoom {
  id: string;
  questId: string;
  questTitle: string;
  participantCount: number;
  lastActivity: number;
  reflectionCount: number;
  totalTips: string;
}

export interface Room {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: number;
  lastActivity: number;
  postCount: number;
  participantCount: number;
}

export interface RoomPost {
  id: string;
  roomId: string;
  questId: string;
  author: string;
  content: string;
  timestamp: number;
  coreReceived: string;
  replies: RoomPost[];
  isHighlighted: boolean;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  yesVotes: number;
  noVotes: number;
  endTime: number;
  isActive: boolean;
  executed: boolean;
  category: 'quest-topic' | 'reward-structure' | 'governance';
  auraWeight: boolean; // If AURA affects vote weight
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mystical';
  earnedAt: number;
  auraBonus: number;
}

export interface AuraRank {
  name: 'Dim' | 'Kindled' | 'Radiant' | 'Luminous' | 'Ascendant' | 'Draconic';
  minAura: number;
  color: string;
  description: string;
  benefits: string[];
}

export interface UserProfile {
  address: string;
  aura: number;
  rank: AuraRank;
  streak: number;
  reflectionCount: number;
  questsCompleted: number;
  questsWon: number;
  coreReceived: string;
  coreSent: string;
   tipsReceived: string;
  totalVotes: number;
 badges: UserBadge[];
  joinedAt: number;
  lastActive: number;
}

export interface LeaderboardEntry {
  address: string;
  aura: number;
  rank: AuraRank;
  weeklyGain: number;
  reflections: number;
  displayName?: string;
}
