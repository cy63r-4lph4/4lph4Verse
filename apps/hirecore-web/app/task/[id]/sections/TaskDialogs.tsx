"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@verse/hirecore-web/components/ui/card";
import { Button } from "@verse/hirecore-web/components/ui/button";
import type { Task } from "./types";
import { BidModal } from "@verse/hirecore-web/components/BidModal";

export default function TaskDialogs({
  task,
  isClient,
  openChat,
  openManage,
  openBid,
  onCloseChat,
  onCloseManage,
  onCloseBid,
  onTaskUpdate,
}: {
  task: Task;
  isClient: boolean;
  openChat: boolean;
  openManage: boolean;
  openBid: boolean;
  onCloseChat: () => void;
  onCloseManage: () => void;
  onCloseBid: () => void;
  onTaskUpdate: (t: Task) => void;
}) {
  return (
    <>
      {openChat && (
        <Overlay onClose={onCloseChat}>
          <Card className="w-full max-w-2xl glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Chat (Placeholder)</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              This will be replaced by your Verse chat module.
              <div className="mt-6">
                <Button onClick={onCloseChat}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </Overlay>
      )}

      {openManage && (
        <ManageTaskModal
          task={task}
          onClose={onCloseManage}
          onTaskUpdate={onTaskUpdate}
        />
      )}
      {openBid && <BidModal task={task} onClose={onCloseBid} />}

      
    </>
  );
}

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function ManageTaskModal({
  task,
  onClose,
  onTaskUpdate,
}: {
  task: Task;
  onClose: () => void;
  onTaskUpdate: (t: Task) => void;
}) {
  const [status, setStatus] = useState(task.status || "open");

  return (
    <Overlay onClose={onClose}>
      <Card className="w-full max-w-lg glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Manage Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-200">
          <label className="block text-sm">Status</label>
          <select
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => {
                onTaskUpdate({ ...task, status });
                onClose();
              }}
              className="bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-700 hover:to-emerald-600"
            >
              Save
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </Overlay>
  );
}
