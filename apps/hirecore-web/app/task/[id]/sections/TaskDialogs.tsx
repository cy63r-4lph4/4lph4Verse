"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@verse/hirecore-web/components/ui/card";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { Download } from "lucide-react";
import type { Task } from "./types";
import type { Attachment } from "@verse/hirecore-web/utils/Interfaces";
import { ApplyBidDialog } from "@verse/hirecore-web/app/task/[id]/sections/dialogs/ApplyBidDialog";

/* -------------------------------------------------------------------------- */
/* 🧩 TaskDialogs                                                             */
/* -------------------------------------------------------------------------- */
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
  selectedAttachment,
  onCloseAttachment,
}: {
  task: Task;
  isClient: boolean;
  openChat: boolean;
  openManage: boolean;
  openBid: boolean;
  selectedAttachment: Attachment | null;
  onCloseAttachment: () => void;
  onCloseChat: () => void;
  onCloseManage: () => void;
  onCloseBid: () => void;
  onTaskUpdate: (t: Task) => void;
}) {
  return (
    <>
      {/* 💬 Chat */}
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

      {/* ⚙️ Manage Task */}
      {openManage && (
        <ManageTaskModal
          task={task}
          onClose={onCloseManage}
          onTaskUpdate={onTaskUpdate}
        />
      )}

      {/* 💸 Bid Modal */}
      {openBid && (
        <Overlay onClose={onCloseBid}>
          <ApplyBidDialog
            open={openBid}
            onClose={onCloseBid}
            task={task}
            containerSelector="#task-dialog-root"
          />
        </Overlay>
      )}

      {/* 📎 Attachment Preview Modal */}
      {selectedAttachment && (
        <Overlay onClose={onCloseAttachment}>
          <Card className="w-full max-w-4xl glass-effect border-white/20 overflow-hidden">
            <CardHeader className="flex items-center justify-between border-b border-white/10">
              <CardTitle className="text-white truncate">
                {selectedAttachment.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseAttachment}
                className="text-gray-300 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="p-0 bg-black flex justify-center max-h-[80vh] overflow-auto">
              <AttachmentContent attachment={selectedAttachment} />
            </CardContent>
          </Card>
        </Overlay>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 📎 Attachment Content Component                                            */
/* -------------------------------------------------------------------------- */
function AttachmentContent({ attachment }: { attachment: Attachment }) {
  const isImage =
    attachment.type?.startsWith("image") ||
    /\.(png|jpg|jpeg|gif|webp)$/i.test(attachment.url);
  const isPDF =
    attachment.type === "application/pdf" || /\.pdf$/i.test(attachment.url);

  if (isImage) {
    return (
      <img
        src={attachment.url}
        alt={attachment.name}
        className="max-h-[75vh] w-auto object-contain rounded-md"
      />
    );
  }

  if (isPDF) {
    return (
      <iframe
        src={`${attachment.url}#toolbar=0`}
        className="w-full h-[80vh] border-none rounded-b-2xl"
      />
    );
  }

  return (
    <div className="p-6 text-gray-400 text-center">
      <p>Preview not available for this file type.</p>
      <Button
        className="mt-4"
        onClick={() => {
          const link = document.createElement("a");
          link.href = attachment.url;
          link.download = attachment.name || "attachment";
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
      >
        <Download className="w-4 h-4 mr-1" /> Download File
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 🧱 Overlay (shared modal wrapper)                                          */
/* -------------------------------------------------------------------------- */
function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative z-10" id="task-dialog-root">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ⚙️ Manage Task Modal (same as before)                                     */
/* -------------------------------------------------------------------------- */
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
