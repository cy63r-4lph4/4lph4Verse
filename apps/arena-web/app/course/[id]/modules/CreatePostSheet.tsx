"use client";
import { useState } from "react";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@verse/arena-web/components/ui/sheet";
import { Textarea } from "@verse/arena-web/components/ui/textArea";
import { MessageSquarePlus, Lightbulb, HelpCircle, Megaphone, Send, Radio, Terminal } from "lucide-react";
import { cn } from "@verse/ui";

type PostType = "thought" | "question" | "announcement";

const postTypes = [
  { type: "thought", label: "INTEL", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", placeholder: "Broadcast a tactical insight..." },
  { type: "question", label: "QUERY", icon: HelpCircle, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30", placeholder: "Request support from the sector..." },
  { type: "announcement", label: "SIGNAL", icon: Megaphone, color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", placeholder: "Official sector announcement..." },
] as const;

export const CreatePostSheet = ({ currentUser, onCreatePost }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<PostType>("thought");
  const [content, setContent] = useState("");

  const activeType = postTypes.find(t => t.type === selectedType)!;

  const handleSubmit = () => {
    if (!content.trim()) return;
    onCreatePost({ type: selectedType, content });
    setContent("");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {/* THE TACTICAL FAB */}
        <button className="fixed bottom-28 right-6 z-50 group">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/40 transition-all animate-pulse" />
          <div className="relative w-14 h-14 bg-black border border-primary/50 rounded-2xl flex items-center justify-center overflow-hidden transition-transform active:scale-90 group-hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
            <MessageSquarePlus size={24} className="text-primary" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_#fff]" />
          </div>
        </button>
      </SheetTrigger>

      <SheetContent side="bottom" className="bg-black/95 backdrop-blur-2xl border-t border-primary/30 rounded-t-[2.5rem] p-6 outline-none">
        <div className="max-w-md mx-auto space-y-6">
          <SheetHeader>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Radio size={14} className="text-primary animate-pulse" />
              <SheetTitle className="font-display text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">
                Establish_Uplink
              </SheetTitle>
            </div>
          </SheetHeader>

          {/* USER & MODE IDENTITY */}
          <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <ArenaAvatar src={currentUser.avatar} size="md" glow glowColor="primary" />
              <div>
                <p className="text-xs font-bold text-white uppercase">{currentUser.name}</p>
                <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Operator_Identified</p>
              </div>
            </div>
            <div className={cn("px-3 py-1 rounded-full border font-mono text-[9px] font-bold uppercase", activeType.border, activeType.color)}>
              {activeType.label}_MODE
            </div>
          </div>

          {/* FREQUENCY SELECTOR */}
          <div className="grid grid-cols-3 gap-2">
            {postTypes.map((pt) => {
              const Icon = pt.icon;
              const isActive = selectedType === pt.type;
              return (
                <button
                  key={pt.type}
                  onClick={() => setSelectedType(pt.type)}
                  className={cn(
                    "flex flex-col items-center gap-2 py-3 rounded-xl border transition-all duration-300",
                    isActive ? cn(pt.bg, pt.border, pt.color) : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10"
                  )}
                >
                  <Icon size={18} />
                  <span className="text-[8px] font-black uppercase tracking-widest">{pt.label}</span>
                </button>
              );
            })}
          </div>

          {/* DATA INPUT TERMINAL */}
          <div className="relative group">
            <div className="absolute -top-2 -left-2 text-[8px] font-mono text-primary/40 group-focus-within:text-primary transition-colors">
              <Terminal size={10} className="inline mr-1" />
              INPUT_STREAM
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={activeType.placeholder}
              className="min-h-[160px] bg-black/40 border-white/10 rounded-xl text-sm font-mono focus:border-primary/50 focus:ring-0 placeholder:text-muted-foreground/30 resize-none transition-all"
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden hidden xs:block">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(content.length / 500) * 100}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-muted-foreground">
                {content.length.toString().padStart(3, '0')}/500
              </span>
            </div>
          </div>

          {/* BROADCAST BUTTON */}
          <NeonButton
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="w-full py-6 rounded-2xl group"
          >
            <Send size={18} className="mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            <span className="font-display font-black uppercase tracking-widest">Broadcast_Signal</span>
          </NeonButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};