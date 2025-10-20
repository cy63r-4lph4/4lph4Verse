import { useToast } from '@verse/vaultoflove-web/components/toast';
import { useState, useEffect } from 'react';

type Story = {
  id: number;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  category: string;
  likes: number;
  views: number;
  tips: number;
  isNftEligible: boolean;
  isMinted: boolean;
  onAuction: boolean;
  createdAt: string;
  tags: string[];
  isInteractive: boolean;
  interactiveContent?: {
    [key: string]: {
      text: string;
      choices: { text: string; nextNodeId: string }[];
    };
  };
};

type Author = {
  name: string;
  followers: number;
};

const useStoryVault = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [followedAuthors, setFollowedAuthors] = useState<string[]>([]);
  const [userTokens, setUserTokens] = useState<number>(1000);
  const { toast } = useToast();

  useEffect(() => {
    const savedStories = localStorage.getItem('vaultofLove_stories');
    if (savedStories) {
      setStories(JSON.parse(savedStories));
    } else {
      const sampleStories = [
        {
          id: 1,
          title: "The Digital Heart",
          author: "Luna_Writer",
          excerpt: "In a world where emotions are digitized, she found love in the most unexpected algorithm...",
          content: "The rain fell in binary patterns against her window as Maya stared at the holographic display floating before her. In 2087, love had become a commodity—measured, analyzed, and optimized by the Global Emotion Network. But tonight, something felt different... She felt a pull towards a strange, unverified connection. A choice appeared on her screen: investigate the anomaly or ignore it and continue her scheduled life.",
          category: "sci-fi",
          likes: 1247,
          views: 3421,
          tips: 89,
          isNftEligible: true,
          isMinted: true,
          onAuction: true,
          createdAt: new Date('2024-01-15').toISOString(),
          tags: ["heartbreak", "technology", "hope"],
          isInteractive: true,
          interactiveContent: {
            "start": { "text": "The rain fell in binary patterns against her window...", "choices": [{ "text": "Investigate", "nextNodeId": "investigate" }, { "text": "Ignore", "nextNodeId": "ignore" }] },
            "investigate": { "text": "She tapped 'Investigate'...", "choices": [{ "text": "Help him.", "nextNodeId": "help" }, { "text": "Leave him.", "nextNodeId": "leave" }] },
            "ignore": { "text": "Maya chose to ignore...", "choices": [] },
            "help": { "text": "Together, they shattered the network's control...", "choices": [] },
            "leave": { "text": "Fear gripped her...", "choices": [] }
          }
        },
        {
          id: 2,
          title: "Letters to Tomorrow",
          author: "HeartSeeker",
          excerpt: "Every heartbreak taught her something new about love, until she learned to love herself...",
          content: "Dear Tomorrow, Today I learned that love isn't about finding someone to complete you. It's about becoming whole enough to share your completeness with another soul...",
          category: "romance",
          likes: 1892,
          views: 2156,
          tips: 167,
          isNftEligible: true,
          isMinted: true,
          onAuction: true,
          createdAt: new Date('2024-01-20').toISOString(),
          tags: ["self-love", "growth", "healing"],
          isInteractive: false,
        },
        {
          id: 3,
          title: "The Last Dance",
          author: "You",
          excerpt: "After 60 years of marriage, he still danced with her ghost every evening...",
          content: "The music box played their wedding song as Harold moved slowly across the empty living room. Margaret had been gone for three months, but every evening at 7 PM, he still felt her hand in his...",
          category: "drama",
          likes: 1456,
          views: 4892,
          tips: 156,
          isNftEligible: true,
          isMinted: false,
          onAuction: false,
          createdAt: new Date('2024-01-10').toISOString(),
          tags: ["eternal love", "loss", "memory"],
          isInteractive: false,
        }
      ];
      setStories(sampleStories);
      localStorage.setItem('vaultofLove_stories', JSON.stringify(sampleStories));
    }

    const savedAuthors = localStorage.getItem('vaultofLove_authors');
    if (savedAuthors) {
      setAuthors(JSON.parse(savedAuthors));
    } else {
      const sampleAuthors = [
        { name: 'Luna_Writer', followers: 256 },
        { name: 'HeartSeeker', followers: 189 },
        { name: 'You', followers: 0 },
      ];
      setAuthors(sampleAuthors);
      localStorage.setItem('vaultofLove_authors', JSON.stringify(sampleAuthors));
    }

    const savedFollowed = localStorage.getItem('vaultofLove_followedAuthors');
    if (savedFollowed) {
      setFollowedAuthors(JSON.parse(savedFollowed));
    }

    const savedTokens = localStorage.getItem('vaultofLove_tokens');
    if (savedTokens) {
      setUserTokens(parseInt(savedTokens));
    }
  }, []);

  const saveStories = (newStories) => {
    setStories(newStories);
    localStorage.setItem('vaultofLove_stories', JSON.stringify(newStories));
  };

  const saveAuthors = (newAuthors) => {
    setAuthors(newAuthors);
    localStorage.setItem('vaultofLove_authors', JSON.stringify(newAuthors));
  };

  const saveFollowedAuthors = (newFollowed) => {
    setFollowedAuthors(newFollowed);
    localStorage.setItem('vaultofLove_followedAuthors', JSON.stringify(newFollowed));
  };

  const saveTokens = (tokens) => {
    setUserTokens(tokens);
    localStorage.setItem('vaultofLove_tokens', tokens.toString());
  };

  const handleFollowAuthor = (authorName) => {
    const isFollowing = followedAuthors.includes(authorName);
    let updatedFollowed;

    if (isFollowing) {
      updatedFollowed = followedAuthors.filter(name => name !== authorName);
      toast({ title: "Unfollowed", description: `You are no longer following ${authorName}.` });
    } else {
      updatedFollowed = [...followedAuthors, authorName];
      toast({ title: "💖 Following!", description: `You'll be notified about new stories from ${authorName}.` });
    }
    saveFollowedAuthors(updatedFollowed);

    const updatedAuthors = authors.map(author => {
      if (author.name === authorName) {
        return { ...author, followers: isFollowing ? author.followers - 1 : author.followers + 1 };
      }
      return author;
    });
    saveAuthors(updatedAuthors);
  };

  const handleLikeStory = (storyId) => {
    const updatedStories = stories.map(story => {
      if (story.id === storyId) {
        const newLikes = story.likes + 1;
        const wasEligible = story.isNftEligible;
        const isNowEligible = newLikes >= 1000;
        
        if (!wasEligible && isNowEligible) {
          toast({
            title: "🎉 NFT Eligible!",
            description: `"${story.title}" can now be minted as an NFT!`,
            duration: 5000,
          });
        }
        
        return {
          ...story,
          likes: newLikes,
          isNftEligible: isNowEligible
        };
      }
      return story;
    });
    saveStories(updatedStories);
  };

  const handleTipAuthor = (storyId, amount) => {
    if (userTokens >= amount) {
      const updatedStories = stories.map(story => 
        story.id === storyId 
          ? { ...story, tips: story.tips + amount }
          : story
      );
      saveStories(updatedStories);
      saveTokens(userTokens - amount);
      
      toast({
        title: "💝 Tip Sent!",
        description: `You tipped ${amount} CØRE tokens to support this story!`,
        duration: 3000,
      });
    } else {
      toast({
        title: "Insufficient Tokens",
        description: "You don't have enough CØRE tokens for this tip.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleAddStory = (newStory) => {
    const story = {
      ...newStory,
      id: Date.now(),
      likes: 0,
      views: 0,
      tips: 0,
      isNftEligible: false,
      isMinted: false,
      onAuction: false,
      createdAt: new Date().toISOString()
    };
    const updatedStories = [story, ...stories];
    saveStories(updatedStories);
    
    toast({
      title: "✨ Story Published!",
      description: "Your story has been added to the Vault of Love!",
      duration: 3000,
    });
  };

  const handleViewStory = (storyId) => {
    const updatedStories = stories.map(s => 
      s.id === storyId 
        ? { ...s, views: s.views + 1 }
        : s
    );
    saveStories(updatedStories);
    return stories.find(s => s.id === storyId);
  };

  const handleMintNFT = (storyId) => {
    const updatedStories = stories.map(s => 
      s.id === storyId ? { ...s, isMinted: true } : s
    );
    saveStories(updatedStories);
    toast({
      title: "✨ NFT Minted!",
      description: "Your story has been successfully minted as an NFT.",
      duration: 4000,
    });
  };

  const handleListForBid = (storyId) => {
    const updatedStories = stories.map(s => 
      s.id === storyId ? { ...s, onAuction: true } : s
    );
    saveStories(updatedStories);
    toast({
      title: "💖 Listed for Heart Bid!",
      description: "Your story NFT is now up for bidding in the Heart Bid event.",
      duration: 4000,
    });
  };

  return {
    stories,
    userTokens,
    authors,
    followedAuthors,
    handleLikeStory,
    handleTipAuthor,
    handleAddStory,
    handleViewStory,
    handleMintNFT,
    handleListForBid,
    handleFollowAuthor,
  };
};

export default useStoryVault;