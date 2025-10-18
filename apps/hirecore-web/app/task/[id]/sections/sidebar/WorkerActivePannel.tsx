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
  MessageCircle,
  UploadCloud,
  CheckCircle,
  Flag,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Task } from "../types";

export function WorkerActivePanel({
  task,
  onOpenChat,
  onOpenBid,
}: {
  task: Task;
  onOpenChat: () => void;
  onOpenBid: () => void; // for reusing modal if needed
}) {

  const handleSubmitDeliverables = () => {
    toast("📤 Opening deliverable submission modal...");
    onOpenBid(); // You can later replace this with a dedicated dialog handler
  };

  const handleMarkMilestone = () => {
    toast("✅ Milestone marked as complete!");
  };

  const handleMarkComplete = () => {
    toast.success("🚀 Task marked as completed — awaiting client review.");
  };

  const progress =
    task.milestones && task.milestones.length
      ? Math.round(
          (task.milestones.filter((m) => m.completed).length /
            task.milestones.length) *
            100
        )
      : 0;

  return (
    <>
      {/* 💼 Assigned Task Summary */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" /> Assigned Task
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Task Budget */}
          <div className="text-center">
            <div className="text-3xl font-orbitron font-bold core-token mb-2">
              {task.budget} CØRE
            </div>
            <p className="text-gray-400 text-sm">
              {task.status === "pending_review"
                ? "Awaiting Client Approval"
                : "In Escrow (Secured Payment)"}
            </p>
          </div>

          {/* Progress */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 text-right">
            {progress}% Milestones Complete
          </p>
        </CardContent>
      </Card>

      {/* 🧠 Actions */}
      <Card className="glass-effect border-white/20 neon-border">
        <CardHeader>
          <CardTitle className="text-white text-center">Actions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <ActionButton
            icon={<UploadCloud className="w-4 h-4 text-indigo-400" />}
            text="Submit Deliverables"
            onClick={handleSubmitDeliverables}
          />
          <ActionButton
            icon={<Flag className="w-4 h-4 text-yellow-400" />}
            text="Mark Milestone Complete"
            onClick={handleMarkMilestone}
          />
          <ActionButton
            icon={<CheckCircle className="w-4 h-4 text-emerald-400" />}
            text="Mark Task Complete"
            onClick={handleMarkComplete}
          />
        </CardContent>
      </Card>

      {/* 💬 Communication */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            Communication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onOpenChat}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <MessageCircle className="w-4 h-4 mr-2" /> Message Client
          </Button>
        </CardContent>
      </Card>

      {/* 💸 Payment Status */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-yellow-400" />
            Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-1 text-sm">
          <Row label="Escrowed" value={`${task.budget} CØRE`} />
          <Row
            label="Milestones Completed"
            value={`${progress}%`}
          />
          <Row
            label="Status"
            value={task.status === "pending_review" ? "Pending Review" : "In Progress"}
          />
        </CardContent>
      </Card>
    </>
  );
}

/* 🧱 Reusable Subcomponents */
function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function ActionButton({
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
