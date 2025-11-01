import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { contractService, HallData } from "@/lib/contractTransactions";

interface CreateHallFormProps {
  onBack: () => void;
  onSuccess: (hall: HallData) => void;
}

export const CreateHallForm: React.FC<CreateHallFormProps> = ({
  onBack,
  onSuccess,
}) => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();
  const { account } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account)
      return toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a hall.",
      });

    if (!topic.trim() || !description.trim())
      return toast({
        title: "Missing Information",
        description: "Please fill in both topic and description.",
      });

    setCreating(true);
    try {
      const result = await contractService.createHall({
        topic: topic.trim(),
        description: description.trim(),
      });

      if (result.success) {
        toast({
          title: "Hall Created!",
          description: `"${topic}" is now live for reflections.`,
        });
        const newHall = await contractService.getHall(result.hallId!);
        if (newHall) onSuccess(newHall);
      } else {
        toast({
          title: "Creation Failed",
          description: result.error || "Failed to create reflection hall.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Transaction Error",
        description: err.message || "Failed to create hall.",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Halls
        </Button>
        <h1 className="text-2xl font-bold">Create Reflection Hall</h1>
      </div>

      <Card className="community-card">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hall Topic *</label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Genesis Reflection Discussion"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this hall is for..."
                className="min-h-24"
                maxLength={500}
              />
            </div>
            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-muted-foreground">
                Creating a hall records it on-chain.
              </p>
              <Button
                type="submit"
                disabled={creating || !topic.trim() || !description.trim()}
                className="bg-gradient-primary text-primary-foreground"
              >
                {creating ? "Creating..." : "Create Hall"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
