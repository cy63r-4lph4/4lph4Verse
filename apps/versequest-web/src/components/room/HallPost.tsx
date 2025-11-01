import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { PostData, parsePostContent, formatAddress } from "@/lib/contractTransactions";

interface HallPostProps {
  post: PostData;
  hallId: string;
}

export const HallPost: React.FC<HallPostProps> = ({ post }) => {
  const { toast } = useToast();
  const { account } = useWallet();

  const handleTip = async (postAuthor: string, amount: string) => {
    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to send tips.",
      });
      return;
    }

    // TODO: Replace with CoreToken tip interaction
    toast({
      title: "Tip Sent!",
      description: `Sent ${amount} CØRE tip to ${formatAddress(postAuthor)}.`,
    });
  };

  return (
    <Card className="community-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                {formatAddress(post.author).slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{formatAddress(post.author)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(post.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm mb-4">{parsePostContent(post.contentURI)}</p>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleTip(post.author, "5")}
            className="gap-2"
          >
            <Heart className="h-4 w-4" />
            Tip 5 CØRE
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
