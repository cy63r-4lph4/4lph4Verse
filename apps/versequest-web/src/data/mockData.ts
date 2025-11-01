import { Quest, QuestResult, QuestRoom, Proposal, UserBadge, UserProfile, AuraRank, RoomPost, Reflection, LeaderboardEntry, Room } from '@/types/contracts';

export const auraRanks: AuraRank[] = [
  {
    name: 'Dim',
    minAura: 0,
    color: 'hsl(240, 20%, 25%)',
    description: 'A faint spark in the darkness',
    benefits: ['Basic quest access', 'Community participation']
  },
  {
    name: 'Kindled',
    minAura: 100,
    color: 'hsl(245, 70%, 45%)',
    description: 'The flame begins to flicker',
    benefits: ['Enhanced reflection rewards', 'Quest room moderation']
  },
  {
    name: 'Radiant',
    minAura: 500,
    color: 'hsl(267, 85%, 63%)',
    description: 'Your light shines bright',
    benefits: ['Premium quest access', 'Council voting power', '10% bonus CØRE']
  },
  {
    name: 'Luminous',
    minAura: 1500,
    color: 'hsl(260, 90%, 70%)',
    description: 'A beacon of wisdom',
    benefits: ['Quest creation privileges', 'Leaderboard prominence', '20% bonus CØRE']
  },
  {
    name: 'Ascendant',
    minAura: 5000,
    color: 'hsl(270, 95%, 80%)',
    description: 'Rising beyond mortal limits',
    benefits: ['Elite quest access', 'Governance influence', '30% bonus CØRE']
  },
  {
    name: 'Draconic',
    minAura: 15000,
    color: 'hsl(280, 100%, 85%)',
    description: 'Transcendent being of pure light',
    benefits: ['Legendary status', 'Maximum rewards', 'Verse shaping power']
  }
];

export const getRankByAura = (aura: number): AuraRank => {
  return [...auraRanks].reverse().find(rank => aura >= rank.minAura) || auraRanks[0];
};

// Birthday Launch Quest
export const mockQuests: Quest[] = [
  {
    id: 'birthday-launch',
    title: 'Genesis Reflection — The Architect of Tomorrow',
    description: 'Welcome to VerseQuest, where minds awaken and wisdom glows. Join us for the inaugural reflection that will shape the 4lph4Verse.',
    videoUrl: 'https://www.youtube.com/embed/H6u0VBqNBQ8',
    reflectionQuestion: 'What does it mean to build a world worth inheriting? Share your vision for a future where technology serves consciousness and wisdom guides progress.',
    correctAnswer: 'A world worth inheriting balances technological advancement with human values, prioritizing sustainable growth, collective wisdom, and the elevation of consciousness.',
    reward: '99',
    auraReward: 150,
    endTime: new Date('2025-11-12').getTime(),
    isActive: true,
    creator: '0x4lph4...Verse',
    participantCount: 247,
    category: 'wisdom'
  },
  {
    id: '2',
    title: 'The Philosophy of Decentralized Mind',
    description: 'Explore how decentralized networks mirror the patterns of consciousness and collective intelligence.',
    videoUrl: 'https://www.youtube.com/embed/kKggE5OvyhE',
    reflectionQuestion: 'How might decentralized systems reflect the nature of consciousness itself? Consider the parallels between neural networks and blockchain networks.',
    correctAnswer: 'Decentralized systems mirror consciousness through distributed processing, emergent properties, and collective decision-making that transcends individual nodes.',
    reward: '75',
    auraReward: 100,
    endTime: Date.now() + (7 * 24 * 60 * 60 * 1000),
    isActive: true,
    creator: '0xWisdom...Seeker',
    participantCount: 189,
    category: 'discovery'
  },
  {
    id: '3',
    title: 'Dragon Energy: The Flow of Digital Vitality',
    description: 'Understand the concept of dragon energy in digital spaces and how it flows through the 4lph4Verse.',
    videoUrl: 'https://www.youtube.com/embed/16W7c0mb-rE',
    reflectionQuestion: 'What is dragon energy in the context of digital consciousness? How does it manifest in our interactions with technology?',
    correctAnswer: 'Dragon energy represents the vital, creative force that animates digital spaces, transforming cold code into living, breathing experiences.',
    reward: '120',
    auraReward: 200,
    endTime: Date.now() + (14 * 24 * 60 * 60 * 1000),
    isActive: true,
    creator: '0xDragon...Master',
    participantCount: 156,
    category: 'mastery'
  },
  {
    id: '4',
    title: 'The Completed Wisdom Path',
    description: 'A journey through the fundamentals of consciousness and technology that has reached its conclusion.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    reflectionQuestion: 'How do we integrate ancient wisdom with modern technology?',
    correctAnswer: 'Integration occurs through mindful application of technological tools guided by timeless principles of wisdom and compassion.',
    reward: '50',
    auraReward: 75,
    endTime: Date.now() - (2 * 24 * 60 * 60 * 1000),
    isActive: false,
    creator: '0xSage...Guide',
    participantCount: 324,
    category: 'wisdom'
  }
];

export const mockQuestRooms: QuestRoom[] = [
  {
    id: '1',
    questId: 'birthday-launch',
    questTitle: 'Genesis Reflection — The Architect of Tomorrow',
    participantCount: 89,
    lastActivity: Date.now() - (10 * 60 * 1000),
    reflectionCount: 67,
    totalTips: '1847.5'
  },
  {
    id: '2',
    questId: '2',
    questTitle: 'The Philosophy of Decentralized Mind',
    participantCount: 134,
    lastActivity: Date.now() - (25 * 60 * 1000),
    reflectionCount: 98,
    totalTips: '2934.8'
  }
];

export const mockReflections: Reflection[] = [
  {
    id: '1',
    questId: 'birthday-launch',
    author: '0x1234...5678',
    content: 'To build a world worth inheriting, we must remember that technology is not neutral—it amplifies our values. The future I envision is one where code serves consciousness, where algorithms enhance rather than replace human judgment, and where the digital realm becomes a sacred space for growth and connection.',
    timestamp: Date.now() - (2 * 60 * 60 * 1000),
    coreReceived: '127.3',
    isWinner: true,
    auraEarned: 85,
    quality: 'luminous'
  },
  {
    id: '2',
    questId: 'birthday-launch',
    author: '0xabcd...efgh',
    content: 'The world we leave behind must be more conscious than the one we inherited. This means building systems that promote wisdom over mere intelligence, connection over isolation, and sustainability over short-term gains. The 4lph4Verse represents this vision made manifest.',
    timestamp: Date.now() - (4 * 60 * 60 * 1000),
    coreReceived: '89.7',
    isWinner: false,
    auraEarned: 65,
    quality: 'radiant'
  }
];

export const mockRooms: Room[] = [
  {
    id: '1',
    title: 'Genesis Reflection Hall',
    description: 'Deep discussions arising from the birthday launch quest about building worlds worth inheriting.',
    isActive: true,
    createdAt: Date.now() - (3 * 24 * 60 * 60 * 1000),
    lastActivity: Date.now() - (10 * 60 * 1000),
    postCount: 156,
    participantCount: 89
  },
  {
    id: '2', 
    title: 'Decentralized Mind Forum',
    description: 'Exploring the parallels between consciousness and decentralized networks.',
    isActive: true,
    createdAt: Date.now() - (5 * 24 * 60 * 60 * 1000),
    lastActivity: Date.now() - (30 * 60 * 1000),
    postCount: 203,
    participantCount: 134
  },
  {
    id: '3',
    title: 'Dragon Energy Sanctuary',
    description: 'Understanding and cultivating digital vitality in the 4lph4Verse.',
    isActive: true,
    createdAt: Date.now() - (7 * 24 * 60 * 60 * 1000),
    lastActivity: Date.now() - (45 * 60 * 1000),
    postCount: 78,
    participantCount: 67
  }
];

export const mockRoomPosts: RoomPost[] = [
  {
    id: '1',
    roomId: '1',
    questId: 'birthday-launch',
    author: '0x1234...5678',
    content: 'The birthday launch feels like more than just a beginning—it\'s an awakening. The question about building worlds worth inheriting really made me reflect on my own role as a digital architect. Every line of code, every interaction, every choice we make shapes the future.',
    timestamp: Date.now() - (1 * 60 * 60 * 1000),
    coreReceived: '45.2',
    replies: [
      {
        id: '2',
        roomId: '1',
        questId: 'birthday-launch',
        author: '0xabcd...efgh',
        content: 'Beautifully put. This reminds me of the ancient concept of "seventh generation thinking"—considering the impact of our actions seven generations into the future. In the digital age, this becomes even more critical.',
        timestamp: Date.now() - (45 * 60 * 1000),
        coreReceived: '23.8',
        replies: [],
        isHighlighted: false
      }
    ],
    isHighlighted: true
  }
];

export const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Launch Weekly Wisdom Circles',
    description: 'Introduce shorter, weekly reflection quests focused on practical wisdom and daily contemplative practices within the 4lph4Verse.',
    proposer: '0x1234...5678',
    yesVotes: 3247,
    noVotes: 456,
    endTime: Date.now() + (6 * 24 * 60 * 60 * 1000),
    isActive: true,
    executed: false,
    category: 'quest-topic',
    auraWeight: true
  },
  {
    id: '2',
    title: 'Enhance Dragon Energy Rewards',
    description: 'Increase AURA multipliers for reflections that demonstrate exceptional depth and contribute to the collective wisdom of the Verse.',
    proposer: '0xdragon...energy',
    yesVotes: 2891,
    noVotes: 623,
    endTime: Date.now() + (3 * 24 * 60 * 60 * 1000),
    isActive: true,
    executed: false,
    category: 'reward-structure',
    auraWeight: true
  }
];

export const mockBadges: UserBadge[] = [
  {
    id: '1',
    name: 'Genesis Architect',
    description: 'Participated in the birthday launch quest and helped architect tomorrow',
    imageUrl: '/badges/genesis.png',
    rarity: 'legendary',
    earnedAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
    auraBonus: 50
  },
  {
    id: '2',
    name: 'Wisdom Weaver',
    description: 'Achieved a 14-day reflection streak in the 4lph4Verse',
    imageUrl: '/badges/wisdom.png',
    rarity: 'epic',
    earnedAt: Date.now() - (7 * 24 * 60 * 60 * 1000),
    auraBonus: 25
  },
  {
    id: '3',
    name: 'Dragon Whisperer',
    description: 'Received 1000+ CØRE tips across all reflections',
    imageUrl: '/badges/dragon.png',
    rarity: 'mystical',
    earnedAt: Date.now() - (14 * 24 * 60 * 60 * 1000),
    auraBonus: 100
  }
];

export const mockUserProfile: UserProfile = {
  address: '0x1234...5678',
  aura: 1247,
  rank: getRankByAura(1247),
  streak: 12,
  reflectionCount: 28,
  questsCompleted: 15,
  questsWon: 6,
  coreReceived: '2847.5',
  coreSent: '456.2',
  tipsReceived: '2847.5',
  totalVotes: 23,
  badges: mockBadges,
  joinedAt: Date.now() - (90 * 24 * 60 * 60 * 1000),
  lastActive: Date.now() - (2 * 60 * 60 * 1000)
};

export const mockQuestResults: QuestResult[] = [
  {
    questId: '4',
    winners: ['0x1234...5678', '0xabcd...efgh', '0x9876...5432'],
    correctAnswers: [
      'Integration occurs through mindful application of technological tools guided by timeless principles of wisdom and compassion.',
      'Ancient wisdom provides the ethical framework while modern technology offers the tools for implementation.',
      'The synthesis happens when we use technology to amplify human virtues rather than replace human judgment.'
    ],
    totalParticipants: 324,
    topReflections: mockReflections
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    address: '0x4lph4...Verse',
    aura: 15847,
    rank: getRankByAura(15847),
    weeklyGain: 423,
    reflections: 127,
    displayName: 'The Architect'
  },
  {
    address: '0x1234...5678',
    aura: 8945,
    rank: getRankByAura(8945),
    weeklyGain: 245,
    reflections: 67,
    displayName: 'WisdomSeeker'
  },
  {
    address: '0xabcd...efgh',
    aura: 6721,
    rank: getRankByAura(6721),
    weeklyGain: 189,
    reflections: 52,
    displayName: 'DragonWhisperer'
  },
  {
    address: '0x9876...5432',
    aura: 4582,
    rank: getRankByAura(4582),
    weeklyGain: 156,
    reflections: 43
  },
  {
    address: '0xdef0...1234',
    aura: 3219,
    rank: getRankByAura(3219),
    weeklyGain: 98,
    reflections: 31
  }
];
