import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Proposal } from "@/types/contracts";
import { mockProposals } from "@/data/mockData";
import { CreateProposalForm } from "@/components/CreateProposalForm";

/* -------------------------------------------------------------------------- */
/* Utility                                                                    */
/* -------------------------------------------------------------------------- */
const formatTimeLeft = (endTime: number) => {
  const diff = endTime - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h left`;
  return "Ending soon";
};

/* -------------------------------------------------------------------------- */
/* Main Council Page                                                          */
/* -------------------------------------------------------------------------- */
export const CouncilPage: React.FC = () => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const { toast } = useToast();

  const activeProposals = proposals.filter((p) => p.isActive);
  const completedProposals = proposals.filter((p) => !p.isActive);

  const handleVote = (proposalId: string, support: boolean) => {
    toast({
      title: "Vote Submitted!",
      description: `Your ${support ? "YES" : "NO"} vote has been recorded.`,
    });
  };

  const handleExecute = (proposalId: string) => {
    toast({
      title: "Proposal Finalized",
      description: "Proposal has been marked as executed.",
    });
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, executed: true, isActive: false } : p
      )
    );
  };

  const handleCreateSuccess = (newProposal: Proposal) => {
    setProposals((prev) => [newProposal, ...prev]);
    setShowCreateProposal(false);
    toast({
      title: "Proposal Added",
      description: `"${newProposal.title}" has been added successfully.`,
    });
  };

  /* --------------------------- Conditional Views -------------------------- */
  if (showCreateProposal)
    return (
      <CreateProposalForm
        onBack={() => setShowCreateProposal(false)}
        onSuccess={handleCreateSuccess}
      />
    );

  if (selectedProposal)
    return (
      <ProposalDetail
        proposal={selectedProposal}
        onBack={() => setSelectedProposal(null)}
        onVote={handleVote}
        onExecute={handleExecute}
        isVoting={selectedProposal.isActive}
      />
    );

  /* ----------------------------- Main Council ----------------------------- */
  return (
    <div className="space-y-6">
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
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <Vote className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">No Proposals Yet</h3>
          <p className="text-muted-foreground mb-6">
            Be the first to create a proposal and shape the VerseQuest’s
            future!
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
                readonly
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Proposal Card                                                              */
/* -------------------------------------------------------------------------- */
interface ProposalCardProps {
  proposal: Proposal;
  onClick: (proposal: Proposal) => void;
  onVote: (proposalId: string, support: boolean) => void;
  readonly?: boolean;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  onClick,
  onVote,
  readonly = false,
}) => {
  const yesVotes = proposal.yesVotes;
  const noVotes = proposal.noVotes;
  const totalVotes = yesVotes + noVotes;
  const yesPercentage = totalVotes ? (yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes ? (noVotes / totalVotes) * 100 : 0;

  const isPassing = yesPercentage > noPercentage;
  const isActive = proposal.isActive && proposal.endTime > Date.now();

  return (
    <Card
      className={`community-card cursor-pointer ${
        !readonly ? "council-glow hover:shadow-council" : ""
      }`}
      onClick={() => onClick(proposal)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{proposal.title}</CardTitle>
            <CardDescription className="mt-2 line-clamp-3">
              {proposal.description}
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
              ? "Passed"
              : "Ended"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-quest flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              Yes: {proposal.yesVotes} ({yesPercentage.toFixed(1)}%)
            </span>
            <span className="text-destructive flex items-center gap-1">
              <ThumbsDown className="h-4 w-4" />
              No: {proposal.noVotes} ({noPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="flex h-2 gap-1">
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

        <div className="flex justify-between text-sm items-center">
          {isActive ? (
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTimeLeft(proposal.endTime)}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground">
              {proposal.executed ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {proposal.executed ? "Executed" : "Not executed"}
            </span>
          )}

          {isActive && !readonly && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onVote(proposal.id, true);
                }}
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
