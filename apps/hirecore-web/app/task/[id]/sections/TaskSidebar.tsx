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
  Phone,
  Settings,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { Task } from "./types";
import { toast } from "sonner";

export default function TaskSidebar({
  task,
  isClient,
  onOpenChat,
  onOpenManage,
}: {
  task: Task;
  isClient: boolean;
  onOpenChat: () => void;
  onOpenManage: () => void;
}) {
  const handleApply = () =>
    toast(
      <>
        <span className="font-semibold">🎉 Application Submitted!</span>
        <div className="text-sm text-gray-300">
          Your application has been sent to the client.
        </div>
      </>
    );

  const handleCall = () =>
    toast("🚧 Calling Feature: This feature isn't implemented yet.");

  return (
    <>
      {/* Client Info */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" /> Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold">{task.postedBy}</div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm">{task.rating ?? 4.6}</span>
                <span className="text-gray-400 text-sm">
                  ({task.reviews ?? 8} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={onOpenChat}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />{" "}
              {isClient ? "Message Worker" : "Message Client"}
            </Button>

            <Button
              onClick={handleCall}
              variant="outline"
              className="w-full neon-border bg-transparent hover:bg-white/10"
            >
              <Phone className="w-4 h-4 mr-2" />{" "}
              {isClient ? "Call Worker" : "Call Client"}
            </Button>

            {isClient && (
              <Button
                onClick={onOpenManage}
                variant="outline"
                className="w-full neon-border bg-transparent hover:bg-white/10"
              >
                <Settings className="w-4 h-4 mr-2" /> Manage Task
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Apply / Status */}
      {isClient ? (
        <Card className="glass-effect border-white/20 neon-border">
          <CardHeader>
            <CardTitle className="text-white text-center">Your Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-orbitron font-bold core-token mb-2">
                {task.budget} CØRE
              </div>
              <p className="text-gray-400 text-sm">Escrowed payment</p>
            </div>

            <div className="text-center p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <User className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-blue-400 font-semibold">
                You posted this task
              </p>
              <p className="text-gray-300 text-sm">
                Manage applications and authorize workers below.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/5 border-white/50 ">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {task.status === "assigned"
                ? "Task Assigned"
                : "Apply for This Task"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-orbitron font-bold core-token mb-2">
                {task.budget} CØRE
              </div>
              <p className="text-gray-400 text-sm">Payment upon completion</p>
            </div>

            {task.status === "assigned" ? (
              <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <CheckCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-yellow-400 font-semibold">
                  Task Already Assigned
                </p>
                <p className="text-gray-300 text-sm">
                  This task has been assigned to another worker.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <Bullet text="Secure escrow payment" />
                  <Bullet text="GPS location provided" />
                  <Bullet text="Client verified" />
                </div>

                <Button
                  onClick={handleApply}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 crypto-glow text-lg py-3"
                >
                  Apply for Task
                </Button>

                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 text-sm font-semibold">
                        Important
                      </p>
                      <p className="text-gray-300 text-xs">
                        Make sure you have the required skills and can complete
                        the task within the estimated time.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm">Task Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Views" value="127" />
          <Row label="Applications" value="8" />
          <Row label="Posted" value={task.postedTime} />
        </CardContent>
      </Card>
    </>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-300">
      <CheckCircle className="w-4 h-4 text-green-400" />
      <span>{text}</span>
    </div>
  );
}
