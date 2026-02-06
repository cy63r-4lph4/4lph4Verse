import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { Textarea } from "./textarea";
import NeonButton from "./NeonButton";
import ArenaAvatar from "./ArenaAvatar";
import { MessageSquarePlus, Lightbulb, HelpCircle, Megaphone, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type PostType = "thought" | "question" | "announcement";

interface PostTypeOption {
  type: PostType;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
}

const postTypes: PostTypeOption[] = [
  { 
    type: "thought", 
    label: "Thought", 
    icon: <Lightbulb size={16} />,
    placeholder: "Share an idea, insight, or discussion point..."
  },
  { 
    type: "question", 
    label: "Question", 
    icon: <HelpCircle size={16} />,
    placeholder: "Ask for clarification or help from your arena..."
  },
  { 
    type: "announcement", 
    label: "Announce", 
    icon: <Megaphone size={16} />,
    placeholder: "Share important news with your arena..."
  },
];

interface CreatePostSheetProps {
  currentUser: { name: string; avatar: string };
  onCreatePost: (post: { type: PostType; content: string }) => void;
  children?: React.ReactNode;
}

const CreatePostSheet = ({ currentUser, onCreatePost, children }: CreatePostSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<PostType>("thought");
  const [content, setContent] = useState("");

  const currentPostType = postTypes.find(pt => pt.type === selectedType)!;

  const handleSubmit = () => {
    if (!content.trim()) return;
    onCreatePost({ type: selectedType, content: content.trim() });
    setContent("");
    setSelectedType("thought");
    setIsOpen(false);
  };

  const isValid = content.trim().length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <button className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30 flex items-center justify-center animate-pulse-glow hover:scale-110 transition-transform">
            <MessageSquarePlus size={24} className="text-primary-foreground" />
          </button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-arena-darker border-t border-arena-border/50 rounded-t-2xl h-auto max-h-[80vh]">
        <SheetHeader className="pb-4">
          <SheetTitle className="font-display text-foreground text-center">Create Post</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 pb-6">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <ArenaAvatar src={currentUser.avatar} alt={currentUser.name} size="md" glow glowColor="primary" />
            <div>
              <p className="font-semibold text-foreground">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">Posting to arena</p>
            </div>
          </div>

          {/* Post Type Selector */}
          <div className="flex gap-2">
            {postTypes.map((pt) => (
              <button
                key={pt.type}
                onClick={() => setSelectedType(pt.type)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedType === pt.type
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "bg-arena-card/50 text-muted-foreground border border-arena-border/50 hover:bg-arena-card"
                )}
              >
                {pt.icon}
                {pt.label}
              </button>
            ))}
          </div>

          {/* Content Input */}
          <div className="relative">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={currentPostType.placeholder}
              className="min-h-[120px] bg-arena-card/50 border-arena-border/50 text-foreground placeholder:text-muted-foreground resize-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50"
              maxLength={500}
            />
            <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {content.length}/500
            </span>
          </div>

          {/* Submit Button */}
          <NeonButton 
            onClick={handleSubmit} 
            disabled={!isValid}
            className="w-full"
          >
            <Send size={18} />
            Post to Arena
          </NeonButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreatePostSheet;
