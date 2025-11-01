import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import {
  contractService,
  HallData,
  PostData,
  formatAddress,
} from "@/lib/contractTransactions";
import { HallPost } from "./HallPost";

interface HallDetailProps {
  hall: HallData;
  onBack: () => void;
  onHallUpdate: () => void;
}

export const HallDetail: React.FC<HallDetailProps> = ({
  hall,
  onBack,
  onHallUpdate,
}) => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const { toast } = useToast();
  const { account } = useWallet();

  // Load posts for this hall
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const hallPosts = await contractService.getHallPosts(hall.id);
        setPosts(hallPosts);
      } catch (error) {
        console.error("Failed to load posts:", error);
        toast({
          title: "Loading Error",
          description: "Failed to load hall posts.",
        });
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [hall.id]);

  const handlePost = async () => {
    if (!newPost.trim()) return;

    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to post.",
      });
      return;
    }

    setPosting(true);
    try {
      const result = await contractService.createPost({
        hallId: hall.id,
        content: newPost.trim(),
      });

      if (result.success) {
        toast({
          title: "Posted!",
          description: "Your reflection has been shared.",
        });
        setNewPost("");

        // Reload posts
        const updated = await contractService.getHallPosts(hall.id);
        setPosts(updated);
        onHallUpdate();
      } else {
        toast({
          title: "Post Failed",
          description: result.error || "Failed to create post.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Transaction Error",
        description: error.message || "Failed to create post.",
      });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Halls
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{hall.topic}</h1>
          <p className="text-muted-foreground">{hall.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>Created by {formatAddress(hall.creator)}</span>
            <span>•</span>
            <span>{new Date(hall.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{hall.postCount} posts</span>
          </div>
        </div>
      </div>

      {/* New Post */}
      <Card className="community-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Share Your Reflection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts on this topic..."
            className="w-full min-h-24 resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Reflect, share, and engage with others.
            </span>
            <Button
              onClick={handlePost}
              disabled={!newPost.trim() || posting}
              className="bg-gradient-primary text-primary-foreground"
            >
              <Send className="h-4 w-4 mr-2" />
              {posting ? "Posting..." : "Post"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="community-card animate-pulse">
              <CardContent className="p-6">
                <div className="h-3 bg-secondary rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-secondary rounded w-full mb-2"></div>
                <div className="h-4 bg-secondary rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card className="community-card">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">No posts yet</h3>
            <p className="text-sm text-muted-foreground">
              Be the first to share your reflection!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <HallPost key={post.id} post={post} hallId={hall.id} />
          ))}
        </div>
      )}
    </div>
  );
};
