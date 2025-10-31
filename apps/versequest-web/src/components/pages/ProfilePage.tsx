import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Trophy, Heart, Vote, Award, Copy, ExternalLink, Share } from 'lucide-react';
import { mockUserProfile } from '@/data/mockData';
import { useWallet } from '@/hooks/useWallet';
import { useContract } from '@/hooks/useContract';
import { useToast } from '@/hooks/use-toast';

export const ProfilePage: React.FC = () => {
  const { account } = useWallet();
  const { userBadges, userAura } = useContract();
  const { toast } = useToast();

  const handleCopyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard"
      });
    }
  };

  const handleShare = () => {
    const profileUrl = `${window.location.origin}/profile/${account}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Profile Link Copied!",
      description: "Share your profile with friends"
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="community-card max-w-md">
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Connect your wallet to view your profile and achievements
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="community-card">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="h-10 w-10 text-primary-foreground" />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Your Profile</h1>
                <div className="flex items-center gap-2 mt-2">
                  <code className="text-sm bg-secondary px-2 py-1 rounded">
                    {account}
                  </code>
                  <Button size="sm" variant="ghost" onClick={handleCopyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleShare}>
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-quest">{mockUserProfile.completedQuests}</div>
                  <div className="text-sm text-muted-foreground">Quests Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{mockUserProfile.tipsReceived}</div>
                  <div className="text-sm text-muted-foreground">CØRE Tips Received</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-council">{mockUserProfile.totalVotes}</div>
                  <div className="text-sm text-muted-foreground">Votes Cast</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-quest-glow">{mockUserProfile.questsWon}</div>
                  <div className="text-sm text-muted-foreground">Quests Won</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Badges */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="community-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-quest" />
                Achievement Badges
                <Badge variant="outline">{userBadges.length}</Badge>
              </CardTitle>
              <CardDescription>
                Showcase your accomplishments and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userBadges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userBadges.map((badge) => (
                    <div key={badge.tokenId} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                      <div className={`w-12 h-12 rounded-lg ${getCategoryColor(badge.category)} flex items-center justify-center`}>
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{badge.name}</h4>
                          <Badge 
                            variant="outline" 
                            className="text-xs border-quest/30 text-quest"
                          >
                            {badge.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Minted {new Date(badge.mintedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No badges earned yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete quests and participate to earn badges!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Summary */}
        <div className="space-y-4">
          <Card className="community-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-quest" />
                Quest Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">Completed Quests</span>
                <Badge className="bg-quest/10 text-quest">
                  {mockUserProfile.completedQuests}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">Quests Won</span>
                <Badge className="bg-quest-glow/10 text-quest-glow">
                  {mockUserProfile.questsWon}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">Win Rate</span>
                <Badge variant="outline">
                  {mockUserProfile.completedQuests > 0 ? 
                    Math.round((mockUserProfile.questsWon / mockUserProfile.completedQuests) * 100) : 0}%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="community-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Community Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">Tips Received</span>
                <Badge className="bg-primary/10 text-primary">
                  {mockUserProfile.tipsReceived} CØRE
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">Votes Cast</span>
                <Badge className="bg-council/10 text-council">
                  {mockUserProfile.totalVotes}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">Community Rank</span>
                <Badge variant="outline">
                  Rising Star
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="community-card">
            <CardHeader>
              <CardTitle className="text-lg">Friend Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share Profile
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Find Friends
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  function getCategoryColor(category: string) {
    switch (category) {
      case 'Quest Master': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'Community Builder': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Discussion Leader': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Governance Participant': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  }
};
