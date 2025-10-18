"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import TaskHeader from "./sections/TaskHeader";
import TaskMain from "./sections/TaskMain";
import TaskSidebar from "./sections/TaskSidebar";
import type { Task } from "./sections/types";
import { useEffect, useState } from "react";
import TaskDialogs from "./sections/TaskDialogs";
import { useTaskStore } from "@verse/hirecore-web/store/useTaskStore";
import { Attachment } from "@verse/hirecore-web/utils/Interfaces";

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string | undefined;

  const [showChat, setShowChat] = useState(false);
  const [showManagement, setShowManagement] = useState(false);
  const [taskState, setTaskState] = useState<Task | null>(null);
  const [showBid, setShowBid] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachment | null>(null);

  useEffect(() => {
    if (!id) return;

    const cached = useTaskStore.getState().getTask(id);
    if (cached) {
      setTask(cached);
      setLoading(false);
    } else {
      (async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/tasks/${id}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Task not found");
          setTask(data);
          useTaskStore.getState().setTask(id, data);
        } catch (err: any) {
          setError(err.message || "Failed to load task");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id]);

  const t = taskState ?? task;
  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <p>Invalid task route — no ID provided.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-300">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-400" />
        <p>Loading task details...</p>
      </div>
    );
  }

  if (!t) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <p>
          No task found for <span className="text-indigo-400">{id}</span>
        </p>
        <button
          className="mt-6 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20"
          onClick={() => router.push("/tasks")}
        >
          Back to Tasks
        </button>
      </div>
    );
  }
  // const isClient = userAddress?.toLowerCase() === t.hirer?.toLowerCase();
  const isClient =false;


  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <TaskHeader task={t} onBack={() => router.push("/tasks")} />
          <TaskMain task={t} onPreviewAttachment={setSelectedAttachment} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <TaskSidebar
            task={t}
            isClient={isClient}
            onOpenChat={() => setShowChat(true)}
            onOpenManage={() => setShowManagement(true)}
            onOpenBid={() => setShowBid(true)}
          />
        </div>
      </div>

      <TaskDialogs
        task={t}
        isClient={isClient}
        openChat={showChat}
        openManage={showManagement}
        openBid={showBid}
        onCloseChat={() => setShowChat(false)}
        onCloseManage={() => setShowManagement(false)}
        onTaskUpdate={(updated) => setTaskState(updated)}
        onCloseBid={() => setShowBid(false)}
        selectedAttachment={selectedAttachment}
        onCloseAttachment={() => setSelectedAttachment(null)}
      />
    </div>
  );
}
