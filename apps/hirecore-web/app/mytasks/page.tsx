"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, ClipboardList } from "lucide-react";
import { Input } from "@verse/ui/input";
import { Button } from "@verse/ui/button";
import { Badge } from "@verse/ui/badge";
import { TaskCard } from "@verse/hirecore-web/components/tasks/TaskCard";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@verse/hirecore-web/store/useTaskStore";

export default function MyTasksPage() {
  const router = useRouter();
  const { cache } = useTaskStore();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "open" | "assigned" | "completed" | "cancelled"
  >("all");

  const filteredTasks = useMemo(() => {
    const tasksArray = Object.values(cache);
    return tasksArray
      .filter((t) =>
        statusFilter === "all" ? true : t.status === statusFilter
      )
      .filter((t) => t.title?.toLowerCase().includes(query.toLowerCase()));
  }, [cache, query, statusFilter]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 🌈 Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              My Tasks
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/tasks/new")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4" /> Post New Task
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/workers")}
              className="flex items-center gap-2 border-white/30 hover:border-blue-400/50"
            >
              <ClipboardList className="w-4 h-4" /> Find Worker
            </Button>
          </div>
        </motion.div>

        {/* 🔍 Search + Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-gray-200 focus:border-blue-400 focus:ring-0"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["all", "open", "assigned", "completed", "cancelled"].map(
              (status) => (
                <Badge
                  key={status}
                  onClick={() =>
                    setStatusFilter(
                      status as
                        | "all"
                        | "open"
                        | "assigned"
                        | "completed"
                        | "cancelled"
                    )
                  }
                  className={`cursor-pointer px-3 py-1 text-sm transition-all ${
                    statusFilter === status
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              )
            )}
          </div>
        </div>

        {/* 🧩 Task Grid */}
        {filteredTasks.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            {filteredTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </motion.div>
        ) : (
          <EmptyState onPost={() => router.push("/tasks/new")} />
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 🪄 Empty State                                                              */
/* -------------------------------------------------------------------------- */
function EmptyState({ onPost }: { onPost: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center text-gray-400 py-24 space-y-4"
    >
      <div className="relative">
        <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 rounded-full"></div>
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10">
          <ClipboardList className="w-8 h-8 text-purple-400" />
        </div>
      </div>

      <h3 className="text-white text-lg font-semibold">No Tasks Yet</h3>
      <p className="text-gray-400 max-w-sm">
        You haven&apos;t posted any tasks yet. Get started by posting your first
        task or finding a worker.
      </p>

      <div className="flex gap-3">
        <Button
          onClick={onPost}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Post a Task
        </Button>
        <Button
          variant="outline"
          onClick={() => console.log("Find Worker")}
          className="border-white/30 hover:border-blue-400/50"
        >
          Find Worker
        </Button>
      </div>
    </motion.div>
  );
}
