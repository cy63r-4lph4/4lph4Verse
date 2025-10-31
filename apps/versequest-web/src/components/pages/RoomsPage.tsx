import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Plus, Heart, Reply, TrendingUp, Send, ArrowLeft } from 'lucide-react';
import { contractService, HallData, PostData, parsePostContent, formatAddress } from '@/lib/contractTransactions';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const RoomsPage: React.FC = () => {
  const [selectedHall, setSelectedHall] = useState<HallData | null>(null);
  const [halls, setHalls] = useState<HallData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateHall, setShowCreateHall] = useState(false);
  const { toast } = useToast();

  // Load all halls on component mount
  useEffect(() => {
    const loadHalls = async () => {
      try {
        setLoading(true);
        const allHalls = await contractService.getAllHalls();
        setHalls(allHalls);
      } catch (error) {
        console.error('Failed to load halls:', error);
        toast({
          title: "Loading Error",
          description: "Failed to load reflection halls"
        });
      } finally {
        setLoading(false);
      }
    };

    loadHalls();
  }, []);

  if (selectedHall) {
    return <HallDetail hall={selectedHall} onBack={() => setSelectedHall(null)} onHallUpdate={() => {
      // Refresh halls list when returning
      contractService.getAllHalls().then(setHalls);
    }} />;
  }

  if (showCreateHall) {
    return <CreateHallForm onBack={() => setShowCreateHall(false)} onSuccess={(newHall) => {
      setHalls(prev => [newHall, ...prev]);
      setShowCreateHall(false);
    }} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            Discussion Rooms
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Join conversations, share insights, and earn CØRE tips
          </p>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          <Plus className="h-4 w-4 mr-2" />
          Create Hall
        </Button>
        <Button 
          onClick={() => setShowCreateHall(true)}
          className="bg-gradient-primary text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Hall
        </Button>
      </div>

      {/* Halls Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="community-card animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-secondary rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-secondary rounded w-full mb-2"></div>
                <div className="h-3 bg-secondary rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall) => (
            <Card key={hall.id} className="community-card hover:shadow-glow cursor-pointer" 
                  onClick={() => setSelectedHall(hall)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{hall.topic}</CardTitle>
                  <CardDescription className="mt-2">
                    {hall.description}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {hall.postCount} posts
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Active
                  </span>
                </div>
                <Button size="sm" variant="outline">
                  Join
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
      
      {halls.length === 0 && !loading && (
        <div className="text-center py-16">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">No Reflection Halls Yet</h3>
          <p className="text-muted-foreground mb-6">
            Be the first to create a reflection hall for quest discussions!
          </p>
          <Button 
            onClick={() => setShowCreateHall(true)}
            className="bg-gradient-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Hall
          </Button>
        </div>
      )}
    </div>
  );
};

// Create Hall Form Component
interface CreateHallFormProps {
  onBack: () => void;
  onSuccess: (hall: HallData) => void;
}

const CreateHallForm: React.FC<CreateHallFormProps> = ({ onBack, onSuccess }) => {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();
  const { account } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a hall"
      });
      return;
    }

    if (!topic.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both topic and description"
      });
      return;
    }

    setCreating(true);
    try {
      const result = await contractService.createHall({
        topic: topic.trim(),
        description: description.trim()
      });

      if (result.success) {
        toast({
          title: "Hall Created!",
          description: `"${topic}" is now live for reflections`
        });
        
        // Fetch the created hall data
        const newHall = await contractService.getHall(result.hallId!);
        if (newHall) {
          onSuccess(newHall);
        }
      } else {
        toast({
          title: "Creation Failed",
          description: result.error || "Failed to create reflection hall"
        });
      }
    } catch (error: any) {
      toast({
        title: "Transaction Error",
        description: error.message || "Failed to create hall"
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
                className="w-full"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {topic.length}/100 characters
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this hall is for and what kind of discussions you want to encourage..."
                className="w-full min-h-24"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/500 characters
              </p>
            </div>

            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-muted-foreground">
                Creating a hall will record it on the blockchain
              </p>
              <Button 
                type="submit"
                disabled={creating || !topic.trim() || !description.trim()}
                className="bg-gradient-primary text-primary-foreground"
              >
                {creating ? 'Creating...' : 'Create Hall'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Hall Detail Component
interface HallDetailProps {
  hall: HallData;
  onBack: () => void;
  onHallUpdate: () => void;
}

const HallDetail: React.FC<HallDetailProps> = ({ hall, onBack, onHallUpdate }) => {
  const [newPost, setNewPost] = useState('');
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
        console.error('Failed to load posts:', error);
        toast({
          title: "Loading Error",
          description: "Failed to load hall posts"
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
        description: "Please connect your wallet to post"
      });
      return;
    }

    setPosting(true);
    try {
      const result = await contractService.createPost({
        hallId: hall.id,
        content: newPost.trim()
      });

      if (result.success) {
        toast({
          title: "Posted!",
          description: "Your reflection has been shared"
        });
        
        setNewPost('');
        
        // Reload posts to show the new one
        const updatedPosts = await contractService.getHallPosts(hall.id);
        setPosts(updatedPosts);
        onHallUpdate();
      } else {
        toast({
          title: "Post Failed",
          description: result.error || "Failed to create post"
        });
      }
    } catch (error: any) {
      toast({
        title: "Transaction Error",
        description: error.message || "Failed to create post"
      });
    } finally {
      setPosting(false);
    }
  };

  const handleTip = async (postAuthor: string, amount: string) => {
    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to send tips"
      });
      return;
    }

    // TODO: Integrate with CØRE token contract for tipping
    // This would require the CoreToken contract integration
    // Here you would interact with CØRE token contract
    toast({
      title: "Tip Sent!",
      description: `Sent ${amount} CØRE tip to ${formatAddress(postAuthor)}`
    });
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
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
              Share insights and engage with fellow reflectors
            </span>
            <Button 
              onClick={handlePost}
              disabled={!newPost.trim() || posting}
              className="bg-gradient-primary text-primary-foreground"
            >
              <Send className="h-4 w-4 mr-2" />
              {posting ? 'Posting...' : 'Post'}
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
            <p className="text-sm text-muted-foreground">Be the first to share your reflection!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="community-card">
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
                    <p className="text-xs text-muted-foreground">{new Date(post.timestamp).toLocaleString()}</p>
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
                {/* TODO: Add reply functionality in future update */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
};
