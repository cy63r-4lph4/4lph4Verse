import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Clock, Users, Play, Award, CheckCircle } from 'lucide-react';
import { mockQuests, mockQuestResults } from '@/data/mockData';
import { contractService, parseReflectionContent } from '@/lib/contractTransactions';
import { useWallet } from '@/hooks/useWallet';
import { Quest } from '@/types/contracts';

export const QuestsPage: React.FC = () => {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  
  const activeQuests = mockQuests.filter(q => q.isActive);
  const completedQuests = mockQuests.filter(q => !q.isActive);

  const formatTimeLeft = (endTime: number) => {
    const diff = endTime - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Ending soon';
  };

  if (selectedQuest) {
    return <QuestDetail quest={selectedQuest} onBack={() => setSelectedQuest(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text flex items-center justify-center gap-3">
          <Trophy className="h-8 w-8" />
          Quest Hub
        </h1>
        <p className="text-muted-foreground text-lg">
          Complete quests, earn CØRE tokens, and expand your knowledge
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Quests</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeQuests.map((quest) => (
              <Card key={quest.id} className="community-card quest-glow hover:shadow-quest">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{quest.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {quest.description}
                      </CardDescription>
                    </div>
                    <Badge className="bg-quest/10 text-quest border-quest/20">
                      {quest.reward} CØRE
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {quest.participantCount} joined
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {formatTimeLeft(quest.endTime)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-quest text-quest-foreground hover:opacity-90"
                      onClick={() => setSelectedQuest(quest)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Quest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedQuests.map((quest) => (
              <Card key={quest.id} className="community-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {quest.title}
                        <CheckCircle className="h-5 w-5 text-quest" />
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {quest.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {quest.participantCount} participants
                    </span>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {mockQuestResults.map((result) => {
            const quest = mockQuests.find(q => q.id === result.questId);
            if (!quest) return null;

            return (
              <Card key={result.questId} className="community-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-quest" />
                    {quest.title} - Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Correct Answer:</h4>
                    <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                      {quest.correctAnswer}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Top Winners:</h4>
                    <div className="space-y-2">
                      {result.winners.slice(0, 3).map((winner, index) => (
                        <div key={winner} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                          <span className="flex items-center gap-2">
                            <Badge variant="outline">{index + 1}</Badge>
                            {winner}
                          </span>
                          <Badge className="bg-quest/10 text-quest">
                            {quest.reward} CØRE
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Participants: {result.totalParticipants} • 
                    Correct Answers: {result.correctAnswers.length}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface QuestDetailProps {
  quest: Quest;
  onBack: () => void;
}

const QuestDetail: React.FC<QuestDetailProps> = ({ quest, onBack }) => {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);
  const { account } = useWallet();

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await contractService.submitReflection(quest.id, answer.trim());
      
      if (result.success) {
        // Auto-mint participation badge
        try {
          await contractService.mintQuestCompletionBadge(
            account,
            quest.title,
            false // Not a winner badge, just participation
          );
        } catch (badgeError) {
          console.log('Badge minting failed, but reflection was successful:', badgeError);
        }

        setSubmitted(true);
      } else {
        alert(result.error || 'Failed to submit reflection');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to submit reflection');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user has already submitted on component mount
  React.useEffect(() => {
    const checkSubmission = async () => {
      if (account && quest.id) {
        const hasSubmitted = await contractService.hasSubmittedReflection(quest.id, account);
        setHasSubmittedBefore(hasSubmitted);
      }
    };
    checkSubmission();
  }, [account, quest.id]);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          ← Back to Quests
        </Button>
        
        <Card className="community-card quest-glow">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-quest mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Quest Completed!</h2>
            <p className="text-muted-foreground mb-6">
              Your answer has been submitted. Results will be announced when the quest ends.
            </p>
            <div className="flex items-center justify-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-quest" />
              <span className="font-semibold">Potential Reward: {quest.reward} CØRE</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasSubmittedBefore) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          ← Back to Quests
        </Button>
        
        <Card className="community-card">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-quest mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Already Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              You have already submitted a reflection for this quest. Results will be announced when the quest ends.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        ← Back to Quests
      </Button>

      <Card className="community-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{quest.title}</CardTitle>
              <CardDescription className="text-lg mt-2">
                {quest.description}
              </CardDescription>
            </div>
            <Badge className="bg-quest/10 text-quest border-quest/20 text-lg px-3 py-1">
              {quest.reward} CØRE
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Video Section */}
      <Card className="community-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Watch & Learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={quest.videoUrl}
              title={quest.title}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </CardContent>
      </Card>

      {/* Reflection Question */}
      <Card className="community-card quest-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-quest" />
            Reflection Question
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium">{quest.reflectionQuestion}</p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Answer:</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Share your thoughts and insights..."
              className="w-full min-h-32 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-quest/20 focus:border-quest"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <Clock className="h-4 w-4 inline mr-1" />
              Quest ends in {quest.endTime > Date.now() ? 
                Math.floor((quest.endTime - Date.now()) / (1000 * 60 * 60 * 24)) : 0} days
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={!answer.trim()}
              disabled={!answer.trim() || isSubmitting || !account}
              className="bg-gradient-quest text-quest-foreground hover:opacity-90"
            >
              {isSubmitting ? 'Submitting...' : !account ? 'Connect Wallet' : 'Submit Reflection'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
