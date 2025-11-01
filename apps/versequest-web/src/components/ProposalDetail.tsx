import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Proposal } from "@/types/contracts";

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */
interface ProposalDetailProps {
  proposal: Proposal;
  onBack: () => void;
  onVote: (proposalId: string, support: boolean) => void;
  onExecute: (proposalId: string) => void;
  isVoting: boolean;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export const ProposalDetail: React.FC<ProposalDetailProps> = ({
  proposal,
  onBack,
  onVote,
  onExecute,
  isVoting,
}) => {
  const { toast } = useToast();

  const yesVotes = proposal.yesVotes;
  const noVotes = proposal.noVotes;
  const totalVotes = yesVotes + noVotes;
  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;
  const isActive = proposal.isActive && proposal.endTime > Date.now();

  const formatTimeLeft = (endTime: number) => {
    const diff = endTime - Date.now();
    if (diff <= 0) return "Voting ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return "Ending soon";
  };

  const handleExecute = () => {
    toast({
      title: "Proposal Executed",
      description: `Proposal "${proposal.title}" finalized successfully.`,
    });
    onExecute(proposal.id);
  };

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <Button variant="outline" onClick={onBack} className="mb-4">
        ← Back to Council
      </Button>

      <Card className="community-card council-glow shadow-xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl font-mystic flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                {proposal.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <span>Proposed by {proposal.proposer}</span>
                <span>•</span>
                <span>
                  {isActive
                    ? formatTimeLeft(proposal.endTime) + " left"
                    : "Voting ended"}
                </span>
              </div>
            </div>
            <Badge
              className={
                isActive
                  ? yesPercentage > noPercentage
                    ? "bg-quest/10 text-quest"
                    : "bg-destructive/10 text-destructive"
                  : "bg-secondary"
              }
            >
              {isActive
                ? yesPercentage > noPercentage
                  ? "Passing"
                  : "Failing"
                : proposal.executed
                ? "Executed"
                : "Ended"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2 text-lg text-gradient-core">
              Description
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {proposal.description}
            </p>
          </div>

          {/* Voting Results */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gradient-primary">
              Current Results
            </h3>

            {/* Vote Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-quest/20 bg-quest/5 glass-card">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-quest" />
                    <span className="font-semibold">Yes Votes</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-quest">
                      {yesVotes}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {yesPercentage.toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/20 bg-destructive/5 glass-card">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ThumbsDown className="h-5 w-5 text-destructive" />
                    <span className="font-semibold">No Votes</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-destructive">
                      {noVotes}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {noPercentage.toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress */}
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Total Votes: {totalVotes.toLocaleString()}</span>
                <span>
                  {isActive
                    ? "Voting in progress"
                    : proposal.executed
                    ? "Finalized"
                    : "Closed"}
                </span>
              </div>
              <Progress value={yesPercentage} className="h-3" />
            </div>
          </div>

          {/* Cast Votes */}
          {isActive && !proposal.executed && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gradient-primary">
                Cast Your Vote
              </h3>
              <div className="flex gap-4">
                <Button
                  onClick={() => onVote(proposal.id, true)}
                  className="flex-1 bg-quest hover:bg-quest/90 text-quest-foreground gap-2"
                  disabled={isVoting}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {isVoting ? "Voting..." : "Vote Yes"}
                </Button>
                <Button
                  onClick={() => onVote(proposal.id, false)}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2"
                  disabled={isVoting}
                >
                  <ThumbsDown className="h-4 w-4" />
                  {isVoting ? "Voting..." : "Vote No"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Your vote will be recorded permanently once the contract
                integration is live.
              </p>
            </div>
          )}

          {/* Execute Section */}
          {!isActive &&
            !proposal.executed &&
            proposal.endTime <= Date.now() && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gradient-core">
                  Finalize Proposal
                </h3>
                <Button
                  onClick={handleExecute}
                  className="w-full bg-gradient-council text-council-foreground"
                >
                  Execute Proposal
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Voting period has ended. Execute to finalize results.
                </p>
              </div>
            )}

          {/* Executed Summary */}
          {proposal.executed && (
            <div className="flex flex-col items-center py-8">
              <CheckCircle className="h-12 w-12 text-quest mb-2" />
              <p className="text-lg font-semibold text-gradient-core">
                Proposal Executed
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                The council has spoken. This proposal has been finalized on the
                Verse chain.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
