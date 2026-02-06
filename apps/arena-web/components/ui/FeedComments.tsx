import { useState } from "react";
import ArenaAvatar from "./ArenaAvatar";
import { MessageCircle, Send } from "lucide-react";
import { cn } from "@verse/ui";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

interface FeedCommentsProps {
  comments: Comment[];
  onAddComment?: (text: string) => void;
}

export const FeedComments = ({ comments, onAddComment }: FeedCommentsProps) => {
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showInput, setShowInput] = useState(false);

  const visibleComments = expanded ? comments : comments.slice(0, 2);
  const hasMore = comments.length > 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment?.(newComment);
      setNewComment("");
      setShowInput(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-arena-border/50">
      {/* Comment Button */}
      <button
        onClick={() => setShowInput(!showInput)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-2"
      >
        <MessageCircle size={14} />
        <span>{comments.length} comments</span>
      </button>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-2">
          {visibleComments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <ArenaAvatar src={comment.avatar} alt={comment.user} size="xs" />
              <div className="flex-1 min-w-0">
                <p className="text-xs">
                  <span className="font-semibold text-foreground">{comment.user}</span>
                  {" "}
                  <span className="text-muted-foreground">{comment.text}</span>
                </p>
                <span className="text-[10px] text-muted-foreground/70">{comment.time}</span>
              </div>
            </div>
          ))}
          
          {hasMore && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="text-xs text-primary hover:underline"
            >
              View {comments.length - 2} more comments
            </button>
          )}
        </div>
      )}

      {/* Comment Input */}
      {showInput && (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-muted/30 border border-arena-border rounded-full px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="p-1.5 rounded-full bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50 transition-colors"
          >
            <Send size={14} />
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedComments;
