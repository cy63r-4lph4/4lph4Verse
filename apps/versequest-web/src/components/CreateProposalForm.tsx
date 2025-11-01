import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import type { Proposal } from "@/types/contracts";
import { Plus } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Create Proposal Form                                                       */
/* -------------------------------------------------------------------------- */
interface CreateProposalFormProps {
  onBack: () => void;
  onSuccess: (proposal: Proposal) => void;
}

export const CreateProposalForm: React.FC<CreateProposalFormProps> = ({
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
        description: "Please connect your wallet to create a proposal.",
      });
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and description.",
      });
      return;
    }

    setCreating(true);
    try {
      // ⚙️ Simulate proposal creation (replace with contractService call later)
      const now = Date.now();
      const newProposal: Proposal = {
        id: crypto.randomUUID() as string,
        title: title.trim(),
        description: description.trim(),
        proposer: account,
        yesVotes: 0,
        noVotes: 0,
        // startTime: now,
        endTime: now + duration * 24 * 60 * 60 * 1000,
        category:"governance",
        auraWeight:true,
        executed: false,
        isActive: true,
      };

      // 🔮 Return to council view
      setTimeout(() => {
        onSuccess(newProposal);
        toast({
          title: "Proposal Created!",
          description: `"${title}" is now open for voting.`,
        });
      }, 600);
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description:
          error?.message || "An unexpected error occurred while creating.",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
          <Plus className="h-7 w-7" />
          Create Proposal
        </h1>
        <Button variant="outline" onClick={onBack}>
          ← Back to Council
        </Button>
      </div>

      {/* Form */}
      <Card className="community-card glass-glow">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Proposal Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Increase Quest Rewards for Complex Topics"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your proposal in detail. What changes do you want to make and why?"
                className="min-h-32"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/1000 characters
              </p>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Voting Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background/40"
              >
                <option value={3}>3 days</option>
                <option value={7}>7 days (recommended)</option>
                <option value={14}>14 days</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-muted-foreground">
                Your proposal will be recorded on the blockchain once integrated.
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
