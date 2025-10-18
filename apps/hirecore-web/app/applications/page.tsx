"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ClipboardList, Inbox, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@verse/hirecore-web/components/ui/input";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { Badge } from "@verse/hirecore-web/components/ui/badge";
import { Card, CardContent } from "@verse/hirecore-web/components/ui/card";

import type { Task, Status } from "@verse/hirecore-web/app/task/[id]/sections/types";
import { TaskCard } from "@verse/hirecore-web/components/tasks/TaskCard";

/* -------------------------------------------------------------------------- */
/* Types for Lists                                                            */
/* -------------------------------------------------------------------------- */

// A worker's application to a task (your own bid/info shown on the card)
type WorkerApplication = Task & {
  myBidAmount?: number;   // optional display of the worker's own bid
};

// A direct client request for a worker (needs Accept/Reject)
type ClientRequest = Task & {
  requestNote?: string;   // optional note client attached
};

/* -------------------------------------------------------------------------- */
/* Temporary mock data (replace with API data)                                */
/* id uses number to match your Task typing                                   */
/* -------------------------------------------------------------------------- */

const mockApplications: WorkerApplication[] = [
  {
    id: 101,
    title: "Design a Landing Page",
    description: "Create a sleek, responsive landing page for a SaaS launch.",
    budget: 200,
    urgency: "medium",
    location: "Remote",
    status: "pending",
    postedByProfile: { displayName: "Kofi Mensah", handle: "kofi_dev" },
    postedTime: "2 days ago",
    skills: ["Figma", "Next.js", "Tailwind"],
    myBidAmount: 180,
    serviceType: "workshop",
  },
  {
    id: 102,
    title: "Electrical Maintenance",
    description: "On-site wiring inspection and quick repairs.",
    budget: 150,
    urgency: "high",
    location: "Tema",
    status: "accepted",
    postedByProfile: { displayName: "Ama Serwaa", handle: "ama_homefix" },
    postedTime: "6 hours ago",
    skills: ["Electrical", "Safety"],
    myBidAmount: 145,
    serviceType: "on-site",
  },
];

const mockRequests: ClientRequest[] = [
  {
    id: 201,
    title: "Fix Office WiFi",
    description: "Need a network technician to diagnose slow office WiFi.",
    budget: 100,
    urgency: "urgent",
    location: "East Legon",
    status: "pending",
    postedByProfile: { displayName: "John Doe", handle: "john_workspace" },
    postedTime: "1 hour ago",
    requestNote: "We saw your profile — are you available today?",
    serviceType: "on-site",
  },
  {
    id: 202,
    title: "Logo Cleanup",
    description: "Vectorize and tidy our logo source file.",
    budget: 60,
    urgency: "low",
    location: "Remote",
    status: "pending",
    postedByProfile: { displayName: "AV Studios", handle: "av_brand" },
    postedTime: "yesterday",
    requestNote: "Quick turnaround (same day) preferred.",
    serviceType: "workshop",
  },
];

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ApplicationsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"applications" | "requests">("applications");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const source = activeTab === "applications" ? mockApplications : mockRequests;

  const filtered = useMemo(() => {
    return source
      .filter((t) => (statusFilter === "all" ? true : (t.status as Status) === statusFilter))
      .filter((t) => (t.title || "").toLowerCase().includes(query.toLowerCase()));
  }, [source, query, statusFilter]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              {activeTab === "applications" ? "My Applications" : "Service Requests"}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-2" />
            <p className="text-gray-400 text-sm mt-2">
              {activeTab === "applications"
                ? "Track your submitted applications and their status."
                : "Respond to direct requests from clients."}
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-gray-200 focus:border-blue-400 focus:ring-0"
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("applications")}
            className={`flex items-center gap-2 text-sm px-4 py-2 transition-all rounded-full ${
              activeTab === "applications"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <ClipboardList className="w-4 h-4" /> Applications
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-2 text-sm px-4 py-2 transition-all rounded-full ${
              activeTab === "requests"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <Inbox className="w-4 h-4" /> Requests
          </Button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "open", "pending", "assigned", "accepted", "completed", "cancelled", "rejected"] as const).map(
            (status) => (
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
            )
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {filtered.map((task, i) =>
              activeTab === "applications" ? (
                <ApplicationCard key={task.id} task={task as WorkerApplication} index={i} onView={() => router.push(`/task/${task.id}`)} />
              ) : (
                <RequestCard
                  key={task.id}
                  task={task as ClientRequest}
                  index={i}
                  onAccept={() => console.log("✅ accept", task.id)}
                  onReject={() => console.log("❌ reject", task.id)}
                  onView={() => router.push(`/task/${task.id}`)}
                />
              )
            )}
          </motion.div>
        ) : (
          <EmptyState tab={activeTab} />
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Cards                                                                      */
/* -------------------------------------------------------------------------- */

// Applications use the standard TaskCard + a small footer line for "Your bid"
function ApplicationCard({
  task,
  index,
  onView,
}: {
  task: WorkerApplication;
  index: number;
  onView: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
      {/* Reuse your TaskCard for visual parity */}
      <div className="relative">
        <TaskCard task={task} index={index} />
        {typeof task.myBidAmount === "number" && (
          <div className="absolute -bottom-3 left-4 right-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-2 px-3 text-xs text-gray-300 flex items-center justify-between">
                <span>Your bid</span>
                <span className="text-white font-medium">{task.myBidAmount} CØRE</span>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Requests add inline Accept/Reject actions under the card
function RequestCard({
  task,
  index,
  onAccept,
  onReject,
  onView,
}: {
  task: ClientRequest;
  index: number;
  onAccept: () => void;
  onReject: () => void;
  onView: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
      <div className="space-y-3">
        <TaskCard task={task} index={index} />

        {/* Request note (if any) */}
        {task.requestNote && (
          <Card className="glass-effect border-white/20">
            <CardContent className="py-3 px-4 text-sm text-gray-300">
              <span className="text-gray-400">Client note:</span> {task.requestNote}
            </CardContent>
          </Card>
        )}

        {/* Inline actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onAccept}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
            >
              <CheckCircle className="w-4 h-4" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onReject}
              className="border-red-500/40 text-red-400 hover:bg-red-500/10 flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
          </div>

          <Button
            size="sm"
            onClick={onView}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            View Task
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({ tab }: { tab: "applications" | "requests" }) {
  const Icon = tab === "applications" ? ClipboardList : Inbox;
  const title = tab === "applications" ? "No Applications Yet" : "No Requests Yet";
  const message =
    tab === "applications"
      ? "You haven’t applied for any tasks yet. Explore open tasks and send your first application."
      : "No client has sent you a request yet. Keep your profile active and visible.";

  const cta =
    tab === "applications"
      ? { label: "Browse Tasks", href: "/tasks" }
      : { label: "Edit Profile", href: "/profile/edit" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center text-gray-400 py-24 space-y-4"
    >
      <div className="relative">
        <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 rounded-full"></div>
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10">
          <Icon className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      <h3 className="text-white text-lg font-semibold">{title}</h3>
      <p className="text-gray-400 max-w-sm">{message}</p>

      <Button
        onClick={() => (window.location.href = cta.href)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        {cta.label}
      </Button>
    </motion.div>
  );
}
