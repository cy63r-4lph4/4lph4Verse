"use client";

import { useCallback } from "react";
import { Activity, MessageSquare } from "lucide-react";
import { cn } from "@verse/ui";
import FeedCard from "@verse/arena-web/components/ui/FeedCard";
import { CreatePostSheet } from "@verse/arena-web/app/course/[id]/modules/CreatePostSheet";
import { useFeed } from "@verse/arena-web/hooks/useFeed";
import { CurrentUser } from "@verse/arena-web/lib/course/types";

interface ConsolePanelProps {
  courseId: string;
  currentUser: CurrentUser;
}

export function ConsolePanel({ courseId, currentUser }: ConsolePanelProps) {
  const {
    data: feedItems = [],
    isLoading: feedLoading,
    createPost,
    react,
    comment,
    deletePost,
    editPost,
  } = useFeed(courseId);

  const handleCreatePost = useCallback(
    (payload: { type: "thought" | "question" | "announcement"; content: string }) => {
      createPost.mutate(payload);
    },
    [createPost],
  );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <MessageSquare size={15} className="text-rose-400" />
        </div>
        <div>
          <h2 className="font-display text-[14px] font-black text-white uppercase tracking-wide leading-tight">
            Sector Console
          </h2>
          <p className="font-display text-[9px] font-bold text-white/25 uppercase tracking-[.2em]">
            Announcements, discussions & broadcasts
          </p>
        </div>
      </div>

      {/* Create Post */}
      <CreatePostSheet currentUser={currentUser} onCreatePost={handleCreatePost} />

      {/* Feed Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Activity size={12} className="text-rose-400/60" />
          <span className="font-display text-[9px] font-black text-white/25 uppercase tracking-[.3em]">
            Tactical Logs
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {feedLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-rose-400/40 border-t-rose-400 animate-spin" />
            <p className="font-display text-[10px] font-black text-white/30 uppercase tracking-[.3em]">
              Syncing feed…
            </p>
          </div>
        )}

        {!feedLoading && feedItems.length === 0 && (
          <div className="flex flex-col items-center py-12 gap-2 border border-dashed border-white/10 rounded-2xl">
            <MessageSquare size={20} className="text-white/15" />
            <p className="font-display text-[10px] font-black text-white/20 uppercase tracking-[.2em]">
              No broadcasts yet
            </p>
            <p className="font-display text-[8px] font-bold text-white/12 uppercase tracking-wider">
              Use the compose button above to post an announcement
            </p>
          </div>
        )}

        {feedItems.map((item) => {
          const postId = (item as any)._postId as string | undefined;
          return (
            <FeedCard
              key={item.id}
              item={item}
              onReact={postId ? (type) => react.mutate({ postId, type }) : undefined}
              onAddComment={postId ? (content) => comment.mutate({ postId, content }) : undefined}
              onDelete={postId ? () => deletePost.mutate(postId) : undefined}
              onEdit={postId ? (content) => editPost.mutate({ postId, content }) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
