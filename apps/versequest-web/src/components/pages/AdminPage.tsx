import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Plus, Trophy, Play, Square, Users, Eye } from 'lucide-react';
import { mockQuests } from '@/data/mockData';
import { contractService, CreateQuestParams, formatDuration } from '@/lib/contractTransactions';
import { useToast } from '@/hooks/use-toast';

export const AdminPage: React.FC = () => {
  const { toast } = useToast();
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    videoURI: '',
    reflectionQuestion: '',
    auraReward: 100,
    maxWinners: 3,
    duration: 7 * 24 * 60 * 60 // 7 days in seconds
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isEnding, setIsEnding] = useState<{ [key: string]: boolean }>({});

  const handleCreateQuest = async () => {
    if (!newQuest.title || !newQuest.description || !newQuest.videoURI || !newQuest.reflectionQuestion) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await contractService.createQuest({
        title: newQuest.title,
        description: newQuest.description,
        videoURI: newQuest.videoURI,
        reflectionQuestion: newQuest.reflectionQuestion,
        auraReward: newQuest.auraReward,
        maxWinners: newQuest.maxWinners,
        duration: newQuest.duration
      });

      if (result.success) {
        toast({
          title: "Quest Created Successfully!",
          description: `"${newQuest.title}" is now live on the blockchain.`
        });
        
        // Reset form
       setNewQuest({
          title: '',
          description: '',
          videoURI: '',
          reflectionQuestion: '',
          auraReward: 100,
          maxWinners: 3,
          duration: 7 * 24 * 60 * 60
        });
      } else {
        toast({
          title: "Quest Creation Failed",
          description: result.error || "Failed to create quest"
        });
      }
    } catch (error: any) {
      toast({
        title: "Transaction Error",
        description: error.message || "Failed to create quest"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEndQuest = async (questId: string) => {
    setIsEnding(prev => ({ ...prev, [questId]: true }));
    
    try {
      const result = await contractService.endQuest(questId);
      
      if (result.success) {
        toast({
          title: "Quest Ended Successfully",
          description: "Quest has been ended and is ready for result calculation."
        });
      } else {
        toast({
          title: "Failed to End Quest",
          description: result.error || "Failed to end quest"
        });
      }
    } catch (error: any) {
      toast({
        title: "Transaction Error",
        description: error.message || "Failed to end quest"
      });
    } finally {
      setIsEnding(prev => ({ ...prev, [questId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text flex items-center justify-center gap-3">
          <Settings className="h-8 w-8" />
          Admin Panel
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage quests and platform settings
        </p>
      </div>

      <Tabs defaultValue="create-quest" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create-quest">Create Quest</TabsTrigger>
          <TabsTrigger value="manage-quests">Manage Quests</TabsTrigger>
          <TabsTrigger value="platform-stats">Platform Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="create-quest" className="space-y-6">
          <Card className="community-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-quest" />
                Create New Quest
              </CardTitle>
              <CardDescription>
                Create engaging quests to educate and reward your community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quest Title *</label>
                  <input
                    type="text"
                    value={newQuest.tiRI}
                    onChange={(e) => setNewQuest({ ...newQuest, titleRI: e.target.value })}
                    placeholder="Enter quest title"
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-quest/20 focus:border-quest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Aura Reward *</label>
                  <input
                    type="number"
                    value={newQuest.auraReward}
                    onChange={(e) => setNewQuest({ ...newQuest, auraReward: parseInt(e.target.value) || 100 })}
                    placeholder="100"
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-quest/20 focus:border-quest"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Winners</label>
                <input
                  type="number"
                  value={newQuest.maxWinners}
                  onChange={(e) => setNewQuest({ ...newQuest, maxWinners: parseInt(e.target.value) || 3 })}
                  placeholder="3"
                  min="1"
                  max="10"
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-quest/20 focus:border-quest"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <textarea
                  value={newQuest.description}
                  onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                  placeholder="Describe what participants will learn"
                  className="w-full min-h-20 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-quest/20 focus:border-quest"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Video URL *</label>
                <input
                  type="url"
                  value={newQuest.videoUrl}
                  onChange={(e) => setNewQuest({ ...newQuest, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-quest/20 focus:border-quest"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reflection Question *</label>
                <textarea
                  value={newQuest.reflectionQuestion}
                  onChange={(e) => setNewQuest({ ...newQuest, reflectionQuestion: e.target.value })}
                  placeholder="What question should participants answer after watching?"
                  className="w-full min-h-20 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-quest/20 focus:border-quest"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (days)</label>
                <select
                  value={newQuest.duration / (24 * 60 * 60)}
                  onChange={(e) => setNewQuest({ ...newQuest, duration: parseInt(e.target.value) * 24 * 60 * 60 })}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-quest/20 focus:border-quest"
                >
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>

              <Button 
                onClick={handleCreateQuest}
                className="w-full bg-gradient-quest text-quest-foreground hover:opacity-90"
                disabled={isCreating}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isCreating ? 'Creating Quest...' : 'Create Quest'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage-quests" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockQuests.map((quest) => (
              <Card key={quest.id} className="community-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{quest.title}</CardTitle>
                      <CardDescription>{quest.description}</CardDescription>
                    </div>
                    <Badge variant={quest.isActive ? "secondary" : "outline"}>
                      {quest.isActive ? 'Active' : 'Ended'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Participants:</span>
                      <div className="font-semibold">{quest.participantCount}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reward:</span>
                      <div className="font-semibold">{quest.auraReward} AURA</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {quest.isActive ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        disabled={isEnding[quest.id]}
                        onClick={() => handleEndQuest(quest.id)}
                      >
                        <Square className="h-4 w-4 mr-1" />
                        {isEnding[quest.id] ? 'Ending...' : 'End Quest'}
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="flex-1">
                        <Trophy className="h-4 w-4 mr-1" />
                        Results
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="platform-stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="community-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Quests</p>
                    <p className="text-2xl font-bold">{mockQuests.length}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-quest" />
                </div>
              </CardContent>
            </Card>

            <Card className="community-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="community-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">CØRE Distributed</p>
                    <p className="text-2xl font-bold">45.2K</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">C</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="community-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement Rate</p>
                    <p className="text-2xl font-bold">87%</p>
                  </div>
                  <div className="w-8 h-8 text-quest flex items-center justify-center">
                    📈
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="community-card">
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                VerseQuest is performing well with strong community engagement. 
                Recent quests have seen high participation rates and positive feedback.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-semibold mb-1">Top Performing Quest</h4>
                  <p className="text-sm text-muted-foreground">Understanding DeFi Fundamentals</p>
                  <p className="text-sm font-medium">247 participants</p>
                </div>
                
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-semibold mb-1">Most Active Room</h4>
                  <p className="text-sm text-muted-foreground">DeFi Discussion</p>
                  <p className="text-sm font-medium">156 posts</p>
                </div>
                
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-semibold mb-1">Recent Proposal</h4>
                  <p className="text-sm text-muted-foreground">Increase Quest Rewards</p>
                  <p className="text-sm font-medium">78% Yes votes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
