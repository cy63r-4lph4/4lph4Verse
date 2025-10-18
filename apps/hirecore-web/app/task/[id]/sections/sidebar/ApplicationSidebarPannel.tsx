"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@verse/hirecore-web/components/ui/card";
import { Button } from "@verse/hirecore-web/components/ui/button";
import {
  User,
  Star,
  MessageCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Task } from "../types";
import { useRouter } from "next/navigation";

export function ApplicantSidebarPanel({
  task,
  isApplicant,
  onOpenChat,
  onOpenBid,
}: {
  task: Task;
  isApplicant?: boolean;
  onOpenChat: () => void;
  onOpenBid: () => void;
}) {
  const router = useRouter();

  const handleProfileClick = () => {
    const profile = task.postedByProfile;
    if (profile?.handle) router.push(`/profile/${profile.handle}`);
    else toast("Profile not found");
  };

  const handleApply = () => {
    if (isApplicant) {
      toast("✅ You’ve already applied for this task.");
    } else {
      toast("📨 Opening application form...");
      onOpenBid();
    }
  };

  // 🧠 Fallback stats (replace with real aggregated data later)
  const totalBids = task.bids?.length ?? 0;
  const averageBid =
    totalBids > 0
      ? (
          task.bids!.reduce((sum, b) => sum + (b.bidAmount ?? 0), 0) / totalBids
        ).toFixed(1)
      : "--";
  const highestBid =
    totalBids > 0 ? Math.max(...task.bids!.map((b) => b.bidAmount ?? 0)) : "--";

  return (
    <>
      {/* 🧍 Client Info */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" /> Client Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <motion.div
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={handleProfileClick}
            className="flex items-center gap-3 cursor-pointer rounded-lg p-2 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden shadow-md">
              <img
                src={task.postedByProfile?.avatar || "/default-avatar.png"}
                alt={task.postedByProfile?.displayName || "Unknown"}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div>
              <div className="text-white font-semibold">
                {task.postedByProfile?.displayName ||
                  task.postedByProfile?.handle ||
                  "Unknown"}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm">{task.rating ?? 4.6}</span>
                <span className="text-gray-400 text-sm">
                  ({task.reviews ?? 8} reviews)
                </span>
              </div>
            </div>
          </motion.div>

          <Button
            onClick={onOpenChat}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <MessageCircle className="w-4 h-4 mr-2" /> Message Client
          </Button>
        </CardContent>
      </Card>

      {/* 💼 Task Summary */}
      <Card className="bg-white/5 border-white/50">
        <CardHeader>
          <CardTitle className="text-white text-center">Task Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-orbitron font-bold core-token mb-2">
              {task.budget} CØRE
            </div>
            <p className="text-gray-400 text-sm">Payment upon completion</p>
          </div>

          <div className="space-y-3">
            <Bullet text="Secure escrow payment" />
            <Bullet text="Client verified" />
            <Bullet text="GPS location provided" />
          </div>

          {/* 🔘 Unified Apply / Bid Button */}
          <Button
            onClick={handleApply}
            disabled={isApplicant}
            className={`w-full text-lg py-3 transition-all ${
              isApplicant
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 crypto-glow"
            }`}
          >
            {isApplicant ? "Application Sent" : "Apply / Place Bid"}
          </Button>

          {/* 📊 Bidding Stats (Partial Transparency Model) */}
          {task.status === "open" && (
            <div className="border-t border-white/10 pt-4 space-y-2 animate-fade-in">
              <p className="text-sm text-gray-400 font-medium">
                Current Bidding Stats
              </p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>💰 Highest Bid</span>
                  <span className="text-gray-300">
                    {highestBid === "--" ? "--" : `${highestBid} CØRE`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>💰 Average Bid</span>
                  <span className="text-gray-300">
                    {averageBid === "--" ? "--" : `${averageBid} CØRE`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>🧑‍💻 Total Applicants</span>
                  <span className="text-gray-300">{totalBids}</span>
                </div>
              </div>
            </div>
          )}

          {/* ⚠️ Warning */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-400 text-sm font-semibold">
                  Important
                </p>
                <p className="text-gray-300 text-xs">
                  Make sure you have the required skills and can complete the
                  task within the estimated time.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

/* 🔹 Utility Subcomponent */
function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-300">
      <CheckCircle className="w-4 h-4 text-green-400" />
      <span>{text}</span>
    </div>
  );
}
