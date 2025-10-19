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
  ClipboardList,
  Rocket,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Task } from "../types";
import { setContext } from "@verse/hirecore-web/utils/ContextBridge";

export function ClientSidebarPanel({
  task,
  onOpenChat,
  onOpenManage,
}: {
  task: Task;
  onOpenChat: () => void;
  onOpenManage: () => void;
}) {
  const router = useRouter();

 const handleProfileClick = () => {
  const profile = task.postedByProfile;
  console.log("Navigating to profile:", profile);

  if (!profile?.handle) {
    toast("Profile not found");
    return;
  }
  setContext("hirer");
  router.push(`/profile/${profile.handle}`);
};

  const handleOpenManage = () => {
    toast("⚙️ Opening management panel...");
    onOpenManage();
  };

  const handleReleasePayment = () => {
    toast.success("💸 Funds released successfully!");
  };

  return (
    <>
      {/* 🧍 Client Info */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" /> Your Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Clickable Profile Card */}
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
                <span className="text-white text-sm">{task.rating ?? 4.8}</span>
                <span className="text-gray-400 text-sm">
                  ({task.reviews ?? 5} reviews)
                </span>
              </div>
            </div>
          </motion.div>

          <Button
            onClick={onOpenChat}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <MessageCircle className="w-4 h-4 mr-2" /> Message Applicants
          </Button>
        </CardContent>
      </Card>

      {/* ⚙️ Management Card */}
      <Card className="glass-effect border-white/20 neon-border">
        <CardHeader>
          <CardTitle className="text-white text-center">Task Manager</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-gray-300">
          <div className="text-center">
            <div className="text-3xl font-orbitron font-bold core-token mb-2">
              {task.budget} CØRE
            </div>
            <p className="text-gray-400 text-sm">Total Escrowed Budget</p>
          </div>

          <div className="space-y-3">
            <ManagerAction
              icon={<ClipboardList className="w-4 h-4 text-indigo-400" />}
              text="View Applications & Bids"
              onClick={handleOpenManage}
            />
            <ManagerAction
              icon={<Rocket className="w-4 h-4 text-emerald-400" />}
              text="Approve Deliverables"
              onClick={() =>
                toast.info("🚀 Opening deliverable approval flow...")
              }
            />
            <ManagerAction
              icon={<CheckCircle className="w-4 h-4 text-yellow-400" />}
              text="Release Payment"
              onClick={handleReleasePayment}
            />
          </div>
        </CardContent>
      </Card>

      {/* 📊 Stats */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm">Task Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="Applications" value={task.applications?.length ?? 0} />
          <Row label="Bids Received" value={task.bids?.length ?? 0} />
          <Row label="Status" value={task.status ?? "open"} />
          <Row label="Posted" value={task.postedTime} />
        </CardContent>
      </Card>
    </>
  );
}

/* 🔹 Reusable UI Elements */
function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function ManagerAction({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{
        scale: 1.02,
        backgroundColor: "rgba(255,255,255,0.05)",
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full flex items-center justify-start gap-3 p-3 rounded-lg border border-white/10 text-left text-sm hover:bg-white/10 transition-all"
    >
      {icon}
      <span className="text-white font-medium">{text}</span>
    </motion.button>
  );
}
