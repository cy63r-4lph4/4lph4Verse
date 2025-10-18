"use client";

import { Badge } from "@verse/hirecore-web/components/ui/badge";
import type { Status } from "@verse/hirecore-web/app/task/[id]/sections/types";

export function StatusFilterBar({
  statusFilter,
  setStatusFilter,
}: {
  statusFilter: "all" | Status;
  setStatusFilter: (v: "all" | Status) => void;
}) {
  const statuses = [
    "all",
    "open",
    "pending",
    "assigned",
    "accepted",
    "completed",
    "cancelled",
    "rejected",
  ] as const;

  return (
    <div className="flex gap-2 flex-wrap">
      {statuses.map((status) => (
        <Badge
          key={status}
          onClick={() => setStatusFilter(status as any)}
          className={`cursor-pointer px-3 py-1 text-sm transition-all ${
            statusFilter === status
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
              : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      ))}
    </div>
  );
}
