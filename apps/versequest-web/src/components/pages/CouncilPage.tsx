import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Vote,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  contractService,
  ProposalData,
  CreateProposalParams,
} from "@/lib/contractTransactions";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Proposal } from "@/types/contracts";
import { mockProposals } from "@/data/mockData";

// Utility function for formatting time
const formatTimeLeft = (endTime: number) => {
  const diff = endTime - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h left`;
  return "Ending soon";
};
export const CouncilPage: React.FC = () => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const activeProposals = mockProposals.filter((p) => p.isActive);
  const completedProposals = mockProposals.filter((p) => !p.isActive);

  const handleVote = async (proposalId: string, support: boolean) => {
    // Here you would interact with the VerseCouncil contract
    toast({
      title: "Vote Submitted!",
      description: `Your ${support ? "YES" : "NO"} vote has been recorded.`,
    });
  };

  if (selectedProposal) {
    return (
      <ProposalDetail
        proposal={selectedProposal}
        onBack={() => setSelectedProposal(null)}
        onVote={handleVote}
        onExecute={() => {}}
        isVoting={selectedProposal.isActive}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Vote className="h-8 w-8" />
            Council Governance
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Participate in community decisions and shape the future of
            VerseQuest
          </p>
        </div>
        <Button className="bg-gradient-council text-council-foreground">
          <Plus className="h-4 w-4 mr-2" />
          <Plus className="h-4 w-4 mr-2" />
          Create Proposal
        </Button>
        <Button
          onClick={() => setShowCreateProposal(true)}
          className="bg-gradient-council text-council-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Proposal
        </Button>
      </div>

      {/* Active Proposals */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="community-card animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-secondary rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-secondary rounded w-full mb-2"></div>
                <div className="h-3 bg-secondary rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : activeProposals.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Active Proposals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onClick={setSelectedProposal}
                onVote={handleVote}
                isVoting={proposal.isActive}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Completed Proposals */}
      {completedProposals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Completed Proposals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onClick={setSelectedProposal}
                onVote={handleVote}
                isVoting={false}
                readonly
              />
            ))}
          </div>
        </div>
      )}

      {!loading && activeProposals.length === 0 && (
        <div className="text-center py-16">
          <Vote className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">No Proposals Yet</h3>
          <p className="text-muted-foreground mb-6">
            Be the first to create a community proposal and shape the future of
            VerseQuest!
          </p>
          <Button
            onClick={() => setShowCreateProposal(true)}
            className="bg-gradient-council text-council-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Proposal
          </Button>
        </div>
      )}
    </div>
  );
};

interface ProposalCardProps {
  proposal: Proposal;
  onClick: (proposal: Proposal) => void;
  onVote: (proposalId: string, support: boolean) => void;
  isVoting?: boolean;
  readonly?: boolean;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  onClick,
  onVote,
  isVoting = false,
  readonly = false,
}) => {
  const yesVotes = proposal.yesVotes;
  const noVotes = proposal.noVotes;
  const totalVotes = yesVotes + noVotes;
  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;

  const isPassing = yesPercentage > noPercentage;
  const isActive = proposal.isActive && proposal.endTime > Date.now();

  const formatTimeLeft = (endTime: number) => {
    const diff = endTime - Date.now();
    if (diff <= 0) return "Voting ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return "Ending soon";
  };

  return (
    <Card
      className={`community-card cursor-pointer ${!readonly ? "council-glow hover:shadow-council" : ""}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div onClick={() => onClick(proposal)} className="flex-1">
            <CardTitle className="text-xl">{proposal.title}</CardTitle>
            <CardDescription className="mt-2">
              {proposal.description.substring(0, 120)}...
            </CardDescription>
          </div>
          <Badge
            variant={isActive ? "secondary" : "outline"}
            className={
              isActive
                ? isPassing
                  ? "bg-quest/10 text-quest"
                  : "bg-destructive/10 text-destructive"
                : ""
            }
          >
            {isActive
              ? isPassing
                ? "Passing"
                : "Failing"
              : proposal.executed
                ? isPassing
                  ? "Passed"
                  : "Failed"
                : "Ended"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voting Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-quest">
              <ThumbsUp className="h-4 w-4" />
              Yes: {proposal.yesVotes} ({yesPercentage.toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1 text-destructive">
              <ThumbsDown className="h-4 w-4" />
              No: {proposal.noVotes} ({noPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="flex gap-1 h-2">
            <div
              className="bg-quest rounded-l-full transition-all"
              style={{ width: `${yesPercentage}%` }}
            />
            <div
              className="bg-destructive rounded-r-full transition-all"
              style={{ width: `${noPercentage}%` }}
            />
          </div>
        </div>

        {/* Time and Actions */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            {isActive ? (
              <>
                <Clock className="h-4 w-4" />
                {formatTimeLeft(proposal.endTime)}
              </>
            ) : (
              <>
                {proposal.executed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {proposal.executed ? "Executed" : "Not executed"}
              </>
            )}
          </span>

          {isActive && !readonly && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onVote(proposal.id, true);
                }}
                disabled={isVoting}
                className="bg-quest hover:bg-quest/90 text-quest-foreground"
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onVote(proposal.id, false);
                }}
                disabled={isVoting}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ProposalDetailProps {
  proposal: Proposal;
  onBack: () => void;
  onVote: (proposalId: string, support: boolean) => void;
  onExecute: (proposalId: string) => void;
  isVoting: boolean;
}

// Create Proposal Form Component
interface CreateProposalFormProps {
  onBack: () => void;
  onSuccess: (proposal: ProposalData) => void;
}

const CreateProposalForm: React.FC<CreateProposalFormProps> = ({
  onBack,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(7); // days
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();
  const { account } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a proposal",
      });
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and description",
      });
      return;
    }

    setCreating(true);
    try {
      const result = await contractService.createProposal({
        title: title.trim(),
        description: description.trim(),
        duration: duration * 24 * 60 * 60, // convert days to seconds
      });

      if (result.success) {
        toast({
          title: "Proposal Created!",
          description: `"${title}" is now open for voting`,
        });

        // Fetch the created proposal data
        const newProposal = await contractService.getProposal(result.hash!);
        if (newProposal) {
          onSuccess(newProposal);
        }
      } else {
        toast({
          title: "Creation Failed",
          description: result.error || "Failed to create proposal",
        });
      }
    } catch (error: any) {
      toast({
        title: "Transaction Error",
        description: error.message || "Failed to create proposal",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          ← Back to Council
        </Button>
        <h1 className="text-2xl font-bold">Create Proposal</h1>
      </div>

      <Card className="community-card">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Proposal Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Increase Quest Rewards for Complex Topics"
                className="w-full"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/100 characters
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your proposal in detail. What changes do you want to make and why?"
                className="w-full min-h-32"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/1000 characters
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Voting Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full p-3 border border-border rounded-lg"
              >
                <option value="3">3 days</option>
                <option value="7">7 days (recommended)</option>
                <option value="14">14 days</option>
              </select>
            </div>

            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-muted-foreground">
                Your proposal will be recorded on the blockchain
              </p>
              <Button
                type="submit"
                disabled={creating || !title.trim() || !description.trim()}
                className="bg-gradient-council text-council-foreground"
              >
                {creating ? "Creating..." : "Create Proposal"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const ProposalDetail: React.FC<ProposalDetailProps> = ({
  proposal,
  onBack,
  onVote,
  onExecute,
  isVoting,
}) => {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        ← Back to Council
      </Button>

      <Card className="community-card council-glow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{proposal.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
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
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {proposal.description}
            </p>
          </div>

          {/* Voting Results */}
          <div className="space-y-4">
            <h3 className="font-semibold">Current Results</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-quest/20 bg-quest/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5 text-quest" />
                      <span className="font-semibold">Yes Votes</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-quest">
                        {proposal.yesVotes}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {yesPercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="h-5 w-5 text-destructive" />
                      <span className="font-semibold">No Votes</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-destructive">
                        {proposal.noVotes}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {noPercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Total Votes: {totalVotes.toLocaleString()}</span>
                <span>Participation: High</span>
              </div>
              <Progress value={yesPercentage} className="h-3" />
            </div>
          </div>

          {/* Voting Actions */}
          {isActive && !proposal.executed && (
            <div className="space-y-4">
              <h3 className="font-semibold">Cast Your Vote</h3>
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
                Your vote will be recorded on the blockchain and cannot be
                changed.
              </p>
            </div>
          )}

          {/* Execute Button for Expired Proposals */}
          {!isActive && !proposal.executed && proposal.endTime <= Date.now() && (
            <div className="space-y-4">
              <h3 className="font-semibold">Finalize Proposal</h3>
              <Button
                onClick={() => onExecute(proposal.id)}
                className="w-full bg-gradient-council text-council-foreground"
              >
                Execute Proposal
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Voting period has ended. Click to finalize the results.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
