"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle,
  XCircle,
  Briefcase,
  ClipboardList,
} from "lucide-react";
import { Input } from "@verse/hirecore-web/components/ui/input";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { Badge } from "@verse/hirecore-web/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@verse/hirecore-web/components/ui/card";
import { useRouter } from "next/navigation";
import type { Task } from "@verse/hirecore-web/app/task/[id]/sections/types";

/* -------------------------------------------------------------------------- */
/* ⚙️ Mock Data / Temporary Store                                             */
/* -------------------------------------------------------------------------- */
const mockApplications: Task[] = [
  {
    id: 1,
    title: "Mobile App UI Design",
    description: "Design a sleek UI for a fintech mobile app.",
    budget: 250,
    urgency: "medium",
    location: "Remote",
    status: "pending",
    postedByProfile: { displayName: "James Adu", avatar: "/default-avatar.png" },
    postedTime: "2 days ago",
  },
  {
    id: 2,
    title: "Plumbing Fix at Airport City",
    description: "Urgent plumbing maintenance needed.",
    budget: 120,
    urgency: "urgent",
    location: "Accra",
    status: "accepted",
    postedByProfile: { displayName: "Kojo Mensah", avatar: "/default-avatar.png" },
    postedTime: "5 hours ago",
  },
];

/* -------------------------------------------------------------------------- */
/* 🎨 Page Component                                                          */
/* -------------------------------------------------------------------------- */
export default function ApplicationsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<
    "all" | "pending" | "accepted" | "completed" | "rejected"
  >("all");

  const filteredApps = useMemo(() => {
    return mockApplications
      .filter((t) => (filter === "all" ? true : t.status === filter))
      .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));
  }, [query, filter]);

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
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              My Applications
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-2"></div>
            <p className="text-gray-400 text-sm mt-2">
              Track your job applications and client requests.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search applications..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-gray-200 focus:border-blue-400 focus:ring-0"
            />
          </div>
        </motion.div>

        {/* 🏷️ Filter Badges */}
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "accepted", "completed", "rejected"].map((status) => (
            <Badge
              key={status}
              onClick={() => setFilter(status as any)}
              className={`cursor-pointer px-3 py-1 text-sm transition-all ${
                filter === status
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          ))}
        </div>

        {/* 🧩 Applications Grid */}
        {filteredApps.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
          >
            {filteredApps.map((task, i) => (
              <ApplicationCard key={task.id} task={task} index={i} router={router} />
            ))}
          </motion.div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 💼 Application Card Component                                              */
/* -------------------------------------------------------------------------- */
function ApplicationCard({
  task,
  index,
  router,
}: {
  task: Task;
  index: number;
  router: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Card className="glass-effect border border-white/20 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-white text-lg font-semibold">
            {task.title}
          </CardTitle>
          <p className="text-gray-400 text-sm">{task.location}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-300 text-sm line-clamp-2">
            {task.description}
          </p>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">
              by {task.postedByProfile?.displayName || "Unknown"}
            </span>
            <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
              {task.budget} CØRE
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            {task.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500/40 text-red-400 hover:bg-red-500/10 flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </Button>
              </div>
            )}

            {["accepted", "completed"].includes(task.status!) && (
              <Button
                size="sm"
                onClick={() => router.push(`/task/${task.id}`)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                View Task
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* 🌌 Empty State                                                              */
/* -------------------------------------------------------------------------- */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center text-gray-400 py-24 space-y-4"
    >
      <div className="relative">
        <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-cyan-500 to-purple-600 opacity-30 rounded-full"></div>
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10">
          <Briefcase className="w-8 h-8 text-cyan-400" />
        </div>
      </div>

      <h3 className="text-white text-lg font-semibold">No Applications Yet</h3>
      <p className="text-gray-400 max-w-sm">
        You haven’t applied for any tasks yet. Explore open jobs and send your first application.
      </p>

      <Button
        onClick={() => (window.location.href = "/tasks")}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        Browse Tasks
      </Button>
    </motion.div>
  );
}
