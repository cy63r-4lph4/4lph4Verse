"use client";

import { ClientSidebarPanel } from "@verse/hirecore-web/app/task/[id]/sections/sidebar/ClientSidebarPannel";
import { useMemo } from "react";
import { WorkerActivePanel } from "@verse/hirecore-web/app/task/[id]/sections/sidebar/WorkerActivePannel";
import { ApplicantSidebarPanel } from "@verse/hirecore-web/app/task/[id]/sections/sidebar/ApplicationSidebarPannel";
import { Task } from "@verse/hirecore-web/app/task/[id]/sections/types";


export default function TaskSidebar({
  task,
  isClient,
  onOpenChat,
  onOpenManage,
  onOpenBid,
}: {
  task: Task;
  isClient: boolean;
  onOpenChat: () => void;
  onOpenManage: () => void;
  onOpenBid: () => void;
}) {
  const userAddress =
    typeof window !== "undefined"
      ? (window as any)?.ethereum?.selectedAddress
      : null;

  const isAssignedWorker = useMemo(
    () =>
      userAddress &&
      task.assignedTo?.toLowerCase() === userAddress?.toLowerCase(),
    [task, userAddress]
  );

  const isApplicant = useMemo(
    () =>
      userAddress &&
      task.applications?.some(
        (a: any) => a.applicant?.toLowerCase() === userAddress?.toLowerCase()
      ),
    [task, userAddress]
  );

  // 🧭 Render according to role
  if (isClient) {
    return (
      <ClientSidebarPanel
        task={task}
        onOpenChat={onOpenChat}
        onOpenManage={onOpenManage}
      />
    );
  }

  if (isAssignedWorker) {
    return (
      <WorkerActivePanel
        task={task}
        onOpenChat={onOpenChat}
        onOpenBid={onOpenBid}
      />
    );
  }

  return (
    <ApplicantSidebarPanel
      task={task}
      isApplicant={isApplicant}
      onOpenChat={onOpenChat}
      onOpenBid={onOpenBid}
    />
  );
}
