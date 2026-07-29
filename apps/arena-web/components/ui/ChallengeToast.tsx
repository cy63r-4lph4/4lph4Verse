"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Swords, X } from "lucide-react";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { useGlobalChallengeToast } from "@verse/arena-web/hooks/useGlobalChallengeToast";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

const AUTO_DISMISS_MS = 6000;

export function ChallengeToast() {
  const { toast, dismiss } = useGlobalChallengeToast();
  const router = useRouter();
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (!toast) return;
    setProgress(1);
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 1 - elapsed / AUTO_DISMISS_MS);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(tick);
        dismiss();
      }
    }, 100);
    return () => clearInterval(tick);
  }, [toast, dismiss]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          className="fixed top-4 left-1/2 z-[200] w-[calc(100%-2rem)] max-w-sm"
        >
          <button
            onClick={() => {
              router.push(`/course/${(toast as any).courseId ?? ""}/duels/challenge/${toast.showdownId}`);
              dismiss();
            }}
            className="relative w-full text-left rounded-2xl border border-primary/30 bg-black/95 backdrop-blur-xl overflow-hidden active:scale-[0.98] transition-all"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,.5), 0 0 24px hsl(var(--primary) / .15)" }}
          >
            <div className="h-[2px] w-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-primary transition-[width] duration-100 linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-3 p-3.5">
              <ArenaAvatar src={dicebearUrl(toast.fromUsername)} size="sm" glow />
              <div className="flex-1 min-w-0">
                <p className="font-display text-[9px] font-black text-primary/70 uppercase tracking-[.2em] mb-0.5">
                  New Challenge
                </p>
                <p className="font-display text-xs font-bold text-white truncate">
                  {toast.fromUsername} wants a duel
                </p>
              </div>
              <Swords size={16} className="text-primary shrink-0" />
              <button
                onClick={(e) => { e.stopPropagation(); dismiss(); }}
                className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5"
              >
                <X size={12} />
              </button>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}